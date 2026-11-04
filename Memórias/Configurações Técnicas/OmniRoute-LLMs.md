---
tags: [llm, openrouter, omniroute]
data: 2026-10-30
origem: Hermes-Agent
---

# OmniRoute & LLMs

## 🔑 Chaves OpenRouter
- Total: 4 chaves (`openrouter-1` a `openrouter-4`).
- Senha Admin Rquest: `Riquestlog_852`.

## 🤖 Modelos Gratuitos Confirmados
- **Texto:** `nemotron-3-super-120b-a12b:free`
- **Visão+Razão:** `nemotron-3-nano-omni-30b-a3b-reasoning:free`
- **Áudio:** Groq Whisper (transcrição).

## ⚠️ Pitfalls (Armadilhas)
- **Não misturar modalidades:** Não usar modelo de texto em requisição de visão ou vice-versa.
- **Evitar `auto/*`:** Provedores fantasma retornam 403.
- **Free Provider:** Ter `apiKey: 'free'` não garante modelo grátis; só os listados acima são garantidos.
