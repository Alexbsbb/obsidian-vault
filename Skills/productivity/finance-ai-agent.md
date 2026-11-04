---
name: finance-ai-agent
description: Finance AI agent for WhatsApp/Telegram with Docker Swarm.
category: productivity
---

# Finance AI Agent for WhatsApp/Telegram

## When to use
Use this skill to create a financial management system accessible via WhatsApp and Telegram, featuring an AI agent that processes transactions, answers queries, and manages accounts payable/receivable, deployed on Docker Swarm with Portainer.

## How to implement

### API Configuration and Webhook Setup

Before diving into implementation phases, configure your API to handle multiple webhooks and external integrations.

#### Environment Variables
Store all sensitive credentials in your Sooretama vault (`~/sooretama-credentials/vault.csv.age`) and reference them in your Docker Swarm secrets or environment variables. Example entries for your vault:
- `telegram_bot_token,telegram-bot-token,[your_token]`
- `twilio_sid,twilio-account-sid,[your_sid]`
- `twilio_token,twilio-auth-token,[your_token]`
- `openrouter_key,openrouter-api-key,[your_key]`
- `evolution_api_key,evolution-api-key,[your_key]`
- `evolution_go_url,evolution-go-url,[your_instance_url]`
- `n8n_webhook_url,n8n-webhook-url,[your_n8n_webhook]`
- `n8n_api_key,n8n-api-key,[your_n8n_key]`

#### Webhook Endpoints Structure
Design your API to accept webhooks from multiple sources with a consistent structure:

```
/webhook/telegram    → Handles Telegram bot updates
/webhook/whatsapp    → Handles Twilio WhatsApp messages
/webhook/n8n         → Receives data from n8n workflows
/webhook/evolution   → Handles Evolution API/Evolution Go events
/webhook/custom      → Generic endpoint for other services
```

#### Security Considerations
- **Verification Tokens**: For services like WhatsApp (Twilio) and Evolution API, implement verification tokens to prevent spoofing.
- **Signature Validation**: Where available (e.g., Stripe, GitHub webhooks), validate signatures.
- **Rate Limiting**: Implement rate limiting per webhook source to prevent abuse.
- **IP Whitelisting**: For trusted services like n8n or Evolution API, consider IP whitelisting at the reverse proxy level (Traefik).

#### Command Prompts for Management
Use these commands during development and deployment:

```bash
# Start API locally for testing
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000

# Run database migrations (if using Alembic)
alembic upgrade head

# View logs in real-time (when deployed)
docker service logs financas-api_api -f

# Check stack status
docker stack ps financas-api

# Update secret (example for Telegram bot token)
echo "new_token_here" | docker secret create telegram_bot_token -

# Redeploy stack with updated secrets
docker stack deploy -c docker-compose.yml financas-api
```

#### Handling Different Webhook Payloads
Each service sends data in different formats. Create adapter functions in `app/webhooks/adapters.py`:

```python
# Example: Twilio WhatsApp adapter
def adapt_twilio_whatsapp(payload: dict) -> dict:
    return {
        "platform": "whatsapp",
        "user_id": payload.get("From"),
        "message": payload.get("Body"),
        "timestamp": payload.get("Timestamp")
    }

# Example: n8n webhook adapter
def adapt_n8n(payload: dict) -> dict:
    return {
        "platform": "n8n",
        "trigger": payload.get("trigger"),
        "data": payload.get("data"),
        "user_id": payload.get("user_id")  # if passed from n8n
    }
```

Then in your webhook endpoints, use the appropriate adapter before passing to the AI agent.

#### Integration Examples
- **WhatsApp via Twilio**: Use Twilio's WhatsApp Business API. Configure your Twilio Sandbox or approved number.
- **n8n**: Create workflows that send financial data to `/webhook/n8n` (e.g., from Google Sheets, email parsers).
- **Evolution API/Evolution Go**: For WhatsApp management without official API, set up your Evolution instance and point webhooks to `/webhook/evolution`.
- **Official APIs**: For banks or accounting software, create custom adapters as needed.

This configuration ensures your API is ready to receive and process data from multiple sources securely before moving to implementation phases.

### Phase 1: Core API and Telegram Integration (Validate First)
1. Generate FastAPI project using `backend-api-development` skill:
   ```
   hermes skill run backend-api-development --prompt "Financial API with accounts receivable/payable, daily transactions, and vales" --name financas-api
   ```
2. Define financial models (ContasReceber, ContasPagar, Lancamentos, Vales) in `app/models.py`
3. Set up Telegram gateway using `telegram-gateway` skill:
   - Create bot via @BotFather
   - Configure webhook to `https://your-domain/webhook/telegram`
4. Implement AI agent service (`app/agent.py`):
   - Uses OpenRouter model (via Hermes) for intent recognition and entity extraction
   - Maps natural language to financial actions (e.g., "received R$100 from client" → create receivable)
   - Returns natural language PT-BR responses
5. Test: Send test message via Telegram, verify DB entry and agent response

### Phase 2: WhatsApp Integration
1. Obtain Twilio credentials from your Sooretama vault:
   ### Phase 3: Advanced Features & Swarm Deployment
   1. Add endpoints:
      - `GET /relatorio/fluxo-caixa?mes=2026-07`
      - `POST /vales` (CRUD for tickets/vales)
      - `GET /lembretes/vencimentos-hoje` (for scheduler)
   2. Implement daily scheduler (`app/scheduler.py`):
      ```python
      def check_due_dates():
          due = db.query(ContasPagar).filter(
              ContasPagar.vencimento == date.today(),
              ContasPagar.status == "pendente"
          ).all()
          for conta in due:
              send_reminder(conta.usuario_chat_id, 
                          f"⚠️ Conta a pagar: {conta.fornecedor} (R$ {conta.valor}) vence HOJE!")
      ```
   3. Prepare `docker-compose.yml` for Swarm (using Supabase for DB):
      ```yaml
      version: '3.8'
      services:
        api:
          build: .
          ports: ["8000:8000"]
          environment:
            - DATABASE_URL=postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT].supabase.co:5432/postgres
            - TELEGRAM_BOT_TOKEN=${TELEGRAM_BOT_TOKEN}
            - TWILIO_SID=${TWILIO_SID}
            - TWILIO_TOKEN=${TWILIO_TOKEN}
            - OPENROUTER_KEY=${OPENROUTER_KEY}
            # Add other service keys as needed (n8n, evolution, etc.)
          # No db service needed - using managed Supabase
        agent:
          build: ./agent
          environment: 
            - TELEGRAM_BOT_TOKEN=${TELEGRAM_BOT_TOKEN}
            - TWILIO_ACCOUNT_SID=${TWILIO_ACCOUNT_SID}
            - TWILIO_AUTH_TOKEN=${TWILIO_AUTH_TOKEN}
            - OPENROUTER_API_KEY=${OPENROUTER_API_KEY}
      ```
      **Importante**: 
      - Substitua `[YOUR-PASSWORD]` e `[YOUR-PROJECT]` pelos valores do seu projeto Supabase (obtenha em Supabase Dashboard → Settings → Database → Connection string)
      - Nunca hardcode credenciais: use referências ao seu cofre de credenciais ou secrets do Docker Swarm (ex: `${SUPABASE_URL}` onde o segredo contém a URL completa)
      - O serviço `db` foi removido pois o PostgreSQL é gerenciado pelo Supabase
   4. Deploy via Portainer:
      - Acesse o Portainer no seu gerenciador Swarm (ex: http://srv-eclick:9000)
      - Crie nova stack → faça upload do docker-compose.yml
      - Configure secrets para valores sensíveis (telegram bot token, twilio credentials, etc.)
      - Deploy e monitore os logs
   5. Validação final:
      - WhatsApp: "Paguei R$250 no supermercado hoje"
      - Agente registra despesa, categoriza como "alimentação", atualiza saldo
      - Resposta: "Despesa registrada! R$250,00 no supermercado (alimentação)."

## Pitfalls to Avoid
- Never hardcode API keys; use Sooretama vault or Swarm secrets
- Validate Phase 1 completely before adding WhatsApp/Swarm complexity
- Always filter queries by user chat ID to prevent data leakage
- Use Brazilian Portuguese contextual examples for AI training (e.g., "feira", "boteco")
- Prefer PostgreSQL over SQLite for Swarm reliability

## Success Verification
After each phase:
- Phase 1: Telegram test message → correct DB entry + coherent PT-BR response
- Phase 2: Same via WhatsApp + agent shows basic category learning
- Phase 3: Stack deploys without errors in Portainer, reminders send at 8 AM

## Environment Integration
- Store credentials in your existing Sooretama vault (`~/sooretama-credentials/vault.csv.age`)
- Use `buscar_cred.py` to retrieve: telegram bot token, twilio sid/token, openrouter key
- Leverage your Docker Swarm/Portainer setup (e.g., srv-eclick) for deployment
- Maintain GUI+CLI workflow: Portainer for monitoring, CLI for config adjustments

> 💡 Remember: Test working functionality before advancing stages, per your preference.