---
tags: [infra, portainer, docker-swarm, srv-app4, traefik-integration]
data: 2026-10-30
origem: Hermes-Agent
servidor: srv-app4 (192.168.3.17)
---

# Portainer — srv-app4 (192.168.3.17)

## 📋 Visão Geral
- **Hostname:** `srv-app4`
- **Domínio:** `painel3.riquest.com.br`
- **Rede:** `rede_riquet3` (shared com Traefik)
- **Volume:** `portainer_data` (externo)

## ⚙️ Stack Completa (docker-compose.yml)

```yaml
version: "3.7"
services:

  agent:
    image: portainer/agent:latest
    volumes:
      - /var/run/docker.sock:/var/run/docker.sock
      - /var/lib/docker/volumes:/var/lib/docker/volumes
    networks:
      - rede_riquet3
    deploy:
      mode: global
      placement:
        constraints: [node.platform.os == linux]

  portainer:
    image: portainer/portainer-ce:latest
    command: -H tcp://tasks.agent:9001 --tlsskipverify --no-setup-token
    volumes:
      - portainer_data:/data
    networks:
      - rede_riquet3
    deploy:
      mode: replicated
      replicas: 1
      placement:
        constraints: [node.role == manager]
      labels:
        - "traefik.enable=true"
        - "traefik.http.routers.portainer.rule=Host(`painel3.riquest.com.br`)"
        - "traefik.http.services.portainer.loadbalancer.server.port=9000"
        - "traefik.http.routers.portainer.tls.certresolver=letsencryptresolver"
        - "traefik.http.routers.portainer.service=portainer"
        - "traefik.docker.network=rede_riquet3"
        - "traefik.http.routers.portainer.entrypoints=websecure"
        - "traefik.http.routers.portainer.priority=1"

volumes:
  portainer_data:
    external: true
    name: portainer_data

networks:
  rede_riquet3:
    external: true
    attachable: true
    name: rede_riquet3
```

## 🔑 Padrão de Integração Traefik (O Ponto-Chave)

### Labels Obrigatórios em Todo Serviço Exposto
```yaml
labels:
  - "traefik.enable=true"
  - "traefik.http.routers.<nome>.rule=Host(`dominio.com.br`)"
  - "traefik.http.services.<nome>.loadbalancer.server.port=<porta_interna>"
  - "traefik.http.routers.<nome>.tls.certresolver=letsencryptresolver"
  - "traefik.docker.network=rede_riquet3"
  - "traefik.http.routers.<nome>.entrypoints=websecure"
  - "traefik.http.routers.<nome>.priority=1"
```

### Estrutura do Roteamento
1. **Rede Compartilhada:** Serviço **deve** estar na `rede_riquet3` (external, attachable).
2. **Resolver TLS:** Usa `letsencryptresolver` definido no Traefik central (challenge HTTP na porta 80).
3. **Entrypoint:** Apenas `websecure` (443) — HTTP é redirecionado automaticamente pelo catchall do Traefik.
4. **Backticks no Host:** Regra usa `` `Host(\`dominio.com.br\`)` `` — **obrigatório**.
5. **Porta Interna:** `loadbalancer.server.port` = porta que o container expõe (ex: 9000 do Portainer).
6. **Priority:** `1` garante precedência sobre catchall genérico.

### Agent Portainer (Global)
- Roda em **todos os nodes Linux** (`mode: global`).
- Expõe socket Docker e volumes para o Portainer central gerenciar o cluster inteiro.
- Comunicação via `tcp://tasks.agent:9001` (DNS interno do Swarm).

## 🔗 Relacionados
- [[Memórias/Configurações Técnicas/Traefik-srv-app4|Traefik Central srv-app4]]
- [[Memórias/Configurações Técnicas/Infraestrutura-e-Servidores|Infraestrutura Geral]]