---
tags: [memoria, config, infra, portainer, swarm, freellmapi, srv-app4]
data: 2026-10-30
origem: Hermes-Agent
---

# Stack FreeLLMAPI para srv-app4 (Portainer/Swarm)

## Resumo
Stack Docker Swarm para deploy do FreeLLMAPI no servidor srv-app4 via Portainer, com Traefik na rede `riquest` e domínio `freellmapi.riquest.com.br`.

## Detalhes

### docker-stack.yml (Portainer)
```yaml
version: "3.7"

services:

## --------------------------- FREELLM API --------------------------- ##

  freellmapi:
    image: ghcr.io/tashfeenahmed/freellmapi:latest

    networks:
      - riquest

    environment:
      - TZ=America/Sao_Paulo
      - NODE_ENV=production
      - PORT=3001
      - FREELLMAPI_SELF_UPDATE_URL=http://watchtower:8080
      - FREELLMAPI_SELF_UPDATE_TOKEN=${WATCHTOWER_TOKEN}

    volumes:
      - freellmapi_data:/app/server/data

    deploy:
      mode: replicated
      replicas: 1
      placement:
        constraints:
          - node.role == manager
      resources:
        limits:
          cpus: "1"
          memory: 1024M
      labels:
        - traefik.enable=true
        - traefik.http.routers.freellmapi.rule=Host(`freellmapi.riquest.com.br`)
        - traefik.http.routers.freellmapi.entrypoints=websecure
        - traefik.http.routers.freellmapi.priority=10
        - traefik.http.routers.freellmapi.tls.certresolver=letsencryptresolver
        - traefik.http.routers.freellmapi.tls=true
        - traefik.http.routers.freellmapi.service=freellmapi
        - traefik.http.services.freellmapi.loadbalancer.server.port=3001
        - traefik.http.services.freellmapi.loadbalancer.passHostHeader=true
        - traefik.docker.network=riquest

## --------------------------- VOLUMES --------------------------- ##

volumes:
  freellmapi_data:
    external: true
    name: freellmapi_data

## --------------------------- NETWORKS --------------------------- ##

networks:
  riquest:
    external: true
    name: riquest
```

### docker-compose.yml (Teste local)
```yaml
name: freellmapi

services:
  freellmapi:
    build: .
    image: ghcr.io/tashfeenahmed/freellmapi:latest
    restart: unless-stopped
    environment:
      - TZ=America/Sao_Paulo
      - NODE_ENV=production
      - PORT=3001
      - FREELLMAPI_SELF_UPDATE_URL=http://watchtower:8080
      - FREELLMAPI_SELF_UPDATE_TOKEN=${WATCHTOWER_TOKEN}
    ports:
      - "127.0.0.1:3001:3001"
    volumes:
      - freellmapi_data:/app/server/data
    extra_hosts:
      - "host.docker.internal:host-gateway"
    healthcheck:
      test: ["CMD", "node", "-e", "fetch('http://127.0.0.1:3001/api/ping').then((res) => { if (!res.ok) process.exit(1); }).catch(() => process.exit(1));"]
      interval: 30s
      timeout: 5s
      start_period: 15s
      retries: 3

volumes:
  freellmapi_data:
```

## Passos de Deploy no Portainer
1. Criar volume antes (se não existir):
   ```bash
   docker volume create freellmapi_data
   ```
2. Portainer → Stacks → + Add stack
3. Name: `freellmapi`
4. Colar conteúdo do `docker-stack.yml`
5. ✅ Marcar **"Re-pull image before redeploy"**
6. Deploy the stack

## Variáveis de Ambiente (Portainer)
- `WATCHTOWER_TOKEN` — token para auto-update via Watchtower (opcional)

## Acesso
Após deploy: **https://freellmapi.riquest.com.br**

## Relacionados
- [[Traefik-srv-app4]]
- [[Portainer-srv-app4]]
- [[OmniRoute-srv-riquest]]