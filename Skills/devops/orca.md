---
name: orca
description: "Drive Hermes as an agent inside the Orca agent IDE. (PC)"
version: 1.0.0
author: Hermes Agent
license: MIT
platforms: [windows, macos, linux]
metadata:
  hermes:
    tags: [orca, ade, agent-ide, worktrees, orchestration, cli]
    related_skills: [hermes-agent, claude-code, codex, opencode]
---

# Orca (stablyai) — Agent IDE on Windows

Use Orca to run multiple CLI agents (Claude Code, Codex, OpenCode, **Hermes**, etc.) side
by side, each in an isolated git worktree. This skill records the setup done on this host
plus the commands to drive Orca from a Hermes session.

## Key facts on this host (Windows, user Alex)

- **App path:** `C:\Users\Alex\AppData\Local\Programs\orca\Orca.exe`
- **CLI binary (NOT on default PATH):** `C:\Users\Alex\AppData\Local\Programs\orca\resources\bin\orca.exe`
  (full CLI `orca.exe`). The user-level `Path` env var was updated to include the `bin` dir,
  so `orca` works in new shells; background Hermes processes inherit a stale PATH — call the
  full path or prefix `export PATH="$LOCALAPPDATA/Programs/orca/resources/bin:$PATH"`.
- **Running check:** `orca status --json` → `runtime.state == "ready"` when the app is up.
- **Hermes CLI:** `hermes` is on PATH (v0.20.x) at
  `C:\Users\Alex\AppData\Local\hermes\hermes-agent\venv\Scripts\hermes`.

## Hermes-as-agent integration

Hermes is a **built-in supported agent** in Orca (`orca` → agent picker → "Hermes", Auto-setup).
Orca launches `hermes` in the worktree and, for new launches, pre-fills the permission-bypass
flag `--yolo` (worktrees are disposable). No extra config required once `hermes` is on PATH.
Per-agent override: Settings → Agents → Agent Permissions (yolo vs manual). A non-empty custom
launch arg/env opts that agent out of global permission migrations.

## Install / update (Windows)

```bash
# grab latest installer
curl -L --fail -o "$LOCALAPPDATA/Temp/orca-windows-setup.exe" \
  "https://github.com/stablyai/orca/releases/latest/download/orca-windows-setup.exe"
# silent NSIS per-user install
"$LOCALAPPDATA/Temp/orca-windows-setup.exe" /S /currentuser
```

## Launch + drive

```bash
OC="$LOCALAPPDATA/Programs/orca/resources/bin/orca.exe"
"$OC" open                 # launch desktop app and wait until runtime reachable
"$OC" status --json        # app/runtime/graph readiness
"$OC" worktree ps --json   # list worktrees (repos tracked by Orca)
"$OC" host list --json     # targetable machines (default: this machine)
"$OC" agent-context        # 232-command schema exposed TO agents; add --json on agents
# procs/tabs
orca terminal list --json; orca terminal create --worktree path:<repo> --command "pnpm test"
orca file open src/App.tsx; orca file diff src/App.tsx --staged
```

Run `orca --help` for the full command tree (open/serve/status, account add/list, skills,
host list, environment add/list, automations, worktree/terminal/file/browser).

## Pitfalls

- **Background processes lose PATH updates** made in the same session — use the full `orca.exe`
  path or export PATH in that command.
- **Orca GUI exposes no accessibility tree** until assistive tech activates it (`ax`/`som`
  captures return 0 elements) — don't rely on computer_use to drive Orca; use the CLI.
- **`orca skills get --skill X` is NOT valid** — flags are `--full`, `--json`, `--topic`,
  `--pairing-code`, `--environment`. Skill install/update is `orca skills install` (bundled
  guides) or the community `npx skills add https://github.com/stablyai/orca --skill orca-cli`.
- Docs live at `https://www.onorca.dev/docs` (nav: agents/supported, cli/*, ssh, mobile).
- Orca launches agents with `--yolo` for Hermes; for review, cherry-pick/discard the diff in
  Orca's diff viewer, don't let the agent auto-merge.

See also the `hermes-agent` skill for the `hermes` CLI itself.