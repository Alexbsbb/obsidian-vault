---
tags: [memoria, traefik, docker, swarm]
---
# Traefik e Docker Swarm

- `Host()` exige **backticks** (`` `dominio.com` ``). Fix via Docker API unix socket + `chr(96)` em Python.
- **Stacks Alex:** env list, volumes `external` + `name`, Traefik backticks + tls, sem `healthcheck`/`depends_on`/`logging`, labels sem aspas, < 90 chars.
