---
name: hermes-linux-deployment
description: Deploy Hermes Agent as persistent OpenRC services on Linux.
trigger: User wants to run Hermes Agent centrally on a Linux server/container with persistent services.
---

# Hermes Agent Linux Deployment

Deploy Hermes Agent as production services on Linux servers (Alpine, Debian, Ubuntu) using native init systems (OpenRC, systemd).

## When to Use
- Setting up a central Hermes instance on a VPS, Proxmox CT, or bare metal
- Need persistent Dashboard (web UI), Gateway (Telegram/Slack/WhatsApp), ACP, or OpenAI-compatible Proxy
- Want auto-start on boot, log rotation, health checks

## Architecture
```
┌─────────────────────────────────────────────────────────────┐
│                    Linux Host (Alpine/Debian)               │
├──────────────┬──────────────┬──────────────┬────────────────┤
│  Dashboard   │   Gateway    │     ACP      │    Proxy       │
│  (port 9119) │  (Telegram,  │  (stdio for  │  (port 8645,   │
│  Basic Auth  │   Slack,     │   editors)   │   OAuth only)  │
│  OpenRC svc  │   WhatsApp)  │  OpenRC svc  │  OpenRC svc    │
└──────────────┴──────────────┴──────────────┴────────────────┘
```

## Prerequisites
- Linux with OpenRC (Alpine) or systemd (Debian/Ubuntu)
- Python 3.11+, pip, Node.js 18+ (for Dashboard build)
- Hermes installed: `pip install hermes-agent`
- For ACP/Proxy extras: `pip install "hermes-agent[acp,messaging]"`

## Service Templates

### Dashboard with Basic Auth (OpenRC)
```bash
# /etc/init.d/hermes-dashboard
#!/sbin/openrc-run
name="hermes-dashboard"
description="Hermes Agent Web Dashboard"
command="/usr/bin/hermes"
command_args="dashboard --host 0.0.0.0 --port 9119 --no-open --skip-build"
command_background=true
pidfile="/run/${name}.pid"
output_log="/var/log/hermes-dashboard.log"
error_log="/var/log/hermes-dashboard.log"

# Auth via env (or config.yaml dashboard.basic_auth)
export HERMES_DASHBOARD_BASIC_AUTH_USERNAME="admin"
export HERMES_DASHBOARD_BASIC_AUTH_PASSWORD="your-password"
export HERMES_DASHBOARD_BASIC_AUTH_SECRET="base64-32bytes-min"
export HERMES_DASHBOARD_BASIC_AUTH_TTL_SECONDS="43200"

depend() { need net; after firewall; }
start_pre() { checkpath -f -m 0644 /var/log/hermes-dashboard.log; }
```

### Gateway (Telegram/Slack/WhatsApp) — OpenRC
```bash
# /etc/init.d/hermes-gateway
#!/sbin/openrc-run
name="hermes-gateway"
description="Hermes Agent Messaging Gateway"
command="/usr/bin/hermes"
command_args="gateway run --replace"  # --replace critical for clean restart
command_user="root"
command_background=true
pidfile="/run/${name}.pid"
output_log="/root/.hermes/logs/gateway.out.log"
error_log="/root/.hermes/logs/gateway.err.log"

depend() { need net; after firewall; use logger; }
start_pre() { touch "$output_log" "$error_log"; }
```

## Config.yaml Essentials (Production)
```yaml
# ~/.hermes/config.yaml
model:
  # Use a PROVIDER-PREFIXED model id. A bare OmniRoute combo name (e.g. `free-stack`)
  # is rejected by the router: "Unable to determine provider for model 'free-stack'",
  # and EVERY inference fails while the service still reports `started`.
  default: nemotron-3-super-120b-a12b:free
  provider: openrouter

fallback_model:
  provider: openrouter
  model: nemotron-3-nano-omni-30b-a3b-reasoning:free
  fallback_chain:
    - provider: openrouter
      model: nemotron-3-super-120b-a12b:free
    - provider: groq
      model: llama-3.3-70b-versatile
  triggers: ["rate_limit", "503", "529", "connection_error", "timeout"]
  validation:
    forbidden_substrings: ["I cannot help", "as an AI", "rate limit", "quota exceeded", "429", "503", "temporarily unavailable", "Unknown model"]
    min_content_length: 5

display:
  language: pt-BR
  tui_status_indicator: kaomoji

tts:
  provider: edge
  edge:
    voice: pt-BR-FranciscaNeural

timezone: America/Sao_Paulo

dashboard:
  basic_auth:
    username: admin
    password_hash: "scrypt$..."  # generate with: python -c "from plugins.dashboard_auth.basic import hash_password; print(hash_password('pwd'))"
    secret: "base64-32bytes"
    session_ttl_seconds: 43200

gateway:
  platforms:
    telegram:
      enabled: true
```

## Deployment Steps
1. **Install deps**: `apk add nodejs npm` (Alpine) / `apt install nodejs npm` (Debian)
2. **Install Hermes**: `pip install --break-system-packages "hermes-agent[acp,messaging]"`
3. **Create init scripts** (see templates above) in `/etc/init.d/`
4. **Make executable**: `chmod +x /etc/init.d/hermes-*`
5. **Enable at boot**: `rc-update add hermes-dashboard default && rc-update add hermes-gateway default`
6. **Start**: `rc-service hermes-dashboard start && rc-service hermes-gateway start`
7. **Verify**: `curl http://localhost:9119` + Telegram bot test

## Automated Installer for New Servers (Idempotent)

Use the **install-hermes-server.sh** script for fresh or existing servers:

```bash
# One-liner (run on target server as root)
curl -fsSL https://raw.githubusercontent.com/alexbuzatto/instaladorhermes/main/install-hermes-server.sh | bash
```

### What it does (idempotent - safe to re-run):

| Step | Action | If already exists |
|------|--------|-------------------|
| 1. Detect OS | Alpine (OpenRC) / Debian/Ubuntu (systemd) | — |
| 2. Check Hermes | `hermes --version` | Skip install |
| 3. Check Traefik | `traefik version` | Skip install |
| 4. Check Docker | `docker --version` + daemon status | Skip install, ensure daemon running |
| 5. Config Hermes | `~/.hermes/config.yaml` with `dashboard.basic_auth` | Update only if password changed |
| 6. Config Traefik Local | `/etc/traefik/traefik.yaml` + `/etc/traefik/dynamic/hermes.yaml` (HTTP only, port 80) | Always update dynamic with current domain |
| 7. Setup Services | OpenRC (`/etc/init.d/`) or systemd (`/etc/systemd/system/`) | Create if missing, restart if config changed |
| 8. Verify | `curl localhost:9119` + `curl -H Host:domain localhost` | Reports OK/WARN |
| 9. Output Central config | Prints exact `servers.yml` block for Traefik Central | — |

### Interactive prompts:
- Domínio (ex: `agente.metabancaria.com.br`)
- IP do Traefik Central (ex: `192.168.25.101`)
- Usuário dashboard (default: `admin`)
- Senha dashboard (hidden input)
- Email Let's Encrypt (no Central)

### After script finishes:
1. Copy printed `servers.yml` block to Traefik Central (`/root/traefik-central/dynamic-config/servers.yml`)
2. Run `docker service update --force traefik-central_traefik-central`
3. DNS must resolve domain to Central's public IP

### Files created:
- `~/.hermes/config.yaml` — Hermes config with basic auth
- `/etc/traefik/traefik.yaml` — Static config (HTTP only)
- `/etc/traefik/dynamic/hermes.yaml` — Dynamic router for domain
- `/etc/init.d/hermes-dashboard` + `/etc/init.d/traefik` (OpenRC) OR systemd units

### Reference: `references/automated-installer.md`

## Pitfalls & Fixes
| Issue | Fix |
|-------|-----|
| Gateway service shows "crashed" but process runs | Add `--replace` to `command_args` — prevents PID conflict on restart |
| Dashboard refuses to bind 0.0.0.0 | Configure `dashboard.basic_auth` in config.yaml OR set env vars `HERMES_DASHBOARD_BASIC_AUTH_*` |
| ACP fails as service | ACP is stdio-based (for editors). Run manually: `hermes acp --accept-hooks`. Don't daemonize. |
| Proxy fails to start | Requires `hermes auth add nous` (Nous Portal OAuth) or xAI OAuth. Not for API-key providers. |
| Port 9119 "address in use" | Kill stale: `fuser -k 9119/tcp` or `pkill -9 -f "hermes dashboard"` |
| Gateway reports `started` but the bot never replies | The init script is fine — the model is broken. Check `model.default` in `~/.hermes/config.yaml`: an OmniRoute combo name with no provider prefix makes every inference fail with `Unable to determine provider for model 'X'` while the service stays `started` and the logs look clean. Set a prefixed ID (`xkiro/qwen/qwen3.7-flash:free`) and re-verify. |
| "The service dies on reboot" | Run `rc-update show default \| grep hermes` FIRST — services are usually already registered at boot, so the fault is config, not the init script. Confirm with `rc-service hermes-gateway status`, `ps aux \| grep "hermes gateway"`, and `tail ~/.hermes/logs/gateway.log`, then look for a model/config error instead of rewriting the script. |
| Restructuring `fallback_model.fallback_chain` | `hermes config set` only sets leaf dotted keys and will not rebuild the chain. Back the file up (`cp config.yaml config.yaml.bak-$(date +%F-%H%M)`) and rewrite the block with PyYAML: `yaml.safe_load` → edit → `yaml.safe_dump(..., sort_keys=False)`. |
| Need to test the gateway's model path without Telegram | `timeout 90 hermes chat -q "Responda apenas: PONG"` exercises the same config path. A reply proves the whole chain; an error or silence localises it to the model. |
| `hermes chat -q` finishes but you cannot find the transcript | Session JSON is not reliably written under `~/.hermes/sessions/` — do not treat a missing file as a failed run. The CLI's own report (`Session: <id>`, `Messages: N`) is the reliable signal. |
| scrypt password hash | Generate: `python3 -c "from plugins.dashboard_auth.basic import hash_password; print(hash_password('your-password'))"` |

## Health Checks
```bash
# Dashboard
curl -s http://localhost:9119 | grep -q "Hermes Agent" && echo "OK"

# Gateway (check logs)
grep "Connected to Telegram" /root/.hermes/logs/gateway.log

# Auth test
curl -X POST http://localhost:9119/auth/password-login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"***","provider":"basic"}'
```

## References
- `references/alpine-openrc-templates.md` — Complete init scripts for Alpine
- `references/fallback-chain-config.md` — Fallback model patterns
- `references/dashboard-auth-providers.md` — Basic, OAuth, OIDC providers

## Related Skills
- `hermes-agent` (bundled) — CLI reference, config schema
- `docker-swarm-stack-builder` — If deploying via Swarm instead of bare metal