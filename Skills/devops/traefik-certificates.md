---
name: traefik-certificates
title: Traefik Central — Gerenciamento de Certificados SSL
description: Diagnóstico, renovação e correção de certificados Let's Encrypt no Traefik Central (Docker Swarm). Cobre detecção de NXDOMAIN, limpeza de acme.json, emissão de certificados combinados, e manutenção de backup do servers.yml.
category: devops
---

# Traefik Central — Certificados SSL

## Quando usar

- Certificados Let's Encrypt expirando ou expirados
- Erro `NXDOMAIN looking up A for <domínio>` nos logs do Traefik
- Erro `TLS-ALPN-01 challenge failed` / `Cannot negotiate ALPN protocol`
- Erro `Unable to obtain ACME certificate for domains`
- Quer verificar o status dos certificados
- Quer adicionar/remover/atualizar servidores no `servers.yml`

## Servidor

| Item | Valor |
|------|-------|
| IP | 192.168.25.101 |
| Diretório | `/root/traefik-central/` |
| Config dinâmica | `/root/traefik-central/dynamic-config/servers.yml` |
| Certificados | `/var/lib/docker/volumes/traefik-certs/_data/acme.json` |
| Script | `/root/traefik-central/scripts/traefikcentral.sh` (ou local em `C:\Users\Alex\Downloads\traefikcentral.sh`) |

## Workflow de diagnóstico

### 1. Verificar status dos certificados

```bash
# Opção 7 no script interativo
bash /root/traefik-central/scripts/traefikcentral.sh
```

Ou manualmente via Docker:

```bash
# Ver logs de erro do Traefik
docker service logs traefik-central_traefik-central --tail 50 2>/dev/null | grep -E '(certif|renew|Unable|acme|error|NXDOMAIN|DNS)'

# Ver certificados atuais no acme.json
cat /var/lib/docker/volumes/traefik-certs/_data/acme.json | python3 -c "
import json, sys
acme = json.load(sys.stdin)
for c in acme.get('letsencrypt', {}).get('Certificates', []):
    d = c.get('domain', {})
    print(f\"  {d.get('main', '?')}  SANs: {d.get('sans', [])}\")
"
```

### 2. Verificar DNS público

Use Google DNS (8.8.8.8) para simular a validação do Let's Encrypt:

```bash
host <dominio> 8.8.8.8
```

Se retornar **NXDOMAIN**, o Let's Encrypt não consegue validar o domínio.

### 3. Identificar a causa raiz

Nos logs do Traefik, os erros mais comuns:

| Erro | Causa | Solução |
|------|-------|---------|
| `NXDOMAIN looking up A for <dom>` | Domínio não existe em DNS público | Remover do router no `servers.yml` |
| `Cannot negotiate ALPN protocol` | TLS interceptado entre LE e Traefik (firewall/proxy) | Verificar NAT no MikroTik, ver se outro serviço está na porta 443 |
| `403 unauthorized :: Incorrect validation certificate` | Desafio TLS-ALPN respondeu com certificado errado | Pode ser race condition; limpar acme.json e forçar re-emissão |

## Correção de certificados expirados

### Caso: NXDOMAIN bloqueia certificado combinado

**Problema:** Um domínio sem DNS no router impede a emissão do certificado para TODOS os domínios daquele router.

**Causa raiz (cache do acme.json):** Mesmo que o domínio NXDOMAIN tenha sido removido do `servers.yml` há meses, certificados individuais emitidos anteriormente (enquanto o domínio ainda estava no router) continuam no `acme.json`. Ao renovar, o Traefik/LetsEncrypt tenta revalidar todos os SANs dos certificados existentes — e encontra o NXDOMAIN, bloqueando a renovação completa. **Remover do servers.yml NÃO limpa o acme.json automaticamente.**

**Solução:**

1. **Remover o domínio NXDOMAIN do router** no `servers.yml`

2. **Limpar certificados individuais conflitantes** do `acme.json`:
   - Domínios que têm certificado individual mas fazem parte de um router com Host() rule multi-domínio
   - Após remover os individuais, o Traefik emite UM certificado combinado com todos os SANs

3. **Forçar restart do Traefik**:
   ```bash
   docker service update --force traefik-central_traefik-central
   ```

4. **Verificar** se o certificado combinado foi emitido (aguardar ~30s):
   ```bash
   cat /var/lib/docker/volumes/traefik-certs/_data/acme.json | python3 -c "
   import json, sys, base64, tempfile, subprocess, os
   acme = json.load(sys.stdin)
   for c in acme.get('letsencrypt', {}).get('Certificates', []):
       main = c.get('domain', {}).get('main', '')
       if 'riquest' in main:
           with tempfile.NamedTemporaryFile(suffix='.pem', delete=False, mode='wb') as f:
               f.write(base64.b64decode(c.get('certificate', '')))
               cert_path = f.name
           r = subprocess.run(['openssl','x509','-in',cert_path,'-noout','-dates'], capture_output=True, text=True)
           print(main, r.stdout.strip())
           os.unlink(cert_path)
   "
   ```

### Caso: TLS-ALPN falha (Cannot negotiate ALPN)

Possíveis causas:
- Outro serviço (nginx, apache, outro Traefik) escutando na porta 443 do mesmo IP
- Firewall/MikroTik com regra de interceptação TLS na porta 443
- Port-forward errado no MikroTik apontando para servidor errado

Diagnóstico:
```bash
# Verificar o que está na porta 443 do servidor
ss -tlnp | grep :443

# Testar ALPN manualmente
openssl s_client -connect 170.83.214.246:443 -alpn "acme-tls/1" 2>&1 | head -20
```

### Caso: Router multi-domínio com domínios atrás de Cloudflare (certificado combinado nunca emite)

**Sintoma:** um domínio do router (ex. `campanha.riquest.com.br`) serve `CN=TRAEFIK DEFAULT CERT`
sem nunca gerar cert LE, enquanto outros domínios do mesmo router têm certs.

**Causa:** o router agrupa vários `Host(...)` → Traefik pede **um** certificado combinado. Se algum
SAN estiver atrás de Cloudflare (recusa `acme-tls/1` e redireciona o HTTP-01) ou apontar p/ outro IP
(eclicksolucoes), o LE não valida o conjunto todo. Log mostra:
`429 rateLimited` / `Cannot negotiate ALPN protocol "acme-tls/1" for tls-alpn-01 challenge` para os
SANs de fora.

**Solução (a "fila"):** adicione `tls.domains` no bloco `tls:` do router, listando **cada domínio
como `main` próprio**. O Traefik emite 1 cert por domínio, independente — um problemático não
bloqueia os demais. Depois `docker service update --force traefik-central_traefik-central` e
aguardar ~40s. O script `traefikcentral.sh` já faz isso automaticamente (função auxiliar
`traefik_sync_domains.py`). Detalhes em `references/cloudflare-tls-domains-case.md`.

## Script traefikcentral.sh

O script tem as seguintes funções relevantes para certificados:

| Opção | Função | Descrição |
|-------|--------|-----------|
| 7 | `verificar_certificados` | Lista todos os certificados com dias restantes |
| 8 | `diagnosticar_e_corrigir` | Escaneia DNS de todos os domínios, detecta NXDOMAIN, remove do router e força renovação |
| 9 | `limpar_backups` | Remove backups antigos mantendo apenas os 5 mais recentes |
| 10 | `aplicar_fila_certificados` | Regenera `tls.domains` (1 cert/domínio) de **todos** os routers — aplica a "fila" manualmente com backup + restart opcional. **Chama automaticamente a opção 8 para remover domínios sem DNS antes de regenerar.** |
| 11 | `listar_dominios_sem_dns` | Lista domínios com DNS inválido (monitoramento proativo) |
| — | `sincronizar_certificados` | Sincroniza certificados após alterações, com backup automático do `acme.json` |
| — | `sincronizar_certificados` | Sincroniza certificados após alterações |

### Editar o traefikcentral.sh (como fazer com segurança)

- **Preferência do usuário:** sempre que der, mantenha a estrutura dos routers e corrija no nível
  Traefik/script (challenge, `tls.domains`), NÃO reestruture o `servers.yml`. E, para tarefas que o
  usuário vai repetir, **exponha uma opção de menu** no instalador em vez de fazer edições one-off —
  o usuário prefere rodar pelo menu (ex.: opção 10 para aplicar a fila).
- A ferramenta `patch` usa match fuzzy e, em blocos multi-linha de um .sh grande, pode **re-entendiar/
  aninhar linhas** repetidamente (quebrou a indentação do `menu_principal` ao inserir uma função).
  Use **substituição exata de string via python** (`open(); s.replace(old,new); write`) para edições
  sensíveis a indentação, e depois sempre `bash -n traefikcentral.sh` para validar sintaxe antes de push.
- Valide helpers Python embutidos (heredoc `<< 'PY...'`) extraindo o blob e rodando num copy do
  `servers.yml` + `yaml.safe_load` antes de assumir que funcionam.
- Push p/ GitHub em ambiente sem askpass/tty: use `git push https://x-access-token:$(gh auth token)@github.com/alexbuzatto/instaladortraefikcentral.git main` (commit local já fica em `main...origin/main`; `gh auth setup-git` sozinho não resolve aqui).

## Remoção Seletiva de Certificados do acme.json

Para remover apenas certificados específicos (por common-name) sem destruir todo o arquivo, use o script em `references/erase-acme-selective.md`.

## Backup rotation

The script cria backups do `servers.yml` automaticamente em cada operação de alteração (adicionar, atualizar, remover servidor). A função `limpar_backups()` é chamada automaticamente após cada backup e **também pode ser executada manualmente via opção 9** no menu principal. Mantém no máximo 5 backups, removendo os mais antigos.

Padrões de backup:
- `servers.yml.bak.<YYYYMMDD_HHMMSS>` — backups de operações normais
- `servers.yml.bak.diag.<YYYYMMDD_HHMMSS>` — backups do diagnóstico

## Pitfalls

- **NXDOMAIN no router bloqueia TODOS os domínios:** Um único domínio sem DNS impede a emissão do certificado combinado para todos os SANs do router.
- **Remover do servers.yml não limpa acme.json:** O Traefik mantém certificados antigos. Se houver certificados individuais conflitantes, é preciso removê-los manualmente do acme.json.
- **Validação de DNS ao adicionar servidores/domínios:** O script verifica DNS de todos os domínios **após** salvá-los no `servers.yml` (avisa, não bloqueia). Se um domínio não tiver DNS válido (ex: `laya.riquest.com.br` sem registro A/AAAA público), ele é adicionado ao `servers.yml` e o certificado será emitido automaticamente quando o DNS existir. **Corrija o DNS público para o Let's Encrypt validar e emitir o certificado.**
- **Script bloqueia adição sem DNS válido (corrigido em eeb9197+):** O `traefikcentral.sh` (opção 5) **NÃO bloqueia mais** a adição de domínios sem DNS público. A validação agora usa `python3 socket.getaddrinfo` (sem dependência de `dig`) e **avisa** que o certificado só será emitido quando o DNS existir. A opção 10 (`aplicar_fila_certificados`) usa `--keep-all` para manter domínios sem DNS no `servers.yml`.
- **Teste de conectividade na porta do destino:** Ao adicionar um servidor, o script verifica se o destino responde na porta configurada (evita erros de roteamento).
- **Backups do servidor:** Antes de qualquer alteração no `servers.yml`, o script cria backup automático. Use `limpar_backups` para evitar acúmulo.
- **Logs do container:** Usar `docker service logs` mostra logs de TODAS as réplicas. Para logs atuais, use `--since 1m` ou `--tail 50`.
- **Reinicialização do Traefik:** `docker service update --force` recria o container. Pode levar ~10s para o novo container começar a renovar certificados.
- **Router multi-domínio com Cloudflare:** certificado combinado nunca valida. Use `tls.domains` (1 `main` por domínio) p/ isolar emissões — a "fila".
- **Prefira corrigir no Traefik/script, não restruturar routers:** o usuário quer manter a config de domínios como está; aplique a correção no lado Traefik (challenge/`tls.domains`) e, se repetível, vire uma opção de menu.
- **`traefik_sync_domains.py` aceita `--keep-all` (commit eeb9197+):** com a flag, domínios sem DNS são MANTIDOS no servers.yml (usado nas opções de adicionar do menu — cert sai quando o DNS existir); sem a flag, remove (modo diagnóstico/opções 8 e 10). Adicionar servidor/domínio sem DNS público não bloqueia mais, apenas avisa. Validação DNS via `python3 socket.getaddrinfo` (sem dependência de `dig`). Em `adicionar_servidor`, a porta é lida ANTES do teste de conectividade.
- **Editar `traefikcentral.sh`:** a ferramenta `patch` (fuzzy) pode re-entendiar linhas em blocos grandes — para edições multi-linha sensíveis a indentação use substituição exata via python e valide com `bash -n`. **Prefira sempre usar o menu interativo do script para alterações recorrentes (ex.: opção 10 para aplicar a fila de certificados).**
- **TLS-ALPN challenge falha quando Central termina TLS:** Se o Traefik Central (edge) termina TLS e proxya HTTP para um Traefik local no servidor de aplicação, o desafio TLS-ALPN do Let's Encrypt falha no servidor local (porta 443 não chega lá). Solução: configure o Traefik local **apenas HTTP (porta 80)**, sem certResolver, e deixe o Central terminar TLS. O Central proxya `https://dominio.com` → `http://servidor-local:80` → Hermes (9119).
