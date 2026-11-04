---
name: windows-hermes-troubleshooting
description: "Windows-specific Hermes Agent troubleshooting — gateway detection pitfalls, WMIC false positives, scheduled task conflicts, and Python process management."
version: "1.0.0"
author: "Hermes Agent"
platforms: [windows]
metadata:
  hermes:
    tags: [hermes, windows, gateway, troubleshooting, wmic, scheduled-task]
    related_skills: [hermes-agent, proxmox-administration]
---

# Windows Hermes Troubleshooting

Windows-specific issues and pitfalls when running Hermes Agent (gateway, CLI, skills) on Windows 10/11 with git-bash/MSYS2.

---

## 🎯 WMIC Gateway Detection — Critical Pitfall

**Discovered:** 2026-07-21

### The Problem

Using `wmic process where "commandline like '%gateway run%'"` to find Hermes gateway processes **matches the query itself** — the search pattern appears in the `wmic` commandline, so the bash shells executing the query show up as false positives.

### False Positive Example

```bash
$ wmic process where "commandline like '%gateway run%'" get processid /format:csv
Node,ProcessId
DESKTOP-DKVSD6L,7048     # ← bash shell running wmic!
DESKTOP-DKVSD6L,12568    # ← bash shell running wmic!
DESKTOP-DKVSD6L,32488    # ← bash shell running wmic!
DESKTOP-DKVSD6L,492      # ← bash shell running wmic!
```

**These are NOT Hermes gateways** — they're the `wmic` child processes themselves!

### Correct Detection

Filter for actual Python executables:

```bash
# Only python.exe / pythonw.exe can be Hermes gateways
wmic process where "name='python.exe' or name='pythonw.exe'" get processid,commandline /format:csv | grep -i "gateway run"
```

Or simply use the Hermes CLI:
```bash
hermes gateway status
```

### Correct Kill Command

```bash
# Kill only actual gateway Python processes
wmic process where "name='python.exe' or name='pythonw.exe'" get processid,commandline /format:csv | \
  grep -i "gateway run" | \
  cut -d',' -f2 | \
  xargs -I{} cmd //c "taskkill /F /PID {}"
```

### Root Cause

In git-bash/MSYS2, each `wmic` call spawns a new `bash.exe` process whose commandline includes the full `wmic ... 'gateway run'` string. The `%gateway run%` pattern matches that string.

### Lesson

**Always verify process identity by executable `name`, not just `commandline` content** when the search pattern could appear in the query command itself.

---

## 🔄 Scheduled Task vs Desktop GUI Conflict

### The Issue

On Windows, two gateway processes often start simultaneously:
1. **Scheduled Task** (`Hermes_Gateway`) — starts at user logon, runs from venv
2. **Desktop GUI** — may auto-start another instance using system Python

### Detection

```bash
# Check both scheduled task status and running processes
schtasks /query /tn "Hermes_Gateway" /v /fo LIST
hermes gateway status
```

### Fix — Single Gateway

```bash
# 1. Kill all Python gateway processes
wmic process where "name='python.exe' or name='pythonw.exe'" get processid,commandline /format:csv | \
  grep -i "gateway run" | \
  cut -d',' -f2 | \
  xargs -I{} cmd //c "taskkill /F /PID {}"

# 2. Start ONE gateway (either method, not both)
# Option A: Scheduled Task (background, survives logout with linger)
cmd //c "schtasks /run /tn Hermes_Gateway"

# Option B: Foreground for debugging
hermes gateway run
```

### Scheduled Task Limitation

The default `Hermes_Gateway` task **only runs at logon** — it does NOT auto-restart on crash. For true daemon behavior:
- Enable Windows "linger" equivalent: `sudo loginctl enable-linger $USER` (WSL2)
- Or use NSSM / Windows Service wrapper
- Or accept manual restart after crashes

---

## 🐍 Python Environment Conflicts

### Multiple Python Installations

Windows often has multiple Python installs:
- **Hermes venv** (where `hermes` command lives)
- **System Python** (from python.org / Microsoft Store)
- **WSL2 Python** (inside Linux)

### Symptoms

- `hermes gateway status` shows different PID than running process
- Model/config changes don't take effect
- "Module not found" errors for installed packages

### Fix

Always use the venv Python explicitly:
```bash
# Find Hermes venv
where hermes
# Output: C:\Users\Alex\AppData\Local\hermes\venv\Scripts\hermes.exe

# Use full path or activate venv
C:\Users\Alex\AppData\Local\hermes\venv\Scripts\python.exe -m hermes_cli.main gateway status
```

---

## 📝 Config File Encoding (UTF-8 BOM)

### Problem

`config.yaml` saved with UTF-8 BOM (common in Windows Notepad) causes:
- `HTTP 400 "No models provided"` on first run
- Config parsing errors

### Fix

Re-save as UTF-8 without BOM:
```bash
# hermes config edit writes without BOM automatically
hermes config edit

# Or in VS Code: File → Save with Encoding → UTF-8 (no BOM)
```

---

## ⌨️ Alt+Enter Newline Issue

### Problem

Alt+Enter toggles fullscreen in Windows Terminal — keystroke never reaches prompt_toolkit.

### Solution

Use **Ctrl+Enter** instead (bound to newline on Windows only).

---

## 🔗 Related Skills

- `skill_view(name="hermes-agent")` — Main Hermes configuration/troubleshooting
- `skill_view(name="proxmox-administration")` — Remote server/CT management
- `skill_view(name="windows-automation-setup")` — Browser/desktop automation on Windows
- `skill_view(name="windows-system-diagnostics")` — General Windows disk/memory diagnostics from CLI

---

## 🔌 Plugin `doctor` Cannot Resolve a Binary (POSIX wrapper in `~/.local/bin`)

### The Problem

A plugin whose readiness check shells out to a binary by bare name (e.g. `rtk` for `rtk-rewrite`) reports the binary as missing even though it runs fine from your bash shell:

```
WARN: rtk binary not found
```

The usual cause: `~/.local/bin` contains only a **POSIX shell wrapper** (a script with no `.exe` extension). The plugin's `doctor` is spawned by the Windows runtime, not by git-bash, so it resolves executables through the Windows `PATH` lookup rules — which need an actual `.exe`. A shell script named `rtk` is invisible to it.

### Fix

Copy the real executable next to the wrapper, keeping the `.exe` extension, in a directory that is on the **Windows user PATH**:

```bash
RTKEXE="/c/Users/Alex/AppData/Local/Microsoft/WinGet/Packages/rtk-ai.rtk_Microsoft.Winget.Source_8wekyb3d8bbwe/rtk.exe"
cp -f "$RTKEXE" "$HOME/.local/bin/rtk.exe"
# verify the Windows-side lookup, NOT `which`:
cmd.exe /c "where rtk"
# then re-check the plugin:
hermes plugins doctor rtk-rewrite
```

### Rules

- Verify resolution with `cmd.exe /c "where <bin>"`, never with bash `which` — `which` happily finds a wrapper script that the Windows runtime cannot execute.
- `~/.local/bin` is on the user PATH, so copying the `.exe` there is enough; no PATH edit or re-login needed.
- Re-run the plugin's `doctor` after the copy — a passing hook count (e.g. `OK, 1 hook`) confirms the fix.
- Plugin hooks only take effect in a **new** Hermes session — restart the desktop app after installing or repairing plugin binaries.

## 📋 Quick Reference Card

| Issue | Wrong Command | Right Command |
|-------|---------------|---------------|
| Find gateway PIDs | `wmic ... '%gateway run%'` | `wmic ... name='python.exe' ... \| grep 'gateway run'` |
| Kill gateways | `taskkill` on all PIDs | Filter for python.exe first |
| Check status | `hermes gateway status` (may show stale) | `hermes gateway status` + verify PID alive |
| Config encoding | Notepad save | `hermes config edit` or VS Code UTF-8 no BOM |
| Newline in terminal | Alt+Enter | Ctrl+Enter |
| Plugin `doctor` says binary missing | bash `which <bin>` (finds the wrapper) | `cmd.exe /c "where <bin>"` + copy the real `.exe` into `~/.local/bin` |