# ZapSenderAPI 🟧⚫

**WhatsApp API para Disparos em Massa**

[![Licença](https://img.shields.io/badge/Licença-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Versão](https://img.shields.io/badge/v1.0.0-laranja?style=for-the-badge&color=FF4500)]

## ✨ Funcionalidades

- **Alta Performance** - Construído com Node.js para uso mínimo de recursos
- **API RESTful** - Endpoints REST limpos e bem documentados
- **Suporte Multi-Bot** - Arquitetura baseada em plugins de bot
- **Multi-Webhook** - Entrega de eventos em tempo real para múltiplos endpoints
- **QR Code Dinâmico** - Geração embutida de QR code
- **Docker Ready** - Configuração Docker pronta para produção

## 🎨 Tema: Laranja & Preto

- **Cor Principal**: `#FF4500` (Laranja derretido)
- **Cor Secundária**: `#000000` (Preto profundo)
- **Cor Destaque**: `#FFA500` (Laranja vibrante)

## 🚀 Início Rápido

### Desenvolvimento Local

```bash
# Clone o repositório
git clone https://github.com/alexbuzatto/zapsenderapi.git
cd zapsenderapi

# Inicie o servidor
node http-server.js

# Acesse a API
curl http://localhost:8080/health

# Acesse o Manager
open http://localhost:8080/manager
```

### Docker

```bash
docker-compose up -d
```

## 📚 Endpoints da API

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/health` | Verificar saúde da API |
| GET | `/status` | Status do sistema |
| GET | `/cores` | Paleta de cores |
| GET | `/manager` | Dashboard administrativo |
| POST | `/api/v1/mensagens` | Enviar mensagem |
| POST | `/api/v1/mensagens/lote` | Mensagens em lote |

## 🤖 Sistema de Bots

Crie bots registrando-os via API:

```json
{
  "name": "notas",
  "description": "Salva e lista notas",
  "handler": "notas_bot.go"
}
```

## 🔐 Autenticação

Todas as chamadas à API requerem uma chave de API:

```bash
curl -H "X-API-Key: sua-api-key" http://localhost:8080/api/v1/mensagens
```

## 📖 Documentação

- [Documentação da API](https://docs.zapsenderapi.com)
- [GitHub](https://github.com/alexbuzatto/zapsenderapi)
- [Comunidade](https://discord.gg/zapsender)

## 🤝 Contribuindo

1. Faça um fork do repositório
2. Crie sua branch de features
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📜 Licença

Licença MIT - consulte [LICENSE](LICENSE) para mais detalhes.

---

**Criado com ❤️ usando Node.js** | **Tema: Laranja & Preto**