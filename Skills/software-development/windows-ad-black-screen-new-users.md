---
name: windows-ad-black-screen-new-users
description: Fix Windows AD new-user black screen login.
version: 1.0.0
author: Hermes Agent
platforms: [windows]
tags: [windows, active-directory, profile, black-screen, login]
---
# Windows AD: New Users Get Black Screen After Login

## Trigger
Use when domain users created **after** a certain date log in via RDP and get a **black screen / no taskbar / no Explorer**, while older users (e.g. ALEX, LUCAS) work normally on the same server.

## Symptom
- New domain users log in but see only a black screen (no taskbar, desktop icons, or Explorer)
- Existing users (created before the issue started) work normally
- Affects Windows Server 2016/2019 Domain Controllers or member servers
- Users can often open Task Manager (Ctrl+Shift+Esc) but Explorer.exe doesn't start
- Profile folders for affected users are **missing** from `C:\Users` despite ProfileList registry entries existing

## Real case (Sooretama, 2026-08)
Server `192.168.25.249` (SRV-SOO-AD-01), domain `intranet.sooretama.es.gov.br`, accessed via WinRM (pywinrm, NTLM, user `intranet\alex.sarmento`).

Findings in order (all read-only):
1. `C:\Users` on disk: only `Administrador`, `ALEX.SARMENTO` (2019), `lucas.serafini` (2019) + system folders. **No folders for any user created after 2019** (soliane.santos, danilson.pereira, usuario, thiago.el, elmo.braum).
2. `HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\ProfileList`: every affected user has a key but `PastaExiste=False`. `elmo` had TWO SIDs: `...-1805.bak` (State=32768, path `C:\Users\elmo.braum`) and orphan `...-3685` (path `C:\Users\elmo`, State=0) that does **not resolve** to any AD account (SID órfão = conta recriada ou SID antigo).
3. Real AD SID of `ELMO.BRAUM` via `Get-ADUser` = `...-1805`. The `-3685` in `SeRemoteInteractiveLogonRight` is a dead SID left in gpedit.
4. `secedit /export` → `SeRemoteInteractiveLogonRight = ALEX.SARMENTO,LUCAS.SERAFINI,ELMO.BRAUM,*S-1-5-21-...-3685` (user present by name AND by orphan SID).
5. RDP enabled (`fDenyTSConnections=0`, TermService Running, NLA on).
6. Default profile `C:\Users\Default` intact (NTUSER.DAT + standard folders) — NOT the cause.
7. No profile-failure events (1511/1515/1502/1508/1533) in Application log, no Explorer crash (ID 1000), no logon scripts, no folder-redirection GPOs, no cleanup scheduled tasks. GPRESULT for affected user returns "sem dados RSOP" (never completed a logon).
8. Suspicion: **profile creation itself fails on this server** — next check was ACL of `C:\Users` root (SYSTEM/Administrators create permission) + test folder creation + logon events 4624/4625.

## Root Cause
Windows fails to create the user profile directory during login for new users, causing Explorer to fail loading. Typical causes:
1. **Insufficient permissions** on `C:\Users` preventing SYSTEM/Administrators from creating new user folders
2. **Corrupted Default User profile** (`C:\Users\Default`) missing critical components
3. **Group Policy** interfering with profile creation or redirection
4. **Antivirus/security software** blocking directory creation in `C:\Users`
5. **Disk quota or volume permissions** issues

Existing users work because their profiles were created successfully before the underlying issue occurred.

## Diagnostic Steps (read-only first)

### 1. Confirm Profile Folder Absence
```powershell
Get-ChildItem 'C:\Users' -Force -Directory | Select Name, CreationTime
```
Affected users show **no folder**; working users show a folder with old CreationTime.

### 2. Check ProfileList Registry State
```powershell
$pre='HKLM:\SOFTWARE\Microsoft\Windows NT\CurrentVersion\ProfileList'
Get-ChildItem $pre | ForEach-Object {
  $p = Get-ItemProperty $_.PSPath
  "$($_.PSChildName) | $($p.ProfileImagePath) | State=$($p.State) | PastaExiste=$(Test-Path $p.ProfileImagePath)"
}
```
**Look for:**
- `State` other than `0` (loaded) or `256` (loaded from backup) — `32768` = failed/corrupt
- `.bak` keys — profile failed to unload/load
- **Most critical:** `PastaExiste=False` — profile never materialized

### 3. Verify Default User Profile Integrity
```powershell
Test-Path 'C:\Users\Default\NTUSER.DAT'
Test-Path 'C:\Users\Default\Desktop'
Test-Path 'C:\Users\Default\AppData\Roaming\Microsoft\Windows\Start Menu'
```
Note: `C:\Users\Default\AppData\Local\Microsoft\Windows\Explorer` returning False is **EXPECTED** — created per-profile at first logon.

### 4. Check C:\Users Permissions (next step in the real case)
```powershell
(Get-Acl 'C:\Users').Access | ForEach-Object {
  "$($_.IdentityReference) | $($_.FileSystemRights) | $($_.AccessControlType)"
}
```
Expected: `SYSTEM` and `Administrators` with `Modify`/`FullControl`, `Users` with CreateDirectories on the root.

### 5. Review Recent Profile Load Events
```powershell
Get-WinEvent -LogName Application -MaxEvents 5000 -ErrorAction SilentlyContinue |
  Where-Object { $_.Id -in @(1511,1515,1502,1508,1533,1500) } |
  Select -First 12 TimeCreated, Id
```
**Note:** Absence of these events (as in the real case) suggests failure occurs **before** the profile load attempt.

### 6. Test Folder Creation (as SYSTEM would)
```powershell
$t = 'C:\Users\.teste_hermes_perm'
try { New-Item -Path $t -ItemType Directory -ErrorAction Stop | Out-Null; 'CRIACAO_OK'; Remove-Item $t -Force } catch { 'FALHOU: ' + $_.Exception.Message }
```
Failure indicates a permission issue on the root.

## Resolution Steps

### If C:\Users Permissions Are Incorrect (Most Common Fix)
```powershell
icacls 'C:\Users' /reset /t /c /q
icacls 'C:\Users' /grant "SYSTEM:(OI)(CI)F" /t
icacls 'C:\Users' /grant "Administrators:(OI)(CI)F" /t
icacls 'C:\Users' /grant "Users:(OI)(CI)RX" /t
```
- `(OI)(CI)` = Object Inherit, Container Inherit
- Run in elevated PowerShell
- Changes may require reboot to fully propagate

### If Default User Profile Is Corrupted
1. Log in as local Administrator (not domain)
2. Rename `C:\Users\Default` to `C:\Users\Default_BAK`
3. Copy a known-good Default profile from another healthy server or `C:\Windows\Panther\DefaultUser.WIM`
4. Reset permissions (same icacls as above)

### If GPO Is Interfering
1. `gpresult /h gpreport.html`
2. Check Folder Redirection, Administrative Templates → System → Logon, User Rights Assignment
3. Temporarily block inheritance or unlink the problematic GPO to test

### If Security Software Is Blocking
1. Temporarily disable real-time scanning/antivirus
2. Test new user login
3. If fixed, create exclusion for `C:\Users\<username>\*`

### Cleanup of orphaned profile keys / dead SIDs (only with user OK)
- Remove only the orphaned ProfileList key (e.g. `...-3685`) and the dead SID from `SeRemoteInteractiveLogonRight` — leave the live name entry (e.g. `ELMO.BRAUM`)
- Never delete user-facing folders

## Verification
1. Log out completely
2. Log in as a **new** test domain user (never logged into this server before)
3. Confirm: desktop loads normally, `C:\Users\<newuser>` folder created, Explorer.exe runs
4. Existing users continue working normally

## Safety Notes
- **Do not delete or modify existing user profiles** without explicit user clearance
- Always backup `C:\Users\Default` before modifying
- Test fixes on a non-production server first if possible

## Related skill
`windows-remote-admin` — WinRM access patterns (pywinrm, NTLM, CLIXML stripping, raw-string pitfall) + companion reference `references/ad-user-black-screen.md`.
