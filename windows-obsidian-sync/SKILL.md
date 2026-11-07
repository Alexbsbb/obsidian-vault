---
name: windows-obsidian-sync
description: Configure silent automatic sync for Obsidian vault via git.
version: 1.1.0
author: Hermes Agent
---

# Windows Obsidian Sync

## When to Use
Configure silent automatic git sync for Obsidian vaults on Windows.

## Core Files

### sync_obsidian.bat
```bat
@echo off
cd /d "%~dp0"
if exist ".git\index.lock" exit /b 0
git pull origin main --quiet
git add . --quiet
git diff-index --quiet HEAD || git commit -m "Auto-sync %date% %time%" --quiet
git push origin main --quiet
```

### sync_obsidian.vbs (silent execution)
```vbs
Set objShell = CreateObject("WScript.Shell")
objShell.Run """" & WScript.ScriptFullName & "\sync_obsidian.bat""", 0, False
```

## Setup

1. **Create batch file** at vault root: `sync_obsidian.bat`
2. **Create VBScript wrapper**: `sync_obsidian.vbs`
3. **Configure Task Scheduler:**
```powershell
schtasks /create /tn "ObsidianSync" /tr "wscript.exe \"C:\path\to\sync_obsidian.vbs\"" /sc minute /mo 2 /ru SYSTEM
```

## Key Points

**Use `--quiet` flag** on all git commands to suppress output.

**Check for index.lock** before sync to avoid conflicts.

**VBScript wrapper hides the terminal window** (param `0`).

**Task Scheduler runs every 2 minutes** (`mo 2`).

## Pitfalls

**Don't use crontab on Windows** - Use Task Scheduler instead.

**Don't run sync too frequently** - Every 2+ minutes is safe.

**Always test manually first** - Run `sync_obsidian.bat` to verify credentials.

**SSH keys must be registered with GitHub** - Use Deploy Keys with write access.