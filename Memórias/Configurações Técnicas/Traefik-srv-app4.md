---
tags: [infra, traefik, docker-swarm, srv-app4]
data: 2026-10-30
origem: Hermes-Agent
servidor: srv-app4 (192.168.3.17)
---

# Traefik Central — srv-app4 (192.168.3.17)

## 📋 Visão Geral
- **Hostname:** `srv-app4`
- **IP:** `192.168.3.17`
- **Função:** Traefik central (edge router) para o cluster Swarm.
- **Versão Traefik:** `v3.5.3`
- **Rede Interna:** `rede_riquet3` (external, attachable)
- **Volumes Externos:**
  - `volume_swarm_shared` → `vol_shared`
  - `volume_swarm_certificates` → `vol_certificates` (Let's Encrypt)

## ⚙️ Configuração Principal (docker-compose.yml)

```yaml
version: "3.7"
services:
  traefik:
    image: traefik:v3.5.3
    command:
      - "--api.dashboard=true"
      - "--providers.swarm=true"
      - "--providers.docker.endpoint=unix:///var/run/docker.sock"
      - "--providers.docker.exposedbydefault=false"
      - "--providers.docker.network=rede_riquet3"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.web.http.redirections.entryPoint.to=websecure"
      - "--entrypoints.web.http.redirections.entryPoint.scheme=https"
      - "--entrypoints.web.http.redirections.entrypoint.permanent=true"
      - "--entrypoints.websecure.address=:443"
      - "--entrypoints.web.transport.respondingTimeouts.idleTimeout=3600"
      - "--certificatesresolvers.letsencryptresolver.acme.httpchallenge=true"
      - "--certificatesresolvers.letsencryptresolver.acme.httpchallenge.entrypoint=web"
      - "--certificatesresolvers.letsencryptresolver.acme.storage=/etc/traefik/letsencrypt/acme.json"
      - "--certificatesresolvers.letsencryptresolver.acme.email=alexbsbb@gmail.com"
      - "--log.level=DEBUG"
      - "--log.format=common"
      - "--log.filePath=/var/log/traefik/traefik.log"
      - "--accesslog=true"
      - "--accesslog.filepath=/var/log/traefik/access-log"
    volumes:
      - "vol_certificates:/etc/traefik/letsencrypt"
      - "/var/run/docker.sock:/var/run/docker.sock:ro"
    networks:
      - rede_riquet3
    ports:
      - target: 80
        published: 80
        mode: host
      - target: 443
        published: 443
        mode: host
    deploy:
      placement:
        constraints:
          - node.role == manager
      labels:
        - "traefik.enable=true"
        - "traefik.http.middlewares.redirect-https.redirectscheme.scheme=https"
        - "traefik.http.middlewares.redirect-https.redirectscheme.permanent=true"
        - "traefik.http.routers.http-catchall.rule=Host(`{host:.+}`)"
        - "traefik.http.routers.http-catchall.entrypoints=web"
        - "traefik.http.routers.http-catchall.middlewares=redirect-https@docker"
        - "traefik.http.routers.http-catchall.priority=1"

volumes:
  vol_shared:
    external: true
    name: volume_swarm_shared
  vol_certificates:
    external: true
    name: volume_swarm_certificates

networks:
  rede_riquet3:
    external: true
    attachable: true
    name: rede_riquet3
```

## 🔑 Pontos-Chave do Padrão

1. **Rede Única:** `rede_riquet3` — todos os serviços do cluster devem anexar a esta rede para serem descobertos pelo Traefik.
2. **Volumes Externos Obrigatórios:** Certificados e compartilhados vêm de volumes externos pré-criados (`docker volume create ...`).
3. **Dashboard Habilitado:** `--api.dashboard=true` (acesso via labels no próprio Traefik).
4. **Redirect HTTP → HTTPS:** Forçado via middleware `redirect-https` + catchall router.
5. **ACME/Let's Encrypt:** Resolver `letsencryptresolver` com challenge HTTP na porta 80, armazenamento em `/etc/traefik/letsencrypt/acme.json`.
6. **Logs:** DEBUG level, arquivo em `/var/log/traefik/`.
7. **Placement:** Apenas em nodes `manager`.
8. **Backticks no Host:** Regra catchall usa `` `Host(\`{host:.+}\`)` `` — padrão da casa.

## 🔗 Relacionados
- [[Memórias/Configurações Técnicas/Infraestrutura-e-Servidores|Infraestrutura Geral]]
- [[Memórias/Configurações Técnicas/Traefik-e-Docker-Swarm|Padrão Traefik Alex (Swarm)]]