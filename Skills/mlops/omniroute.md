---
name: omniroute
description: "OmniRoute - Universal AI Gateway with smart routing, 260+ providers, MCP/A2A, CLI integrations. Covers setup, deployment, API reference, provider management, combos, Docker, environment config, and advanced features."
version: "1.3.0"
author: "Hermes Agent"
tags:
  - ai-gateway
  - llm-router
  - multi-provider
  - mcp
  - a2a
  - docker
  - cli-tools
  - free-models
---

# OmniRoute Skill — Complete Reference

> **OmniRoute** (by diegosouzapw) is a universal AI gateway: one endpoint, 260+ providers (50+ free), smart routing with auto-fallback, token compression (RTK+Caveman), MCP/A2A protocols, CLI tool integrations, and a web dashboard.
>
> **Current version:** v3.8.50 (release branch). **Roadmap:** v3.8.54 → prep, v3.8.59 → validation, **v3.9.0 LTS** (stable/v3 branch), then **v4.0 modular** (@omniroute/core + @omniroute/sdk + modules + marketplace). The core is MIT and free forever.

---

## 🎯 Quick Start (Docker)

```bash
# 1. Clone & configure
git clone https://github.com/diegosouzapw/OmniRoute.git
cd OmniRoute
cp .env.example .env
# Edit .env: JWT_SECRET, API_KEY_SECRET, INITIAL_PASSWORD, OMNIROUTE_WS_BRIDGE_SECRET

# 2. Start with CLI profile (includes Codex, Claude Code, OpenClaw)
docker compose --profile cli up -d

# 3. Dashboard: http://localhost:20128
# 3. API Base: http://localhost:20128/v1 (canonical internal: /api/v1)
```

**Profiles:**
| Profile | Service | Use Case |
|---------|---------|----------|
| `base` | `omniroute-base` | Minimal, no CLIs |
| `cli` | `omniroute-cli` | **Recommended** — bundled CLIs (Codex, Claude Code, Droid, OpenClaw) |
| `host` | `omniroute-host` | Linux host — mounts host CLIs read-only |
| `web` | `omniroute-web` | Web-cookie providers (Gemini Web, Claude Web) — needs Chromium |
| `cliproxyapi` | `cliproxyapi` | CLIProxyAPI sidecar on :8317 |
| `memory` | `qdrant` | Qdrant vector memory sidecar |
| `bifrost` | `bifrost` | Go Tier-1 router sidecar on :8080 |

---

## 🔑 Provider Setup (Dashboard → Providers)

### Subscription (OAuth)
| Provider | Models | Quota |
|----------|--------|-------|
| **Claude Code** (`cc/`) | `cc/claude-opus-4-7`, `cc/claude-sonnet-4-6`, `cc/claude-haiku-4-5-20251001` | 5h + weekly |
| **Codex** (`cx/`) | `cx/gpt-5.5`, `cx/gpt-5.4`, `cx/gpt-5.3-codex` | 5h + weekly |
| **GitHub Copilot** (`gh/`) | `gh/gpt-5.5`, `gh/claude-opus-4.7`, `gh/gemini-3.1-pro-preview` | Monthly (1st) |
| **Kiro** (`kr/`) | `kr/claude-sonnet-4.6`, `kr/claude-opus-4.7` | ~50 credits/mo (FREE) |
| **Qoder** (`if/`) | `if/kimi-k2`, `if/qwen3-coder-plus`, `if/deepseek-r1` | **Unlimited FREE** |

### Cheap API Key
| Provider | Model ID | Cost | Notes |
|----------|----------|------|-------|
| **GLM** | `glm/glm-4.7` | $0.6/1M | Daily 10AM reset; Coding Plan = 3× quota at 1/7 cost |
| **MiniMax** | `minimax/MiniMax-M2.1` | $0.2/1M | 5h rolling; 1M context |
| **Kimi** | `kimi/kimi-k2.5` | $9/mo flat | 10M tokens/mo = $0.9/1M |
| **DeepSeek** | `ds/deepseek-v4-flash` | Pay per use | |

### Free (No Auth) — Built-in

| Provider | Prefix | Status (v3.8.48) | Models | Enable |
|----------|--------|------------------|--------|--------|
| **OpenCode** | `oc/` | ✅ Connectable | `oc/deepseek-v4-flash-free`, `oc/nemotron-3-ultra-free`, `oc/ling-3.0-flash-free`, `oc/north-mini-code-free`, `oc/laguna-s-2.1-free`, `oc/mimo-v2.5-free` + more | `apiKey: 'free'` via API or Dashboard |
| **Auggie** | `aug/` | ✅ Connectable | claude-sonnet-4.6, claude-opus-4.6, claude-haiku-4.5, gemini-3.1-pro, gemini-3.0-flash, gpt-5.5, kimi-k2.6 + 15 total | `apiKey: 'free'` via API or Dashboard |
| **MimoCode** | `mcode/` | ✅ Connectable | mimo-auto | `apiKey: 'free'` via API or Dashboard |
| **Veo AI Free** | `veo-free/` | ✅ Connectable | veo, seedance (video gen) | `apiKey: 'free'` via API or Dashboard |
| **Claude Web** | `claude-web/` | 🍪 Cookie | claude-fable-5, claude-opus-4-8, claude-sonnet-5, claude-haiku-4-5, claude-opus-4-7, claude-opus-4-6, claude-sonnet-4-6 | Cookie auth via claude.ai session |
| **AgentRouter** | `agentrouter/` | 🔑 API Key | claude-opus-4-6, claude-haiku-4-5, glm-5.1, deepseek-v3.2 | API key from agentrouter.org |
| **Qoder** | `if/` | 🔑 OAuth | kimi-k2, qwen3-coder-plus, deepseek-r1 | Dashboard → Connect Qoder → GitHub/Google |
| **Kiro** | `kr/` | 🔑 OAuth | claude-sonnet-4.6, claude-opus-4.7 + 9 total | Dashboard → Connect Kiro → AWS Builder ID |
| **Qwen** | `qw/` | 🔑 OAuth | 2 models | Dashboard → Connect Qwen → Google/GitHub |
| **TheOldLLM** | `tllm/` | ❌ Unavailable | GPT_5, CLAUDE_4_6_OPUS, gemini_3_pro + 26 total | Listed in catalog only — provider plugin absent in v3.8.48 |
| **DuckDuckGo Web** | `ddgw/` | ❌ Unavailable | gpt-4o-mini, gpt-5-mini, claude-3-5-haiku + | Listed in catalog only — provider plugin absent in v3.8.48 |
| **Chipotle** | `pepper/` | ❌ Unavailable | pepper-1 | Listed in catalog only — provider plugin absent in v3.8.48 |

> ⚠️ **"Free" connection ≠ free model usage.** `apiKey: 'free'` means adding the provider costs nothing, but some providers' models may still consume credits. The **only guaranteed no-cost models** are those with explicit `-free` in their model ID from the **OpenCode** provider (`oc/deepseek-v4-flash-free`, `oc/nemotron-3-ultra-free`, `oc/ling-3.0-flash-free`, `oc/north-mini-code-free`, `oc/laguna-s-2.1-free`, `oc/mimo-v2.5-free`). The user corrected this distinction three times during setup — do not equate "free provider connection" with "free model usage."

All free providers plus the auto-combo engine mean you can route entirely on free models.

---

## 🎨 Combos (Smart Fallback Chains)

### Auto-Combos (Zero Config — Recommended)

Use `auto/` prefix as your model ID. No combo creation needed — OmniRoute builds a **virtual combo** on-the-fly from all your active providers:

| Model ID | Behavior |
|----------|----------|
| `auto` | All providers, LKGP strategy, balanced weights |
| `auto/coding` | Quality-first weights, best for code generation |
| `auto/fast` | Low-latency weighted selection (ship-fast mode) |
| `auto/cheap` | Cost-optimized (cheapest first) |
| `auto/reasoning` | Reasoning/thinking models only |
| `auto/vision` | Vision-capable models only |
| `auto/smart` | Quality-first + 10% exploration rate |
| `auto/offline` | Max headroom (quota availability first) |

**Category × Tier composition:** `auto/<category>:<tier>`
- **Categories:** `coding`, `reasoning`, `vision`, `chat`, `multimodal`
- **Tiers:** `fast`, `cheap` (alias `floor`), `reliable`, `free`, `pro`
- Examples: `auto/coding:fast`, `auto/reasoning:pro`, `auto/vision:free`

The auto-combo engine uses **12-factor scoring** (health, quota, cost, latency, task-fit, stability, tier-priority, etc.) to pick the best provider per request. Mode packs bias the scores:
- **ship-fast**: latency 0.32 + health 0.28 (fastest response)
- **cost-saver**: cost 0.37 (cheapest tokens)
- **quality-first**: task-fit 0.37 + stability 0.15 (best model)

### Custom Combos (Manual)

**Dashboard → Combos → Create New** or via API:

**Dashboard form fields explained:**

| Section | Field | What it does | Recommended |
|---------|-------|-------------|-------------|
| **Basic** | `Name` | Combo identifier used as model ID in clients | Descriptive name like `free-all` |
| | `Strategy` | Routing algorithm (see strategies table) | `priority` for predictable fallback |
| | `Models` | Ordered/weighted list of model IDs to route through | Use format `provider/model-id` |
| **Response Validation** | `forbiddenSubstrings` | If the assistant response contains any of these strings, the combo fails over to the next model | `I cannot help`, `as an AI`, `I cannot assist` |
| | `requiredSubstrings` | If the response lacks any of these, failover | Rarely used — leave empty |
| | `minContentLength` | Minimum character count for a valid response | `10` to reject empty/placeholder replies |
| | `jsonPathChecks` | Advanced JSON response validation | Leave empty |
| **Agent Resources** | `systemPromptOverride` | Forces a system prompt for this combo, ignoring the client's | Leave empty (client controls it) |
| | `systemPromptRegex` | Regex-based substitution in system prompts | Leave empty |
| | `toolFilterRegex` | Only allow certain agent tools via regex (e.g. `^(bash\|computer)$`) | Leave empty unless restricting tools |
| | `protectCacheFromToolMutations` | Prevents tool calls from invalidating the cache | Off by default |
| | `contextCacheForAgents` | Cross-turn context caching for agent tool calls | Off by default |
| **Context Length** | `contextWindow` | Overrides the context length reported in `/v1/models` for this combo | Leave empty — auto-detected per model |

**API equivalent of these fields** goes into the `config` object:
```json
{
  "name": "free-all",
  "strategy": "priority",
  "models": ["aug/claude-sonnet-4.6", "oc/deepseek-v4-flash-free"],
  "config": {
    "validation": {
      "forbiddenSubstrings": ["I cannot help", "as an AI"],
      "minContentLength": 10
    }
  }
}
```

The basic combo creation API:
```bash
curl -X POST http://localhost:20128/api/combos \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "free-forever",
    "models": ["if/kimi-k2", "qw/coder-model", "if/deepseek-r1"],
    "strategy": "fill-first"
  }'
```

**Available models for combos come from the catalog** (fetch via API):
```bash
GET /api/models/catalog
# Returns providers: combo (37 auto-models), openrouter (362+ models),
# chipotle, auggie, opencode, duckduckgo-web, etc.
```

**Strategies:**
| Strategy | Behavior |
|----------|----------|
| `priority` (aka `fill-first`) | Primary until unavailable, then next |
| `round-robin` | Cycle with sticky limit (default 3) |
| `p2c` | Power of Two Choices — picks healthier of 2 random |
| `random` | Fisher-Yates shuffle |
| `least-used` | Oldest `lastUsedAt` |
| `cost-optimized` | Lowest priority value first |
| `weighted` | Weighted random by per-target weight |
| `lkgp` | Last Known Good Provider |
| `context-optimized` | Context-window affinity |
| `context-relay` | Route based on context |

**Use in CLI:**
```bash
# 3. API Base: http://localhost:20128/v1 (canonical internal: /api/v1)
API Key:  [from Dashboard → Endpoints]
Model:    auto/coding          # any auto/ variant OR combo name
```

---

## 🔧 CLI Tool Integration (Auto-configure)

```bash
# Local OmniRoute → local CLI config
omniroute setup-claude      # ~/.claude/settings.json
omniroute setup-codex       # ~/.codex/config.yaml
omniroute setup-opencode    # ~/.config/opencode/opencode.json
omniroute setup-cline       # Cline CLI + VS Code
omniroute setup-kilo        # Kilo Code
omniroute setup-continue    # ~/.continue/config.yaml
omniroute setup-cursor      # Prints Cursor steps
omniroute setup-roo         # Roo Code import
omniroute setup-crush       # ~/.config/crush/crush.json
omniroute setup-goose       # ~/.config/goose/config.yaml
omniroute setup-qwen        # ~/.qwen/settings.json
omniroute setup-aider       # ~/.aider.conf.yml

# Remote OmniRoute → local CLI
omniroute setup-claude --remote http://server:20128 --api-key sk-xxx
```

**Manual Config Examples:**

| Tool | Config |
|------|--------|
| **Claude Code** | `~/.claude/settings.json`: `{"env":{"ANTHROPIC_BASE_URL":"http://localhost:20128","ANTHROPIC_AUTH_TOKEN":"sk-xxx"}}` |
| **Codex** | `~/.codex/config.yaml`: `apiBaseUrl: http://localhost:20128/v1`, `apiKey: sk-xxx` |
| **OpenCode** | `~/.config/opencode/opencode.json`: provider `omniroute` with `baseURL: http://localhost:20128/v1` |
| **Cline** | `~/.cline/data/globalState.json`: `{"apiProvider":"openai","openAiBaseUrl":"http://localhost:20128/v1","openAiApiKey":"sk-xxx"}` |
| **OpenClaw** | `~/.openclaw/openclaw.json`: provider `omniroute` with `api: "openai-completions"` |

---

## 🐳 Docker Deployment (Production)

### Docker Compose (single port 20128)
```yaml
# docker-compose.yml (from repo)
services:
  omniroute:
    image: diegosouzapw/omniroute:latest
    container_name: omniroute
    restart: unless-stopped
    stop_grace_period: 40s
    ports:
      - "20128:20128"
    volumes:
      - omniroute-data:/app/data
    env_file: .env
    healthcheck:
      test: ["CMD", "node", "healthcheck.mjs"]
      interval: 30s
      timeout: 5s
      retries: 3
      start_period: 15s

  redis:
    image: redis:7-alpine
    container_name: omniroute-redis
    ports: ["6379:6379"]
    volumes: [redis-data:/data]
    command: redis-server --save 60 1 --loglevel warning

volumes:
  omniroute-data:
  redis-data:
```

### Docker Swarm (+ Traefik)

When deploying to a Swarm cluster with Traefik, use this template matching Alex's n8n format:

```yaml
version: "3.7"

services:

## --------------------------- OMNIROUTE --------------------------- ##

  omniroute:
    image: diegosouzapw/omniroute:latest

    volumes:
      - omniroute_data:/app/data

    networks:
      - riquest

    environment:
      - PORT=20128
      - TZ=America/Sao_Paulo
      - NODE_ENV=production
      - OMNIROUTE_MEMORY_MB=1024
      - REDIS_URL=redis://omniroute-redis:6379
      - OMNIROUTE_PUBLIC_BASE_URL=https://routers.riquest.com.br

    deploy:
      mode: replicated
      replicas: 1
      placement:
        constraints:
          - node.role == manager
      resources:
        limits:
          cpus: "1"
          memory: 1024M
      labels:
        - traefik.enable=true
        - traefik.http.routers.omniroute.rule=Host(`routers.riquest.com.br`)
        - traefik.http.routers.omniroute.entrypoints=websecure
        - traefik.http.routers.omniroute.priority=5
        - traefik.http.routers.omniroute.tls.certresolver=letsencryptresolver
        - traefik.http.routers.omniroute.service=omniroute
        - traefik.http.services.omniroute.loadbalancer.server.port=20128
        - traefik.http.services.omniroute.loadbalancer.passHostHeader=true

## --------------------------- REDIS --------------------------- ##

  omniroute-redis:
    image: redis:7-alpine

    volumes:
      - omniroute_redis_data:/data

    networks:
      - riquest

    deploy:
      placement:
        constraints:
          - node.role == manager
      resources:
        limits:
          cpus: "0.5"
          memory: 256M

volumes:
  omniroute_data:
    external: true
    name: omniroute_data
  omniroute_redis_data:
    external: true
    name: omniroute_redis_data

networks:
  riquest:
    external: true
    name: riquest
```

**⚠️ Portainer YAML quirks (Alex's stack format):**
- Labels use **backticks** (`` ` ``) in the `Host()` rule — CRITICAL. Missing backticks → Traefik router disabled with "is not defined" error.
- Labels should be written **without** quotes (the `- key=value` format, not `- "key=value"`)
- Use `##` section headers as visual dividers between services
- External volumes must exist with `external: true` and explicit `name:`
- The overlay network must be pre-created

**⚠️ Traefik must watch the same network:**
```bash
docker service update --network-add riquest traefik_traefik
docker service update --args "--providers.docker.network=eclick --providers.docker.network=riquest" traefik_traefik
```

**⚠️ Access note:** Alex accesses OmniRoute ONLY via the public domain (`https://routers.riquest.com.br`), NEVER via localhost. The server is remote (192.168.25.103).

### With Caddy (Auto-HTTPS)
```yaml
services:
  omniroute:
    image: diegosouzapw/omniroute:latest
    environment:
      - NEXT_PUBLIC_BASE_URL=https://your-domain.com
      - AUTH_COOKIE_SECURE=true
    volumes:
      - omniroute-data:/app/data

  caddy:
    image: caddy:latest
    ports: ["80:80", "443:443"]
    command: caddy reverse-proxy --from https://your-domain.com --to http://omniroute:20128
```

### Cloudflare Quick Tunnel
Dashboard → Endpoints → Enable **Cloudflare Quick Tunnel** → Get `https://xxx.trycloudflare.com/v1`

---

## ⚙️ Critical Environment Variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `JWT_SECRET` | **YES** | Session signing (`openssl rand -base64 48`) |
| `API_KEY_SECRET` | **YES** | Encrypt stored API keys (`openssl rand -hex 32`) |
| `INITIAL_PASSWORD` | **YES** | First login password (change after) |
| `OMNIROUTE_WS_BRIDGE_SECRET` | **YES (prod)** | WS bridge auth (`openssl rand -base64 32`) |
| `REDIS_URL` | **YES (Required)** | `redis://redis:6379` — rate limiter, cache, shared state. The official docker-compose always includes a Redis sidecar; without it the app runs but rate limiting, cache, and distributed state degrade or fail. |
| `DATA_DIR` | Docker | `/app/data` (mount volume) |
| `NEXT_PUBLIC_BASE_URL` | Prod | Public URL for OAuth callbacks |
| `OMNIROUTE_PUBLIC_BASE_URL` | **YES (dashboard)** | Must match the public URL (e.g. `https://routers.riquest.com.br`). Without it the dashboard shows `Invalid request origin / Same-origin dashboard writes must include a valid dashboard CSRF token` errors when using the UI. Same as `NEXT_PUBLIC_BASE_URL` in the upstream repo. |
| `AUTH_COOKIE_SECURE` | Prod | `true` behind HTTPS |
| `REQUIRE_API_KEY` | Multi-user | `true` to enforce Bearer on `/v1/*` |
| `OMNIROUTE_ALLOW_PRIVATE_PROVIDER_URLS` | Local LLMs | `true` for Ollama/LM Studio |
| `OMNIROUTE_MEMORY_MB` | Docker | Heap limit (default 512) |
| `BIFROST_ENABLED` | Optional | `1` to enable Go Tier-1 router sidecar |

**Full reference:** `docs/reference/ENVIRONMENT.md` (100+ vars)

---

## 📡 API Reference (Key Endpoints)

### Chat & Completions
```
POST /v1/chat/completions          # OpenAI format (also works as /api/v1/...)
POST /v1/messages                  # Anthropic format
POST /v1/responses                 # OpenAI Responses API
GET  /v1/models                    # List all models + combos
```

**Path note:** The canonical local path is `/api/v1` (e.g. `http://localhost:20128/api/v1/chat/completions`). The `/v1` path also works and is the externally-exposed path via reverse proxy.

### Audio Transcription
```
POST /v1/audio/transcriptions  # OpenAI-compatible — routes to Groq Whisper
```

**Models:** `groq/whisper-large-v3-turbo` (fastest), `groq/whisper-large-v3`, `groq/distil-whisper-large-v3-en`

**Usage (multipart/form-data):**
| Field | Type | Value |
|-------|------|-------|
| `file` | binary | Audio file (flac, m4a, mp3, mp4, mpeg, oga, ogg, wav, webm) |
| `model` | string | `groq/whisper-large-v3-turbo` |
| `language` | string | `pt` (optional ISO code) |
| `response_format` | string | `json` or `verbose_json` (optional, default `json`) |
| `temperature` | number | `0` (optional) |

**cURL:**
```bash
curl --request POST --url https://routers.riquest.com.br/v1/audio/transcriptions \
  --header "Authorization: Bearer n8n-omniroute-2024" \
  --form "file=@/tmp/audio.mp3" \
  --form "model=groq/whisper-large-v3-turbo" \
  --form "language=pt"
```

**n8n integration (HTTP Request node):**
- Method: `POST`
- URL: `https://routers.riquest.com.br/v1/audio/transcriptions`
- Authentication: Header Auth → `Authorization: Bearer n8n-omniroute-2024`
- Body Content Type: `multipart-form-data`
- Parameters:
  - `file` — **Parameter Type: File**, Value: `{{ $binary.DATA_PROPERTY.data }}` (from Convert to File or binary source)
  - `model` — String: `groq/whisper-large-v3-turbo`
  - `language` — String: `pt`
  - `response_format` — String: `verbose_json`
  - `temperature` — String: `0`
- Result: `{{ $json.text }}` contains the transcript

**Groq free tier:** generous — thousands of minutes/day at no cost.

### Text-to-Speech (Audio Speech)

⚠️ **Not supported by OmniRoute in v3.8.48.** The `/v1/audio/speech` endpoint exists but returns `"Invalid speech model"` for any model ID passed. Groq's TTS models (playai-tts) are not routed through OmniRoute.

The user has a separate **Kokoro TTS** service running on `srv-eclick` (192.168.25.102) in the Docker Swarm for TTS needs.

### Provider & Combo Management
```
GET    /api/providers              # List configured
POST   /api/providers              # Add provider
GET    /api/providers/available    # Browse catalog
POST   /api/providers/test         # Test connection

GET    /api/combos                 # List combos
POST   /api/combos                 # Create combo
PUT    /api/combos/:id             # Update
DELETE /api/combos/:id             # Delete
```

### API Keys (Endpoints)
```
GET    /api/endpoints              # List keys
POST   /api/endpoints              # Create key
DELETE /api/endpoints/:id          # Revoke
```

### Monitoring & Health
```
GET /api/monitoring/health         # Health + provider counts
GET /api/telemetry/summary         # Latency p50/p95/p99 per provider
GET /api/cache/stats               # Cache hit rates
```

### MCP (Model Context Protocol)
```
GET  /api/mcp/status               # Server status
GET  /api/mcp/tools                # List 87 tools
GET  /api/mcp/sse                  # SSE transport
POST /api/mcp/sse                  # JSON-RPC on SSE
```

### A2A (Agent-to-Agent)
```
GET  /.well-known/agent.json       # Agent Card
POST /a2a                          # JSON-RPC 2.0
```

### Skills & Memory
```
GET  /api/skills                   # List installed
POST /api/skills/install           # Install from manifest
GET  /api/skills/marketplace?q=    # Search SkillsMP
GET  /api/memory                   # List memories
POST /api/memory                   # Create memory
```

---

## 🧠 Advanced Features

### Token Compression (RTK + Caveman)
- **Header:** `x-omniroute-compression: engine:rtk` | `engine:caveman` | `combo-name` | `off` | `default`
- **Dashboard:** Settings → Compression → Default profile + per-combo override
- **Savings:** 15–95% tokens

### Semantic Cache
- Auto-caches non-streaming, `temperature=0` responses
- Bypass: `X-OmniRoute-No-Cache: true`
- Response header: `X-OmniRoute-Cache: HIT|MISS`

### Idempotency
- `Idempotency-Key` or `X-Request-Id` header → 5s dedup window
- Response: `X-OmniRoute-Idempotent: true`

### Circuit Breakers & Resilience
```
GET  /api/resilience                    # Current state
PATCH /api/resilience                   # Override breaker thresholds
POST /api/resilience/reset              # Reset all breakers
GET  /api/resilience/model-cooldowns    # Active model lockouts
DELETE /api/resilience/model-cooldowns  # Clear lockout
```

### API Key Restrictions (PATCH)

⚠️ **`PATCH /api/keys/:id` — NOT POST.** The `allowedCombos`, `allowedModels` etc. are set via PATCH after creation, not on POST.

```bash
# Create key first
curl -sk -b /tmp/cookies -X POST https://routers.riquest.com.br/api/keys \
  -H "Content-Type: application/json" \
  -d '{"name":"client-x","key":"sk-client-x"}'

# Then restrict via PATCH
curl -sk -b /tmp/cookies -X PATCH https://routers.riquest.com.br/api/keys/ID \
  -H "Content-Type: application/json" \
  -d '{
    "allowedCombos": ["free-all"],
    "maxRequestsPerDay": 500,
    "usageLimitEnabled": true,
    "ipAllowlist": "201.10.0.0/16"
  }'
```

**Restriction fields:**

| Field | What it does | Example |
|---|---|---|
| `allowedCombos` | Only allows these combos | `["free-all", "infinite-free"]` |
| `allowedModels` | Only allows these model IDs | `["oc/deepseek-v4-flash-free"]` |
| `blockedModels` | Blocks these models (supports glob) | `["openrouter/*"]` |
| `maxRequestsPerDay` | Hard cap on requests/day | `1000` |
| `maxRequestsPerMinute` | Rate limit per minute | `60` |
| `dailyUsageLimitUsd` | USD spending cap per day | `2.00` |
| `weeklyUsageLimitUsd` | USD spending cap per week | `10.00` |
| `ipAllowlist` | CIDR whitelist for source IP | `"201.10.0.0/16"` |
| `allowedEndpoints` | Allowed API endpoint paths | `["/v1/chat/completions"]` |
| `usageLimitEnabled` | Master toggle for budget caps | `true` |

### Quota Plans (Plans & Quotas)

Configure per-provider consumption limits with dimensions and time windows.

**Dashboard:** Provider Quota → Plans & Quotas

**Dimensions:** `percent`, `requests`, `tokens`, `usd`
**Windows:** `5h`, `hourly`, `daily`, `weekly`, `monthly`

Auto-detects provider plans (e.g. Codex 5h + weekly) or manual override.

### Quota Pools (Sharing)

Share a provider's quota across multiple API keys with weight % allocation.

**Dashboard:** Quota Sharing (may be 404 in v3.8.48 — feature in development)

**Key concepts:**
- **Pool:** One provider/connection, one time window, shared across keys
- **Weight:** Each key gets quota proportional to its configured weight (fair-share)
- **Exclusive mode:** Key only sees the pool's models — hides everything else
- **Borrowing:** Keys can consume free balance from others (up to cap)
- **Free Pool:** Allow burst into free pool when paid quota exhausted
- **Groups:** Organize pools into named groups

### 💰 Commercial Model (Selling Access)

OmniRoute supports two billing models for reselling:

| | 📦 Prepaid (Fixed) | 📊 Postpaid (Dynamic) |
|---|---|---|
| **Mechanism** | Pool + key with 100% weight + `allowedCombos` | Key with `dailyUsageLimitUsd` cap |
| **When exhausted** | HTTP 402 — blocked until quota increased | Resets next day |
| **Best for** | Subscriptions, fixed token packages | Enterprise, usage-based billing |

**Prepaid setup:**
```bash
# 1. Create key
curl -sk -b /tmp/cookies -X POST https://.../api/keys \
  -d '{"name":"cliente-x","key":"sk-cliente-x"}'

# 2. Restrict: combo + daily cap + IP whitelist
curl -sk -b /tmp/cookies -X PATCH https://.../api/keys/ID \
  -d '{
    "allowedCombos": ["free-all"],
    "maxRequestsPerDay": 500,
    "usageLimitEnabled": true,
    "ipAllowlist": "201.10.0.0/16"
  }'

# 3. Renewal: bump the limit
curl -sk -b /tmp/cookies -X PATCH https://.../api/keys/ID \
  -d '{"maxRequestsPerDay": 1000}'
```

**Postpaid setup:**
```bash
curl -sk -b /tmp/cookies -X PATCH https://.../api/keys/ID \
  -d '{
    "usageLimitEnabled": true,
    "dailyUsageLimitUsd": 2.00
  }'
```

**Suggested pricing tiers:**

| Plan | Req/day | Max $/day | Combos | Price |
|---|---|---|---|---|
| Free | 100 | $0 | Free only | Grátis |
| Basic | 1.000 | $0,50 | Free + cheap | R$ 29/mês |
| Pro | 10.000 | $5,00 | All | R$ 99/mês |
| Enterprise | Unlimited | Custom | Custom | Sob consulta |

**Monitoring:** Traffic Inspector + Analytics for per-key consumption tracking.

**Exhaustion response:** HTTP 402 `"Insufficient Balance / Quota Exhausted"` — the client's call fails cleanly. The key's `maxRequestsPerDay` / `dailyUsageLimitUsd` auto-block without manual intervention.

⚠️ **Important:** Quota Pools UI (`quota-sharing` page) returns 404 in v3.8.48. The API endpoint `/api/quota/pools` exists but pool creation returns `bad_request`. Use per-key restrictions (`maxRequestsPerDay`, `dailyUsageLimitUsd`, `allowedCombos`) as the reliable path for now.

### Budget & Token Limits
```\nGET  /api/usage/budget                  # USD budgets per key\nPOST /api/usage/budget                  # Set budget\nGET  /api/usage/token-limits?apiKeyId=  # Token budgets per key\nPOST /api/usage/token-limits            # Set token limit\n```\n\n### Usage Logs (Analytics)
```\nGET /api/usage/logs?limit=N            # Call history
```
Format: `timestamp | model | provider | auth_type | tokens_in | tokens_out | status_code`

---

## 🖥️ Dashboard Features Reference

Complete sidebar feature map for `routers.riquest.com.br` (v3.8.48), organized by section.

### 📡 OmniProxy

| Dashboard Item | Function |
|----------------|----------|
| **Endpoints** | AI connection URLs — pre-built OpenAI Chat, Anthropic Messages, Codex Responses, Audio, Models, WebSocket examples |
| **API Keys** | Create, list, revoke keys. **Custom key values** accepted on create (not truncated in response) |
| **Providers** | Add/test providers — `apiKey: 'free'`, API key, OAuth. Supports **key pooling** (multiple keys same provider) |
| **Serviços Embarcados** | Embedded: **9Router** (Go Tier-1 sidecar :8080), **CLIProxyAPI** (CLI proxy :8317) |
| **Combos** | Create with 14 strategies, response validation, agent resources, context overrides |
| **Combo Studio** | Live routing cascade — see model active/fail reason/response times in real time |
| **Provider Quota** | Real-time usage limits per provider, auto-detected from catalog, manual override |
| **Quota Sharing** | Pools sharing quota between API keys. **Currently empty** — no pools configured |

### 🗜️ Compression

| Engine | Savings | Best for |
|--------|---------|----------|
| **RTK** | 15-40% | Logs, commands, repetitive text |
| **Caveman** | 30-60% | Prose, long prompts |
| **LLMLingua** | 40-80% | Semantic pruning |
| **Headroom** | 20-50% | Tables, structured data |
| **Lite** | 5-15% | Whitespace cleanup |
| **Aggressive** | 50-95% | Max compression (summary + aging) |
| **Ultra** | Similar to Aggressive | Heuristic pruning |
| **OmniGlyph** | Extreme compression | Context-as-image |

Also: **Session Dedup** (cross-turn), **CCR** (retrieve markers), **Engine Combos** (cascade multiple engines), **Compression Studio** (live cascade testing)

### 🛠️ Tools

| Feature | Description |
|---------|-------------|
| **CLI Code** | Code tools routed through OmniRoute (OpenCode, Codex, Claude Code). Auto-configure via `setup-*` commands |
| **CLI Agents** | Autonomous CLIs (Hermes Agent, Goose, OpenClaw) |
| **ACP Agents** | CLIs **spawned by** OmniRoute (reverse flow). 13 built-in: codex, claude, goose, openclaw, aider, opencode, cline, qwen, forge, amazon-q, interpreter, cursor-cli, warp. Custom agents supported. |
| **Cloud Agents** | 24/7 cloud-based agents. **Not configured** — requires OmniRoute Cloud account |
| **Agent Bridge** | **MITM proxy** intercepts IDE agent HTTPS traffic (Claude Code, Cursor, Copilot). Installs CA root cert, DNS-spoofs api.anthropic.com / api.openai.com. No agent config needed |
| **Traffic Inspector** | Live LLM monitoring — capture requests/responses, export .har, record sessions for offline debug |
| **AgentBridge** | **MITM proxy** intercepts IDE agent HTTPS traffic (9 agents: Claude Code, Cursor, Copilot, Codex, Kiro, Antigravity, Zed, OpenCode, Trae). Installs CA root cert, DNS-spoofs api.anthropic.com / api.openai.com. No agent config needed. |
| **Playground Studio** | 4 tabs: Chat (multi-turn streaming), **Compare** (1 prompt → 4 models parallel), API (Monaco editor), Build (tools/structured output). Prompt Improver, Export Code (curl/Python/TS). Dashboard: `/dashboard/playground` |

### 🔍 Dev Tools

| Feature | Description |
|---------|-------------|
| **Descoberta (Discovery)** | LOCAL-ONLY. Scans provider endpoints for free access methods. Access via `http://localhost:20128` |
| **Free Provider Rankings** | Arena ELO leaderboard synced every 24h. Top: Blackbox AI (1508), Auggie (1505), Antigravity (1505), BazaarLink (1505) |
| **Chaos Mode** | Run models **parallel** (fastest wins) or **collaborative** (chain output). **OFF by default** |
| **Gamification** | XP & levels, 20+ badges, streaks, leaderboards (global/weekly/monthly), token sharing between users, invite/redeem codes, community server federation. Local-first SQLite, zero-latency on hot path (fire-and-forget). |
| **Local Corpus** | Expose one approved directory of text files to MCP server. In-memory search index, 3 MCP tools (status, search, read). Supports .md, .py, .ts, .js, .json, .yaml, etc. Max 5000 files, 64MB total. |

### 📊 Analytics

| Feature | Function |
|---------|----------|
| **Custos (Overview)** | Cost analysis — tokens per provider/model |
| **Usage Logs** | History: `timestamp | model | provider | auth_type | tokens_in | tokens_out | status` |
| **Pricing** | Price per 1K tokens per model, auto-updated |
| **Budget** | USD or token caps per API key (daily/weekly/monthly). Auto-block on overage |
| **Free Tier Budget** | Monthly free-token allowances |
| **Free Provider Rankings** | Arena ELO leaderboard |

### ⚙️ Configuration

| Section | Key Options |
|---------|-------------|
| **General** | App Name, TZ (America/Sao_Paulo), Sticky RR Limit (3), Provider Strategy (fallback), Require Login (true), Max Body (10MB), Idempotency (5000ms) |
| **Appearance** | Theme, layout |
| **AI Settings** | System Prompt (OFF), Hide Paid (OFF), Debug (ON), Codex Service Tier (OFF), Claude Fast Mode (OFF) |
| **Global Routing** | Wildcard Model Aliases (`claude-sonnet-*` → `cc/claude-sonnet-4-6`), Sticky RR, Prefer Claude Code |
| **Resilience** | Breakers (8 OAuth/12 key fails), Queue (60/min, 350ms, 6 concurrent), Cooldown (3s key/5s OAuth, 8 levels), Retry (3×, 30s max) |
| **Advanced** | Debug internals |
| **Security** | Login required, WS Bridge Secret, encrypted key storage |
| **Tokens de Acesso** | Scoped CLI tokens for remote mode |
| **Feature Flags** | MCP (OFF), A2A (OFF), Chaos (OFF), Tailscale Tunnel (OFF), Cloud Sync (OFF), Arena ELO Sync (ON), Debug (ON) |
| **Sidebar** | Customize sidebar layout — reorder, hide sections |

### 🤖 Agentic Features
- **MCP:** 36 tools — **OFFLINE**. Enable via Settings → mcpEnabled
- **A2A:** JSON-RPC 2.0. 6 skills: smart-routing, model-query, quota-analytics, cost-tracker, provider-health, combo-optimizer. Card: `/.well-known/agent.json`
- **44 Agent Skills:** Code-oriented (Auth, Providers, Models, Combos, Keys, Usage, Budget, Settings, Proxy, Cache, Compression, Resilience, CLI Tools, Tunnels, Cloud Sync, Backups, Webhooks, MCP, A2A, Version, Inference) + 22 CLI-specific (serve, health, providers, keys, models, chat, routing, resilience, compression, contexts, cost, MCP, A2A, tunnel, backup, policy/audit, batches/files, evals, plugins/skills/memory, setup/config, Codex CLI, GitHub skills)
- **CLI Plugin System:** `omniroute-cmd-*` naming convention. Install from npm or local. `omniroute plugin install stripe`, `omniroute plugin scaffold myplugin`. Plugin SDK with `register(program, ctx)` API. Discovery: `~/.omniroute/plugins/` + `OMNIROUTE_PLUGIN_PATH`.
- **Skills Framework:** Two systems — **Omni Skills** (LLM tool injection + sandboxed execution: file_read, file_write, http_request, web_search, eval_code, execute_command, browser) and **Agent Skills** (SKILL.md catalog for external agents). Sources: built-in, SkillsMP marketplace, SkillsSH community.
- **Reasoning Replay Cache:** Captures `reasoning_content` from thinking-mode models, replays on multi-turn to prevent HTTP 400. Hybrid memory (2000 LRU) + SQLite. Providers: deepseek, opencode-go, siliconflow, nebius, deepinfra, sambanova, fireworks, together, kimi-coding, xiaomi-mimo. TTL 2h.
- **Reasoning Routing:** Rules for effort/budget manipulation. Scopes: apiKey > combo > model > global. Effort: any, missing, none, low, medium, high, xhigh, max, ultra. Modes: inherit, default, force. Budget: preserve, remove, set. API: `/api/settings/reasoning-routing-rules`.

### 🔗 Other Features
- **Webhooks:** Events: `request.completed`, `provider.status_changed`, `quota.limit_reached`, `error.threshold`
- **Tunnels:** ngrok, Cloudflare Quick Tunnel via Dashboard
- **Cloud Sync:** Remote config sync
- **Backups:** SQLite snapshots + restore
- **Version Manager:** Embedded services versioning

---

## 🔌 Model ID Format

**Provider-prefixed:** `<provider>/<model>`
```
cc/claude-opus-4-7
cx/gpt-5.5
gh/gpt-5.5
if/kimi-k2
qw/coder-model
glm/glm-4.7
minimax/MiniMax-M2.1
kimi/kimi-k2.5
ds/deepseek-v4-flash
groq/llama-3.3-70b-versatile
xai/grok-4.20-0309-reasoning
mistral/mistral-large-latest
pplx/sonar-pro
together/meta-llama/Llama-3.3-70B-Instruct-Turbo-Free
fireworks/accounts/fireworks/models/kimi-k2p6
cerebras/zai-glm-4.7
cohere/command-a-reasoning-08-2025
nvidia/z-ai/glm-5.1
qianfan/ernie-5.1
```

**Combos:** Use combo name directly: `free-forever`, `premium-coding`

**Wildcard aliases:** Dashboard → Settings → Routing → Wildcard Model Aliases
```
claude-sonnet-* → cc/claude-sonnet-4-6
gpt-*         → gh/gpt-5.3-codex
```

---

## 🛠️ Internal CLI (`omniroute` binary)

```bash
omniroute                    # Start server
omniroute setup              # Interactive wizard
omniroute setup --non-interactive --password "xxx" --add-provider --provider openai --api-key "sk-xxx" --test-provider
omniroute doctor             # Health checks
omniroute providers list     # Configured connections
omniroute providers test-all # Test all
omniroute providers available --search openai
omniroute status             # Runtime status
omniroute logs --follow      # Stream logs
omniroute health             # Detailed health (breakers, cache, memory)
omniroute combo list | switch | create | delete
omniroute keys add | list | remove
omniroute backup | restore
omniroute mcp status | restart
omniroute a2a status | card
```

---

## 📁 Key Files & Paths

| Path | Purpose |
|------|---------|
| `~/.omniroute/` | Data dir (SQLite, logs, backups) |
| `docker-compose.yml` | Main compose with profiles |
| `docker-compose.prod.yml` | Production stack (ports 20130/20131) |
| `.env` | Runtime secrets |
| `src/shared/constants/cliTools.ts` | CLI catalog (20 code + 6 agents) |
| `src/lib/acp/registry.ts` | ACP spawnable agents |
| `open-sse/config/providerPluginManifestRegistry.ts` | Provider manifests |

---

## 📁 Files in This Skill

| File | Purpose |
|------|---------|
| `SKILL.md` | Full OmniRoute reference (this file's parent) |
| `references/alex-production-deployment.md` | Production deployment notes for srv-riquest (192.168.25.103) |
| `references/free-providers-combos.md` | Free provider catalog with model IDs, context lengths, thinking vs execution combo pattern |
| `references/traefik-backtick-pitfall.md` | Debugging guide for Traefik router disabled by missing backticks in `Host()` rule |
| `references/api-patterns.md` | API endpoints + setup script + tool configs |
| `references/api-quickref.md` | Quick API reference |
| `references/n8n-integration.md` | n8n HTTP Request node JSON + audio transcription patterns |
| `scripts/setup-omniroute.sh` | Automated setup script (run after deploy) |
| `references/dashboard-features.md` | Full Dashboard Features Catalog — every sidebar item with API endpoints, settings, and configuration values |
| `references/practical-scenarios.md` | 11 practical scenarios with strategy, models, and rationale for each use case |

---

## 🚨 Troubleshooting

| Issue | Fix |
|-------|-----|
| "Executable doesn't exist at .../chromium" | Use `--profile web` (includes Playwright/Chromium) |
| OAuth callback fails | Set `NEXT_PUBLIC_BASE_URL=https://your-domain.com` + `AUTH_COOKIE_SECURE=true` |
| Rate limited on free providers | Add more free providers to combo; enable `fill-first` |
| WebSocket connection rejected | Set `LIVE_WS_ALLOWED_ORIGINS=https://your-domain.com` |
| Local LLM (Ollama) blocked | `OMNIROUTE_ALLOW_PRIVATE_PROVIDER_URLS=true` |
| Container OOM | Increase `OMNIROUTE_MEMORY_MB=1024` |
| Port 20128 in use | Set `PORT=3000` in `.env` |
| Container starts but nothing listens on 20128 | The image `CMD` is `node dev/run-standalone.mjs` — despite the `dev/` path, this IS the production entrypoint. It bootstraps env, runs migrations, then spawns the Next.js standalone server. If nothing binds, check that `HOSTNAME=0.0.0.0` is set (it is set in the Dockerfile: `ENV HOSTNAME=0.0.0.0`). Next.js uses `HOSTNAME` env var, NOT `HOST`. |
| Service restarts in loop on Swarm | Check healthcheck (`CMD node healthcheck.mjs`). If migrations take long during first start, increase `start_period` to 90s. Also verify `REDIS_URL` is reachable — if Redis is down the healthchecks may fail. |
| Frontend returns 404 (Traefik seen but no route) | **Traefik backtick pitfall:** The `Host()` rule MUST use backticks: `Host(\`domain.com\`)`. Without them, the Traefik router is **disabled** with error: `"routers.riquest.com.br is not defined"` or `"illegal rune literal"`. Check via `curl -sk http://127.0.0.1:8080/api/http/routers/omniroute@swarm` — look for `"status":"disabled"` and `"error"`. Fix: update the label via Docker API (NOT shell — shell eats backticks as command substitution). See "Docker Service Update with Backticks" below. |
| `Invalid request origin` / CSRF error in dashboard | Set `OMNIROUTE_PUBLIC_BASE_URL=https://routers.riquest.com.br` (or your public URL) as an environment variable and restart the container. |
| Combo creation fails with `"Invalid input"` at `models.0` | The `models` array must be **plain strings**, not objects. ❌ `"models": [{"model":"..."}]` → ✅ `"models": ["provider/model-id"]` |

### Docker Service Update with Backticks

When updating a Traefik label that contains backticks (`` ` ``), you CANNOT use `docker service update --label-add` from the shell — the shell interprets backticks as command substitution. Use the Docker REST API instead:

```bash
# 1. Get current spec and write to file
curl -s --unix-socket /var/run/docker.sock \
  http://localhost/v1.48/services/omniroute_omniroute > /tmp/spec.json

# 2. Edit the rule label in /tmp/spec.json to include backticks
#    Change: "Host(domain.com)" → "Host(`domain.com`)"

# 3. Get version and update
VERSION=$(python3 -c "import json;d=json.load(open('/tmp/spec.json'));print(d['Version']['Index'])")

# 4. POST update with @file (avoids shell interpretation)
curl -s -X POST --unix-socket /var/run/docker.sock \
  "http://localhost/v1.48/services/omniroute_omniroute/update?version=$VERSION" \
  -H "Content-Type: application/json" \
  -d @/tmp/spec.json
```

Alternatively, write the JSON payload from Python to avoid shell backtick issues entirely.

---

## 🔗 Links

- **GitHub:** https://github.com/diegosouzapw/OmniRoute
- **Dashboard:** http://localhost:20128 (or your domain)
- **Docs:** https://omniroute.online/
- **API Reference:** `docs/reference/API_REFERENCE.md`
- **Setup Guide:** `docs/guides/SETUP_GUIDE.md`
- **User Guide:** `docs/guides/USER_GUIDE.md`
- **Docker Guide:** `docs/guides/DOCKER_GUIDE.md`
- **CLI Tools:** `docs/reference/CLI-TOOLS.md`
- **Environment:** `docs/reference/ENVIRONMENT.md`

---

## 💡 Alex's Stack Notes (from context)

- **Server:** `srv-riquest` (192.168.25.103) — Docker Swarm, Portainer
- **Domain:** `routers.riquest.com.br` (⚠️ NOT `routes...` — common typo in older docs)
- **Access:** Alex accesses OmniRoute ONLY via the public domain (remote server), NEVER via localhost
- **Current OmniRoute:** `diegosouzapw/omniroute:latest` on port 20128, 1 replica
- **Network:** `riquest` (overlay) — same as n8n and other stacks
- **Redis:** `omniroute-redis` on same network (required for rate limiting, cache)
- **Login:** Senha `Riquestlog_852` (sem email)
- **Canonical internal path:** `http://omniroute:20128/api/v1` (NOT `/v1` — the container serves at `/api/v1`)
- **Free combo patterns:** `thinking-free` (reasoning), `execution-free` (fast), `free-all` (max coverage with paid fallback), `truly-free` (only `oc/*-free` models, no cost). See `references/free-providers-combos.md`.
- **4 OpenRouter keys:** Added as `openrouter-1` through `openrouter-4` via API
- **OpenCode:** Added as connection with `apiKey: 'free'` — appears as active provider
- **Auggie:** Added as connection with `apiKey: 'free'` ✅ (2026-07-29)
- **MimoCode:** Added as connection with `apiKey: 'free'` ✅ (2026-07-29)
- **OpenCode as connection:** `{"name": "opencode", "provider": "opencode", "apiKey": "free"}`
- **Free provider caveat:** `theoldllm`, `duckduckgo-web`, and `chipotle` models appear in catalog but their providers return `"Invalid provider"` — not connectable in v3.8.48
- **API Keys:**
  - `n8n-omniroute-2024` (for n8n automations, user-specified key)
  - `hermes-key-omniroute` (for Hermes Agent, user-specified key)
- **n8n integration:** Use OpenAI node with Base URL `https://routers.riquest.com.br/v1` + API Key `n8n-omniroute-2024`
- **Hermes integration:** Use `hermes model` → Custom endpoint → `https://routers.riquest.com.br/v1` + API key
- **Combo creation via API:** `curl -X POST /api/combos -H "Authorization: Bearer ..." -d '{"name":"...","models":["id1","id2"],"strategy":"priority"}'`
- **Combo model format:** `models` array MUST be plain strings (`["provider/model-id"]`), NOT objects
- **Combo validation config:** Use `config.validation.forbiddenSubstrings` (array) + `config.validation.minContentLength` (int) to auto-failover on garbage responses. Supported by the dashboard form fields. See "Custom Combos" section above.
- **Combo context requirements:** Add `config.contextRequirements` to filter/sort targets by context window: `{minContextWindow: 128000, preferLargeContext: true, contextFilterMode: "strict"}`. Useful for long-document processing (128K+) or codebase analysis. Strict mode excludes unknown-context models (fail-opens if pool empties). Lenient mode includes unknowns.
- **Free combo `free-all`:** Final version 2026-07-29 contains ONLY `oc/*-free` models (deepseek-v4-flash-free, nemotron-3-ultra-free, ling-3.0-flash-free, north-mini-code-free, laguna-s-2.1-free, mimo-v2.5-free). User rejected two previous versions that included auggie/openrouter/groq models — insists only models with `-free` suffix are truly free. Strategy `priority`, validation config active. See `references/free-providers-combos.md` for both `free-all` (all-provider) and `truly-free` patterns.

---

## ✅ Deployment Status (verified 2026-07-29 — combo creation session)

| Item | Status |
|------|--------|
| **Stack** | Deployed & running (`omniroute_omniroute` 1/1 on `srv-riquest`) |
| **Version** | v3.8.50 (release branch) |
| **Health** | `https://routers.riquest.com.br/api/monitoring/health` → `{"status":"healthy",...}` |
| **API Base** | `https://routers.riquest.com.br/v1` (OpenAI-compatible) |
| **Login** | Senha `Riquestlog_852` (sem email) |
| **Providers** | 4 OpenRouter keys + Groq + opencode + auggie + mimocode (5 free built-ins) |
| Combos | `thinking-free` (6 models), `execution-free` (7 models), **`free-all`** (6 `oc/*-free` models w/ validation, truly free) |
| **API Key** | `n8n-omniroute-2024` (`n8n-automacao`) — testada com Bearer auth via `/v1/chat/completions` ✅ |

---

## 🎯 Lessons Learned (2026-07-29 — Combo + Audio Session)

### Free Model Distinction (user-corrected 3×)
- `apiKey: 'free'` = free to **add the connection**, NOT free to **use the models**
- Only models with `-free` suffix in the ID from OpenCode are guaranteed no-cost
- Auggie/MimoCode models appear to work but may consume credits — the user insists on `oc/*-free` only for a "truly free" combo
- Combo `truly-free` uses only `oc/deepseek-v4-flash-free`, `oc/nemotron-3-ultra-free`, `oc/ling-3.0-flash-free`, `oc/north-mini-code-free`, `oc/laguna-s-2.1-free`, `oc/mimo-v2.5-free`

### Audio Transcription
- `/v1/audio/transcriptions` works through OmniRoute → Groq Whisper
- Endpoint tested with tone file → returned "." (expected for non-speech)
- n8n integration: HTTP Request node with `multipart-form-data` Content Type, `file` as FormBinaryData parameter
- User already had a working Groq-direct audio node — just changed URL + auth + model prefix

### TTS Limitation
| **TTS Limitation** | `/v1/audio/speech` exists but doesn't route any models → "Invalid speech model" error |
| **Memory OFF by Default** | Since v3.8.30+, `DEFAULT_MEMORY_SETTINGS.enabled` is `false`. Enabling injects ~2k tokens into every chat request (billed). Opt in under Settings → Memory. Per-request opt-out: `x-omniroute-no-memory: true` header. |
| **Reasoning Replay Cache** | Captures `reasoning_content` from thinking-mode models and replays on multi-turn to prevent HTTP 400 from strict providers (DeepSeek, OpenCode-Go, SiliconFlow, etc.). Hybrid memory (2000 entries LRU) + SQLite. TTL: 2h. |
| **Combo Context Requirements** | Add `contextRequirements` to combo config: `{minContextWindow: 128000, preferLargeContext: true, contextFilterMode: "strict"}`. Filters out models below threshold, sorts by context size. Fail-opens to unknown-context models if pool would empty. |
| **Claude Web Models** | `claude-web` provider now has: `claude-fable-5`, `claude-opus-4-8`, `claude-sonnet-5`, `claude-haiku-4-5-20251001`, `claude-opus-4-7`, `claude-opus-4-6`, `claude-sonnet-4-6`. Cookie-based auth via claude.ai session. |
| **AgentRouter Provider** | Built-in Anthropic-compatible relay at `agentrouter.org`. Supports Claude Code wire image natively. Models: `claude-opus-4-6`, `claude-haiku-4-5-20251001`, `glm-5.1`, `deepseek-v3.2`. |
| **Alibaba/Qwen Families** | 4 provider IDs: `alibaba` (Model Studio), `bailian-coding-plan` (Token Plan/Anthropic wire), `qwen-cloud` (Qwen pay-as-you-go), `qwen-cloud-token-plan`. Regions: `global-sg` and `china-beijing`. |
| **ACP Agents (13 built-in)** | `codex`, `claude`, `goose`, `openclaw`, `aider`, `opencode`, `cline`, `qwen`, `forge`, `amazon-q`, `interpreter`, `cursor-cli`, `warp`. Custom agents supported. |
| **Free Tiers Totals** | ~1.53B documented free tokens/month across 43 pools (Mistral 1B, LLM7 150M, Groq 117M, Gemini 60M, Cerebras 30M, Cloudflare AI 30M, SambaNova 30M). + ~620M first-month signup credits. |
- User has separate Kokoro TTS on srv-eclick for this

### Dashboard Combo Form
- Dashboard → Combos → Create New has 3 collapsed sections beyond Name/Strategy/Models:
  1. **Response Validation** — quality gates (forbidden substrings, min length)
  2. **Agent Resources** — system prompt overrides, tool filters, agent cache
  3. **Context Length** — override advertised context window
- All 3 are optional; leave empty for most cases
- The form's validation fields map to `config.validation.forbiddenSubstrings[]` and `config.validation.minContentLength` in the API

### GLM & MiniMax Placeholder Issue
- Added via API with placeholder keys (`YOUR_GLM****HERE`, `YOUR_MIN****HERE`)
- Status shows `testStatus: "error"` / `"expired"` — **must replace with real keys** before use
- Update via PUT to `/api/providers/{id}` or delete + re-add

### OAuth Providers Require Manual Dashboard Action
| Provider | Action | URL |
|----------|--------|-----|
| Qoder | Click "Connect" → GitHub/Google | `/dashboard/providers` |
| Kiro | Click "Connect" → AWS Builder ID | `/dashboard/providers` |
| Qwen | Click "Connect" → Google/GitHub | `/dashboard/providers` |
| Kimi | Already connected via OAuth | Auto |

### Working Combos
- `free-coding` — 8 OpenRouter free models, `fill-first` strategy
- `master-free` — references `free-coding` combo
- **Missing:** `cheap-backup` (GLM → MiniMax) — needs real keys first

### Tested & Working
- `master-free` combo responds correctly (fell back to Qwen Coder 32B)
- 563 total models available across all providers
- Health endpoint returns healthy

### API Key Creation via /api/keys (alternative to /api/endpoints)

- `POST /api/keys` with `{"name": "name", "key": "sk-custom-key"}` also works for creating endpoint keys
- Unlike `/api/endpoints`, this endpoint accepts a custom key value in the request body and **returns the full key** un-truncated in the response
- The created key works with `Authorization: Bearer` header against `/v1/*` (OpenAI-compatible endpoints)
- Response includes: `{key, name, id, machineId, ...}` — save the key on creation (no reveal endpoint)

### Combo Model Format

The `models` array in combo creation must be **plain strings** (model IDs), NOT objects. Using `[{"model": "..."}]` fails with `"Invalid input"` at `models.0`. Correct format: `["provider/model-id"]`.

### Initial Password Format
- API returns truncated key (`sk-d2e...`) — **full key not exposed via API**
- Must retrieve full key from Dashboard → Endpoints or query DB directly:
  ```sql
  SELECT key FROM api_keys WHERE name = 'alex-tools';
  ```
- Created keys: `alex-tools`, `alex-tools-full`, `test-full-key` — all truncated in response

### Initial Password Format
- Stack uses base64-encoded password: `XgBcZshhFgcaC1tiAaIVLQ==`
- Login works with the base64 string directly (not decoded)
- API: `POST /api/auth/login` with `{"password": "XgBcZshhFgcaC1tiAaIVLQ=="}`

### Traefik Network Requirement
- Traefik runs on `eclick` network; OmniRoute on `riquest` network
- **Must add `riquest` network to Traefik service** for cross-network routing:
  ```bash
  docker service update --network-add riquest traefik_traefik
  # Also update Traefik args to watch both networks:
  --providers.docker.network=eclick --providers.docker.network=riquest
  ```

### Internal DNS Resolution
- Container cannot resolve `routes.riquest.com.br` internally
- Fixed with `extra_hosts` in stack: `"routes.riquest.com.br:192.168.25.102"`
- Alternative: internal DNS entry on MikroTik (192.168.2.254)

---

## ⚠️ Estado 2026-08-09 — Descobertas críticas (sessão combo inteligente)

### `oc/*-free` com quota esgotada (403)
- TODOS os `oc/*-free` (deepseek-v4-flash-free, nemotron-3-ultra-free, ling-3.0-flash-free, north-mini-code-free, laguna-s-2.1-free, mimo-v2.5-free) retornam **HTTP 403** — a conta OpenCode free morreu/esgotou. Os combos `free-all`, `free-coding`, `processo-livre`, etc. que dependem deles **não funcionam mais** até a quota renovar.

### O que FUNCIONA agora (openrouter `:free`)
- `openrouter/nvidia/nemotron-3-ultra-550b-a55b:free` ✅ (1M ctx, texto)
- `openrouter/nvidia/nemotron-3-super-120b-a12b:free` ✅ (262K, texto)
- `openrouter/nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free` ✅ (**VÊ IMAGENS**, vision+reasoning)
- `openrouter/nvidia/nemotron-nano-12b-v2-vl:free` ✅ (vision-language)
- `openrouter/google/gemma-4-31b-it:free` ⚠️ (vision, mas 429 frequente)
- `openrouter/google/gemma-4-26b-a4b-it:free` ⚠️ (vision, 429)
- **Usar conexão `openrouter-4` apenas** — openrouter-1/2/3 estão `credits_exhausted`

### Combos criados (funcionando)
- **`inteligente-gratis`** — texto/raciocínio: 550B → super-120b → nano-omni (priority, validação ativa)
- **`visao-gratis`** — imagem + texto: nano-omni → nano-vl → gemma-4-31b (priority) — **só modelos COM visão**
- **`auggie-top-gratis`** — Claude Opus 4.6/Sonnet 4.6, GPT-5.5, Gemini 3.1 Pro — criado mas **conta Augment sem cota** ("out of usage")

### Pitfalls críticos do OmniRoute v3.8.48
1. **Combos NÃO filtram por modalidade**: `requiredCapabilities`/`capabilityFilter`/`capabilities`/`modality` são **aceitos na API mas IGNORADOS**. Combo priority com modelo sem visão + imagem → erro 404 "No endpoints found that support image input" → **derruba a conexão inteira** (`all_accounts_inactive`, status `unavailable`). Fix: separar combos de texto e visão (nunca misturar), e retestar conexão com `POST /api/providers/{id}/test` após erro.
2. **Erro de imagem no combo marca a CONEXÃO como unavailable**: mesmo com `backoffLevel: 0` e cooldown limpo, a conexão fica `unavailable` até reativar + retestar via API.
3. **Auto-combos poluídos**: `auto/vision:free`, `auto/coding:free` etc. incluem providers fantasma do catálogo (duckduckgo-web, theoldllm, chipotle) que não estão conectados → erros 400/503. Não confiar em auto/* para produção.
4. **Auggie requer login OAuth LOCAL**: o callback `127.0.0.1:port/callback` só completa no browser da MESMA máquina do CLI. Para servidor remoto: instalar CLI no PC local (`npm i -g @augmentcode/auggie`), rodar `auggie login --headless` no PC, copiar `~/.augment/session.json` (accessToken+tenantURL) para `/home/node/.augment/session.json` no container (usuário `node`, NÃO root). O OmniRoute roda como `node`.
5. **Combo `weighted` com weights**: a API cria com `weight: 0` se passar strings; é preciso PUT com `{"model": "...", "weight": N}` para aplicar pesos. Mesmo assim weighted deu "Combo has no executable targets" em alguns casos — priority é mais confiável.

### Correção 2026-08-09 (mesma sessão)
- Usuário removeu `gemma-4-31b-it:free` do `inteligente-gratis` e adicionou `mimocode/mimo-auto` (errado, "Unsupported model") — corrigido via PUT no combo.
- **4 chaves OpenRouter = failover**: openrouter-1/2/3 estavam desativadas (eu desativei por ver `credits_exhausted`); usuário esclareceu que a intenção é deixar TODAS ativas como failover. Reativadas + testadas (valid=True). Cada chave tem limite `free-models-per-day` próprio — 4 chaves = 4× capacidade free diária. **NÃO desativar chaves openrouter sem confirmar com o usuário.**
- `thinking-free` reescrito: 550B → super-120b → nano-omni (priority + validação com `503`/`chat_admission_busy`/`capacity` nos forbiddenSubstrings).

## 🎯 Next Actions for Alex

1. ✅ ~~Update GLM + MiniMax with real keys~~ → Decided to focus on free providers instead
2. ✅ ~~Create combos~~ → `thinking-free` + `execution-free` + `free-all` criados
3. ✅ ~~Add OpenRouter keys~~ → 4 chaves adicionadas como `openrouter-1` a `openrouter-4`
4. ✅ ~~Fix Traefik route~~ → Backticks corrigidos, OMNIROUTE_PUBLIC_BASE_URL setado
5. ✅ ~~Login~~ → Senha `Riquestlog_852`
6. ✅ ~~Testar combo com prompt real~~ → `free-all` respondeu "Olá, mundo!" via Groq ✅
7. ⬜ Conectar Qoder/Kiro/Qwen via Dashboard OAuth (opcional)
8. ⬜ Usar `free-all` no n8n e no Telegram/OpenClaw
9. ⬜ Avaliar Claude Web provider (cookie-based, modelos Fable 5/Opus 4.8/Sonnet 5)
10. ⬜ Testar AgentBridge para interceptar tráfego do Claude Code/Cursor/Copilot
11. ⬜ Configurar Memory system (OFF by default desde v3.8.30 — precisa habilitar manualmente)

---

## 🌐 Multi-Server Setup

OmniRoute runs on **srv-riquest** (192.168.25.103) only. The Traefik on srv-riquest handles `.riquest.com.br` domains including `routers.riquest.com.br`. The central Traefik on srv-eclick handles `.eclicksolucoes.com.br` domains.

**Network requirement:** The Traefik must be connected to the same overlay network (`riquest`) as the OmniRoute service. If the Traefik doesn't see the network, it can't route:
```bash
docker service update --network-add riquest traefik_traefik
```
- Added via API with placeholder keys (`YOUR_GLM****HERE`, `YOUR_MIN****HERE`)
- Status shows `testStatus: "error"` / `"expired"` — **must replace with real keys** before use
- Update via PUT to `/api/providers/{id}` or delete + re-add

### OAuth Providers Require Manual Dashboard Action
| Provider | Action | URL |
|----------|--------|-----|
| Qoder | Click "Connect" → GitHub/Google | `/dashboard/providers` |
| Kiro | Click "Connect" → AWS Builder ID | `/dashboard/providers` |
| Qwen | Click "Connect" → Google/GitHub | `/dashboard/providers` |
| Kimi | Already connected via OAuth | Auto |

### Working Combos
- `free-coding` — 8 OpenRouter free models, `fill-first` strategy
- `master-free` — references `free-coding` combo
- **Missing:** `cheap-backup` (GLM → MiniMax) — needs real keys first

### Tested & Working
- `master-free` combo responds correctly (fell back to Qwen Coder 32B)
- 563 total models available across all providers
- Health endpoint returns healthy

### API Key Creation via /api/keys (alternative to /api/endpoints)

- `POST /api/keys` with `{"name": "name", "key": "sk-custom-key"}` also works for creating endpoint keys
- Unlike `/api/endpoints`, this endpoint accepts a custom key value in the request body and **returns the full key** un-truncated in the response
- The created key works with `Authorization: Bearer` header against `/v1/*` (OpenAI-compatible endpoints)
- Response includes: `{key, name, id, machineId, ...}` — save the key on creation (no reveal endpoint)

### Combo Model Format

The `models` array in combo creation must be **plain strings** (model IDs), NOT objects. Using `[{"model": "..."}]` fails with `"Invalid input"` at `models.0`. Correct format: `["provider/model-id"]`.

### Initial Password Format
- API returns truncated key (`sk-d2e...`) — **full key not exposed via API**
- Must retrieve full key from Dashboard → Endpoints or query DB directly:
  ```sql
  SELECT key FROM api_keys WHERE name = 'alex-tools';
  ```
- Created keys: `alex-tools`, `alex-tools-full`, `test-full-key` — all truncated in response

### Initial Password Format
- Stack uses base64-encoded password: `XgBcZshhFgcaC1tiAaIVLQ==`
- Login works with the base64 string directly (not decoded)
- API: `POST /api/auth/login` with `{"password": "XgBcZshhFgcaC1tiAaIVLQ=="}`

### Traefik Network Requirement
- Traefik runs on `eclick` network; OmniRoute on `riquest` network
- **Must add `riquest` network to Traefik service** for cross-network routing:
  ```bash
  docker service update --network-add riquest traefik_traefik
  # Also update Traefik args to watch both networks:
  --providers.docker.network=eclick --providers.docker.network=riquest
  ```

### Internal DNS Resolution
- Container cannot resolve `routes.riquest.com.br` internally
- Fixed with `extra_hosts` in stack: `"routes.riquest.com.br:192.168.25.102"`
- Alternative: internal DNS entry on MikroTik (192.168.2.254)