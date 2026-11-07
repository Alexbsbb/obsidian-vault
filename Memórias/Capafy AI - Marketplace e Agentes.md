---
tags: [memoria, studio-ai, video, marketplace, agents, traefik, postgresql, docker-swarm, omniroute, llm-providers, freellmapi, kokoro-tts]
data: 2026-11-06
---
# Studio AI — Hub de Agentes & Criação de Vídeos

Plataforma de criação e remix de vídeos curtos com inteligência artificial e marketplace de agentes especialistas (CloneCut, Motion Dancer Swap, Faceless Shorts, Commercial 3D).

- **Domínio Público:** `https://studio.riquest.com.br`
- **Diretório Local:** `C:\Users\PAULA\Documents\Craft Anything\capafy-ai`
- **Rede Traefik:** `rede_riquet3` (TLS com `letsencryptresolver`)
- **Rede Banco de Dados:** `riquest`
- **Banco de Dados:** PostgreSQL 14 (Stack Orion) via schema dedicado `studio_ai`
- **Connection String Interna:** `postgresql://postgres:ceaab78bac269316f947ac2c0112e06d@postgres:5432/postgres?schema=studio_ai`
- **Roteador Multimodal (FreeLLMAPI):** `https://freellmapi.riquest.com.br/v1` (srv-app4) / `http://freellmapi:3001/v1` (rede interna `riquest`)

---

## 🧭 Rotas do Sistema
- `/`: Studio de Criação interativo, seleção de agentes, geração com IA e player ao vivo
- `/marketplace`: Catálogo completo de agentes com busca e filtros
- `/login`: Autenticação e perfil do criador
- `/api/health`: Status de saúde e verificação do PostgreSQL e Provedor de IA
- `/api/settings`: Leitura e gravação de provedores de IA, Vídeo e Áudio (`GET`/`POST`)
- `/api/test-provider`: Teste de conectividade com o endpoint de LLM (`POST`)
- `/api/agents`: Lista dinâmica de agentes cadastrados no banco
- `/api/generations`: Histórico persistido de vídeos gerados
- `/api/generate`: Endpoint de disparo de pipeline com roteiro, renderização e locução neural

---

## 🤖 Integração com Provedores de IA Multimodal (FreeLLMAPI & OmniRoute)
O sistema conta com um painel de configuração (**Modal Provedores de IA**) com 3 modalidades integradas:
1. **FreeLLMAPI (srv-app4 - Principal):**
   - **Endpoint Base:** `https://freellmapi.riquest.com.br/v1`
   - **Roteiro & Sonoplastia:** `/v1/chat/completions` (modelos: `gemini-1.5-flash`, `llama-3.3-70b-versatile`)
   - **Vídeo & Imagem Real:** `/v1/videos/generations` e `/v1/images/generations` (renderiza os quadros diretamente a partir do briefing)
   - **Locução Neural & TTS:** `/v1/audio/speech` (modelo `kokoro`, voz brasileira `pf_dora`)
2. **OmniRoute (srv-riquest):**
   - Endpoint `https://routers.riquest.com.br/v1` com modelo padrão `nemotron-3-nano-omni-30b-a3b-reasoning:free`.
3. **APIs Externas Dedicadas (Opcional):**
   - Luma Dream Machine API, Runway Gen-3 Alpha, Fal.ai Kling 1.5, OpenAI TTS.
4. **Persistência Completa no PostgreSQL Orion:**
   - As preferências e credenciais de LLM, vídeo e áudio são salvas com chave/valor em `studio_ai.settings`.

---

## 🔊 Áudio Estéreo e Locução Neural Integrada
- **Locução Neural:** O texto do briefing ou sinopse da cena é sintetizado em arquivo `.mp3` no diretório `public/assets/generated/`.
- **Player Sincronizado:** O player executa o vídeo/mídia juntamente com a locução neural e trilha sonora em estéreo.
- **Controle de Volume Nativo:** Barra de ganho de 0 a 100% com botão de mudo rápido.
- **Autoplay Compliance:** Tratamento automático de política de autoplay dos navegadores com banner de ativação imediata caso necessário.

---

## 🎬 Streaming e Player de Vídeo Nativo
- **Streaming HTTP 206 Partial Content:** Suporte a cabeçalhos `Range: bytes=X-Y` no `server.js` para carregamento instantâneo e seek sem travamentos.
- **Assets de Vídeo Locais Integrados:** Não depende mais de serviços externos com risco de 403 (Access Denied).
- **Botão de Download:** Permite baixar o arquivo MP4 diretamente após a conclusão.
- **Autoplay Seguro:** Configurado com `muted` e `playsinline` para respeitar as políticas de mídia dos navegadores.

---

## 🐳 Stack Docker Swarm (Portainer)
```yaml
version: "3.7"

services:
  studio_ai:
    image: alexbsbb/studio-ai:latest
    environment:
      - NODE_ENV=production
      - PORT=3000
      - DATABASE_URL=postgresql://postgres:ceaab78bac269316f947ac2c0112e06d@postgres:5432/postgres?schema=studio_ai
      - DB_SSL=false
      - TZ=America/Sao_Paulo
    networks:
      - riquest
      - rede_riquet3
    deploy:
      mode: replicated
      replicas: 1
      placement:
        constraints:
          - node.role == manager
      resources:
        limits:
          cpus: "1"
          memory: 512M
      labels:
        - "traefik.enable=true"
        - "traefik.docker.network=rede_riquet3"
        - "traefik.http.routers.studio-ai.rule=Host(`studio.riquest.com.br`)"
        - "traefik.http.routers.studio-ai.entrypoints=websecure"
        - "traefik.http.routers.studio-ai.tls=true"
        - "traefik.http.routers.studio-ai.tls.certresolver=letsencryptresolver"
        - "traefik.http.services.studio-ai.loadbalancer.server.port=3000"

networks:
  riquest:
    external: true
    name: riquest
  rede_riquet3:
    external: true
    name: rede_riquet3
```
