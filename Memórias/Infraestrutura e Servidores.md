---
tags: [memoria, infraestrutura, servidores]
---
# Infraestrutura e Servidores

## CT 200 (`srv-ct200`)
- IP: `192.168.2.216`
- Alpine 3.21, Hermes v0.16.0
- Dashboard em `:9119` com basic auth (`admin` / `hermes2026`) via OpenRC
- Usuário quer o Hermes **centralizado aqui**.

## srv-riquest (`192.168.25.103`)
- CPU Xeon **sem AVX/AVX-512**.
- `supabase/logflare` (Supabase analytics) tem NIF `libexplorer` pré-compilada p/ AVX → `SIGILL` (exit 132) em crash-loop a ~197% CPU; pode travar o host.
- **Fix:** `docker service scale supabase_supabase_analytics=0` (volta ao re-deploy do stack supabase).
