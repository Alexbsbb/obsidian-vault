---
tags: [memoria, studio-ai, video, marketplace, agents, traefik, postgresql, docker-swarm, omniroute, llm-providers]
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

---

## 🧭 Rotas do Sistema
- `/`: Studio de Criação interativo, seleção de agentes, geração com IA e player ao vivo
- `/marketplace`: Catálogo completo de agentes com busca e filtros
- `/login`: Autenticação e perfil do criador
- `/api/health`: Status de saúde e verificação do PostgreSQL e Provedor de IA
- `/api/settings`: Leitura e gravação de provedores de IA (`GET`/`POST`)
- `/api/test-provider`: Teste de conectividade com o endpoint de LLM (`POST`)
- `/api/agents`: Lista dinâmica de agentes cadastrados no banco
- `/api/generations`: Histórico persistido de vídeos gerados
- `/api/generate`: Endpoint de disparo de geração

---

## 🤖 Integração com Provedores de IA / LLM
O sistema conta com um painel de configuração (**Modal Provedores de IA**) que permite:
1. **OmniRoute (Nativo do cluster):** Endpoint `https://routers.riquest.com.br/v1` com modelo padrão `nemotron-3-nano-omni-30b-a3b-reasoning:free`.
2. **OpenRouter / OpenAI / Provedores Customizados:** Suporte a qualquer endpoint compatível com a API padrão de `/chat/completions` ou geração de vídeo.
3. **Persistência das Chaves e Endpoints:** Salvos na tabela `studio_ai.settings` no PostgreSQL Orion.
4. **Roteirização Cinematográfica Automática:** O modelo de LLM conectado analisa o prompt e expande as diretrizes de enquadramento, câmera, iluminação e trilha sonora antes de renderizar.

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
