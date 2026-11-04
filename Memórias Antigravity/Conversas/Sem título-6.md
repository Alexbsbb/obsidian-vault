---
tags: [antigravity-conversa]
data: ""
steps: 3424
fonte: Antigravity
---

# Sem título

> Accessing GHCR Credentials


## Mensagens do usuário

pode me passar a senha do ghcr.io/alexbuzatto
pode me mandar a stack tambem
preciso atualizar a stack chatwoot-production com esses dados, substituir por esses, como por exemplo senha de banco
version: "3.7"

services:



## --------------------------- ORION --------------------------- ##



  chatwoot_app:

    image: chatwoot/chatwoot:latest ## VersÃ£o do Chatwoot

    command: >

     sh -c "echo 'Rails.application.config.active_storage.variant_processor = :mini_magick' > /app/config/initializers/active_storage.rb && bundle exec rails db:chatwoot_prepare && bundle exec rails s -p 3000 -b 0.0.0.0"

    entrypoint: docker/entrypoints/rails.sh    



    volumes:

      - chatwoot_storage:/app/storage ## Arquivos de conversa

      - chatwoot_public:/app/public ## Arquivos de logos

      - chatwoot_mailer:/app/app/views/devise/mailer ## Arquivos de email

      - chatwoot_mailers:/app/app/views/mailers ## Arquivos de emails



    networks:

      - eclick ## Nome da rede interna

    

    environment:

    ## ðŸ¢ Nome da Empresa

      - INSTALLATION_NAME=srv-eclick



    ## ðŸ” Secret key

      - SECRET_KEY_BASE=fdceee53290992293fd29603c373cd2f



    ## ðŸ’¬ Url Chatwoot

      - FRONTEND_URL=https://unichat.eclicksolucoes.com.br

      #- CHATWOOT_HUB_URL=https://unichat.eclicksolucoes.com.br

      - FORCE_SSL=true



    ## ðŸŒ Idioma/LocalizaÃ§Ã£o padrÃ£o

      - DEFAULT_LOCALE=pt_BR

      - TZ=America/Sao_Paulo



    ## â˜ï¸ Google Cloud - Modifique de acordo com os seus dados

      #- GOOGLE_OAUTH_CLIENT_ID=369777777777-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com

      #- GOOGLE_OAUTH_CLIENT_SECRET=ABCDEF-GHijklmnoPqrstuvwX-yz1234567

      #- GOOGLE_OAUTH_CALLBACK_URL=https://<your-server-domain>/omniauth/google_oauth2/callback



    ## ðŸ” Facebook e Instagram

      #- IG_VERIFY_TOKEN=

      #- FB_VERIFY_TOKEN=

      #- FB_APP_SECRET=

      #- FB_APP_ID=



    ## ðŸ§‘â€ðŸ’» Dados do Redis

      - REDIS_URL=redis://chatwoot_redis:6379



    ## ðŸ—„ï¸ Dados do Postgres

      - POSTGRES_HOST=pgvector

      - POSTGRES_USERNAME=postgres

      - POSTGRES_PASSWORD=0cfde4fe45c8b679cfd16983daa4b7bc ## Senha do postgres

      - POSTGRES_DATABASE=chatwoot



    ## ðŸ  Armazenamento

      - ACTIVE_STORAGE_SERVICE=local ## use s3_compatible para MinIO

      #- STORAGE_BUCKET_NAME=chatwoot

      #- STORAGE_ACCESS_KEY_ID=ACCESS_KEY_MINIO

      #- STORAGE_SECRET_ACCESS_KEY=SECRET_KEY_MINIO

      #- STORAGE_REGION=eu-south

      #- STORAGE_ENDPOINT=https://s3.DOMINIO.COM

      #- STORAGE_FORCE_PATH_STYLE=true



    ## ðŸ“§ Dados do SMTP

      - MAILER_SENDER_EMAIL=alexbsbb3@gmail.com <alexbsbb3@gmail.com> ## Email SMTP

      - SMTP_DOMAIN=gmail.com ## Dominio do email

      - SMTP_ADDRESS=smtp.gmail.com ## Host SMTP

      - SMTP_PORT=465 ## Porta SMTP

      - SMTP_SSL=true ## Se a porta for 465 = true | Se a porta for 587 = false

      - SMTP_USERNAME=alexbsbb3@gmail.com ## Usuario SMTP

      - SMTP_PASSWORD=ooqd cklm qfdf ecwk ## Senha do SMTP

      - SMTP_AUTHENTICATION=login

      - SMTP_ENABLE_STARTTLS_AUTO=true

      - SMTP_OPENSSL_VERIFY_MODE=peer

      - MAILER_INBOUND_EMAIL_DOMAIN=alexbsbb3@gmail.com ## Email SMTP



    ## âš™ï¸ Melhorias

      - SIDEKIQ_CONCURRENCY=10

      - RACK_TIMEOUT_SERVICE_TIMEOUT=0

      - RAILS_MAX_THREADS=5

      - WEB_CONCURRENCY=2

      - ENABLE_RACK_ATTACK=false



    ## âš¡ Outras configuraÃ§Ãµes

      - NODE_ENV=production

      - RAILS_ENV=production

      - INSTALLATION_ENV=docker

      - RAILS_LOG_TO_STDOUT=true

      - USE_INBOX_AVATAR_FOR_BOT=true

      - ENABLE_ACCOUNT_SIGNUP=false



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

        - traefik.http.routers.chatwoot_app.rule=Host(`unichat.eclicksolucoes.com.br`)

        - traefik.http.routers.chatwoot_app.entrypoints=websecure

        - traefik.http.routers.chatwoot_app.tls.certresolver=letsencryptresolver

        - traefik.http.routers.chatwoot_app.priority=1

        - traefik.http.routers.chatwoot_app.service=chatwoot_app

        - traefik.http.services.chatwoot_app.loadbalancer.server.port=3000

        - traefik.http.services.chatwoot_app.loadbalancer.passHostHeader=true

        - traefik.http.middlewares.sslheader.headers.customrequestheaders.X-Forwarded-Proto=https

        - traefik.http.routers.chatwoot_app.middlewares=sslheader



## --------------------------- ORION --------------------------- ##



  chatwoot_sidekiq:

    image: chatwoot/chatwoot:latest ## VersÃ£o do Chatwoot

    command: bundle exec sidekiq -C config/sidekiq.yml



    volumes:

      - chatwoot_storage:/app/storage ## Arquivos de conversa

      - chatwoot_public:/app/public ## Arquivos de logos

      - chatwoot_mailer:/app/app/views/devise/mailer ## Arquivos de email

      - chatwoot_mailers:/app/app/views/mailers ## Arquivos de emails



    networks:

      - eclick ## Nome da rede interna



    environment:

    ## ðŸ¢ Nome da Empresa

      - INSTALLATION_NAME=srv-eclick



    ## ðŸ” Secret key

      - SECRET_KEY_BASE=fdceee53290992293fd29603c373cd2f



    ## ðŸ’¬ Url Chatwoot

      - FRONTEND_URL=https://unichat.eclicksolucoes.com.br

      #- CHATWOOT_HUB_URL=https://unichat.eclicksolucoes.com.br

      - FORCE_SSL=true



    ## ðŸŒ Idioma/LocalizaÃ§Ã£o padrÃ£o

      - DEFAULT_LOCALE=pt_BR

      - TZ=America/Sao_Paulo



    ## â˜ï¸ Google Cloud - Modifique de acordo com os seus dados

      #- GOOGLE_OAUTH_CLIENT_ID=369777777777-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com

      #- GOOGLE_OAUTH_CLIENT_SECRET=ABCDEF-GHijklmnoPqrstuvwX-yz1234567

      #- GOOGLE_OAUTH_CALLBACK_URL=https://<your-server-domain>/omniauth/google_oauth2/callback



    ## ðŸ” Facebook e Instagram

      #- IG_VERIFY_TOKEN=

      #- FB_VERIFY_TOKEN=

      #- FB_APP_SECRET=

      #- FB_APP_ID=



    ## ðŸ§‘â€ðŸ’» Dados do Redis

      - REDIS_URL=redis://chatwoot_redis:6379



    ## ðŸ—„ï¸ Dados do Postgres

      - POSTGRES_HOST=pgvector

      - POSTGRES_USERNAME=postgres

      - POSTGRES_PASSWORD=0cfde4fe45c8b679cfd16983daa4b7bc ## Senha do postgres

      - POSTGRES_DATABASE=chatwoot



    ## ðŸ  Armazenamento

      - ACTIVE_STORAGE_SERVICE=local ## use s3_compatible para MinIO

      #- STORAGE_BUCKET_NAME=chatwoot

      #- STORAGE_ACCESS_KEY_ID=ACCESS_KEY_MINIO

      #- STORAGE_SECRET_ACCESS_KEY=SECRET_KEY_MINIO

      #- STORAGE_REGION=eu-south

      #- STORAGE_ENDPOINT=https://s3.DOMINIO.COM

      #- STORAGE_FORCE_PATH_STYLE=true



    ## ðŸ“§ Dados do SMTP

      - MAILER_SENDER_EMAIL=alexbsbb3@gmail.com <alexbsbb3@gmail.com> ## Email SMTP

      - SMTP_DOMAIN=gmail.com ## Dominio do email

      - SMTP_ADDRESS=smtp.gmail.com ## Host SMTP

      - SMTP_PORT=465 ## Porta SMTP

      - SMTP_SSL=true ## Se a porta for 465 = true | Se a porta for 587 = false

      - SMTP_USERNAME=alexbsbb3@gmail.com ## Usuario SMTP

      - SMTP_PASSWORD=ooqd cklm qfdf ecwk ## Senha do SMTP

      - SMTP_AUTHENTICATION=login

      - SMTP_ENABLE_STARTTLS_AUTO=true

      - SMTP_OPENSSL_VERIFY_MODE=peer

      - MAILER_INBOUND_EMAIL_DOMAIN=alexbsbb3@gmail.com ## Email SMTP



    ## âš™ï¸ Melhorias

      - SIDEKIQ_CONCURRENCY=10

      - RACK_TIMEOUT_SERVICE_TIMEOUT=0

      - RAILS_MAX_THREADS=5

      - WEB_CONCURRENCY=2

      - ENABLE_RACK_ATTACK=false



    ## âš¡ Outras configuraÃ§Ãµes

      - NODE_ENV=production

      - RAILS_ENV=production

      - INSTALLATION_ENV=docker

      - RAILS_LOG_TO_STDOUT=true

      - USE_INBOX_AVATAR_FOR_BOT=true

      - ENABLE_ACCOUNT_SIGNUP=false



    deploy:

      mode: replicated

      replicas: 1

      placement:

        constraints:

          - node.role == manager

      resources:

        limits:

       
