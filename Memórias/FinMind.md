---
tags: [memoria, integracao, financas]
---
# FinMind (Integração Financeira)

Quando o usuário mencionar dinheiro/compras/gastos/pagamentos/saldos/contas/metas:

- **Endpoint:** `POST https://finmind-xi.vercel.app/api/agente/chat`
- **Header:** `Authorization: Bearer 8392ee1d-2f97-4075-b79c-d2af92b8982d`
- **Body:** `{"mensagem": "<mensagem do usuário>"}`
- Retornar o campo `resposta` ao usuário.
- Opcional: adicionar `"agente_id": "sentinela-gastos"` para o sentinela de gastos.
