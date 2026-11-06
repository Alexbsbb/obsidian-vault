---
tags: [memoria, studio-ai, video, marketplace, agents, traefik, postgresql, docker-swarm]
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
- `/api/health`: Status de saúde e verificação do PostgreSQL
- `/api/agents`: Lista dinâmica de agentes cadastrados no banco
- `/api/generations`: Histórico persistido de vídeos gerados
- `/api/generate`: Endpoint de disparo de geração

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

---

## ⚙️ Isolamento de Dados no PostgreSQL
- **Schema:** `studio_ai`
- **Tabelas Criadas Automaticamente:**
  - `studio_ai.agents` (catálogo e métricas de agentes)
  - `studio_ai.generations` (prompts, estilo, proporção 9:16/16:9, status e link do vídeo MP4)
  - `studio_ai.users` (contas e provedores)
