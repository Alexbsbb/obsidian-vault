---
tags: [antigravity-conversa]
data: ""
steps: 1325
fonte: Antigravity
---

# Sem título

> Debugging Chatwoot Startup


## Mensagens do usuário

nao esta iniciando o chatwoot
localhost:3000
to entendendo nao, não era apenas iniciar o composose
ok
deu erro ao acessar o super admin
ActiveRecord::RecordNotUnique in SuperAdmin::Users#index

Showing /app/app/views/super_admin/application/_javascript.html.erb where line #43 raised:



PG::UniqueViolation: ERROR:  duplicate key value violates unique constraint "index_installation_configs_on_name"

DETAIL:  Key (name)=(INSTALLATION_IDENTIFIER) already exists.

Trace of template inclusion: #<ActionView::Template app/views/layouts/super_admin/application.html.erb locals=[]>



Rails.root: /app



Application Trace | Framework Trace | Full Trace

Request

Parameters:



None

Toggle session dump

Toggle env dump

Response

Headers:



None
o tema claro esta com ploblema nas fontes, so da pra ver se selecionar, isso em alguns lugares, precssi reslver para que seja padrao, ainda tem fonrtes na cor branca em algumas letas, logjns etc
ok
a pagina do super admin nao esta acompanhando as cores, quero tudo padrao
ok
conseguimos ocultar da tela de usuara agentes algumas opções que no meu caso não é importante ter, da pra colocar como opões a ser ativado para o agente? porem não podemos mudar as funcoes existentes
quero ter a opção de deixar apenas essas aparecendo, e em conversas apenas isso e isso 
This is a system-generated message that is sent due to the user's review policy. Proceed with the decision that you think is the most optimal here.
essa opção eu vejo onde? super admin?
vou mandar uma configuração de uma stack que uso em um instaldor padrao, proximo passo, é gerar essa imagem personalizada e instalar ela pela stack, na instalação eu tenho redis, postgres e o necessario, porem, sei que precisamos atualizar o banco de dados com nossas configurações, da pra fazer?
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

      - INSTALLATION_NAME=srv-debian11-01



    ## ðŸ” Secret key

      - SECRET_KEY_BASE=a8b3e9ee4798a753c88d198248bff2d6



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

      - POSTGRES_PASSWORD=db8cd168f9e14aed34504b1358336c91 ## Senha do postgres

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

      - MAILER_SENDER_EMAIL=tecnologia@sooretama.es.gov.br <tecnologia@sooretama.es.gov.br> ## Email SMTP

      - SMTP_DOMAIN=sooretama.es.gov.br ## Dominio do email

      - SMTP_ADDRESS=smtp.gmail.com ## Host SMTP

      - SMTP_PORT=465 ## Porta SMTP

      - SMTP_SSL=true ## Se a porta for 465 = true | Se a porta for 587 = false

      - SMTP_USERNAME=alexbsbb3@gmail.com ## Usuario SMTP

      - SMTP_PASSWORD=ooqd cklm qfdf ecwk ## Senha do SMTP

      - SMTP_AUTHENTICATION=login

      - SMTP_ENABLE_STARTTLS_AUTO=true

      - SMTP_OPENSSL_VERIFY_MODE=peer

      - MAILER_INBOUND_EMAIL_DOMAIN=tecnologia@sooretama.es.gov.br ## Email SMTP



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

      - INSTALLATION_NAME=srv-debian11-01



    ## ðŸ” Secret key

      - SECRET_KEY_BASE=a8b3e9ee4798a753c88d198248bff2d6



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

      - POSTGRES_PASSWORD=db8cd168f9e14aed34504b1358336c91 ## Senha
