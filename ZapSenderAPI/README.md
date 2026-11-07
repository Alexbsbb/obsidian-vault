# ZapSenderAPI 🟧⚫

**WhatsApp API Server built in Go | Theme: Orange & Black**

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![Go](https://img.shields.io/badge/Go-1.22+-blue)](https://golang.org/)
[![Version](https://img.shields.io/badge/v1.0.0-orange?style=for-the-badge&color=FF4500)](https://github.com/zapsender/zapsenderapi)

## ✨ Features

- **High Performance** - Built with Go for minimal resource usage
- **RESTful API** - Clean, well-documented REST endpoints
- **Multi-Bot Support** - Plugin-based bot architecture
- **Multi-Webhook** - Real-time event delivery to multiple endpoints
- **Media Support** - Image, video, audio, document with MinIO/S3 storage
- **QR Code Pairing** - Built-in QR code generation
- **Docker Ready** - Production-ready Docker configuration

## 🎨 Theme: Orange & Black

- **Primary Color**: `#FF4500` (Laranja derretido)
- **Secondary Color**: `#000000` (Preto profundo)
- **Accent Color**: `#FFA500` (Laranja vibrante)

## 🚀 Quick Start

### Docker (Recommended)

```bash
# Clone repository
git clone https://github.com/zapsender/zapsenderapi.git
cd zapsenderapi

# Start services
docker-compose up -d

# Access API
curl http://localhost:8080/health
```

### Local Development

```bash
# Install dependencies
go mod download

# Build and run
go run main.go

# Swagger UI
http://localhost:8080/swagger/index.html
```

## 📚 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/v1/instances` | Create WhatsApp instance |
| GET | `/api/v1/instances/:id` | Get instance status |
| GET | `/api/v1/instances/:id/qr` | Get QR code for pairing |
| DELETE | `/api/v1/instances/:id` | Delete instance |
| POST | `/api/v1/messages` | Send text message |
| POST | `/api/v1/messages/bulk` | Send bulk messages |
| POST | `/api/v1/bots` | Register bot plugin |
| POST | `/api/v1/webhooks` | Register webhook endpoint |
| POST | `/api/v1/webhooks/test` | Test webhook delivery |

## 🔐 Authentication

All API calls require an API key:

```bash
curl -H "X-API-Key: your-api-key" http://localhost:8080/api/v1/instances
# OR
curl -H "Authorization: Bearer your-api-key" http://localhost:8080/api/v1/instances
```

## 🤖 Bot System

Create bots by registering them via API:

```json
{
  "name": "notas",
  "description": "Salva e lista notas",
  "handler": "notas_bot.go"
}
```

## 📦 Docker Images

```bash
docker pull zapsender/api:latest
docker-compose up -d
```

## 📖 Documentation

- [API Docs](https://docs.zapsenderapi.com)
- [GitHub](https://github.com/zapsender/zapsenderapi)
- [Community](https://discord.gg/zapsender)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📜 License

Apache 2.0 License - see [LICENSE](LICENSE) for details.

## 🎯 Roadmap

- [ ] WhatsApp Cloud API Support
- [ ] Multi-Device Sessions
- [ ] Message Templates
- [ ] Advanced Analytics
- [ ] SMS Gateway Integration

---

**Created with ❤️ using Go** | **Theme: Orange & Black**