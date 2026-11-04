---
tags: [antigravity-conversa]
data: ""
steps: 4369
fonte: Antigravity
---

# Sem título

> Starting Chatwoot Project


## Mensagens do usuário

me ajuda a resolver os erros desse projeto e peço a gentileza de fazer ele iniciar
por favor
ViteRuby::MissingEntrypointError in Dashboard#index

Showing /app/app/views/layouts/vueapp.html.erb where line #74 raised:



Vite Ruby can't find entrypoints/dashboard.js in the manifests.



Possible causes:

  - The last build failed. Try running `bin/vite build --clear --mode=development` manually and check for errors.



Errors:

  [33mThe CJS build of Vite's Node API is deprecated. See https://vite.dev/guide/troubleshooting.html#vite-cjs-node-api-deprecated for more details.[39m

  error during build:

  TypeError: Cannot read properties of undefined (reading 'meta')

      at config (/app/node_modules/.pnpm/vite-plugin-ruby@5.1.2_vite@5.4.21_@types+node@22.7.0_sass@1.79.3_terser@5.33.0_/node_modules/vite-plugin-ruby/dist/index.cjs:251:32)

      at runConfigHook (file:///app/node_modules/.pnpm/vite@5.4.21_@types+node@22.7.0_sass@1.79.3_terser@5.33.0/node_modules/vite/dist/node/chunks/dep-BK3b2jBa.js:67004:25)

      at resolveConfig (file:///app/node_modules/.pnpm/vite@5.4.21_@types+node@22.7.0_sass@1.79.3_terser@5.33.0/node_modules/vite/dist/node/chunks/dep-BK3b2jBa.js:66445:18)

      at process.processTicksAndRejections (node:internal/process/task_queues:103:5)

      at async build (file:///app/node_modules/.pnpm/vite@5.4.21_@types+node@22.7.0_sass@1.79.3_terser@5.33.0/node_modules/vite/dist/node/chunks/dep-BK3b2jBa.js:65503:18)

      at async CAC.<anonymous> (file:///app/node_modules/.pnpm/vite@5.4.21_@types+node@22.7.0_sass@1.79.3_terser@5.33.0/node_modules/vite/dist/node/cli.js:829:5)





Visit the Troubleshooting guide for more information:

  https://vite-ruby.netlify.app/guide/troubleshooting.html#troubleshooting









Extracted source (around line #74):

72

73

74

75

76

77

              

    <% end %>

    <%= vite_client_tag %>

    <%= vite_javascript_tag @application_pack %>

  </head>

  <body class="antialiased font-inter">

    <div id="app"></div>



Rails.root: /app



Application Trace | Framework Trace | Full Trace

app/views/layouts/vueapp.html.erb:74:in '_app_views_layouts_vueapp_html_erb___3017385866724869567_104664'

app/controllers/concerns/switch_locale.rb:56:in 'SwitchLocale#set_locale'

app/controllers/concerns/switch_locale.rb:19:in 'SwitchLocale#switch_locale'

Request

Parameters:



None

Toggle session dump

Toggle env dump

Response

Headers:



None
ok
continua

ActiveRecord::NoDatabaseError

We could not find your database: chatwoot_dev. Available database configurations can be found in config/database.yml.

To resolve this error:

- Did you not create the database, or did you delete it? To create the database, run:

bin/rails db:create

- Has the database name changed? Verify that config/database.yml contains the correct database name.

Create database

Extracted source (around line #74):

72

73

74

75

76

77

              

            raise ActiveRecord::ConnectionNotEstablished, error.message

          elsif conn_params && conn_params[:dbname] && error.message.include?(conn_params[:dbname])

            raise ActiveRecord::NoDatabaseError.db_error(conn_params[:dbname])

          elsif conn_params && conn_params[:user] && error.message.include?(conn_params[:user])

            raise ActiveRecord::DatabaseConnectionError.username_error(conn_params[:user])

          elsif conn_params && conn_params[:host] && error.message.include?(conn_params[:host])



Rails.root: /app



Application Trace | Framework Trace | Full Trace

activerecord (7.1.5.2) lib/active_record/connection_adapters/postgresql_adapter.rb:74:in 'ActiveRecord::ConnectionAdapters::PostgreSQLAdapter.new_client'

activerecord (7.1.5.2) lib/active_record/connection_adapters/postgresql_adapter.rb:980:in 'ActiveRecord::ConnectionAdapters::PostgreSQLAdapter#connect'

activerecord (7.1.5.2) lib/active_record/connection_adapters/postgresql_adapter.rb:992:in 'ActiveRecord::ConnectionAdapters::PostgreSQLAdapter#reconnect'

activerecord (7.1.5.2) lib/active_record/connection_adapters/abstract_adapter.rb:685:in 'block in ActiveRecord::ConnectionAdapters::AbstractAdapter#reconnect!'

activesupport (7.1.5.2) lib/active_support/concurrency/null_lock.rb:9:in 'ActiveSupport::Concurrency::NullLock#synchronize'

activerecord (7.1.5.2) lib/active_record/connection_adapters/abstract_adapter.rb:684:in 'ActiveRecord::ConnectionAdapters::AbstractAdapter#reconnect!'

activerecord (7.1.5.2) lib/active_record/connection_adapters/abstract_adapter.rb:786:in 'block in ActiveRecord::ConnectionAdapters::AbstractAdapter#verify!'

activesupport (7.1.5.2) lib/active_support/concurrency/null_lock.rb:9:in 'ActiveSupport::Concurrency::NullLock#synchronize'

activerecord (7.1.5.2) lib/active_record/connection_adapters/abstract_adapter.rb:777:in 'ActiveRecord::ConnectionAdapters::AbstractAdapter#verify!'

activerecord (7.1.5.2) lib/active_record/connection_adapters/abstract_adapter.rb:794:in 'ActiveRecord::ConnectionAdapters::AbstractAdapter#connect!'

activerecord (7.1.5.2) lib/active_record/connection_adapters/abstract_adapter.rb:1000:in 'block in ActiveRecord::ConnectionAdapters::AbstractAdapter#with_raw_connection'

activesupport (7.1.5.2) lib/active_support/concurrency/null_lock.rb:9:in 'ActiveSupport::Concurrency::NullLock#synchronize'

activerecord (7.1.5.2) lib/active_record/connection_adapters/abstract_adapter.rb:999:in 'ActiveRecord::ConnectionAdapters::AbstractAdapter#with_raw_connection'

activerecord (7.1.5.2) lib/active_record/connection_adapters/abstract_adapter.rb:1112:in 'ActiveRecord::ConnectionAdapters::AbstractAdapter#valid_raw_connection'

activerecord (7.1.5.2) lib/active_record/connection_adapters/postgresql_adapter.rb:616:in 'ActiveRecord::ConnectionAdapters::PostgreSQLAdapter#get_database_version'

activerecord (7.1.5.2) lib/active_record/connection_adapters/schema_cache.rb:374:in 'ActiveRecord::ConnectionAdapters::SchemaCache#database_version'

activerecord (7.1.5.2) lib/active_record/connection_adapters/schema_cache.rb:70:in 'ActiveRecord::ConnectionAdapters::SchemaReflection#database_version'

activerecord (7.1.5.2) lib/active_record/connection_adapters/schema_cache.rb:200:in 'ActiveRecord::ConnectionAdapters::BoundSchemaReflection#database_version'

activerecord (7.1.5.2) lib/active_record/connection_adapters/abstract_adapter.rb:870:in 'ActiveRecord::ConnectionAdapters::PostgreSQLAdapter#database_version'

activerecord-import (2.1.0) lib/activerecord-import/adapters/postgresql_adapter.rb:228:in 'ActiveRecord::Import::PostgreSQLAdapter#database_version'

activerecord (7.1.5.2) lib/active_record/connection_adapters/postgresql_adapter.rb:644:in 'ActiveRecord::ConnectionAdapters::PostgreSQLAdapter#check_version'

activerecord (7.1.5.2) lib/active_record/connection_adapters/abstract/connection_pool.rb:680:in 'ActiveRecord::ConnectionAdapters::ConnectionPool#new_connection'

activerecord (7.1.5.2) lib/active_record/connection_adapters/abstract/connection_pool.rb:730:in 'ActiveRecord::ConnectionAdapters::ConnectionPool#checkout_new_connection'

activerecord (7.1.5.2) lib/active_record/connection_adapters/abstract/connection_pool.rb:709:in 'ActiveRecord::ConnectionAdapters::ConnectionPool#try_to_checkout_new_connection'

activerecord (7.1.5.2) lib/active_record/connection_adapters/abstract/connection_pool.rb:654:in 'ActiveRecord::ConnectionAdapters::ConnectionPool#acquire_connection'

activerecord (7.1.5.2) lib/active_record/connection_adapters/abstract/connection_pool.rb:353:in 'ActiveRecord::ConnectionAdapters::ConnectionPool#checkout'

activerecord (7.1.5.2) lib/active_record/connection_adapters/abstract/connection_pool.rb:182:in 'ActiveRecord::ConnectionAdapters::ConnectionPool#connection'

activerecord (7.1.5.2) lib/active_record/migration/pending_migration_connection.rb:8:in 'ActiveRecord::PendingMigrationConnection.establish_temporary_connection'

activerecord (7.1.5.2) lib/active_record/migration.rb:774:in 'block in ActiveRecord::Migration.p
