---
name: docker-swarm-stack-builder
description: Gera stacks Docker Swarm completas seguindo os padrões do Alex — docker-stack.yml, docker-compose.yml, Dockerfile.
---

# Docker Swarm Stack Builder

Gera stacks completas para deploy no Docker Swarm seguindo os **padrões do Alex**.

## Quando usar

Sempre que o Alex pedir "monta uma stack pra [repositorio]" ou "cria stack pra [projeto]".

## 📦 Estrutura de saída

Criar em `E:/<nome-projeto>/`:
```
E:/<projeto>/
├── Dockerfile           # (se necessário containerizar)
├── docker-compose.yml   # Teste local
├── docker-stack.yml     # Deploy Swarm
```

> 📖 **Referências de projetos reais:**
> - `references/kokoro-tts.md` — exemplo completo de stack e-click com modelos ONNX baixados durante o build, CPU-only, API FastAPI + dashboard embutido
> - `references/fastapi-embedded-dashboard.md` — padrão de dashboard visual embutido em APIs FastAPI
> - `references/proxmox-ct-vs-swarm-decision.md` — matriz de decisão: Proxmox CTs vs Docker Swarm para gateways multi-tenant (OmniRoute, etc.)
> - `references/omniroute.md` — deploy do OmniRoute (diegosouzapw/omniroute) no Swarm: secrets obrigatórias, env vars, verificação
> - `references/omniroute-api.md` — API REST do OmniRoute: login, settings, providers, keys, endpoints
> - `references/omniroute-multi-tenant-swarm.md` — padrão para múltiplas instâncias isoladas do OmniRoute no Swarm (uma por usuário) com portas, volumes e Traefik separados
> - `references/noc-center-stack.md` — deploy do NOC Center: entrypoint com auto-seed, correcoes de YAML para Portainer, template exato do typebot/zerobyte
- `references/omniroute-deployment-103.md` — **OmniRoute production deployment on srv-riquest (192.168.25.103)** with Traefik networking, internal DNS, provider status, combos, API keys
> - `references/omniroute-production-deployment.md` — **Critical findings: imagem upstream usa CMD dev (dev/run-standalone.mjs) que NÃO sobe HTTP server em 0.0.0.0:20128. Precisa sobrescrever `command: ["node", "server.js"]` no serviço Swarm. Stack validada com Redis, volumes, secrets, Traefik na rede riquest.**
>
> 🛠️ **Scripts de apoio:**
> - `scripts/build-and-push.sh` — versionamento semântico automatizado (patch/minor/major), build dual-tag + push

## Estrutura correta (template)

Seguir EXATAMENTE a estrutura do typebot ou zerobyte. Nao inventar ordem.

```yaml
version: "3.7"

services:

## --------------------------- NOME --------------------------- ##

  servico:
    image: ghcr.io/alexbuzatto/imagem:tag

    networks:
      - rede_cidade ## Nome da rede interna

    environment:
      - TZ=America/Sao_Paulo
      - KEY=valor

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
        - traefik.http.routers.servico.rule=Host(`dominio.com`)
        - traefik.http.routers.servico.entrypoints=websecure
        - traefik.http.routers.servico.tls.certresolver=letsencryptresolver
        - traefik.http.services.servico.loadbalancer.server.port=PORTA
        - traefik.http.services.servico.loadbalancer.passHostHeader=true
        - traefik.http.routers.servico.service=servico
        - traefik.http.routers.servico.tls=true

## --------------------------- VOLUMES --------------------------- ##

volumes:
  volume_name:
    external: true
    name: volume_name

## --------------------------- NETWORKS --------------------------- ##

networks:
  rede_cidade: ## Nome da rede interna
    external: true

```

### Regras

- Section headers `## --- NOME --- ##`
- `resources.limits` sempre presente
- `priority=10` para serviços públicos (editor, app) no contexto riquest/eclick
- `passHostHeader=1` (não `true`) no contexto riquest/eclick
- SEM `traefik.docker.network` (exceto quando explicitamente necessário)
- SEM `attachable: true` na declaração da rede
- SEM healthcheck, depends_on, logging
- Environment como lista (`- KEY=valor`)
- Volumes com `external: true` + `name:`
- Networks com `external: true` + `name: <mesmo_nome>`
- ASCII puro (sem acentos, emojis, em dash)
- Linhas < 90 chars
- Evitar env vars vazias (`KEY=` sem valor)
- Confirmar rede overlay antes de gerar stack — pode ser diferente das 3 padrão (rede_cidade, eclick, riquest)

### Stack NOC Center ajustada para PostgreSQL compartilhado (ORION)

Quando o Alex usa PostgreSQL do stack ORION compartilhado:

```yaml
version: "3.7"

services:

  redis:
    image: redis:7-alpine
    command: ["redis-server", "--appendonly", "yes"]
    volumes:
      - noc_redis_data:/data
    networks:
      - rede_cidade
    environment:
      - TZ=America/Sao_Paulo
    deploy:
      mode: replicated
      replicas: 1
      placement:
        constraints:
          - node.role == manager
      resources:
        limits:
          cpus: "0.5"
          memory: 512M

  backend:
    image: ghcr.io/alexbuzatto/noc-backend:latest
    networks:
      - rede_cidade
    environment:
      - TZ=America/Sao_Paulo
      - DATABASE_URL=postgresql+asyncpg://postgres:e20945c00fd8a8c6a2d192cadded2de8@postgres:5432/nocdb
      - REDIS_URL=redis://redis:6379/0
      - JWT_SECRET_KEY=<gerado_forte>
      - MIKROTIK_HOST=200.203.124.10
      - MIKROTIK_USER=alexandre
      - MIKROTIK_PASSWORD=
      - EVOLUTION_API_URL=
      - N8N_WEBHOOK_SECRET=
    deploy:
      mode: replicated
      replicas: 1
      placement:
        constraints:
          - node.role == manager
      resources:
        limits:
          cpus: "0.5"
          memory: 512M

  frontend:
    image: ghcr.io/alexbuzatto/noc-frontend:latest
    networks:
      - rede_cidade
    environment:
      - TZ=America/Sao_Paulo
      - NEXT_PUBLIC_API_URL=http://backend:8000
      - NODE_ENV=production
    deploy:
      mode: replicated
      replicas: 1
      placement:
        constraints:
          - node.role == manager
      resources:
        limits:
          cpus: "0.5"
          memory: 384M
      labels:
        - traefik.enable=true
    ```
        - traefik.http.routers.noc-frontend.tls.certresolver=letsencryptresolver
        - traefik.http.services.noc-frontend.loadbalancer.server.port=3000
        - traefik.http.routers.noc-frontend.service=noc-frontend
        - traefik.http.routers.noc-frontend.tls=true

volumes:
  noc_redis_data:
    external: true
    name: noc_redis_data

networks:
  rede_cidade:
    external: true

```

**Pontos-chave desta versão:**
- Sem serviço postgres — usa o do ORION (`postgres:5432`)
- `DATABASE_URL` com credenciais do ORION + banco `nocdb`
- Role do admin seed: `full` (constraint `chk_users_role` não aceita `admin`)
- Senhas fortes geradas: `POSTGRES_PASSWORD` + `JWT_SECRET_KEY` + admin password
- Antes do deploy: criar banco `nocdb` no PostgreSQL compartilhado

---

### Stack NOC Center com init-db automático (versão 2026-07-27)

Versão que **cria o banco automaticamente** no PostgreSQL compartilhado via init container:

```yaml
version: "3.7"

services:

## --------------------------- INIT DB --------------------------- ##

  init-db:
    image: postgres:16-alpine
    networks:
      - rede_cidade
    environment:
      - PGPASSWORD=e20945c00fd8a8c6a2d192cadded2de8
    command: >
      sh -c "
        until pg_isready -h postgres -U postgres; do
          echo 'Aguardando PostgreSQL...';
          sleep 2;
        done;
        psql -h postgres -U postgres -d postgres -c 'CREATE DATABASE nocdb;' 2>/dev/null || echo 'Banco nocdb ja existe';
        echo 'Banco nocdb pronto'
      "
    deploy:
      mode: replicated
      replicas: 1
      placement:
        constraints:
          - node.role == manager
      restart_policy:
        condition: on-failure
        delay: 5s
        max_attempts: 3

## --------------------------- REDIS --------------------------- ##

  redis:
    image: redis:7-alpine
    command: ["redis-server", "--appendonly", "yes"]
    volumes:
      - noc_redis_data:/data
    networks:
      - rede_cidade
    environment:
      - TZ=America/Sao_Paulo
    deploy:
      mode: replicated
      replicas: 1
      placement:
        constraints:
          - node.role == manager
      resources:
        limits:
          cpus: "0.5"
          memory: 512M

## --------------------------- BACKEND --------------------------- ##

  backend:
    image: ghcr.io/alexbuzatto/noc-backend:latest
    networks:
      - rede_cidade
    environment:
      - TZ=America/Sao_Paulo
      - DATABASE_URL=postgresql+asyncpg://postgres:e20945c00fd8a8c6a2d192cadded2de8@postgres:5432/nocdb
      - REDIS_URL=redis://redis:6379/0
      - JWT_SECRET_KEY=444b6ef9b6fbdd1af9d05d0a9812c288587ccb01a046e39d4ce969b15b59e366
      - MIKROTIK_HOST=192.168.2.254
      - MIKROTIK_USER=noccenterpms
      - MIKROTIK_PASSWORD=Pmslog852$!@#
      - EVOLUTION_API_URL=
      - N8N_WEBHOOK_SECRET=
    deploy:
      mode: replicated
      replicas: 1
      placement:
        constraints:
          - node.role == manager
      resources:
        limits:
          cpus: "0.5"
          memory: 512M

## --------------------------- FRONTEND --------------------------- ##

  frontend:
    image: ghcr.io/alexbuzatto/noc-frontend:latest
    networks:
      - rede_cidade
    environment:
      - TZ=America/Sao_Paulo
      - NEXT_PUBLIC_API_URL=http://backend:8000
      - NODE_ENV=production
    deploy:
      mode: replicated
      replicas: 1
      placement:
        constraints:
          - node.role == manager
      resources:
        limits:
          cpus: "0.5"
          memory: 384M
      labels:
        - traefik.enable=true
    ```
        - traefik.http.routers.noc-frontend.tls.certresolver=letsencryptresolver
        - traefik.http.services.noc-frontend.loadbalancer.server.port=3000
        - traefik.http.routers.noc-frontend.service=noc-frontend
        - traefik.http.routers.noc-frontend.tls=true

volumes:
  noc_redis_data:
    external: true
    name: noc_redis_data

networks:
  rede_cidade:
    external: true

```

**Fluxo do deploy:**
1. `init-db` sobe → espera PostgreSQL → cria `nocdb` → termina (restart on-failure)
2. `redis` sobe
3. `backend` sobe → conecta no `nocdb` → roda migrations → seed cria admin (`alex.buzatto` / `full`)
4. `frontend` sobe

**Configurações geradas na sessão:**
- Admin password: `N80NwFqkEEpNXZxL` (seed.py)
- JWT_SECRET_KEY: `444b6ef9b6fbdd1af9d05d0a9812c288587ccb01a046e39d4ce969b15b59e366`
- PostgreSQL ORION creds: `postgres:e20945c00fd8a8c6a2d192cadded2de8@postgres:5432`
- Frontend domain: `noc.riquest.com.br` (Traefik backticks obrigatórios)

---

### 🔌 MikroTik Port Knocking Pattern (NOC Center)

O NOC Center usa **port knocking** para acessar o MikroTik via API pública:

```
```

**Configuração no backend (env vars):**
```yaml
environment:
  - MIKROTIK_HOST=191.242.217.166    # IP público
  - MIKROTIK_PORT=63222             # Porta API após knocking
  - MIKROTIK_USER=noccenterpms
  ```

**Importante:** O client MikroTik (`MikroTikClient.from_config`) lê as credenciais da tabela `SystemConfig` no banco (keys: `mikrotik_host`, `mikrotik_user`, `mikrotik_password_enc`, `mikrotik_api_port`). As env vars servem como fallback inicial. **Configure via UI** (Settings → MikroTik) após o primeiro login.

**Teste de conectividade local (sem knocking):**
```bash
# IP local na rede da prefeitura
MIKROTIK_HOST=192.168.2.254
MIKROTIK_PORT=8728
MIKROTIK_USER=noccenterpms
```

---

### 🎛️ Frontend Settings Page — Conexão com API Real (2026-07-27)

A página `/settings` era **estática/mock** (botões sem `onClick`, inputs com `defaultValue`, sem chamadas de API). Refatorada para:

**Funcionalidades implementadas:**
- ✅ Estado controlado (`value` + `onChange`) em todos os inputs
- ✅ Carregamento real via `GET /api/config` (apiGet)
- ✅ Salvamento via `PUT /api/config` (apiPut)
- ✅ **Testar Conexão MikroTik** via `POST /api/mikrotik/test` (apiPost)
- ✅ Toggle de visibilidade de senha (Eye/EyeOff)
- ✅ Feedback visual: loading, sucesso, erro
- ✅ Mapeamento de keys frontend ↔ backend (`KEY_MAP`)

**Componentes adicionados:**
- `Label` component em `src/components/ui/label.tsx` (faltava no shadcn/ui)

**Endpoints backend usados:**
```python
GET    /api/config           # Lista todas configs (decrypted para sensitive)
PUT    /api/config           # Bulk update { entries: [{key, value, is_sensitive}] }
```

**Padrão de uso no frontend:**
```tsx
import { apiGet, apiPost, apiPut } from '@/lib/api';

// Carregar
const data = await apiGet<ConfigEntry[]>('/config');

// Testar MikroTik
const res = await apiPost<ConnectionTestResult>('/mikrotik/test', payload);

// Salvar
```

---

### 🔐 MikroTik Client — Config via SystemConfig (Runtime)

O `MikroTikClient.from_config(db)` lê credenciais da tabela `system_config` **em tempo de execução**:

```python
# app/mikrotik/client.py
async def _load_config(db: AsyncSession) -> dict[str, str]:
    result = await db.execute(
        select(SystemConfig).where(SystemConfig.key.like("mikrotik%"))
    )
    # Descriptografa chaves sensíveis (is_sensitive=True)
    ...

@classmethod
async def from_config(cls, db: AsyncSession | None = None) -> MikroTikClient:
    cfg = await _load_config(db)
    return cls(
        host=cfg.get("mikrotik_host", "192.168.2.254"),
        port=int(cfg.get("mikrotik_api_port", "8728")),
        username=cfg.get("mikrotik_user", "noccenterpms"),
        password=cfg.get("mikrotik_password_enc", ""),

```

**Keys esperadas no SystemConfig:**
| Key | Tipo | Descrição |
|-----|------|-----------|
| `mikrotik_host` | plain | IP do MikroTik |
| `mikrotik_user` | plain | Usuário API |
| `mikrotik_password_enc` | encrypted | Senha (Fernet) |
| `mikrotik_api_port` | plain | Porta API (default 8728) |

> **⚠️ Não confiar nas env vars** — elas são apenas fallback inicial. Configure via **Settings → MikroTik** no frontend.
version: "3.7"

services:

  app:                                   # ← nome do serviço (trocável)
    image: ghcr.io/alexbuzatto/<imagem>:latest

    networks:
      - eclick

    environment:
      ## Timezone
      - TZ=America/Sao_Paulo

      ####################################################
      # BANCO DE DADOS
      ####################################################
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_HOST=postgres
      - DB_POSTGRESDB_PORT=5432
      - DB_POSTGRESDB_DATABASE=<database>
      - DB_POSTGRESDB_USER=postgres
      - DB_POSTGRESDB_PASSWORD=<senha>

      ####################################################
      # REDIS
      ####################################################
      - QUEUE_BULL_REDIS_HOST=<redis_host>
      - QUEUE_BULL_REDIS_PORT=6379
      - QUEUE_BULL_REDIS_DB=1

      ####################################################
      # VOLUMES
      ####################################################
    volumes:
      - app_data:/data

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

      restart_policy:
        condition: any

      labels:
        - traefik.enable=true
        - traefik.http.routers.app.rule=Host(`<subdominio>.eclicksolucoes.com.br`)
        - traefik.http.routers.app.entrypoints=websecure
        - traefik.http.routers.app.priority=10
        - traefik.http.routers.app.tls.certresolver=letsencryptresolver
        - traefik.http.routers.app.tls=true
        - traefik.http.services.app.loadbalancer.server.port=<PORTA>
        - traefik.http.services.app.loadbalancer.passHostHeader=true
        - traefik.docker.network=eclick

volumes:
  app_data:
    external: true
    name: app_data

networks:
  eclick:

```

> ⚠️ Notar: no contexto eclick o `priority=10` (não 1), tem `passHostHeader=true`, e usa `resources.limits` com `restart_policy`.

## Contexto: riquest (riquest.com.br)

Servidor: srv-riquest / srv-eclick (192.168.25.102) — VM 102 no Proxmox srv-app-01
Rede: `riquest` (overlay, `docker network create --driver overlay --attachable riquest`)
Dominio: `*.riquest.com.br`
Arquivos: `/root/<stack>.yaml` no servidor

**Traefik priority:** servicos publicos (editor, app) usam `priority=10`; servicos internos/webhooks usam `priority=5`.

**Traefik priority:** serviços públicos (editor, app) usam `priority=10`; serviços internos/webhooks usam `priority=5`.

```yaml
version: "3.7"
services:

## --------------------------- ORION --------------------------- ##

  servico:
    image: usuario/imagem:tag ## Descrição

    networks:
      - riquest ## Nome da rede interna

    environment:
      ## PostgreSQL
      - DB_TYPE=postgresdb
      - DB_POSTGRESDB_HOST=postgres
      - DB_POSTGRESDB_PORT=5432
      - DB_POSTGRESDB_USER=postgres
      - DB_POSTGRESDB_PASSWORD=<senha>

      ## Criptografia
      - N8N_ENCRYPTION_KEY=<chave>

      ## URLs e Configuracoes de Acesso
      - SERVICO_HOST=servico.riquest.com.br
      - SERVICO_URL=https://servico.riquest.com.br/

      ## Ambiente de Execucao
      - NODE_ENV=production
      - TZ=America/Sao_Paulo

    volumes:
      - servico_data:/dados

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
        - traefik.http.routers.servico.rule=Host(`servico.riquest.com.br`) ## Descrição
        - traefik.http.routers.servico.entrypoints=websecure
        - traefik.http.routers.servico.priority=10
        - traefik.http.routers.servico.tls.certresolver=letsencryptresolver
        - traefik.http.routers.servico.tls=true
        - traefik.http.routers.servico.service=servico
        - traefik.http.services.servico.loadbalancer.server.port=PORTA
        - traefik.http.services.servico.loadbalancer.passHostHeader=true

## --------------------------- ORION --------------------------- ##

volumes:
  servico_data:
    external: true
    name: servico_data

networks:
  riquest:

```

## 🔍 Check pré-build: imagem existe?

Antes de gerar a stack, verificar se o repositório já tem uma imagem pública ou se precisa ser buildada:

```bash
# 1. Verificar se o repo tem Dockerfile
curl -sI "https://raw.githubusercontent.com/<user>/<repo>/main/Dockerfile" | head -1

# 2. Verificar se publica imagem (GitHub Packages)
curl -s "https://api.github.com/repos/<user>/<repo>/packages?per_page=3"

# 3. Verificar se menciona Docker no README
```

**Resultados possíveis:**
- **Repo oficial Alex (alexbuzatto)**: imagem já existe em `ghcr.io/alexbuzatto/<projeto>` — pular build
- **Repo de terceiros (sem Dockerfile)**: precisa containerizar + buildar do zero
- **Repo de terceiros (com Dockerfile)**: pode adaptar e buildar

> ⚠️ **Nunca assumir que `ghcr.io/alexbuzatto/<projeto>` existe.** Verificar primeiro no GitHub. Se o repositório for de terceiros, o caminho `ghcr.io/alexbuzatto/` só existirá depois de buildar e dar push.

## 🚢 Autenticação no GHCR (push)

Para fazer push da imagem, usar o token do GitHub CLI:

```bash
# Verificar se gh CLI está logado
gh auth status

# Logar Docker no GHCR com o token do gh
echo "$(gh auth token)" | docker login ghcr.io -u alexbuzatto --password-stdin

# Push
```

> O gh CLI já tem escopo `write:packages` necessário para push.

## 🚢 Deploy via Portainer (Alex usa Portainer, não CLI)

O Alex gerencia stacks pelo **Portainer**, não por `docker stack deploy` no terminal.

### Workflow: stack nova via Portainer

1. Acessar o Portainer → **Stacks** → **+ Add stack**
2. **Name:** `<nome-do-projeto>` (ex: `kokoro-tts`)
3. Colar o conteúdo do `docker-stack.yml` no editor
4. ⚠️ **Marcar "Re-pull image before redeploy"** — sem isso, a imagem `:latest` em cache não é atualizada
5. Clicar em **Deploy the stack**

### Workflow: atualizar stack existente

1. Portainer → **Stacks** → clicar no stack
2. **Editor** → **Update the stack**
3. **Marcar ✅ "Re-pull image"** (obrigatório para `:latest` tag)
4. **Update**

> ⚠️ **Armadilha comum:** se não marcar "Re-pull image", o Portainer usa a imagem em cache local e TODAS as correções na imagem (numpy, bugfixes, novos endpoints) ficam invisíveis. Sempre avisar o Alex para marcar essa opção.

### Atualizar imagem via Portainer (versão nova)

Quando houver uma nova tag (ex: `v1.0.0` → `v1.0.1`):

1. Atualizar a tag no `docker-stack.yml`: `image: ghcr.io/alexbuzatto/<projeto>:v1.0.1`
2. No Portainer → **Stacks** → stack do projeto → **Editor**
3. Substituir o YAML pelo novo conteúdo
4. **Update the stack** com ✅ **Re-pull image** marcado
5. O Portainer usa a tag específica, sem ambiguidade de cache

### ⚠️ Armadilha: GHCR packages são PRIVADOS por padrão

**Problema:** Imagens em `ghcr.io/alexbuzatto/<projeto>` são privadas por padrão no GitHub Container Registry. O Swarm/Portainer **não consegue puxar** sem autenticação — o "Re-pull image" falha silenciosamente e o serviço continua na versão antiga.

**Sintoma:** `/health` retorna configuração antiga (ex: `default_voice: af_sarah` em vez de `pf_dora`).

**Soluções (escolher uma):**

| Opção | Como fazer |
|-------|------------|
| **Tornar público (mais simples)** | GitHub → Packages → kokoro-tts → Settings → Change visibility → **Public** |
| **Docker Hub público** | `docker tag ghcr.io/... alexbuzatto/kokoro-tts:v1.0.0 && docker push alexbuzatto/kokoro-tts:v1.0.0` e usar `image: alexbuzatto/kokoro-tts:v1.0.0` |
| **Registry auth no Portainer** | Registries → Add → ghcr.io → user + PAT (read:packages) → associar ao stack |

> ✅ **Recomendação:** tornar o pacote público no GitHub. Zero config, zero credenciais no Swarm.

## ⚠️ Pitfall: variáveis de ambiente some no update do Portainer

**Problema:** Ao atualizar a stack no Portainer, o YAML pode estar incompleto — a seção `environment:` pode estar faltando ou com valores diferentes do arquivo local. O container sobe com os defaults do código (`af_sarah`, `localhost`, etc.) em vez das env vars configuradas.

**Sintoma:** `/health` retorna `default_voice: "af_sarah"` mesmo com `KOKORO_DEFAULT_VOICE=pf_dora` no YAML local.

**Diagnóstico via SSH no servidor:**
```bash
```

Se as env vars não aparecerem, o YAML no Portainer está incompleto.

**Solução:** Substituir TODO o YAML no editor do Portainer (não só ajustar uma linha). Copiar o `docker-stack.yml` completo do projeto local e colar no editor do Portainer.

### 🖥️ Acesso SSH aos servidores (Windows + paramiko)

No Windows, `sshpass` não existe. Usar `paramiko` para conexões SSH com senha:

```python
import paramiko
ssh = paramiko.SSHClient()
ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
ssh.connect('192.168.25.102', username='root', password='<senha>',
            timeout=10, look_for_keys=False, allow_agent=False)
stdin, stdout, stderr = ssh.exec_command('docker ps')
print(stdout.read().decode())
```

**Servidores conhecidos:**

| Servidor | IP | Finalidade | Redes |
|----------|-----|-----------|-------|
| srv-eclick | 192.168.25.102 | Docker Swarm (Portainer, Traefik, stacks) | `eclick`, `riquest` |
| srv-app-02 | 192.168.2.215 | Proxmox (Hermes CTs, sem Docker) | — |

> ⚠️ SSH key auth pode falhar após tentativas de senha inválidas (fail2ban). Usar `paramiko` com `look_for_keys=False, allow_agent=False` para forçar auth por senha.

### 🔍 Verificar se o deploy atualizou (padrão de diagnóstico)

Após o update no Portainer, **sempre testar o endpoint de health**:

```bash
```

**Verificar campos que mudaram na imagem nova:**

| Campo | Indica |
|-------|--------|
| `default_voice` | Variável `KOKORO_DEFAULT_VOICE` aplicada? |
| `model_loaded` | Modelo ONNX carregou? |
| `voices_available` | Número de vozes bate com a imagem? |

Se o health ainda mostrar valores antigos → **a imagem nova NÃO subiu** (cache ou auth GHCR).

## 🧪 Teste local da imagem (antes do deploy)

Sempre testar a imagem localmente antes de enviar pro Swarm:

```bash
# Iniciar container
docker run -d --name <test> ghcr.io/alexbuzatto/<projeto>:latest

# Verificar logs (procura por erros de startup)
docker logs <test>

# Se a imagem depender de volume (ex: modelos), espera-se erro de healthcheck
# — isso não significa que o build falhou

# Limpar
docker kill <test>
```

### 🔧 Variáveis que sempre preciso perguntar/descobrir

| Variável | Onde descobrir | Exemplo |
|----------|---------------|---------|
| `nome do serviço` | Nome do projeto | `noc-backend` |
| `imagem:tag` | ghcr.io/alexbuzatto/<nome> | `ghcr.io/alexbuzatto/noc-backend:v0.1.0` |
| `PORTAS` | Porta que a app escuta (Dockerfile/docs) | `3000`, `8000` |
| `subdominio` | Nome do serviço + domínio | `app.sooretama.es.gov.br` |
| `volumes` | Se precisa persistir dados | `postgres_data` |
| `env vars` | Variáveis de ambiente que a app precisa | `DATABASE_URL`, `REDIS_URL` |
| `replicas` | Quantas instâncias | `1` (padrão manager) |
| **PostgreSQL compartilhado?** | Perguntar ao Alex: "usa PostgreSQL externo ou sobe na stack?" | Se usa ORION, não criar serviço postgres |
| **Seed inicial?** | Verificar se app tem `seed.py` / `create_admin.py` | Se sim, adicionar no entrypoint |
| **Role do admin** | Verificar constraint `chk_users_role` no model | `full` (não `admin`) |

## 🏗️ Build & Push da imagem

Após gerar os arquivos da stack, a imagem precisa ser **buildada e enviada** para o GHCR antes do deploy. Para repos de terceiros (que não têm imagem pré-existente), este passo é **obrigatório**.

### Workflow padrão

```bash
# 1. Build da imagem
cd E:/<projeto>
docker build -t ghcr.io/alexbuzatto/<projeto>:latest .

# 2. Push para o GHCR (autenticar antes se necessário)
```

### Onde buildar

Antes de tentar build, perguntar ao Alex onde fazer:
- **Desktop** (Docker Desktop no Windows) — se estiver rodando
- **Servidor com Docker/Swarm** — alguma máquina na rede que tenha Docker
- **CT no Proxmox** — verificar antes se Docker está instalado

> ⚠️ Não assumir que CT200 ou qualquer servidor tem Docker — confirmar com `docker --version` primeiro.

### Tag versionada (obrigatório — Alex prefere versionamento semântico)

**Sempre** usar tags versionadas (`v1.0.0`, `v1.0.1`, ...). **Não publicar novas versões só com `:latest`.**

```bash
# 1. Build com a nova versão
docker build -t ghcr.io/alexbuzatto/<projeto>:v1.0.1 .

# 2. Opcionalmente também atualizar :latest (para quem ainda usa a tag solta)
docker tag ghcr.io/alexbuzatto/<projeto>:v1.0.1 ghcr.io/alexbuzatto/<projeto>:latest

# 3. Push da tag versionada
docker push ghcr.io/alexbuzatto/<projeto>:v1.0.1

```

**Workflow no Portainer com tags versionadas:**

1. Atualizar `image:` no docker-stack.yml para a nova tag
2. Portainer → Stacks → stack → Editor → colar YAML novo
3. **Update the stack** com ✅ **Re-pull image**
4. O Portainer puxa a tag exata (sem ambiguidade de cache)

## 📋 docker-compose.yml (teste local)

Sempre gerar junto. Estrutura padrão:

```yaml
name: <projeto>

services:
  app:
    build: .
    image: ghcr.io/alexbuzatto/<imagem>:latest
    restart: unless-stopped
    environment:
      - TZ=America/Sao_Paulo
      <env vars>
    ports:
      - "127.0.0.1:<PORTA_HOST>:<PORTA_CONTAINER>"
    volumes:
      - traefik.http.routers.noc-frontend.rule=Host(`noc.riquest.com.br`)
      ```

### 🧠 Lições da sessão kokoro-tts (sempre aplicar)

#### 🔧 Dashboard embutido em FastAPI (HTMLResponse)

Quando a API FastAPI serve um dashboard HTML embutido (via `HTMLResponse`), o JS pode quebrar silenciosamente.

**Padrão de verificação antes de notificar o Alex:**

```bash
# 1. Verificar que IDs do JS existem no HTML servido
curl -s https://<domain>/ | grep -o 'id="[^"]*"' | sort -u

# 2. Verificar endpoints da API (CORS, resposta)
curl -s -I https://<domain>/voices | grep -i access-control
curl -s https://<domain>/voices | python -c "import sys,json; d=json.load(sys.stdin); print(len(d['voices']))"

# 3. Verificar que health retorna config nova
```

**Fixes comuns no server.py:**

| Problema | Fix |
|----------|-----|
| **CORS bloqueando fetch** | Adicionar `CORSMiddleware(allow_origins=["*"])` |
| **Mixed Content (HTTP no HTTPS)** | JS: `const API = window.location.origin` (não `''`) |
| **Aspas JS quebradas** | Usar `&apos;` em vez de escapar `'` em Python triple-quoted strings |
| **DOM element faltando** | Adicionar `<select id="...">` no template HTML |

**Exemplo CORS:**
```python
from fastapi.middleware.cors import CORSMiddleware
```

**Exemplo Mixed Content Fix:**
```javascript
// ❌ Quebra no HTTPS: const API = '';
// ✅ Herda o origin da página (https://domain):
```

#### Modelos/assets pesados vão NA IMAGEM, não em bind mount

❌ **ERRADO:** montar como volume externo esperando que o admin copie arquivos
```yaml
volumes:
  ```

✅ **CERTO:** baixar durante o build do Dockerfile
```dockerfile
RUN mkdir -p /app/models && \
    wget -q -O /app/models/modelo.onnx <URL> && \

```

**Por quê?** O Alex explicitamente disse que modelos devem estar "na stack" —
a imagem precisa ser autossuficiente, sem depender de arquivos soltos no nó Swarm.

> ⚠️ Exceção: volumes para uploads gerados pela aplicação (não assets estáticos de setup)
> continuam como volumes normais.

### Serviços ONNX/ML em CPU (sem GPU)

Para serviços de inferência rodando **apenas em CPU**, sempre adicionar:

```yaml
environment:
  - OMP_NUM_THREADS=1    # alinhado com cpus: "1"
  - ORT_DEFAULT_LOG_LEVEL=WARNING  # menos barulho
  ```

**`NUMBA_CACHE_DIR`** é obrigatório quando o app usa `librosa`, `numba`, ou processamento de áudio (ex: Kokoro TTS) em containers non-root — o cache JIT padrão tenta escrever em diretório sem permissão. Ver `references/kokoro-tts.md` > "Numba cache issue".

**Quando usar:** sempre que o stack tiver `resources.limits.cpus: "1"` e usar ONNX Runtime, TensorFlow, PyTorch ou similar.

### Autenticação GHCR para push

Usar o token do GitHub CLI (já tem escopo `write:packages`):

```bash
```

> Não usar token fixo ou outra conta — o `gh` do Alex já está autenticado com as permissões certas.

### Testar imagem local antes do deploy (com auto-seed)

Quando a aplicacao precisa de um usuario admin inicial (ex: `seed.py`):

1. O seed DEVE ser chamado no `docker-entrypoint.sh` **depois das migrations**
2. O seed DEVE ser idempotente (verificar se usuario ja existe)
3. Sempre testar que o seed roda corretamente:
```bash
docker run -d --name <test> ghcr.io/alexbuzatto/<projeto>:latest
sleep 5
docker logs <test>  # deve mostrar "seeding initial admin user"
```
4. Adicionar ao entrypoint:
```bash
echo "[entrypoint] seeding initial admin user (if not exists)..."
```

```bash
docker run -d --name <test> ghcr.io/alexbuzatto/<projeto>:latest
sleep 5
docker logs <test>        # verificar startup
docker ps --filter name=<test>  # ver se está rodando
```

### Repo sem Dockerfile (só PyPI)

Quando o repositório for um pacote Python sem Dockerfile:

1. Usar **multi-stage build**: primeiro stage instala o pacote pip + build-essential, segundo stage copia só o necessário
2. Baixar modelos/assets no segundo stage (runtime)
3. Criar `server.py` wrapper FastAPI
4. Adicionar healthcheck que valida os modelos

### Script de versionamento automático (build-and-push.sh)

Para garantir versionamento semântico a cada mudança, criar script em `E:/<projeto>/build-and-push.sh`:

```bash
#!/bin/bash
# build-and-push.sh — Build, versiona e push da imagem
# Uso: ./build-and-push.sh [patch|minor|major]

set -e

VERSION_FILE="VERSION"
REGISTRY="ghcr.io/alexbuzatto/<projeto>"

# Lê versão atual
CURRENT=$(cat "$VERSION_FILE")
IFS='.' read -r MAJOR MINOR PATCH <<< "$CURRENT"

# Incrementa conforme argumento
case "${1:-patch}" in
  major) MAJOR=$((MAJOR+1)); MINOR=0; PATCH=0 ;;
  minor) MINOR=$((MINOR+1)); PATCH=0 ;;
  patch|*) PATCH=$((PATCH+1)) ;;
esac

NEW_VERSION="${MAJOR}.${MINOR}.${PATCH}"
TAG="v${NEW_VERSION}"

echo "📦 Versão atual: $CURRENT"
echo "🚀 Nova versão:  $NEW_VERSION ($TAG)"

# Build
docker build -t "${REGISTRY}:${TAG}" -t "${REGISTRY}:latest" .

# Push
docker push "${REGISTRY}:${TAG}"
docker push "${REGISTRY}:latest"

# Atualiza VERSION
echo "$NEW_VERSION" > "$VERSION_FILE"

echo "✅ Feito! Imagem: ${REGISTRY}:${TAG}"
```

**Workflow:**
- Qualquer mudança: `./build-and-push.sh patch` → `v1.0.1` → `v1.0.2`...
- Nova feature: `./build-and-push.sh minor` → `v1.1.0`
- Breaking change: `./build-and-push.sh major` → `v2.0.0`

### Stack Swarm completa v1.0.3+ (padrão produção)

Stack testada com healthcheck, update strategy, resources adequados:

```yaml
version: "3.7"

services:

  app:
    image: ghcr.io/alexbuzatto/<projeto>:v1.0.3

    networks:
      - eclick

    environment:
      - TZ=America/Sao_Paulo
      - OMP_NUM_THREADS=1
      - ORT_DEFAULT_LOG_LEVEL=WARNING
      - NUMBA_CACHE_DIR=/tmp/numba_cache
      <app-specific vars>

    deploy:
      mode: replicated
      replicas: 1

      placement:
        constraints:
          - node.role == manager

      resources:
        limits:
          cpus: "1.5"
          memory: 2048M
        reservations:
          cpus: "0.5"
          memory: 1024M

      restart_policy:
        condition: any

      update_config:
        parallelism: 1
        delay: 10s
        order: start-first

      labels:
        - traefik.enable=true
        - traefik.http.routers.<servico>.rule=Host(`<dominio>`)
        - traefik.http.routers.<servico>.entrypoints=websecure
        - traefik.http.routers.<servico>.priority=10
        - traefik.http.routers.<servico>.tls.certresolver=letsencryptresolver
        - traefik.http.services.<servico>.loadbalancer.server.port=<PORTA>
        - traefik.http.services.<servico>.loadbalancer.passHostHeader=true
        - traefik.docker.network=eclick

networks:
  eclick:

```

**Pontos-chave desta versão:**
- `memory: 2048M` (não 1024M — evita OOM em textos longos)
- `update_config.order: start-first` — novo container sobe antes de derrubar o antigo (zero downtime)
- `healthcheck` no Dockerfile (interval=30s, timeout=10s, start-period=60s)

## 🔥 Diagnóstico de Alta CPU em Serviços Swarm

### Caso real: Traefik com 87.5% CPU por DEBUG log

**Sintoma:** Consumo de CPU de um serviço Swarm anormalmente alto (80-90% de uma vCPU) mesmo sem tráfego intenso.

**Causa mais comum:** `--log.level=DEBUG` + `--accesslog=true`. Cada requisição gera múltiplas linhas de log, consumindo CPU e I/O.

### Diagnóstico

```bash
# 1. Ver top de processos no nó
ps aux --sort=-%cpu | head -10

# 2. Ver args do container
docker service inspect traefik_traefik | python3 -c \
  "import sys,json; d=json.load(sys.stdin); [print(a) for a in d[0]['Spec']['TaskTemplate']['ContainerSpec']['Args'] if 'log.level' in a or 'accesslog' in a]"

# 3. Ver YAML da stack
```

### ⚠️ Armadilha: `docker service update --args` + host-mode ports
```
```

Isso atualiza os args mas o novo container **falha ao iniciar** com `"no suitable node (host-mode port already in use on 1 node)"`. A porta 80/443 ainda está ocupada pelo container antigo — Swarm não mata o antigo antes do novo subir com `mode: host`.

**Workflow correto (3 passos):**

```bash
# 1. EDITAR o YAML da stack
# --log.level=DEBUG → --log.level=ERROR
# --accesslog=true  → --accesslog=false

# 2. REMOVER o serviço (libera portas host-mode)
docker service rm traefik_traefik

# 3. REDEPLOYAR a stack
```

### Valores seguros para Traefik

| Parâmetro | Ruim | Otimizado |
|:---------|:----:|:---------:|
| `--log.level` | `DEBUG` 🔴 | `ERROR` ✅ |
| `--accesslog` | `true` 🔴 | `false` ✅ |
| `--log.format` | `common` 🟡 | `json` ✅ |

**Impacto real:** Traefik caiu de **87.5% → 12.6%** CPU. Load average do nó caiu de **3.46 → 1.14**.

### CLI tools indispensáveis para diagnóstico in-band

```bash
# Serviço está rodando no nó certo?
docker service ps <service> --no-trunc | head -5

# O que o container está fazendo agora?
docker stats --no-stream <container-id>

# Args reais com que o container subiu
docker inspect <container-id> | python3 -c \
  ```

## 🔧 Imagens locais patched para Swarm (quando a imagem upstream não funciona)

Quando um serviço Swarm falha por incompatibilidade na imagem upstream (ex: NumPy X86_V2 em CPU KVM, PyTorch sem SSE4.1), a solução mais rápida é:

## 🌐 Multi-Server OmniRoute Deployment (Two Servers, Same Domain)

**Descoberta crítica (sessão 2026-07-18):** O Alex tem **duas instâncias separadas do OmniRoute** servindo o mesmo domínio `routes.riquest.com.br`:

| Server | IP | Traefik Networks | Domain | Status |
|--------|-----|-----------------|--------|--------|
| **srv-eclick** | 192.168.25.102 | `eclick` + `riquest` | `routes.riquest.com.br` | ✅ Working (DNS points here) |
| **srv-riquest** | 192.168.25.103 | `eclick` only (was missing `riquest`) | `routes.riquest.com.br` | Fixed by adding `riquest` network |

**Key lesson:** When deploying OmniRoute (or any service) behind Traefik on a separate overlay network, **Traefik must watch that network**. The srv-riquest Traefik only watched `eclick`, so it never created the router for OmniRoute on `riquest` network.

**Fix applied:**
```bash
# 1. Add riquest network to Traefik service
docker service update --network-add riquest traefik_traefik

# 2. Update Traefik args to watch both networks
```

---

## 🔧 OmniRoute Stack on srv-riquest (192.168.25.103) — Working Template

**Problema identificado (2026-07-24):** Stack deployada via Portainer mas **Traefik não criava router** — labels não eram lidos porque:
1. Traefik config não tinha arquivo (`/etc/traefik/traefik.yml` vazio)
2. Mas Traefik args incluem `--providers.docker.network=riquest` ✅
3. OmniRoute está na rede `riquest` ✅

**Solução:** O compose precisa do label `traefik.docker.network=riquest` **no serviço** (já tem) + volume `letsencrypt` montado no Traefik (já tem). O que faltava era garantir que o **serviço OmniRoute tem o label correto de rede**.

```yaml
version: "3.7"

services:

## --------------------------- ORION --------------------------- ##

  omniroute:
    image: diegosouzapw/omniroute:latest

    networks:
      - riquest

    environment:
      ## Porta do Servico
      - PORT=20128

      ## Fuso Horario
      - TZ=America/Sao_Paulo

      ## Ambiente de Execucao
      - NODE_ENV=production
      - OMNIROUTE_MEMORY_MB=1024

      ## Secrets (gerados no deploy)
      - JWT_SECRET=${JWT_SECRET}
      - API_KEY_SECRET=${API_KEY_SECRET}
      - INITIAL_PASSWORD=${INITIAL_PASSWORD}
      - NEXT_PUBLIC_BASE_URL=https://routers.riquest.com.br

      ## Redis (obrigatorio)
      - REDIS_URL=redis://omniroute-redis:6379

    volumes:
      - omniroute_data:/app/data

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
        - traefik.http.routers.omniroute.rule=Host(`routers.riquest.com.br`)
        - traefik.http.routers.omniroute.entrypoints=websecure
        - traefik.http.routers.omniroute.priority=5
        - traefik.http.routers.omniroute.tls.certresolver=letsencryptresolver
        - traefik.http.routers.omniroute.service=omniroute
        - traefik.http.services.omniroute.loadbalancer.server.port=20128
        - traefik.http.services.omniroute.loadbalancer.passHostHeader=true
        - traefik.docker.network=riquest

  omniroute-redis:
    image: redis:7-alpine
    networks:
      - riquest
    volumes:
      - omniroute_redis_data:/data
    deploy:
      placement:
        constraints:
          - node.role == manager
      resources:
        limits:
          cpus: "0.5"
          memory: 256M

## --------------------------- ORION --------------------------- ##

volumes:
  omniroute_data:
    external: true
  omniroute_redis_data:
    external: true

networks:
  riquest:
    external: true

```

**Pré-requisitos no servidor:**
```bash
# 1. Criar volumes (se não existirem)
docker volume create omniroute_data
docker volume create omniroute_redis_data

# 2. Gerar secrets
JWT_SECRET=$(openssl rand -base64 48)
API_KEY_SECRET=$(openssl rand -hex 32)
```

**Deploy via Portainer:** Stacks → Add stack → colar YAML → **marcar "Re-pull image"** → Deploy.

## 🔧 Imagens locais patched para Swarm (quando a imagem upstream não funciona)

### Workflow: build local + deploy sem registry

```bash
# 1. Build uma imagem local com o fix em cima da upstream
docker build -t meu-servico-fixed:v1 -f- . <<'DOCKERFILE'
FROM ghcr.io/alexbuzatto/imagem-original:v0.1.1
RUN pip3 install --quiet --force-reinstall "numpy<2"
DOCKERFILE

# 2. Verificar que o fix funciona
docker run --rm meu-servico-fixed:v1 python3 -c "import numpy; print('OK')"

# 3. Remover o serviço antigo (que está em crash loop)
docker service rm meu-servico_servico

# 4. Criar novo serviço apontando para a imagem local
docker service create \
  --name meu-servico_servico \
  --constraint node.role==manager \
  --mount type=volume,source=meu_volume,target=/data \
  --network eclick \
  meu-servico-fixed:v1 \
  ```

### ⚠️ Limitação: nó único

Imagens locais (não pusheadas em registry) só funcionam em Swarm de **nó único** — cada nó Swarm precisa ter a imagem localmente. Em clusters multi-nó, buildar a imagem em todos os nós ou usar um registry local.

### Quando usar

| Cenário | Recomendação |
|:--------|:-------------|
| Nó único Swarm + erro de compatibilidade | 🔧 Imagem local patched (mais rápido) |
| Nó único Swarm + mudança de config (args) | ✏️ Editar YAML + `docker stack deploy` |
| Multi-nó ou deploy via Portainer | 📦 Build + push GHCR com tag versionada |
| Erro de runtime (ex: NumPy X86_V2, PyTorch) | 🔧 Imagem local patched + `docker service rm` + recreate |

### Caso real: qwen3-tts no srv-eclick

O container `ghcr.io/alexbuzatto/qwen3-tts:v0.1.1` falhava com `RuntimeError: NumPy was built with baseline optimizations: (X86_V2)`. Mesmo mudando CPU type da VM para `host`, o container KVM não via SSE4.2.

**Solução:**
```bash
# Dockerfile de 2 linhas
FROM ghcr.io/alexbuzatto/qwen3-tts:v0.1.1
RUN pip3 install --quiet --force-reinstall "numpy<2"

# Build
docker build -t qwen3-tts-fixed:v1 .

# Deploy (remove + create, porque update --image não funciona com imagem local)
docker service rm qwen3-tts_tts
docker service create --name qwen3-tts_tts \
  --constraint node.role==manager \
  --mount type=volume,source=tts_models,target=/models/.cache \
  --env HF_HOME=/models/.cache \
  --env TZ=America/Sao_Paulo \
  --limit-cpu 2 --limit-memory 4g \
  --network eclick \
  qwen3-tts-fixed:v1 \
  ```

**Resultado:** Image build levou ~80s (pip install numpy 1.26), deploy imediato, serviço rodando.

## ❌ Proibido: emojis e Unicode no YAML

O Alex explicitamente disse **"remove os emojs"** — **NÃO** usar emojis nos comentários do YAML nem caracteres Unicode especiais (em dash `—`, `ã`, `ç`, etc.). Manter **ASCII puro**:

```yaml
## CERTO (ASCII puro):
## Banco de Dados
## ERRO (emojis/Unicode):
## 🗄 Banco de Dados
## ERRO (em dash):
```

**Por quê?** O editor web do Portainer pode interpretar mal caracteres Unicode ou o terminal pode quebrar a linha ao copiar.

## ✂️ Pitfall: linhas longas quebram no copy-paste

Toda linha do YAML deve ter no maximo 80 caracteres (preferencial) ou 90 no maximo. Linhas mais longas quebram ao copiar do terminal para o Portainer.

Erros causados no Portainer (sempre associar erro ao diagnostico correto):

| Erro | Causa mais provavel | Diagnostico |
|------|--------------------|-------------|
| YAMLSemanticError: Implicit map keys need to be on a single line | Linha longa quebrou ao copiar, criando nova linha no meio de um mapeamento | `python -c "lines=open('docker-stack.yml').read().split(chr(10)); long=[(i+1,len(l)) for i,l in enumerate(lines) if len(l)>90]; print(long if long else 'OK')"` |
| YAMLSyntaxError: All collection items must start at the same column | Item de lista quebrou em duas linhas ao copiar porque linha > 80 chars | Abrir no Bloco de Notas em vez de copiar do terminal |
| asyncpg.exceptions.InvalidPasswordError: password authentication failed for user | Volume PostgreSQL ja existe com senha DIFERENTE da que esta no YAML | Apagar volume e redeploy, ou ajustar senha no YAML |
| Router Traefik disabled com erro "is not defined" | Backticks faltando no Host() | `docker service inspect` para verificar label real |

Diagnostico completo de YAML antes de deploy:

```bash
python -c "
import yaml
with open('docker-stack.yml','rb') as f:
    raw = f.read()
yaml.safe_load(raw)                      # 1. Validar syntax
tabs = raw.count(b'\\t')                   # 2. Tabs? Ideal: 0
crlf = raw.count(b'\\r\\n')                 # 3. CRLF? Ideal: 0
non_ascii = sum(1 for b in raw if b>127)  # 4. Unicode? Ideal: 0
lines = raw.decode('ascii').split('\\n')
long = sum(1 for l in lines if len(l)>90) # 5. Linhas longas? Ideal: 0
trail = sum(1 for l in lines if l and l[-1]==' ') # 6. Espaços finais? Ideal: 0
print(f'Tabs:{tabs} CRLF:{crlf} NonASCII:{non_ascii} Long>{long} Trail:{trail} OK')
```

Causa raiz: o terminal quebra visualmente a linha (>80 colunas), o usuario copia a linha quebrada como se fossem duas linhas, quebrando o YAML.

SOLUCAO OBRIGATORIA: NAO copiar do terminal. Abrir o arquivo no Bloco de Notas (Botao direito > Abrir com > Bloco de Notas > Ctrl+A > Ctrl+C > cola no Portainer).

```
```
Botao direito -> Abrir com -> Bloco de Notas -> Ctrl+A -> Ctrl+C -> cola no Portainer.

**Regra:** toda linha < 90 chars. Verificar com:
```bash
python -c "
lines = open('docker-stack.yml').read().split('\n')
long = [(i+1,len(l)) for i,l in enumerate(lines) if len(l)>90]
if long: print('MUITO LONGAS:', long)
else: print('OK - max:', max(len(l) for l in lines))
```

## 💡 Ambiente: usar formato LISTA, NAO dict

**Sempre** usar `- KEY=valor` (formato lista), nunca `KEY: valor` (formato dict):

```yaml
## CERTO:
environment:
  - TZ=America/Sao_Paulo
  - DB_HOST=postgres

## ERRADO (Portainer pode rejeitar):
environment:
  TZ: America/Sao_Paulo
  ```

## 💡 Evitar env vars vazias (`KEY=`)

Nao usar variaveis de ambiente com valor vazio (`- MIKROTIK_HOST=`). Se a variavel nao tem valor, simplesmente nao incluir no YAML:

```yaml
## CERTO (so variaveis com valor):
environment:
  - TZ=America/Sao_Paulo
  - DB_HOST=postgres

## ERRADO (vazias podem causar erro no parser do Portainer):
environment:
  - TZ=America/Sao_Paulo
  - MIKROTIK_HOST=
  ```

## 💡 Volumes: `external: true` + `name:`

Volumes persistentes DEVEM ter `external: true` E `name:` com o mesmo nome:

```yaml
volumes:
  dados_app:
    external: true

```

Isso faz o volume aparecer corretamente na interface do Portainer e sobreviver à remoção da stack.

## 💡 Traefik: adicionar `tls=true`

Além do `certresolver`, adicionar o label `tls=true`:

```yaml
labels:
  - traefik.http.routers.app.tls.certresolver=letsencryptresolver
  ```

## 💡 Stacks limpas: sem healthcheck, depends_on, logging

Para stacks do Alex, NÃO incluir:
- `healthcheck:` — ele não usa
- `depends_on:` — redundante no Swarm
- `x-logging:` + `logging: *default-logging` — não faz parte do padrao
- `restart_policy` — implicito no Swarm

## 💡 Usar stacks que funcionam como template EXATO

**NUNCA inventar estrutura propria.** Ao criar uma stack para um novo servico, usar a estrutura exata de uma stack que ja funciona (zerobyte, typebot):

```yaml
  servico:
    image: imagem:tag
    networks:
      - rede_cidade ## Nome da rede interna
    environment:
      - TZ=America/Sao_Paulo
      - KEY=valor
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
        - traefik.http.routers.servico.rule=Host(`dominio.com`)
        - traefik.http.services.servico.loadbalancer.server.port=PORTA
        - traefik.http.routers.servico.service=servico
        - traefik.http.routers.servico.tls.certresolver=letsencryptresolver
        - traefik.http.routers.servico.entrypoints=websecure
    ```

Regras:
- **Copiar a estrutura** de zerobyte/typebot — mesma ordem de keys, mesmo espacamento, mesmos comentarios
- Nao adicionar secoes extras (healthcheck, depends_on, logging)
- Nao mudar ordem dos labels do Traefik
- Nao usar volume bind no servico externo sem confirmacao

## 💡 Secao header no formato exato do Alex

Usar `##` com bordas de `-` para separar secoes:

```yaml
```

- Sempre ASCII puro (sem acentos, sem emojis)
- Nome do servico em MAIUSCULO dentro dos `--`
- Exatamente ` ##` (espaco + dois #) no final

## 💡 Ordem dos labels do Traefik

Seguir o padrao dos stacks que funcionam (typebot, zerobyte):

```yaml
labels:
  - traefik.enable=true
  - traefik.http.routers.<servico>.rule=Host(`<dominio>`)
  - traefik.http.routers.<servico>.entrypoints=websecure
  - traefik.http.routers.<servico>.tls.certresolver=letsencryptresolver
  - traefik.http.services.<servico>.loadbalancer.server.port=<PORTA>
  - traefik.http.routers.<servico>.tls=true
  ```

Para servicos que precisam de passHostHeader, adicionar apos service_port:
```yaml
  ```

## 💡 Copiar do Bloco de Notas, nao do terminal

```
```

## 🔌 Portainer API para Swarm Mode (deploy automatizado)

Quando o Alex pede "instala via Portainer automaticamente" ou precisa atualizar stack programaticamente:

### Autenticação
```python
import requests, json
PORTAINER_URL = "https://painel.riquest.com.br"
auth = requests.post(f"{PORTAINER_URL}/api/auth", json={
    "username": "alexbsbb3@gmail.com",
    "password": "[REDACTED]"
}, verify=False)
token = auth.json()["jwt"]
headers = {"Authorization": f"Bearer {token}"}
```

### Endpoints Swarm (DIFERENTES de standalone)
- **Listar endpoints**: `GET /api/endpoints` → pegar `Id` do endpoint Swarm (Type: 2)
- **Obter Swarm ID**: `GET /api/endpoints/{endpoint_id}/docker/swarm` → `ID` field
- **Listar stacks**: `GET /api/stacks` → filtrar por `Name`
- **Criar stack Swarm**: `POST /api/stacks/create/swarm/string` com body:
  ```json
  {
    "name": "laya",
    "swarmID": "vrij6g2qk0q7u8hhki9dw5b58",
    "stackFileContent": "<YAML completo>",
    "env": [],
    "option": {"prune": false}
  }
  ```
- **Atualizar stack**: `PUT /api/stacks/{stack_id}` com body:
  ```json
  {
    "stackFileContent": "<YAML completo>",
    "env": [],
    "prune": true,
    "pullImage": true
  }
  ```

### ⚠️ Pitfalls da API Portainer
- **`json=` vs `data=json.dumps()`**: Portainer API (Go) falha com `requests.json=payload` em campos `Env` — usar `data=json.dumps(payload)` + `Content-Type: application/json`
- **`prune: true`**: remove serviços que não estão mais no YAML (equivalente a "docker stack deploy --prune")
- **`pullImage: true`**: força re-pull da imagem (equivalente ao checkbox "Re-pull image" no Portainer UI)
- **Swarm ID obrigatório**: criar stack Swarm exige `swarmID` no payload (não é o `endpoint_id`)

### Script template: `portainer-deploy.py`
```python
#!/usr/bin/env python3
import requests, json, sys
requests.packages.urllib3.disable_warnings()

PORTAINER_URL = "https://painel.riquest.com.br"
USERNAME = "alexbsbb3@gmail.com"
PASSWORD = "[REDACTED]"

def get_token():
    r = requests.post(f"{PORTAINER_URL}/api/auth", json={"username": USERNAME, "password": PASSWORD}, verify=False)
    return r.json()["jwt"]

def get_swarm_id(token, endpoint_id):
    r = requests.get(f"{PORTAINER_URL}/api/endpoints/{endpoint_id}/docker/swarm", 
                     headers={"Authorization": f"Bearer {token}"}, verify=False)
    return r.json()["ID"]

def update_stack(token, stack_id, yaml_content):
    payload = {"stackFileContent": yaml_content, "env": [], "prune": True, "pullImage": True}
    r = requests.put(f"{PORTAINER_URL}/api/stacks/{stack_id}", 
                     headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
                     data=json.dumps(payload), verify=False)
    return r.status_code == 200

if __name__ == "__main__":
    token = get_token()
    endpoints = requests.get(f"{PORTAINER_URL}/api/endpoints", headers={"Authorization": f"Bearer {token}"}, verify=False).json()
    endpoint_id = endpoints[0]["Id"]
    swarm_id = get_swarm_id(token, endpoint_id)
    
    stacks = requests.get(f"{PORTAINER_URL}/api/stacks", headers={"Authorization": f"Bearer {token}"}, verify=False).json()
    stack = next((s for s in stacks if s["Name"] == "laya"), None)
    
    with open("docker-stack.yml") as f:
        yaml_content = f.read()
    
    if stack:
        update_stack(token, stack["Id"], yaml_content)
        print(f"Stack {stack['Name']} (ID {stack['Id']}) atualizada")
    else:
        print("Stack não encontrada")
```

## 🖼️ Imagens Node.js para ONNX Runtime / ML

### ⚠️ CRÍTICO: `node:alpine` NÃO funciona com ONNX Runtime
**Problema:** `node:20-alpine` usa musl libc, mas `onnxruntime-node` precisa de glibc (`ld-linux-x86-64.so.2`).
**Sintoma:** `Error loading shared library ld-linux-x86-64.so.2: No such file or directory`
**Solução:** Usar `node:20-slim` (Debian-based) em vez de Alpine.

```yaml
## ERRADO (quebra com ONNX):
image: node:20-alpine

## CERTO (funciona com ONNX):
image: node:20-slim
```

**Regra:** Qualquer stack Node.js que use `onnxruntime-node`, `tensorflow`, `pytorch` ou bibliotecas nativas compiladas → usar `node:20-slim` ou `node:20` (Debian), NUNCA Alpine.

### Pattern: npm install no entrypoint (com volumes)
Quando o `node_modules` está em volume persistente e precisa reinstalar deps:

```yaml
entrypoint: ["/bin/bash", "-c"]
command:
  - |
    cd /app
    rm -rf node_modules package.json package-lock.json
    npm init -y > /dev/null 2>&1
    npm install @receptron/laya express
    exec node /app/server.js
```

**Por quê?** Volumes persistentes de `node_modules` podem ter deps incompatíveis com a nova imagem. `rm -rf` garante install limpo. `exec node` substitui o shell como PID 1 (sinais SIGTERM chegam ao Node).

## 📦 Volumes em uso no Swarm

**Problema:** `docker volume rm` falha com `volume is in use by [container_ids]`.
**Solução:**
1. Remover serviço primeiro: `docker service rm <service_name>`
2. OU usar volumes não-persistentes (sem `external: true`) para dados que podem ser recriados (ex: `node_modules`, `npm_cache`)
3. OU escalar serviço para 0: `docker service scale <service>=0` → remover volume → escalar de volta

**Regra:** Volumes de cache/dependências (`node_modules`, `.npm`, `pip_cache`) NÃO precisam ser `external: true` — podem ser recriados. Volumes de dados do usuário (banco, uploads) DEVEM ser `external: true`.

## 🎯 Regras de estilo

1. **Seja conciso.** Apresentar a stack pronta, sem repetir o YAML completo de volta em explicações. "Fazer baseado no padrão" = gerar a stack no padrão conhecido e mostrar só o essencial.
2. **Identificar o contexto certo primeiro.** Confirmar qual servidor/domínio antes de gerar a stack (cidade_conectada, eclick ou riquest).
3. **Validar a rede overlay.** Sempre verificar se a rede existe no servidor antes de criar o stack. Cada domínio tem sua rede:
   - `sooretama.es.gov.br` → `rede_cidade`
   - `eclicksolucoes.com.br` → `eclick`
   - `riquest.com.br` → `riquest`
4. **Gerar secrets obrigatórias.** Stacks que exigem JWT_SECRET, API keys etc. devem gerar as secrets com `openssl rand` ou `secrets.token_hex` e incluir na stack, não deixar sem valor.
5. **Deploy + verificação.** Sempre testar o serviço após deploy: `docker service ls`, logs, healthcheck.

## 💡 Regras fixas

1. **Networks**: `rede_cidade` (cidade_conectada), `eclick` (eclick) ou `riquest` (riquest), sempre external
2. **Traefik resolver**: `letsencryptresolver` (NÃO `letsencrypt`)
3. **Domínios**: `*.sooretama.es.gov.br`, `*.eclicksolucoes.com.br` ou `*.riquest.com.br`
4. **Imagens**: `ghcr.io/alexbuzatto/<nome>:<tag>` (ou imagem de terceiros)
5. **Manager only**: `node.role == manager`
6. **TZ sempre**: `America/Sao_Paulo`
7. **Versão**: `"3.7"` no stack
8. **Volumes**: `external: true` quando persistente
9. **Variáveis de ambiente**: PostgreSQL e Redis sempre inclusos se o app usar
10. **replicas**: 1 padrão
11. **Volumes**: `external: true` para dados persistentes que sobrevivem à remoção da stack
12. **Senhas/dados sensíveis**: seguir o padrão do projeto (plain env var)
13. **Teste local via docker compose** antes de deploy: verificar healthcheck, logs, e endpoints

### 📦 Volumes e Portainer: `external: true` vs gerenciado pela stack

Duas abordagens para volumes no Portainer:

| Abordagem | YAML | Efeito no Portainer | Dados sobrevivem à remoção da stack? |
|-----------|------|---------------------|--------------------------------------|
| **externo (criar antes)** | `volumes: <vol>: external: true` | Precisa criar o volume manualmente antes (Portainer → Volumes → Add volume). Aparece na lista. | ✅ Sim |
| **gerenciado pela stack** | `volumes: <vol>:` (sem `external`) | Portainer cria automaticamente no deploy. Volume fica vinculado à stack. | ⚠️ Varia — depende da config "remove volumes on stack removal" |

**Recomendação para stacks do Alex:** usar `external: true` + criar os volumes manualmente no Portainer antes do deploy. Isso garante que dados não sejam perdidos se a stack for removida e o volume continua visível/clicável no Portainer.

**Workflow correto:**
```bash
# 1. Criar volumes manualmente (via CLI ou Portainer)
docker volume create noc_pg_data
docker volume create noc_redis_data

# 2. Deploy da stack
```

**Se o Alex pedir "coloca na stack para clicar"** (volumes gerenciáveis sem passo extra), usar **sem `external: true`** para que o Portainer crie os volumes automaticamente no deploy.

### Diferenças entre contextos

| Característica | cidade_conectada | eclick | riquest |
|---|---|---|---|---|
| Servidor | srv-app-02 (192.168.2.215) | srv-eclick (192.168.25.102) | srv-eclick (192.168.25.102) |
| Network | `rede_cidade` (attachable) | `eclick` | **`riquest`** |
| Domínio | `*.sooretama.es.gov.br` | `*.eclicksolucoes.com.br` | `*.riquest.com.br` |
| Traefik priority | SEM (nao usado em sooretama) | 10 | 5 (webhook) ou 10 (editor) |
| passHostHeader | true (typebot tem) | true | true |
| resources.limits | cpus: 1, memory: 1024M | cpus: 1, memory: 1024M | cpus: 1, memory: 1024M |
| restart_policy | implícito | `condition: any` | `condition: any` |
| Nomenclatura env vars | `DB_HOST`, `REDIS_HOST` | `DB_POSTGRESDB_HOST`, `QUEUE_BULL_REDIS_HOST` | igual eclick |
| Section headers | `## --- NOME --- ##` | `######` com bordas | `## ----... ORION ...---- ##` |
| Criação da rede | `docker network create --driver overlay --attachable rede_cidade` | criada pelo stack automático | `docker network create --driver overlay --attachable riquest` |

## ⚠️ Pitfalls

### 🎯 Traefik label: backticks OBRIGATÓRIOS em `Host()`

**Problema:** Labels de rota SEM backticks são silenciosamente rejeitadas pelo Traefik. O router fica **disabled** com erro "X is not defined".
```
❌ Host(dominio.com)           → router DISABLED (erro: is not defined)
```

**Sintoma:** Serviço funciona internamente (healthcheck OK, responde na rede overlay) mas retorna `404 page not found` via HTTPS/Traefik.

**No Traefik API (`:8080/api/http/routers/<router>@swarm`):**
```json
{"error": ["error while parsing rule Host(dominio.com): dominio.com is not defined"],
 - traefik.http.routers.noc-frontend.rule=Host(`noc.riquest.com.br`)
 ```

**Debug rápido — listar todos os routers e status:**
```bash
curl -sk http://127.0.0.1:8080/api/http/routers | python3 -c "
import sys,json
for r in json.load(sys.stdin):
    status = r['status']
    name = r['name']
    rule = r.get('rule','?')
    print(f'{status:8} {name:40} rule={rule}')
    if 'error' in r:
        print(f'        ERRO: {r[\"error\"]}')
```

**Comparar label do serviço quebrado vs um que funciona:**
```bash
docker service inspect <quebrado> --format '{{json .Spec.Labels}}' | \
  python3 -c "import sys,json; d=json.load(sys.stdin); [print(k,v) for k,v in d.items() if 'rule' in k]"
docker service inspect n8n_n8n_editor --format '{{json .Spec.Labels}}' | \
  ```

**Corrigir label via Docker API (quando shell come os backticks):**

`docker service update --label-add` processa o valor pelo shell, que interpreta crases como substituição de comando e as remove. Solução: usar a Docker API via unix socket com arquivo JSON:

```bash
# 1. Pegar spec atual
curl -s --unix-socket /var/run/docker.sock \
  http://localhost/v1.48/services/<servico> > /tmp/spec.json

# 2. Editar rule com backtick puro (chr(96))
python3 -c "
import json
bt = chr(96)
with open('/tmp/spec.json') as f:
    d = json.load(f)
d['Spec']['Labels']['traefik.http.routers.<servico>.rule'] = f'Host({bt}dominio.com{bt})'
with open('/tmp/spec.fixed.json', 'w') as f:
    json.dump(d['Spec'], f)
"

# 3. Update (--data @file evita shell expansion)
version=$(python3 -c "import json; print(json.load(open('/tmp/spec.json'))['Version']['Index'])")
curl -s -X POST --unix-socket /var/run/docker.sock \
  "http://localhost/v1.48/services/<servico>/update?version=$version" \
  -H "Content-Type: application/json" \
  ```

**Por que isso acontece:** No YAML, `Host(\`dominio.com\`)` é um plain scalar — as crases são literais. Mas se o Portainer, shell, ou processo de deploy interpretar as crases como substituição de comando, elas são removidas e o label vira `Host(dominio.com)`. Sempre verificar o label real no serviço com `docker service inspect` depois do deploy.

- NOVO stack usa `version: "3.7"` (não `3.9`) — pegadinha comum
- Traefik usa `letsencryptresolver` com `r` no final, NÃO `letsencrypt`
- Rede é `rede_cidade`, não `noc_net`
- Volumes declarados como `external: true` não são criados pelo stack — precisam existir antes
- Se o repositório já tiver Dockerfile, adaptar em vez de criar do zero
- Verificar se a app precisa de build multi-stage para runtime menor
- **Repos de terceiros NÃO têm imagem no GHCR do Alex** — `ghcr.io/alexbuzatto/<projeto>` precisa ser BUILDADA primeiro, não está pré-publicada
> ⚠️ Não tentar build cego em servidores — verificar se Docker está disponível antes (`docker --version`), especialmente em CTs Alpine no Proxmox (que geralmente não têm Docker)
> ⚠️ **Builds com compilação de numpy levam 3-6 minutos** — usar `background=true + notify_on_complete=true` no terminal, pois o timeout máximo foreground é 600s
> ⚠️ **Tag da imagem no compose/stack DEVE bater com a tag buildada** — Se você builda `:latest` mas o `docker-compose.yml` ou `docker-stack.yml` referencia `:v0.1.0`, o Docker usa a imagem antiga (que já existe com aquela tag) e o container fica "unhealthy" ou com código desatualizado. **Sempre verificar/atualizar as 3 tags:** comando `docker build -t`, `docker-compose.yml`, `docker-stack.yml`. Sintoma clássico: o build termina OK mas o container não reflete as mudanças.
- **Sempre oferecer build + push depois de criar os arquivos** da stack, especialmente para projetos de terceiros sem imagem pública
- **Erro: "No log line matching the '' filter"** — Ao rodar `docker service logs <serviço>`, esse erro indica que o container nunca iniciou (crashou imediatamente). Causas comuns, diagnóstico e solução detalhados em `references/deploy-diagnostics.md`.
  - Volume/path de modelos ou dados não existe no nó Swarm (ex: `/data/kokoro-models/`)
  - Variável de ambiente obrigatória faltando
  - Imagem não encontrada (não foi buildada/pushada)
  - Comando/entrypoint falhou
  **Diagnóstico**: checar com `docker service ps <serviço>` qual nó está rodando e ver o erro real. Se aparecer "rejected" ou "failed", o motivo está na coluna ERROR.
- **Container com healthcheck falhando não morre** — O healthcheck marca como "unhealthy" mas o container continua rodando. O serviço só reinicia se o healthcheck estiver configurado com `restart: always` ou similar.
- **NumPy wheel falha em CPUs antigas (Proxmox CTs)** — `RuntimeError: NumPy was built with baseline optimizations: (X86_V2) but your machine doesn't support`. Solução completa em `references/numpy-x86-v2.md`. **Resumo:** no builder stage usar `pip install --no-cache-dir --no-binary numpy -Csetup-args=-Dcpu-baseline=` (último parâmetro = string vazia). **NÃO usar `NPY_BASELINE_OVERRIDE`** — não funciona no numpy 2.x com Meson. Tudo num ÚNICO pip install pra evitar que pip sobrescreva o numpy compilado. Build leva 3-6 minutos a mais. Sempre fazer quando a imagem usar numpy-dependente e for rodar em servidor com CPU mais antiga (comum em CTs Alpine no Proxmox).
- **PyTorch é INCOMPATÍVEL com CPUs virtuais sem SSE4.1/AVX** — Containers que usam PyTorch 2.x falham com `RuntimeError: could not create a primitive` em servidores com CPU virtual que não expõe SSE4.1+AVX (comum em Proxmox com CPU tipo `qemu64`/`kvm64` sem `host` passthrough). **ONNX Runtime NÃO tem esse problema** — funciona com SSE/SSE2 básico. **Diagnóstico:** rodar `cat /proc/cpuinfo | grep flags` e verificar se `sse4_1`, `sse4_2`, `avx` estão presentes. **Soluções:** (1) usar imagem baseada em ONNX Runtime em vez de PyTorch, (2) mudar tipo de CPU no Proxmox para `host` (expõe instruções reais da CPU física), ou (3) adicionar flags explícitas na config da VM. Exemplo real: Kokoro-FastAPI (remsky, PyTorch 2.8.0) falhou no srv-eclick (Common KVM processor, só SSE/SSE2) — mesmo funcionando perfeitamente no Desktop. **Regra:** antes de deployar container ML/PyTorch, sempre verificar flags de CPU do destino com `cat /proc/cpuinfo | grep flags`.
- **Numba JIT cache em containers non-root** — `RuntimeError: cannot cache function '__o_fold': no locator available for file`. O `librosa` (usado por `kokoro-onnx`) aciona o JIT do numba, que tenta cachear no diretório do site-packages (sem permissão como non-root). **Solução:** definir `NUMBA_CACHE_DIR=/tmp/numba_cache` nas env vars do container. Sempre adicionar em stacks que envolvam áudio/ML com `librosa` ou `numba`.
- **Aspas escapadas em JS dentro de Python triple-quoted strings** — `\\''` dentro de `DASHBOARD_HTML = """..."""` vira `\\'\\'` no HTML, quebrando JavaScript inteiro. **Solução:** usar `&apos;` (entidade HTML) em vez de tentar escapar aspas simples. Exemplo: `onclick="previewVoice(&apos;'+v+'&apos;)"` em vez de `onclick="previewVoice(\\''+v+'\\')"`. Verificar sempre o HTML servido com `curl` pra confirmar que as aspas estão corretas.
- **JavaScript falha silenciosa quando DOM element não existe** — Se o JS chama `document.getElementById('voice')` mas não existe `<select id="voice">` no HTML, o `init()` lança erro e todo o dashboard fica vazio sem mensagem de erro visível. **Diagnóstico:** abrir DevTools (F12) → Console pra ver erros. **Solução:** verificar que todos os IDs referenciados no JS existem no HTML. Se faltar um select, adicionar o `<select id="..."></select>` no template.
- **Deploy via SSH quando Portainer não atualiza** — Se o update no Portainer não funciona (imagem privada, cache, etc.), deployar direto via SSH: `docker service update --image ghcr.io/...:<tag> <service_name>`. Funciona como alternativa ao Portainer quando o serviço já existe.
- **`name:` no topo do compose não é suportado no Swarm** — `docker stack deploy` rejeita a propriedade `name:` no nível raiz do docker-compose.yml (erro: "Additional property name is not allowed"). Remover `name:` antes de usar com `docker stack deploy`. O `docker-compose.yml` local pode ter `name:` normalmente para `docker compose up`.
- **SEMPRE confirmar a rede quando o domínio é novo** — O Alex tem 3 domínios (`sooretama.es.gov.br`, `eclicksolucoes.com.br`, `riquest.com.br`). Cada um tem sua própria rede overlay: `rede_cidade`, `eclick` e `riquest` respectivamente. Para domínios fora dos 3 conhecidos, PERGUNTAR a rede antes de assumir.
- **GHCR login remoto via paramiko** — Quando a imagem é privada no GHCR e o servidor não tem credenciais, fazer login via SSH usando o token do gh CLI:
  ```python
  import subprocess, paramiko
  gh_token = subprocess.run(['gh', 'auth', 'token'], capture_output=True, text=True).stdout.strip()
  ssh = paramiko.SSHClient()
  ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
  ssh.connect('192.168.25.102', username='root', password='<senha>', ...)
  login_cmd = f'echo {gh_token} | docker login ghcr.io -u alexbuzatto --password-stdin'
  stdin, stdout, stderr = ssh.exec_command(login_cmd)
  ```
  > Funciona porque o `gh auth token` gera PAT com escopo `read:packages` + `write:packages`. O login persiste no servidor.
- **Verificar HTML servido antes de deploy** — Sempre testar o conteúdo HTML/JS servido com `curl` antes de notificar ao Alex que está pronto. O erro pode estar no JS embutido (aspas escapadas, IDs faltando no DOM) e não na imagem. Padrão de verificação:
  ```bash
  # Verificar que IDs do JS existem no HTML
  curl -s https://<domain>/ | grep -o 'id="[^"]*"' | sort -u
  
  # Verificar endpoints da API
  curl -s https://<domain>/voices | python -c "import sys,json; d=json.load(sys.stdin); print(len(d['voices']))"
  
  # Verificar que health retorna config nova
  ```
