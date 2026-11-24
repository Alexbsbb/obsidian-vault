---
tags: [memoria, zapsender, keygen, vouchers, licenca, seguranca]
data: 2026-11-23
versao: v1.0.0
origem: Antigravity
---

# 🔑 ZapSender — Gerador de Chaves VIP (Padrão VIP1-XXXX-XXXX-XXXX)

## 📌 1. Visão Geral
Módulo e aplicação web desenvolvidos para gerar, gerenciar, validar e resgatar códigos de ativação / vouchers VIP no formato exato solicitado:
> **Padrão:** `VIP1-Q2W5-CSWQ-RKD6` (4 blocos de 4 caracteres alfanuméricos separados por hífen).

---

## 🏗️ 2. Estrutura do Padrão
- **Bloco 1 (Prefixo / Nível):** `VIP1` (ou customizável: `VIP2`, `PRO1`, `GOLD`, etc.).
- **Blocos 2, 3 e 4:** 4 caracteres alfanuméricos criptograficamente seguros gerados via `crypto.randomBytes` / `crypto.getRandomValues`.
- **Comprimento total:** 19 caracteres (16 caracteres alfanuméricos + 3 hífens).

---

## 💻 3. Como Utilizar

### 3.1 Interface Web Standalone (Navegador)
Abra diretamente no navegador o arquivo:
- `D:\apiwhatsapp\keygen-app.html`

Ou acesse pelo servidor Express local:
- `http://localhost:8081/keygen`
- `http://localhost:8081/manager` (Aba Gerador Chaves VIP)

### 3.2 Linha de Comando (CLI)
```bash
node keygen-cli.js [quantidade] [prefixo]

# Exemplo: gerar 10 chaves VIP1
node keygen-cli.js 10 VIP1
```

### 3.3 Endpoints REST da API
- **Gerar Chaves:** `POST /api/v1/keys/generate`
  ```json
  {
    "count": 5,
    "prefix": "VIP1"
  }
  ```
- **Validar / Resgatar Chave:** `POST /api/v1/keys/validate`
  ```json
  {
    "key": "VIP1-Q2W5-CSWQ-RKD6",
    "redeem": true
  }
  ```

---

## 📱 4. Recursos do Aplicativo Web
1. **Geração Instantânea e em Lote:** de 1 a 1000 chaves com um clique.
2. **Presets de Prefixo:** `VIP1`, `VIP2`, `VIP3`, `PRO1`, `GOLD`, `PASS`.
3. **Modos de Caracteres:** Alfanumérico Completo ou Modo Clean (sem caracteres ambíguos `0/O`, `1/I/L`).
4. **Exportação:** Copiar Todas, Baixar TXT, CSV e JSON.
5. **Validador & Resgate:** Analisador sintático de chaves com verificação de status e registro de uso.
6. **Integração WhatsApp:** Disparo com 1 clique do código gerado para o cliente pelo WhatsApp.
