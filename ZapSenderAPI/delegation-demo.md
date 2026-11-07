# Demonstração de Delegação Automática - ZapSenderAPI

## 🔄 Fluxo Simulado de Agentes

### PASSO 1: Hermes delega para Athena (Análise)
```bash
npx hermes msg athena "Analise requisitos para API WhatsApp mass messaging com:
- Envio em lote até 10.000 mensagens/dia
- Rate limiting por provedor
- Webhook de confirmação
- QR Code dinâmico
- Sessões persistentes"
```

**Athena responde:**
```
Requisitos MVP:
1. Endpoint POST /messages/bulk - envio em lote
2. Rate limiting configurável
3. Webhook /webhooks para notificações
4. QR Code dinâmico /qrcode
5. Sessão persistente via whatsmeow
6. Health check /health
```

### PASSO 2: Hermes delega para Atlas (Arquitetura)
```bash
npx hermes msg atlas "Basar arquitetura ZapSenderAPI usando:
- Go 1.22 + Gin + whatsmeow
- SQLite para sessões
- Redis para rate limiting
- Docker multi-stage
Seguindo os requisitos da Athena"
```

**Atlas responde:**
```
Arquitetura Proposta:
- camada HTTP (Gin)
- camada de serviço (WhatsAppService)
- camada de dados (SQLite session store)
- middleware RateLimiter (Redis)
- webhook manager async
```

### PASSO 3: Hermes delega para Ada (Desenvolvimento)
```bash
npx hermes msg ada "Implementar endpoint POST /messages/bulk com:
- whatsmeow client
- batch processing
- error handling
- async webhook dispatch"
```

**Ada implementa:** (ver código em progresso)

### PASSO 4: Hermes delega para Linus (QA)
```bash
npx hermes msg linus "Testar endpoint POST /messages/bulk com:
- 100 mensagens simuladas
- Verificar rate limiting
- Validar webhook response"
```

## 🧪 Comando de Teste Rápido

Para ver funcionando agora, execute:

```bash
cd ZapSenderAPI && go run main.go &
curl http://localhost:8080/health
```

Resultado esperado:
```json
{
  "status": "ok",
  "service": "ZapSenderAPI",
  "version": "1.0.0",
  "timestamp": "2026-11-07T..."
}
```

---

## 🎯 Próximos Comandos Automáticos Disponíveis

| Comando | O que faz |
|---------|-----------|
| `npx hermes auto start` | Inicia workflow completo |
| `npx hermes analyze requirements` | Pega requisitos do usuário |
| `npx hermes design api` | Gera arquitetura |
| `npx hermes code generate` | Código automaticamente |
| `npx hermes test run` | Testa tudo |

**Execute um para ver funcionando!**