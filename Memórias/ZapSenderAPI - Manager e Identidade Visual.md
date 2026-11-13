---
tags: [memoria, zapsender, zapsenderapi, manager, frontend, design-system]
data: 2026-11-12
versao: v1.0.0
origem: Antigravity
---

# 🚀 ZapSenderAPI — Manager & Identidade Visual

## 📌 Visão Geral
O **ZapSenderAPI Manager** é a interface oficial de gerenciamento e monitoramento da API de mensagens do WhatsApp (`ZapSenderAPI`). O painel é servido diretamente pelo Express em `/manager` e implementa comunicação em tempo real com todos os endpoints do backend.

---

## 🎨 1. Sistema de Cores Oficial (ZapSender Design System)

| Token Semântico | Valor HEX | Uso na Interface |
|---|---|---|
| `--primary` | `#FF6B18` | Cor de destaque primária, botões de ação e ícones ativos |
| `--primary-hover` | `#E55A0D` | Estado hover de botões e links primários |
| `--bg-app` | `#0B0B0D` | Fundo principal da aplicação (Preto profundo com tom âmbar) |
| `--bg-sidebar` | `#0E0E12` | Fundo da barra lateral de navegação |
| `--bg-card` | `#121215` | Superfície de cards, painéis e contêineres |
| `--bg-card-hover` | `#18181D` | Hover de cards e itens de menu |
| `--bg-input` | `#18181D` | Fundo de inputs, selects e textareas |
| `--border-subtle` | `#27272A` | Bordas e divisores discretos |
| `--border-hover` | `#3F3F46` | Destaque de bordas ao passar o mouse |
| `--text-main` | `#FFFFFF` | Títulos, valores de métricas e texto principal |
| `--text-muted` | `#A1A1AA` | Descrições secundárias e labels |
| `--text-dim` | `#71717A` | Dicas, rodapés e textos apagados |

### Cores de Status do WhatsApp:
- **Enviado:** `#FF6B18` (`rgba(255, 107, 24, 0.12)`)
- **Entregue:** `#38BDF8` (`rgba(56, 189, 248, 0.12)`)
- **Lido:** `#A855F7` (`rgba(168, 85, 247, 0.12)`)
- **Sucesso / Online:** `#10B981` (`rgba(16, 185, 129, 0.12)`)
- **Falha / Erro:** `#EF4444` (`rgba(239, 68, 68, 0.12)`)
- **Fila / Alerta:** `#EAB308` (`rgba(234, 179, 8, 0.12)`)

---

## ⚡ 2. Módulos Funcionais do Manager

1. **Dashboard Geral:**
   - Métricas em tempo real (Uptime, Consumo de memória Heap, Total de mensagens).
   - Indicador de latência e saúde do serviço (`GET /health`).
   - Mostruário de cores da marca com cópia rápida de HEX.
   - Testador com 1 clique de todos os endpoints REST.
2. **Envio de Mensagem (Individual):**
   - Envio real para `POST /api/v1/messages` com suporte a autenticação por `X-API-Key`.
   - Exibição da resposta JSON com `messageId` e `providerMessageId` (`wamid...`).
3. **Disparo em Lote (Bulk Messages):**
   - Envio em paralelo com controle de concorrência configurável (1 a 10).
   - Validador JSON de lista de mensagens e relatório de envio.
4. **Histórico de Mensagens:**
   - Listagem paginada conectada a `GET /api/v1/messages`.
5. **Gerenciador de API Keys:**
   - Geração de novas chaves via `POST /manager/api-key`.
   - Listagem e revogação de chaves ativas.
6. **Webhooks:**
   - Registro de novos endpoints de callback via `POST /api/v1/webhooks/register`.
   - Testador de disponibilidade de URL via `GET /api/v1/webhooks/test`.
7. **Instâncias WhatsApp:**
   - Visualização do canal principal e módulo de pareamento.

---

## 🔧 3. Como Executar

```bash
cd D:\apiwhatsapp
node http-server.js
```
- **Painel:** `http://localhost:8081/manager`
- **Health:** `http://localhost:8081/health`
- **Cores:** `http://localhost:8081/colors`
- **Chave de Teste Padrão:** `test-api-key-12345`

