---
title: OmniRoute Pulo do Gato
name: omniroute-pulo-do-gato
description: Configurações avançadas de OmniRoute — múltiplas contas por provedor, combos de pool, auto-healing, farm de áudio/embedding e técnicas para multiplicar capacidade gratuita.
---

# OmniRoute — Pulo do Gato

Skill para implementar truques avançados no OmniRoute. Dividido em **Cenário Geral** (qualquer modelo) e **Cenário Free** (só modelos gratuitos).

## 🎤 ÁUDIO — Transcrição com Pulo do Gato

### Whisper Pool Multi-Contas (Free)

Adicionar múltiplas chaves Groq:
```bash
# Groq-2 (2ª chave gratuita)
curl -sk -b /tmp/omni_cookies -X POST https://routers.riquest.com.br/api/providers \
  -H "Content-Type: application/json" \
  -d '{"name":"Groq-2","provider":"groq","apiKey":"gsk_SUA_OUTRA_CHAVE"}'

# Groq-3 (3ª chave gratuita)
curl -sk -b /tmp/omni_cookies -X POST https://routers.riquest.com.br/api/providers \
  -H "Content-Type: application/json" \
  -d '{"name":"Groq-3","provider":"groq","apiKey":"gsk_SUA_TERCEIRA_CHAVE"}'
```

Criar combo round-robin para distribuir carga:
```bash
curl -sk -b /tmp/omni_cookies -X POST https://routers.riquest.com.br/api/combos \
  -H "Content-Type: application/json" \
  -d '{
    "name": "whisper-free-pool",
    "strategy": "round-robin",
    "models": [
      "groq/whisper-large-v3-turbo",
      "groq/whisper-large-v3-turbo",
      "groq/whisper-large-v3-turbo"
    ]
  }'
```

### Whisper Farm Multi-Provedor (Híbrido Free → Pago)
```bash
curl -sk -b /tmp/omni_cookies -X POST https://routers.riquest.com.br/api/combos \
  -H "Content-Type: application/json" \
  -d '{
    "name": "whisper-hybrid",
    "strategy": "priority",
    "models": [
      "groq/whisper-large-v3-turbo",
      "groq/whisper-large-v3",
      "openrouter/openai/whisper-1"
    ],
    "config": {
      "validation": {
        "forbiddenSubstrings": ["rate limit","429","quota"],
        "minContentLength": 5
      }
    }
  }'
```

### Codecs — Melhores Práticas

| Formato | Codec | Recomendação |
|---|---|---|
| **OGG** (opus 32k) | libopus | ★ Melhor custo-benefício |
| MP3 128k | mp3 | Bom, compatível |
| WAV | PCM | Evitar (muito grande) |
| FLAC | FLAC | Só se precisar de lossless |

```bash
# Melhor prática: converter para opus 32k antes de enviar
ffmpeg -i entrada.wav -c:a libopus -b:a 32k saida.ogg
```

### Automação n8n para Lote de Áudio

No n8n, use um loop que alterna entre as contas Groq:
```
IF: índice % 3 == 0 → HTTP Request → Groq-1: model=groq/whisper-large-v3-turbo
IF: índice % 3 == 1 → HTTP Request → Groq-2: model=groq/whisper-large-v3-turbo
IF: índice % 3 == 2 → HTTP Request → Groq-3: model=groq/whisper-large-v3-turbo
```

### Pipeline Completo (Webhook → Áudio → LLM → Resposta)
```
Webhook → ffmpeg (opus 32k) → /v1/audio/transcriptions → LLM → resposta
```

### Parâmetros importantes
- `response_format`: json, verbose_json, srt, vtt, text
- `language`: pt, en, es, fr, de (ISO code)
- `temperature`: 0 (mais preciso)
- Sempre use `temperature=0` para transcrição

## 🔑 API Keys — Restrições por Chave

É possível **amarrar uma chave de API** a combos, modelos, orçamento e IPs específicos. Crie a chave e depois aplique as restrições via PATCH:

```bash
# 1. Criar chave
curl -sk -b /tmp/omni_cookies -X POST https://routers.riquest.com.br/api/keys \
  -H "Content-Type: application/json" \
  -d '{"name":"n8n-free","key":"n8n-free-key"}'

# 2. Restringir a combo + limite diário
curl -sk -b /tmp/omni_cookies -X PATCH https://routers.riquest.com.br/api/keys/ID_DA_CHAVE \
  -H "Content-Type: application/json" \
  -d '{
    "allowedCombos": ["free-all", "infinite-free"],
    "maxRequestsPerDay": 1000,
    "usageLimitEnabled": true
  }'
```

**Campos de restrição disponíveis:**

| Campo | Função | Exemplo |
|---|---|---|
| `allowedCombos` | Só permite usar estes combos | `["free-all"]` |
| `allowedModels` | Só permite usar estes modelos | `["oc/deepseek-v4-flash-free"]` |
| `blockedModels` | Bloqueia modelos específicos (glob) | `["openrouter/*"]` |
| `maxRequestsPerDay` | Limite de requisições/dia | `1000` |
| `maxRequestsPerMinute` | Limite de req/min | `60` |
| `dailyUsageLimitUsd` | Limite de gasto USD/dia | `2.00` |
| `weeklyUsageLimitUsd` | Limite de gasto USD/semana | `10.00` |
| `ipAllowlist` | IPs permitidos (CIDR) | `"201.10.0.0/16"` |
| `allowedEndpoints` | Endpoints permitidos | `["/v1/chat/completions"]` |
| `usageLimitEnabled` | Master toggle para budget | `true` |

## 💰 Comercial — Planos e Quotas

OmniRoute permite revender acesso. Duas estratégias:

### 📦 Consumo Fixo (Pré-pago)
```bash
curl -sk -b /tmp/omni_cookies -X PATCH https://routers.riquest.com.br/api/keys/ID \
  -d '{
    "allowedCombos": ["free-all"],
    "maxRequestsPerDay": 500,
    "usageLimitEnabled": true,
    "ipAllowlist": "201.10.0.0/16"
  }'
# Bateu 500 req/dia → HTTP 402. Renova: PATCH com maxRequestsPerDay maior.
```

### 📊 Consumo Dinâmico (Pós-pago)
```bash
curl -sk -b /tmp/omni_cookies -X PATCH https://routers.riquest.com.br/api/keys/ID \
  -d '{"usageLimitEnabled": true, "dailyUsageLimitUsd": 2.00}'
# Gasta até $2/dia, reseta no dia seguinte.
```

### Quota Plans (Dashboard → Provider Quota → Plans & Quotas)
Dimensões: %, requests, tokens, USD. Janelas: 5h, hora, dia, semana, mês.

### Quota Pools (Sharing)
Compartilha quota de um provedor entre chaves com peso %. ⚠️ V3.8.48: UI 404. Use restrições por chave.

## Login Admin

```bash
curl -sk -c /tmp/omni_cookies -X POST https://routers.riquest.com.br/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"password": "Riquestlog_852"}'
```

## 🌍 CENÁRIO GERAL (qualquer modelo)

### G1 — Pool Round-Robin entre Contas

Adicionar múltiplas conexões do mesmo provedor e criar combo round-robin:

```bash
# Exemplo: criar combo round-robin com 4 contas OpenRouter
curl -sk -b /tmp/omni_cookies -X POST https://routers.riquest.com.br/api/combos \
  -H "Content-Type: application/json" \
  -d '{
    "name": "pool-round-robin",
    "strategy": "round-robin",
    "models": [
      "openrouter/anthropic/claude-sonnet-4.6",
      "openrouter/anthropic/claude-sonnet-4.6",
      "openrouter/anthropic/claude-sonnet-4.6",
      "openrouter/anthropic/claude-sonnet-4.6"
    ]
  }'
```

### G2 — Fallback Barato → Caro

```bash
curl -sk -b /tmp/omni_cookies -X POST https://routers.riquest.com.br/api/combos \
  -H "Content-Type: application/json" \
  -d '{
    "name": "smart-fallback",
    "strategy": "priority",
    "models": ["modelo-barato", "modelo-medio", "modelo-premium"],
    "config": {
      "validation": {
        "forbiddenSubstrings": ["rate limit", "quota exceeded"],
        "minContentLength": 10
      }
    }
  }'
```

### G3 — Agente de Decisão (barato decide se precisa do caro)

```bash
curl -sk -b /tmp/omni_cookies -X POST https://routers.riquest.com.br/api/combos \
  -H "Content-Type: application/json" \
  -d '{
    "name": "router-inteligente",
    "strategy": "priority",
    "models": ["ddgw/gpt-5-mini", "oc/deepseek-v4-flash-free", "auto/reasoning"]
  }'
```

### G4 — Webhook Auto-Healing

Criar webhook no OmniRoute:
```bash
curl -sk -b /tmp/omni_cookies -X POST https://routers.riquest.com.br/api/webhooks \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://seu-n8n/webhook/omniroute-healing",
    "events": ["provider.status_changed"],
    "secret": "seu-token"
  }'
```

### G5 — Compressão Seletiva

Usar headers HTTP por tipo de requisição:
```
x-omniroute-compression: engine:lite     (chat normal)
x-omniroute-compression: engine:rtk      (código)
x-omniroute-compression: engine:caveman  (conversação)
x-omniroute-compression: engine:headroom (tabelas)
x-omniroute-compression: engine:aggressive (docs longos)
```

### G6 — Cache Embeddings

```bash
# Ver stats
curl -sk -b /tmp/omni_cookies https://routers.riquest.com.br/api/cache/stats
```

### G7 — Chaos Mode Benchmark

Ativar via Dashboard > Dev Tools > Chaos Mode > Parallel.

## 💰 CENÁRIO FREE (só modelos gratuitos)

### F1 — Criar 2ª conta de provedor free

```bash
# OpenCode (2ª conta)
curl -sk -b /tmp/omni_cookies -X POST https://routers.riquest.com.br/api/providers \
  -H "Content-Type: application/json" \
  -d '{"name":"opencode-2","provider":"opencode","apiKey":"free","priority":2}'

# Auggie (2ª conta)
curl -sk -b /tmp/omni_cookies -X POST https://routers.riquest.com.br/api/providers \
  -H "Content-Type: application/json" \
  -d '{"name":"auggie-2","provider":"auggie","apiKey":"free","priority":2}'
```

### F2 — Combo Free Infinito

```bash
curl -sk -b /tmp/omni_cookies -X POST https://routers.riquest.com.br/api/combos \
  -H "Content-Type: application/json" \
  -d '{
    "name": "infinite-free",
    "strategy": "priority",
    "models": [
      "oc/deepseek-v4-flash-free",
      "oc/deepseek-v4-flash-free",
      "aug/claude-sonnet-4.6",
      "aug/gemini-3.0-flash",
      "ddgw/gpt-5-mini",
      "oc/laguna-s-2.1-free"
    ],
    "config": {
      "validation": {
        "forbiddenSubstrings": ["I cannot help","as an AI","rate limit","quota exceeded"],
        "minContentLength": 10
      }
    }
  }'
```

### F3 — Pool Embeddings Free

```bash
curl -sk -b /tmp/omni_cookies -X POST https://routers.riquest.com.br/api/combos \
  -H "Content-Type: application/json" \
  -d '{
    "name": "embedding-pool-free",
    "strategy": "round-robin",
    "models": [
      "openrouter/openai/text-embedding-3-small",
      "openrouter/openai/text-embedding-3-small",
      "openrouter/openai/text-embedding-3-small",
      "openrouter/openai/text-embedding-3-small"
    ]
  }'
```

### F4 — Whisper Farm (Groq)

Adicionar múltiplas chaves Groq e alternar no n8n:
```bash
curl -sk -b /tmp/omni_cookies -X POST https://routers.riquest.com.br/api/providers \
  -H "Content-Type: application/json" \
  -d '{"name":"Groq-2","provider":"groq","apiKey":"gsk_NOVA_CHAVE"}'
```

### F5 — Fallback Free → Pago

```bash
curl -sk -b /tmp/omni_cookies -X POST https://routers.riquest.com.br/api/combos \
  -H "Content-Type: application/json" \
  -d '{
    "name": "free-primeiro",
    "strategy": "priority",
    "models": [
      "oc/deepseek-v4-flash-free",
      "aug/claude-sonnet-4.6",
      "openrouter/anthropic/claude-sonnet-5"
    ],
    "config": {
      "validation": {
        "forbiddenSubstrings": ["rate limit","quota exceeded"],
        "minContentLength": 10
      }
    }
  }'
```

### F6 — Pool 4 OpenRouter ($4/mês grátis)

```bash
curl -sk -b /tmp/omni_cookies -X POST https://routers.riquest.com.br/api/combos \
  -H "Content-Type: application/json" \
  -d '{
    "name": "openrouter-free-pool",
    "strategy": "round-robin",
    "models": [
      "openrouter/anthropic/claude-sonnet-4.6",
      "openrouter/anthropic/claude-sonnet-4.6",
      "openrouter/anthropic/claude-sonnet-4.6",
      "openrouter/anthropic/claude-sonnet-4.6"
    ]
  }'
```

## Verificar resultados

```bash
# Listar provedores
curl -sk -b /tmp/omni_cookies https://routers.riquest.com.br/api/providers

# Listar combos
curl -sk -b /tmp/omni_cookies https://routers.riquest.com.br/api/combos

# Circuit breakers
curl -sk -b /tmp/omni_cookies https://routers.riquest.com.br/api/resilience

# Testar combo
curl -sk -X POST https://routers.riquest.com.br/v1/chat/completions \
  -H "Authorization: Bearer n8n-omniroute-2024" \
  -H "Content-Type: application/json" \
  -d '{"model":"infinite-free","messages":[{"role":"user","content":"teste"}]}'
```

## Dicas

- **Multiple OpenCode/Auggie**: Adicionar com mesmo `apiKey: "free"` mas nomes diferentes. O OmniRoute trata como conexões separadas.
- **OpenRouter pool**: Já existem 4 contas. Round-robin dobra/quádruplo a capacidade.
- **Embeddings**: Sempre temperature=0. Cache automático. Mesmo modelo sempre.
- **Auto-healing**: Webhook provider.status_changed → n8n → PUT /api/combos/:id.
- **Chaos Mode**: Teste todos modelos em paralelo antes de definir o combo final.
