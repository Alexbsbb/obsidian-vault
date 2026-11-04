---
tags: [infra, docker, swarm, traefik]
data: 2026-10-30
origem: Hermes-Agent
---

# Infraestrutura e Servidores

## ️ Servidor CT 200 (Central Hermes)
- **IP:** `192.168.2.216`
- **Hostname:** `srv-ct200`
- **OS:** Alpine 3.21
- **Hermes Version:** v0.16.0
- **Acesso Dashboard:** Porta `9119` (Basic Auth: admin/hermes2026)
- **Função:** Centralização do Hermes Agent via OpenRC.

## 🌐 Servidor Rquest (OmniRoute/Apps)
- **IP:** `192.168.25.103`
- **Hostname:** `srv-riquest`
- **Domínio:** `routers.riquest.com.br`
- **CPU:** Xeon (⚠️ **Sem AVX/AVX-512**)
- **Alerta Crítico:** Supabase/Logflare crasha (SIGILL) devido à falta de AVX.
  - **Fix:** `docker service scale supabase_supabase_analytics=0` antes de redeploy.

##  Traefik & Docker Swarm
- **Regra de Ouro:** Hostnames no Traefik exigem backticks: `` `dominio.com` ``.
- **Stacks Alex:**
  - Volumes: Preferir `external: true` + nome explícito.
  - Labels: Sem aspas extras, <90 chars.
  - Sem healthcheck/depends_on/logging padrão nas stacks simples.
  - TLS habilitado globalmente.
