---
tags: [memoria, capafy, ia, video, marketplace, agents]
data: 2026-11-06
---
# Capafy AI - Marketplace e Vitrine de Agentes de IA

Plataforma clone e ecossistema de marketplace de Agent Skills, com foco no agente principal **CloneCut (Vídeos curtos com IA e Seedance 2.0)**.

- **Localização do Projeto:** `C:\Users\PAULA\Documents\Craft Anything\capafy-ai`
- **Comando de Execução:** `npm start` (porta `3000`)
- **Repositório Local:** Inicializado com Git (branch `main`/`master`)

---

## 🧭 Rotas Principais
- `/`: Home / Apresentação do Agent CloneCut
- `/pt/`: Marketplace geral com catálogo de skills e criadores
- `/login`: Autenticação (Google, GitHub, e-mail)
- `/pt/agent/5133292529`: Página detalhada do Agent CloneCut
- `/pt/publisher/saya`: Perfil público do criador "saya"
- `/pt/agent/5133292529/featured-examples/fitem_2074072014785499136`: Exemplo em destaque ("Replace the dancer in the video")

---

## ⚙️ Arquitetura e Estrutura Atual
- **Servidor:** [`server.js`](file:///c:/Users/PAULA/Documents/Craft%20Anything/capafy-ai/server.js) nativo Node.js com resolução de clean URLs, MIME types completos e suporte a fallback de agentes.
- **Frontend:** HTML5, CSS moderno baseado em tokens (DM Sans, paleta `#ff6a2b`, `#18181b`, `#fafafa`), interatividade simulada no login com `localStorage`.
- **Build:** [`app/build.js`](file:///c:/Users/PAULA/Documents/Craft%20Anything/capafy-ai/app/build.js) gerando distribuição em `app/dist/`.

---

## 🎯 Próximos Passos Planejados (Roadmap)
1. **Integração com APIs de IA para Geração de Vídeo:**
   - Conectar provedores reais de geração/remix de vídeo (Seedance, Luma Dream Machine, Runway Gen-3, Kling, Haiper ou OpenAI).
   - Pipeline de processamento assíncrono (envio do prompt/vídeo de referência → polling do status → entrega do vídeo renderizado).
2. **Backend e Banco de Dados:**
   - Criação de API REST / tRPC (Node.js/Express, Fastify ou Next.js).
   - Banco de dados (Supabase / PostgreSQL / SQLite) para persistência de usuários, créditos, agentes e histórico de vídeos gerados.
   - Autenticação real (JWT / OAuth2).
3. **Refinamento de Design e UI:**
   - Player interativo para visualização de prévias de vídeo antes/depois.
   - Modal interativo de criação de briefing e upload de arquivos de referência.
   - Dashboard do criador para publicação de novos agentes no marketplace.
