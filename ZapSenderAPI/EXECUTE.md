# Executar ZapSenderAPI 🔧

## Opção 1: Docker (Recomendado)

```powershell
cd "C:\Users\PAULA\Documents\Obsidian Vault\ZapSenderAPI"
docker-compose up -d
```

## Opção 2: Go diretamente

```powershell
# Instalar Go 1.22+ se não tiver
# Depois:
cd "C:\Users\PAULA\Documents\Obsidian Vault\ZapSenderAPI"
go mod download
go run main.go
```

## Verificar funcionando

```powershell
curl http://localhost:8080/health
```

## Resposta esperada:
```json
{
  "status": "ok",
  "service": "ZapSenderAPI",
  "version": "1.0.0",
  "timestamp": "2026-11-07T..."
}
```

## Endpoints disponíveis

### Health Check
```
GET http://localhost:8080/health
```

### Instance Management
```
POST http://localhost:8080/api/v1/instances
GET http://localhost:8080/api/v1/instances/:id
GET http://localhost:8080/api/v1/instances/:id/qr
DELETE http://localhost:8080/api/v1/instances/:id
```

### Message Sending
```
POST http://localhost:8080/api/v1/messages
POST http://localhost:8080/api/v1/messages/bulk
```

### Bot Management
```
POST http://localhost:8080/api/v1/bots
GET http://localhost:8080/api/v1/bots
DELETE http://localhost:8080/api/v1/bots/:name
POST http://localhost:8080/api/v1/bots/:name/test
```

### Webhook Management
```
POST http://localhost:8080/api/v1/webhooks
GET http://localhost:8080/api/v1/webhooks
POST http://localhost:8080/api/v1/webhooks/test
DELETE http://localhost:8080/api/v1/webhooks/:id
```

## Swagger UI
```
http://localhost:8080/swagger/index.html
```