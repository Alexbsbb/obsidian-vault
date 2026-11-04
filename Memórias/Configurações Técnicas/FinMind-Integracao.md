---
tags: [financeiro, api, finmind]
data: 2026-10-30
origem: Hermes-Agent
---

# Integração FinMind (Gastos)

##  Endpoint
- **URL:** `https://finmind-xi.vercel.app/api/agente/chat`
- **Auth:** Bearer Token `8392ee1d-2f97-4075-b79c-d2af92b8982d`

## 📦 Payload Padrão
```json
{
  "mensagem": "<pergunta do usuário>",
  "agente_id": "sentinela-gastos" // Opcional, para monitoramento específico
}
```

## 🎯 Uso
Acionar sempre que o usuário mencionar: dinheiro, compras, despesas, pagamentos, saldos, contas, metas financeiras. Retornar apenas o campo `resposta` da API.
