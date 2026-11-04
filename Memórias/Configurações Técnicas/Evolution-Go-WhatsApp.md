---
tags: [whatsapp, evolution-go, api]
data: 2026-10-30
origem: Hermes-Agent
---

# Evolution Go API (WhatsApp)

## 🔗 Instância Base
- **URL Prática:** `evogo.riquest.com.br`
- **Auth Header:** Usa token da instância (não GLOBAL_API_KEY) para envio. Webhook usa `instanceId` UUID.

## 🚀 Criação de Instância
- **Body:** `instanceName` + `integration: WHATSAPP-BAILEYS`.
- **QR Code:** `GET /instance/{name}/qrcode`.

## 📨 Estrutura Webhook (Diferencial)
- Eventos capitalizados: `Message`, `Connected`, `QRCode`.
- Dados aninhados: `data.Info.Sender`, `data.Message.conversation`.
- **Importante:** Diferente da Evolution API Node padrão. Verificar docs oficiais se mudar de servidor.

## ️ TTS Dinâmico
- **Regra:** NÃO usar mensagens pré-gravadas.
- **Fluxo:** Gerar áudio TTS em tempo real baseado na resposta da IA/Banco.
- **Voz Alvo:** Feminina, BR, jovem, natural (f0≈193Hz). OmniVoice em CPU é inviável (>10min); usar serviço externo ou GPU.
