---
tags: [antigravity-conversa]
data: ""
steps: 1240
fonte: Antigravity
---

# Sem título

> Início De Projeto Colaborativo


## Mensagens do usuário

opa, vamos trabalhar nesse projeto?
preciso que faça um poll do repositorio
agora preciso iniciar ele local, gerar um build e enviar para o docker desktop, e fazer um push, para eu conseguir fazer o deploy dele no portainer em um outro servidor, conforme minha estrutura, vou te passar o modelo de minha estrutura para que possa criar a stack yaml conforme meu padrao
version: "3.7"

services:



## --------------------------- ORION --------------------------- ##



  n8n_editor:

    image: n8nio/n8n:latest ## Versão do N8N

    command: start



    networks:

      - riquest ## Nome da rede interna



    environment:

    ## 🗄️ Banco de Dados (PostgreSQL)

      - N8N_FIX_MIGRATIONS=true 

      - DB_TYPE=postgresdb

      - DB_POSTGRESDB_DATABASE=n8n_queue

      - DB_POSTGRESDB_HOST=postgres

      - DB_POSTGRESDB_PORT=5432

      - DB_POSTGRESDB_USER=postgres

      - DB_POSTGRESDB_PASSWORD=ceaab78bac269316f947ac2c0112e06d



    ## 🔐 Criptografia

      - N8N_ENCRYPTION_KEY=a9da65950ce9c835824f9f3b8ac72997



      ## 🌐 URLs e Configurações de Acesso

      - N8N_HOST=rn8n.riquest.com.br

      - N8N_EDITOR_BASE_URL=https://rn8n.riquest.com.br/

      - WEBHOOK_URL=https://webhookn8n.riquest.com.br/

      - N8N_PROTOCOL=https

      - N8N_PROXY_HOPS=1

      - N8N_ONBOARDING_FLOW_DISABLED=true

      - N8N_BLOCK_ENV_ACCESS_IN_NODE=false

      - N8N_SKIP_AUTH_ON_OAUTH_CALLBACK=false



    ## ⚙️ Ambiente de Execução

      - NODE_ENV=production

      - EXECUTIONS_MODE=queue

      - EXECUTIONS_TIMEOUT=3600

      - EXECUTIONS_TIMEOUT_MAX=7200

      - OFFLOAD_MANUAL_EXECUTIONS_TO_WORKERS=true

      - N8N_RUNNERS_ENABLED=true

      - N8N_RUNNERS_MODE=internal

      - N8N_RESTRICT_FILE_ACCESS_TO="~/.n8n-files"

      - NODES_EXCLUDE="[]"



    ## 📦 Pacotes e Nós Comunitários

      - N8N_REINSTALL_MISSING_PACKAGES=true

      - N8N_COMMUNITY_PACKAGES_ENABLED=true

      - N8N_NODE_PATH=/home/node/.n8n/nodes

      - N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=true



    ## 📧 SMTP (Envio de E-mails)

      - N8N_SMTP_SENDER=alexbsbb3@gmail.com

      - N8N_SMTP_USER=alexbsbb3@gmail.com

      - N8N_SMTP_PASS=ooqd cklm qfdf ecwk

      - N8N_SMTP_HOST=smtp.gmail.com

      - N8N_SMTP_PORT=465

      - N8N_SMTP_SSL=true



    ## 🔁 Redis (Fila de Execução)

      - QUEUE_BULL_REDIS_HOST=n8n_redis

      - QUEUE_BULL_REDIS_PORT=6379

      - QUEUE_BULL_REDIS_DB=1



    ## 📊 Métricas

      - N8N_METRICS=true



    ## ⏱️ Execuções e Limpeza

      - EXECUTIONS_DATA_PRUNE=true

      - EXECUTIONS_DATA_MAX_AGE=336



    ## 🧠 Recursos de IA

      - N8N_AI_ENABLED=false

      - N8N_AI_PROVIDER=openai

      - N8N_AI_OPENAI_API_KEY=



    ## 🧰 Permissões em Funções Personalizadas

      - NODE_FUNCTION_ALLOW_BUILTIN=*

      - NODE_FUNCTION_ALLOW_EXTERNAL=moment,lodash



    ## 🕒 Fuso Horário

      - GENERIC_TIMEZONE=America/Sao_Paulo

      - TZ=America/Sao_Paulo

      #- N8N_DEFAULT_LOCALE=pt-BR



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

        - traefik.http.routers.n8n_editor.rule=Host(`rn8n.riquest.com.br`) ## Url do Editor do N8N

        - traefik.http.routers.n8n_editor.entrypoints=websecure

        - traefik.http.routers.n8n_editor.priority=10

        - traefik.http.routers.n8n_editor.tls.certresolver=letsencryptresolver

        - traefik.http.routers.n8n_editor.service=n8n_editor

        - traefik.http.services.n8n_editor.loadbalancer.server.port=5678

        - traefik.http.services.n8n_editor.loadbalancer.passHostHeader=1



## --------------------------- ORION --------------------------- ##



  n8n_webhook:

    image: n8nio/n8n:latest ## Versão do N8N

    command: webhook



    networks:

      - riquest ## Nome da rede interna



    environment:

    ## 🗄️ Banco de Dados (PostgreSQL)

      - N8N_FIX_MIGRATIONS=true 

      - DB_TYPE=postgresdb

      - DB_POSTGRESDB_DATABASE=n8n_queue

      - DB_POSTGRESDB_HOST=postgres

      - DB_POSTGRESDB_PORT=5432

      - DB_POSTGRESDB_USER=postgres

      - DB_POSTGRESDB_PASSWORD=ceaab78bac269316f947ac2c0112e06d



    ## 🔐 Criptografia

      - N8N_ENCRYPTION_KEY=a9da65950ce9c835824f9f3b8ac72997



      ## 🌐 URLs e Configurações de Acesso

      - N8N_HOST=rn8n.riquest.com.br

      - N8N_EDITOR_BASE_URL=https://rn8n.riquest.com.br/

      - WEBHOOK_URL=https://webhookn8n.riquest.com.br/

      - N8N_PROTOCOL=https

      - N8N_PROXY_HOPS=1

      - N8N_ONBOARDING_FLOW_DISABLED=true

      - N8N_BLOCK_ENV_ACCESS_IN_NODE=false

      - N8N_SKIP_AUTH_ON_OAUTH_CALLBACK=false



    ## ⚙️ Ambiente de Execução

      - NODE_ENV=production

      - EXECUTIONS_MODE=queue

      - EXECUTIONS_TIMEOUT=3600

      - EXECUTIONS_TIMEOUT_MAX=7200

      - OFFLOAD_MANUAL_EXECUTIONS_TO_WORKERS=true

      - N8N_RUNNERS_ENABLED=true

      - N8N_RUNNERS_MODE=internal

      - N8N_RESTRICT_FILE_ACCESS_TO="~/.n8n-files"

      - NODES_EXCLUDE="[]"



    ## 📦 Pacotes e Nós Comunitários

      - N8N_REINSTALL_MISSING_PACKAGES=true

      - N8N_COMMUNITY_PACKAGES_ENABLED=true

      - N8N_NODE_PATH=/home/node/.n8n/nodes

      - N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=true



    ## 📧 SMTP (Envio de E-mails)

      - N8N_SMTP_SENDER=alexbsbb3@gmail.com

      - N8N_SMTP_USER=alexbsbb3@gmail.com

      - N8N_SMTP_PASS=ooqd cklm qfdf ecwk

      - N8N_SMTP_HOST=smtp.gmail.com

      - N8N_SMTP_PORT=465

      - N8N_SMTP_SSL=true



    ## 🔁 Redis (Fila de Execução)

      - QUEUE_BULL_REDIS_HOST=n8n_redis

      - QUEUE_BULL_REDIS_PORT=6379

      - QUEUE_BULL_REDIS_DB=1



    ## 📊 Métricas

      - N8N_METRICS=true



    ## ⏱️ Execuções e Limpeza

      - EXECUTIONS_DATA_PRUNE=true

      - EXECUTIONS_DATA_MAX_AGE=336



    ## 🧠 Recursos de IA

      - N8N_AI_ENABLED=false

      - N8N_AI_PROVIDER=openai

      - N8N_AI_OPENAI_API_KEY=



    ## 🧰 Permissões em Funções Personalizadas

      - NODE_FUNCTION_ALLOW_BUILTIN=*

      - NODE_FUNCTION_ALLOW_EXTERNAL=moment,lodash



    ## 🕒 Fuso Horário

      - GENERIC_TIMEZONE=America/Sao_Paulo

      - TZ=America/Sao_Paulo

      #- N8N_DEFAULT_LOCALE=pt-BR

      

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

        - traefik.http.routers.n8n_webhook.rule=Host(`webhookn8n.riquest.com.br`) ## Url do Webhook do N8N

        - traefik.http.routers.n8n_webhook.entrypoints=websecure

        - traefik.http.routers.n8n_webhook.priority=5

        - traefik.http.routers.n8n_webhook.tls.certresolver=letsencryptresolver

        - traefik.http.routers.n8n_webhook.service=n8n_webhook

        - traefik.http.services.n8n_webhook.loadbalancer.server.port=5678

        - traefik.http.services.n8n_webhook.loadbalancer.passHostHeader=1



## --------------------------- ORION --------------------------- ##



  n8n_worker:

    image: n8nio/n8n:latest ## Versão do N8N

    command: worker --concurrency=10



    networks:

      - riquest ## Nome da rede interna



    environment:

    ## 🗄️ Banco de Dados (PostgreSQL)

      - N8N_FIX_MIGRATIONS=true 

      - DB_TYPE=postgresdb

      - DB_POSTGRESDB_DATABASE=n8n_queue

      - DB_POSTGRESDB_HOST=postgres

      - DB_POSTGRESDB_PORT=5432

      - DB_POSTGRESDB_USER=postgres

      - DB_POSTGRESDB_PASSWORD=ceaab78bac269316f947ac2c0112e06d



    ## 🔐 Criptografia

      - N8N_ENCRYPTION_KEY=a9da65950ce9c835824f9f3b8ac72997



      ## 🌐 URLs e Configurações de Acesso

      - N8N_HOST=rn8n.riquest.com.br

      - N8N_EDITOR_BASE_URL=https://rn8n.riquest.com.br/

      - WEBHOOK_URL=https://webhookn8n.riquest.com.br/

      - N8N_PROTOCOL=https

      - N8N_PROXY_HOPS=1

      - N8N_ONBOARDING
