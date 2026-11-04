---
name: custom-provider-configuration
description: "Configure custom OpenAI-compatible endpoints in Hermes."
version: 1.0.0
author: Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [hermes, configuration, providers, custom-endpoint, openai-compatible]
    related_skills: [hermes-agent]
---

# Custom Provider Configuration

Configure Hermes to use custom OpenAI-compatible API endpoints (private gateways, local models, self-hosted routers like OmniRoute, LiteLLM, etc.).

## When to Use

- Connecting to a private OpenAI-compatible endpoint (OmniRoute, LiteLLM, vLLM, Ollama, etc.)
- Using a self-hosted model router with custom models
- Any endpoint that speaks the OpenAI Chat Completions API format

## Quick Setup

```bash
# Set the custom endpoint base URL
hermes config set model.base_url https://your-endpoint.com/v1

# Use 'custom' as provider
hermes config set model.provider custom

# Set default model (must exist on the endpoint)
hermes config set model.default your-model-name

# Set API key (if required)
hermes config set model.api_key your-api-key
```

## Verification

```bash
# Test the connection
hermes chat -q "Responda apenas OK"
```

## Common Endpoints

| Provider | Base URL Pattern | Notes |
|----------|------------------|-------|
| OmniRoute | `https://routers.riquest.com.br/v1` | Uses `free-coding`, `claude-opus-5-fast`, etc. |
| LiteLLM | `http://localhost:4000/v1` | Self-hosted router |
| Ollama | `http://localhost:11434/v1` | Local models |
| vLLM | `http://localhost:8000/v1` | High-throughput serving |
| LocalAI | `http://localhost:8080/v1` | Drop-in OpenAI replacement |

## Pitfalls

1. **Model name must exist on the endpoint** — `model.default` must match a model the endpoint serves. Check `/v1/models` endpoint.
2. **Provider must be `custom`** — Not `openrouter`, `openai`, etc. This tells Hermes to use the raw `base_url`.
3. **API key format** — Some endpoints require `Bearer ` prefix, others just the raw key. Test with `curl` first.
4. **Max tokens limit** — Custom endpoints may have lower limits. Error "requested up to 65536 tokens, but can only afford N" means the model/account has a token budget. Use a model with higher limits or reduce `max_tokens` in request.

## Verification Script

See `scripts/verify-endpoint.sh` for a quick health check.

## References

- `references/omniprovider-example.md` — OmniRoute specific configuration example
- `references/troubleshooting.md` — Common errors and fixes