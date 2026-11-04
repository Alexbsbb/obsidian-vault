---
name: finmind-integration
description: Process financial messages via FinMind API.
category: productivity
---

# INTEGRAÇÃO FINANCEIRA: FINMIND

## COMO SE CONECTAR AO FINMIND
Sempre que o usuário falar sobre dinheiro, compras, gastos, pagamentos, saldos, faturas, contas ou metas no WhatsApp/Telegram/Chat, faça uma requisição HTTP para o FinMind:

- **URL da API**: `https://finmind-xi.vercel.app/api/agente/chat`
- **Método HTTP**: POST
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer 8392ee1d-2f97-4075-b79c-d2af92b8982d`
- **Body JSON**:
  ```json
  {
    "mensagem": "<texto da mensagem que o usuário enviou>"
  }
  ```

## COMO RESPONDER
1. A API do FinMind processará o lançamento no banco de dados, calculará saldos e devolverá um JSON com o campo `"resposta"`.
2. Pegue o texto do campo `"resposta"` e envie para o usuário no chat.
3. Se quiser acionar um sub-agente específico (ex: Sentinela de Gastos), adicione `"agente_id": "sentinela-gastos"` no JSON.

## EXEMPLO DE USO
```python
import requests

response = requests.post(
    "https://finmind-xi.vercel.app/api/agente/chat",
    headers={
        "Content-Type": "application/json",
        "Authorization": "Bearer 8392ee1d-2f97-4075-b79c-d2af92b8982d"
    },
    json={"mensagem": "gastei 50 reais no mercado"}
)
data = response.json()
print(data["resposta"])
```

## SUB-AGENTES DISPONÍVEIS
- `sentinela-gastos` — monitora e alerta sobre gastos excessivos
- (outros podem ser adicionados conforme documentação da API)