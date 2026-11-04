---
name: hermes-dashboard-deployment
description: Deploy Hermes Web Dashboard on Linux with auth/persistence.
version: 1.0.0
tags:
  - hermes
  - dashboard
  - deployment
  - authentication
  - alpine
  - openrc
  - systemd
---

# Hermes Dashboard Deployment

Class-level skill for deploying the **Hermes Web Dashboard** (not the Electron Desktop app) on headless Linux servers with authentication and persistence.

## When to use

- Setting up Hermes Dashboard on a remote/server machine (VPS, Proxmox LXC, VM, bare metal)
- Need web-based access to Hermes Agent config, sessions, skills, plugins, logs
- Require authentication (username/password or OAuth/OIDC)
- Need the service to survive reboots (systemd/OpenRC)

## Key distinction: Dashboard vs Desktop

| Component | What it is | Runs on headless server? |
|-----------|------------|--------------------------|
| **Hermes Dashboard** (`hermes dashboard`) | Web UI (FastAPI + React), served via browser | ✅ Yes — this skill |
| **Hermes Desktop** (`hermes desktop` / `hermes gui`) | Electron app, native GUI | ❌ No — needs X11/Wayland + full source tree (`apps/desktop/`) |

**If the user says "activate Hermes Desktop" on a headless box, they almost always mean the Dashboard.**

## Authentication providers (built-in)

Hermes ships three dashboard-auth plugins under `plugins/dashboard_auth/`:

| Provider | Type | Config surface | Best for |
|----------|------|----------------|----------|
| **basic** | Username/password (scrypt + HMAC sessions) | `dashboard.basic_auth` in `config.yaml` or `HERMES_DASHBOARD_BASIC_AUTH_*` env vars | Simple self-hosted, zero-infrastructure |
| **nous** | OAuth via Nous Portal | `dashboard.oauth.nous` | Nous Research accounts |
| **self-hosted** | Generic OIDC (Keycloak, Zitadel, Authentik, etc.) | `dashboard.oauth.self_hosted` | Enterprise SSO |

### Basic auth (simplest, used in this session)

```yaml
# config.yaml (canonical)
dashboard:
  basic_auth:
    username: admin                    # required
    password_hash: "scrypt$..."        # preferred: precomputed hash
    # password: "plaintext"            # fallback: hashed in-memory at load
    secret: "base64-or-hex-32+bytes"   # optional: stable sessions across restarts/workers
    session_ttl_seconds: 43200         # optional: access token lifetime (default 12h)
```

```bash
# Env var overrides (Docker/Fly/secret injection)
export HERMES_DASHBOARD_BASIC_AUTH_USERNAME="admin"
export HERMES_DASHBOARD_BASIC_AUTH_PASSWORD="hermes2026"   # hashed in-memory
export HERMES_DASHBOARD_BASIC_AUTH_SECRET="dGVzdC1zZWNyZXQtMTIzNDU2Nzg5MDEyMzQ1Njc4OTAxMjM0NTY3ODkwMTI="
export HERMES_DASHBOARD_BASIC_AUTH_TTL_SECONDS="43200"
```

**Generate a password hash:**
```bash
python3 -c "from plugins.dashboard_auth.basic import hash_password; print(hash_password('your-password'))"
```

## Persistence: OpenRC (Alpine Linux)

```bash
# /etc/init.d/hermes-dashboard
#!/sbin/openrc-run
name="hermes-dashboard"
description="Hermes Agent Web Dashboard"
command="/usr/bin/hermes"
command_args="dashboard --host 0.0.0.0 --port 9119 --no-open --skip-build"
command_background=true
pidfile="/run/hermes-dashboard.pid"
output_log="/var/log/hermes-dashboard.log"
error_log="/var/log/hermes-dashboard.log"

# Basic auth env vars (or use config.yaml)
export HERMES_DASHBOARD_BASIC_AUTH_USERNAME="admin"
export HERMES_DASHBOARD_BASIC_AUTH_PASSWORD="hermes2026"
export HERMES_DASHBOARD_BASIC_AUTH_SECRET="your-base64-secret"
export HERMES_DASHBOARD_BASIC_AUTH_TTL_SECONDS="43200"

depend() { need net; after firewall; }
start_pre() {
    checkpath -f -m 0644 -o root:root /var/log/hermes-dashboard.log
    checkpath -d -m 0755 -o root:root /run
}
```

```bash
chmod +x /etc/init.d/hermes-dashboard
rc-update add hermes-dashboard default
rc-service hermes-dashboard start
```

## Persistence: systemd (Debian/Ubuntu/RHEL)

```ini
# /etc/systemd/system/hermes-dashboard.service
[Unit]
Description=Hermes Agent Web Dashboard
After=network.target

[Service]
Type=simple
User=hermes
Environment=HERMES_DASHBOARD_BASIC_AUTH_USERNAME=admin
Environment=HERMES_DASHBOARD_BASIC_AUTH_PASSWORD=hermes2026
Environment=HERMES_DASHBOARD_BASIC_AUTH_SECRET=your-base64-secret
ExecStart=/usr/local/bin/hermes dashboard --host 0.0.0.0 --port 9119 --no-open --skip-build
Restart=on-failure
RestartSec=5
StandardOutput=append:/var/log/hermes-dashboard.log
StandardError=append:/var/log/hermes-dashboard.log

[Install]
WantedBy=multi-user.target
```

```bash
systemctl daemon-reload
systemctl enable --now hermes-dashboard
```

## Verification

```bash
# Service listening
ss -tlnp | grep 9119

# Login test (returns session cookies)
curl -X POST http://<host>:9119/auth/password-login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"hermes2026","provider":"basic"}' -c cookies.txt

# Dashboard access (with cookies)
curl -b cookies.txt http://<host>:9119/ | head -5

# Providers list
curl http://<host>:9119/api/auth/providers
```

## Common pitfalls

| Symptom | Cause | Fix |
|---------|-------|-----|
| `Refusing to bind dashboard to 0.0.0.0 — no auth providers registered` | No auth provider loaded | Set basic auth env vars **before** starting, or use `--insecure` (dev only) |
| `address in use` on port 9119 | Stale process | `pkill -9 -f "hermes dashboard"; fuser -k 9119/tcp` |
| Login returns 422 `Field required: provider` | Missing `provider` in JSON body | Include `"provider": "basic"` in POST body |
| Service starts but exits immediately | `command_background=true` but process forks/dies | Ensure `hermes dashboard` runs in foreground (it does by default) |
| Sessions don't survive restart | No `secret` configured | Set `HERMES_DASHBOARD_BASIC_AUTH_SECRET` (32+ bytes base64/hex) |

## Reverse proxy (Traefik/Nginx/Caddy)

When behind a proxy with `X-Forwarded-Prefix: /hermes`, the login redirect automatically prefixes `/hermes/login`. Ensure the proxy passes `Host`, `X-Forwarded-For`, `X-Forwarded-Proto`, and `X-Forwarded-Prefix`.

## References

- `references/basic-auth-provider.md` — full provider API, token format, scrypt params
- `references/openrc-template` — ready-to-copy OpenRC init script
- `references/systemd-template` — ready-to-copy systemd unit file