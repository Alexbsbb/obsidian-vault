---
name: evolution-api-integration
description: Reference for Evolution API, Evolution Go, WhatsApp Meta (Business API), and Telegram bot integration patterns.
version: 0.1.0
author: Alex Buzatto (alexbuzatto), Hermes Agent
license: MIT
platforms: [linux, macos, windows]
metadata:
  hermes:
    tags: [messaging, evolution-api, whatsapp, telegram, webhook, integration]
    related_skills: [telegram-gateway]
---

# Evolution API / Evolution Go / WhatsApp Meta / Telegram Integration Skill

Knowledge reference for integrating Evolution API (WhatsApp), Evolution Go, WhatsApp Business API (Meta), and Telegram bots. Covers authentication, webhooks, message sending/receiving, media handling, and common patterns.

## When to Use

- Setting up Evolution API/Evolution Go for WhatsApp automation
- Implementing WhatsApp Business API (Meta Cloud API) directly
- Building Telegram bots with webhook or polling
- Handling media (images, audio, video, documents) across platforms
- Webhook signature verification and security
- Session management and multi-device support

## Prerequisites

### Evolution API
- Evolution API instance running (Docker: `atendai/evolution-api:v1.7.1` or later)
- Admin token (`AUTHENTICATION_API_KEY` in env)
- Instance name and token per WhatsApp connection

### Evolution Go
- Evolution Go binary or Docker (`atendai/evolution-go:latest`)
- Same auth model as Evolution API

### WhatsApp Business API (Meta)
- Meta Developer App with WhatsApp Business API
- Permanent access token (or short-lived + refresh)
- Phone Number ID and Business Account ID
- Webhook verify token and app secret

### Telegram
- Bot token from @BotFather
- Webhook URL (HTTPS) or long-polling setup
- Optional: Telegram Bot API local server for large files

## Quick Reference

| Task | Evolution API | Meta WhatsApp API | Telegram |
|------|---------------|-------------------|----------|
| Send text | `POST /message/sendText/{instance}` | `POST /{phone-id}/messages` | `sendMessage` |
| Send media | `POST /message/sendMedia/{instance}` | `POST /{phone-id}/media` + messages | `sendPhoto`/`sendDocument`/etc |
| Send audio (PTT) | `POST /message/sendWhatsAppAudio/{instance}` | `type=audio` + `ptt=true` | `sendVoice` |
| Webhook events | `webhook` config per instance | `POST /webhook` (app-level) | `setWebhook` / `getUpdates` |
| Verify signature | `apikey` header | `X-Hub-Signature-256` | `X-Telegram-Bot-Api-Secret-Token` |
| Mark read | `POST /chat/markAsRead/{instance}` | Not directly supported | N/A |
| Get QR code | `GET /instance/connect/{instance}` | N/A (pre-approved) | N/A |

## Procedure

### 1. Evolution API — Create Instance & Connect

```bash
# Create instance
curl -X POST "http://<evo-host>:8080/instance/create" \
  -H "apikey: <AUTHENTICATION_API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{"instanceName": "my-bot", "token": "instance-token", "qrcode": true}'

# Get QR code (poll until connected)
curl -X GET "http://<evo-host>:8080/instance/connect/my-bot" \
  -H "apikey: <AUTHENTICATION_API_KEY>"

# Check connection state
curl -X GET "http://<evo-host>:8080/instance/connectionState/my-bot" \
  -H "apikey: <AUTHENTICATION_API_KEY>"
```

**Completion:** Instance shows `"state": "open"` in connectionState.

### 1b. Evolution Go — Create Instance & Connect (documentação oficial)

Evolution Go (binário Go, biblioteca whatsmeow) tem endpoints similares à Evolution API mas com diferenças na estrutura de dados e webhooks.

```bash
# Criar instância — usa "instanceName" (igual Evolution API)
curl -X POST "https://<host>/instance/create" \
  -H "apikey: <GLOBAL_API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{"instanceName": "my-bot", "integration": "WHATSAPP-BAILEYS"}'

# Obter QR Code (endpoint específico por instância)
curl "https://<host>/instance/my-bot/qrcode" \
  -H "apikey: <GLOBAL_API_KEY>"

# Enviar texto (endpoint diferente)
curl -X POST "https://<host>/send/text" \
  -H "apikey: <GLOBAL_API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{"number": "5511999999999", "text": "Olá!"}'
```

**Webhook Evolution Go** (estrutura diferente da Evolution API):

```json
{
  "event": "Message",
  "data": {
    "Info": {
      "PushName": "João",
      "Sender": "5511999999999@s.whatsapp.net"
    },
    "Message": {
      "conversation": "texto da mensagem"
    }
  },
  "instanceId": "uuid-da-instancia"
}
```

**Eventos disponíveis:** `Message`, `Connected`, `QRCode`, `SendMessage`

**Diferenças vs Evolution API:**
- QR Code: `GET /instance/{name}/qrcode` (não `/instance/connect/{name}`)
- Webhook data: `data.Info.Sender`, `data.Message.conversation` (não `data.data.messageType`)
- Eventos webhook: `Message`, `Connected`, `QRCode` (capitalização diferente)
- Auth: `GLOBAL_API_KEY` em todos os endpoints (não token por instância)
- Integração: campo `integration: "WHATSAPP-BAILEYS"` no create

### 2. Evolution API — Configure Webhook

```bash
curl -X POST "http://<evo-host>:8080/webhook/set/my-bot" \
  -H "apikey: <AUTHENTICATION_API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-domain.com/webhook/evolution",
    "webhook_by_events": false,
    "webhook_base64": false,
    "events": ["MESSAGES_UPSERT", "MESSAGES_UPDATE", "SEND_MESSAGE", "CONNECTION_UPDATE"]
  }'
```

**Completion:** Webhook returns 200 and test event delivers.

### 3. Evolution API — Send Text Message

```bash
curl -X POST "http://<evo-host>:8080/message/sendText/my-bot" \
  -H "apikey: <AUTHENTICATION_API_KEY>" \
  -H "Content-Type: application/json" \
  -d '{
    "number": "5511999999999",
    "text": "Olá! Mensagem de teste.",
    "delay": 1000,
    "linkPreview": true
  }'
```

### 4. Evolution API — Send Audio (PTT / Voice Message)

```bash
# Upload media first (returns mediaKey)
curl -X POST "http://<evo-host>:8080/message/sendWhatsAppAudio/my-bot" \
  -H "apikey: <AUTHENTICATION_API_KEY>" \
  -F "audio=@audio.ogg;type=audio/ogg" \
  -F "number=5511999999999" \
  -F "ptt=true"
```

**Note:** Audio must be Opus in OGG container, ≤16MB, ≤2min for PTT.

### 5. Meta WhatsApp Business API — Send Template Message

```bash
curl -X POST "https://graph.facebook.com/v20.0/<PHONE_NUMBER_ID>/messages" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "messaging_product": "whatsapp",
    "to": "5511999999999",
    "type": "template",
    "template": {
      "name": "hello_world",
      "language": { "code": "pt_BR" }
    }
  }'
```

### 6. Meta WhatsApp Business API — Send Media Message

```bash
# 1. Upload media
curl -X POST "https://graph.facebook.com/v20.0/<PHONE_NUMBER_ID>/media" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -F "file=@image.jpg;type=image/jpeg" \
  -F "type=image/jpeg"

# Returns: {"id": "MEDIA_ID"}

# 2. Send message with media ID
curl -X POST "https://graph.facebook.com/v20.0/<PHONE_NUMBER_ID>/messages" \
  -H "Authorization: Bearer <ACCESS_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{
    "messaging_product": "whatsapp",
    "to": "5511999999999",
    "type": "image",
    "image": { "id": "MEDIA_ID", "caption": "Legenda" }
  }'
```

### 7. Meta — Webhook Verification (GET)

```python
# Flask/FastAPI example
@app.get("/webhook/meta")
async def verify_webhook(
    hub_mode: str = Query(alias="hub.mode"),
    hub_challenge: str = Query(alias="hub.challenge"),
    hub_verify_token: str = Query(alias="hub.verify_token")
):
    if hub_mode == "subscribe" and hub_verify_token == META_VERIFY_TOKEN:
        return PlainTextResponse(hub_challenge)
    raise HTTPException(403, "Invalid verify token")
```

### 8. Meta — Webhook Signature Verification (POST)

```python
import hmac, hashlib

async def verify_signature(request: Request):
    signature = request.headers.get("X-Hub-Signature-256", "")
    body = await request.body()
    expected = "sha256=" + hmac.new(
        META_APP_SECRET.encode(), body, hashlib.sha256
    ).hexdigest()
    if not hmac.compare_digest(signature, expected):
        raise HTTPException(401, "Invalid signature")
```

### 9. Telegram — Set Webhook

```bash
curl -X POST "https://api.telegram.org/bot<BOT_TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-domain.com/webhook/telegram",
    "secret_token": "your-secret-token",
    "allowed_updates": ["message", "edited_message", "callback_query"]
  }'
```

### 10. Telegram — Send Voice (PTT)

```bash
curl -X POST "https://api.telegram.org/bot<BOT_TOKEN>/sendVoice" \
  -F "chat_id=123456789" \
  -F "voice=@audio.ogg" \
  -F "caption="Optional caption""
```

**Note:** Telegram requires OGG/Opus for voice messages.

## Pitfalls

| Issue | Cause | Fix |
|-------|-------|-----|
| Evolution API 401 on webhook | Missing `apikey` header in webhook config | Add `apikey` to webhook URL or configure `webhook_headers` |
| Meta "Invalid signature" | Body parsed before verification (consumes stream) | Verify signature on raw body BEFORE `request.json()` |
| Meta template rejected | Template not approved or wrong language code | Use exact approved template name + `pt_BR` |
| Evolution audio not playing | Wrong codec/container | Convert to OGG/Opus: `ffmpeg -i in.mp3 -c:a libopus -b:a 32k out.ogg` |
| Telegram 413 on large files | Bot API default 20MB limit | Use Telegram Bot API local server (`--limit=0`) |
| Evolution instance disconnects | Phone battery saver / background kill | Keep phone charged, disable battery optimization for WhatsApp |
| Evolution Go webhook data structure | Estrutura diferente da Evolution API | Usar `data.Info.Sender`, `data.Message.conversation` (não `data.data.messageType`) |
| Evolution Go events capitalization | Eventos com capitalização diferente | `Message`, `Connected`, `QRCode` (não `MESSAGE`, `SEND_MESSAGE`) |
| Evolution Go QR Code endpoint | Endpoint específico por instância | `GET /instance/{name}/qrcode` (não `/instance/connect/{name}`) |
| Evolution Go auth model | Usa GLOBAL_API_KEY em tudo | Mesmo `apikey` header para todos os endpoints (não token por instância) |
| Evolution Go webhook event name | Evento de mensagem é "Message" (capitalizado) | Webhook handler deve verificar `event == "Message"` (não "MESSAGE") |
| Evolution Go /send/text auth | Na prática usa token da instância | `/send/text` requer token da instância no `apikey` (não GLOBAL_API_KEY) |
| Evolution Go JID suffix | Multi-device suffix (`:50`, `:61`) | Normalizar: `jid.split(':')[0]` para número limpo |
| Meta webhook duplicate events | Retry without idempotency | Deduplicate by `message_id` + `timestamp` |
| Webhook loop infinito | Bot responde suas próprias mensagens | Usar filtro `fromMe: true` OU assinatura na resposta (ex: "— Hermes") |
| Auto-conversa não funciona | Filtro `fromMe` bloqueia mensagens próprias | Remover filtro `fromMe` + adicionar filtro por assinatura para evitar loop |

## Verification

- [ ] Evolution instance connects and stays `"open"` for >10 min
- [ ] Webhook receives `MESSAGES_UPSERT` on incoming message
- [ ] Text message delivers to target number (all 3 platforms)
- [ ] Media (image/audio/document) sends and renders correctly
- [ ] Webhook signature verification passes (Meta + Telegram)
- [ ] Audio sent as PTT/voice plays inline on recipient device
- [ ] Template messages deliver via Meta API
- [ ] Error handling: invalid number, rate limits, token expiry
- [ ] Auto-conversa: usuário pode mandar mensagem para si mesmo sem loop

## Advanced Patterns

### Standalone Webhook Server (fora do plugin Hermes)

Quando o plugin Hermes não carrega ou você precisa de lógica customizada, use um servidor standalone:

```python
#!/usr/bin/env python3
"""Webhook server para Evolution Go - integra com Hermes via CLI"""
import json
import subprocess
from aiohttp import web

EVOLUTION_API = "https://evogo.riquest.com.br"
INSTANCE_TOKEN = "<instance-token>"
HERMES_SIGNATURE = "— Hermes"

def process_with_hermes_cli(text, sender):
    """Processa mensagem via Hermes CLI e adiciona assinatura"""
    cmd = ["hermes", "chat", "-Q", "-q", text]
    result = subprocess.run(cmd, capture_output=True, text=True, timeout=120)
    response = result.stdout.strip()
    return f"{response}\n\n{HERMES_SIGNATURE}"

async def handle_webhook(request):
    data = await request.json()
    event = data.get("event", "")
    
    if event != "Message":
        return web.json_response({"status": "ignored"})
    
    message_data = data.get("data", {})
    text = message_data.get("Message", {}).get("conversation", "")
    sender = message_data.get("Info", {}).get("Sender", "").split("@")[0]
    
    # Filtro anti-loop por assinatura
    if HERMES_SIGNATURE in text:
        return web.json_response({"status": "ignored_signature"})
    
    # Processar mensagem
    response = process_with_hermes_cli(text, sender)
    
    # Enviar resposta via Evolution Go API
    import requests
    requests.post(
        f"{EVOLUTION_API}/send/text",
        headers={"apikey": INSTANCE_TOKEN, "Content-Type": "application/json"},
        json={"number": sender, "text": response}
    )
    
    return web.json_response({"status": "ok"})

app = web.Application()
app.router.add_post("/webhook", handle_webhook)

if __name__ == "__main__":
    web.run_app(app, host="0.0.0.0", port=8088)
```

**Vantagens:**
- Controle total sobre lógica de filtro
- Independente do plugin system do Hermes
- Fácil debug via logs
- Gerenciável via OpenRC/systemd

### Anti-Loop Strategies

**1. Filtro `fromMe` (nativo WhatsApp):**
```python
if message_data.get("fromMe", False):
    return web.json_response({"status": "ignored"})
```
- ✅ Mais confiável (marca do WhatsApp)
- ❌ Impede auto-conversa (usuário não pode testar)

**2. Filtro por assinatura (flexível):**
```python
HERMES_SIGNATURE = "— Hermes"
if HERMES_SIGNATURE in text:
    return web.json_response({"status": "ignored_signature"})
```
- ✅ Permite auto-conversa
- ✅ Funciona mesmo se mensagem for copiada/colada
- ❌ Depende de formatação consistente

**3. Combinado (recomendado para produção):**
```python
# Ignorar mensagens próprias (evita loop básico)
if message_data.get("fromMe", False):
    return web.json_response({"status": "ignored"})

# Ignorar mensagens com assinatura (backup anti-loop)
if HERMES_SIGNATURE in text:
    return web.json_response({"status": "ignored_signature"})
```

| Auto-conversa mode (desenvolvimento/teste):**
```python
# Remover filtro fromMe, manter apenas assinatura
if HERMES_SIGNATURE in text:
    return web.json_response({"status": "ignored_signature"})
# Processa normalmente
```
- ✅ Usuário pode testar mandando mensagem para si mesmo
- ✅ Assinatura evita loop infinito

### Evolution Go Webhook Limitations

**Problema:** Evolution Go NÃO envia eventos `Message` para mensagens do próprio dispositivo (fromMe: true) por padrão.

**Sintoma:** Usuário manda mensagem para si mesmo, webhook não recebe nada.

**Causa:** Evolution Go filtra mensagens próprias no nível do WhatsApp/whatsmeow antes de enviar para webhook.

**Workaround:** Não há configuração conhecida para mudar esse comportamento no Evolution Go. Alternativas:

1. **Usar segundo número** — chip pré-pago ou WhatsApp Business com outro número
2. **Amigo/familiar testa** — outra pessoa manda mensagem para o número conectado
3. **Número virtual** — TextNow, NumberBarn (nem todos funcionam com WhatsApp)
4. **Outro dispositivo** — logar com outro número no WhatsApp Web

**Verificação:** Se webhook não recebe mensagens do próprio usuário, mas recebe de outros contatos, é essa limitação — não é bug do webhook.

**Nota:** Evolution API (Node.js) pode ter comportamento diferente — testar separadamente se usar essa variante.

## References

- Evolution API docs: `https://doc.evolution-api.com/`
- Evolution Go docs: `https://docs.evolutionfoundation.com.br/evolution-go`
- Evolution Go repo: `https://github.com/EvolutionAPI/evolution-go`
- Meta WhatsApp Cloud API: `https://developers.facebook.com/docs/whatsapp/cloud-api`
- Telegram Bot API: `https://core.telegram.org/bots/api`
- Telegram Bot API local server: `https://github.com/tdlib/telegram-bot-api`