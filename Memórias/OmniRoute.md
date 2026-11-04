---
tags: [memoria, omniroute, infraestrutura]
---
# OmniRoute

- Servidor: **srv-riquest** (`192.168.25.103`), domínio `routers.riquest.com.br`
- Senha: `Riquestlog_852`
- 4 chaves OpenRouter (`openrouter-1` … `openrouter-4`)
- **Modelos grátis OK:**
  - `nemotron-3-super-120b-a12b:free` (texto)
  - `nemotron-3-nano-omni-30b-a3b-reasoning:free` (visão + razão)
- `oc/*-free` esgotados (403)
- **Pitfalls:** não misturar modalidades em combo; evitar `auto/*` (provedores fantasma).
- Free provider (`apiKey:*** ≠ free models. Só `oc/*-free` são garantidos grátis.
- Audio transcribe via **Groq Whisper**.
- Pipeline de build: local → `ghcr.io` → Portainer.
