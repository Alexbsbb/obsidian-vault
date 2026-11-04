---
tags: [memoria, whatsapp, evolution, api]
---
# Evolution Go API (WhatsApp)

Docs oficiais: `docs.evolutionfoundation.com.br/evolution-go`

- Criar instância: `instanceName` + `integration: WHATSAPP-BAILEYS`
- QR: `GET /instance/{name}/qrcode`
- Webhook data: `{event, data: {Info: {Sender, PushName}, Message: {conversation}}, instanceId}`
- Eventos: `Message`, `Connected`, `QRCode` (capitalização)
- Auth (teórico): `GLOBAL_API_KEY` em todos os endpoints

## Na prática (`evogo.riquest.com.br`)
- `/instance/all` retorna lista com tokens
- `/send/text` usa **token da instância** no `apikey` (não `GLOBAL_API_KEY`)
- Webhook usa `instanceId` UUID no header

## Diferenças vs Evolution API Node
- QR endpoint específico
- Estrutura de dados do webhook diferente
- Eventos capitalizados
