---
name: kokoro-tts-deploy
description: "Deploy Kokoro TTS a novo servidor Docker Swarm."
---

# Kokoro TTS Deploy (Docker Swarm)

## Trigger
- Instalar Kokoro TTS em um **servidor Swarm novo**
- Migrar Kokoro de um servidor pra outro
- Montar stack completa com rede, volumes, Traefik

## Pré-requisitos
- Servidor de origem (ex. srv-eclick) com a imagem `kokoro-fastapi-cpu:local` buildada
- Login GHCR configurado no servidor de origem (`docker login ghcr.io`)
- Servidor de destino já é nó Swarm com Traefik (ou vai receber)
- Acesso SSH root em ambos

## Passos

### 1. Push imagem pro GHCR (do servidor de origem)

```bash
docker tag kokoro-fastapi-cpu:local ghcr.io/alexbuzatto/kokoro-fastapi-cpu:v1.0.0
docker tag kokoro-fastapi-cpu:local ghcr.io/alexbuzatto/kokoro-fastapi-cpu:latest
docker push ghcr.io/alexbuzatto/kokoro-fastapi-cpu:v1.0.0
docker push ghcr.io/alexbuzatto/kokoro-fastapi-cpu:latest
```

### 2. Copiar credencial GHCR pro servidor novo

```python
import paramiko, json
a = paramiko.SSHClient(); a.set_missing_host_key_policy(paramiko.AutoAddPolicy())
a.connect('ORIGEM_IP', username='root', password='SENHA', timeout=10)
si,so,se = a.exec_command("cat /root/.docker/config.json", timeout=20)
cfg = so.read().decode(); a.close()

b = paramiko.SSHClient(); b.set_missing_host_key_policy(paramiko.AutoAddPolicy())
b.connect('DESTINO_IP', username='root', password='SENHA', timeout=10)
sftp = b.open_sftp()
with sftp.open('/root/.docker/config.json','w') as f: f.write(cfg)
sftp.close(); b.close()
```

Ou copiar manualmente `~/.docker/config.json` do origem pro destino.

### 3. Criar volumes

```bash
for v in kokoro_models kokoro_output kokoro_temp; do
  docker volume ls -q | grep -qx "$v" || docker volume create "$v"
done
```

### 4. Stack YAML (ajustar domínio, rede, versão)

```yaml
version: "3.7"
services:
  kokoro_fastapi:
    image: ghcr.io/alexbuzatto/kokoro-fastapi-cpu:v1.0.0
    environment:
      - ALLOW_LOCAL_VOICE_SAVING=true
      - DOWNLOAD_MODEL=true
      - DEVICE=cpu
      - USE_GPU=false
      - CORS_ENABLED=true
      - ENABLE_WEB_PLAYER=true
      - SERVER_URL=https://kokoro.seudominio.com.br
      - DEFAULT_VOICE=pf_dora
    volumes:
      - kokoro_models:/app/api/src/models
      - kokoro_output:/app/output
      - kokoro_temp:/app/api/temp_files
    networks:
      - rede_swarm
    deploy:
      replicas: 1
      placement:
        constraints:
          - node.role == manager
      labels:
        - "traefik.enable=true"
        - "traefik.http.routers.kokoro.rule=Host(`kokoro.seudominio.com.br`)"
        - "traefik.http.routers.kokoro.entrypoints=websecure"
        - "traefik.http.routers.kokoro.tls.certresolver=letsencryptresolver"
        - "traefik.http.services.kokoro.loadbalancer.server.port=8880"
        - "traefik.docker.network=rede_swarm"
volumes:
  kokoro_models:  { external: true, name: kokoro_models }
  kokoro_output:  { external: true, name: kokoro_output }
  kokoro_temp:    { external: true, name: kokoro_temp }
networks:
  rede_swarm:
    external: true
    attachable: true
    name: rede_swarm
```

Deploy:

```bash
docker stack deploy -c kokoro_stack.yml kokoro
```

### 5. Corrigir permissão dos volumes (OBRIGATÓRIO)

Container roda como **appuser (uid 1000)** mas volumes são root:

```bash
for vol in kokoro_models kokoro_output kokoro_temp; do
  chown -R 1000:1000 "$(docker volume inspect "$vol" -f '{{.Mountpoint}}')"
done
docker service update --force kokoro_kokoro_fastapi
```

### 6. Verificar

```bash
docker service ps kokoro_kokoro_fastapi
docker logs $(docker ps -q --filter name=kokoro_kokoro_fastapi) 2>&1 | tail -10
```

Teste da API (dentro do container):

```python
import requests
r = requests.post('http://localhost:8880/v1/audio/speech',
    json={'model':'kokoro','input':'Ola mundo','voice':'pf_dora',
          'response_format':'mp3','return_download_link':True,'stream':True}, timeout=120)
print('POST', r.status_code, 'Path:', r.headers.get('X-Download-Path'))
```

## Pitfalls
- **Imagem privada** GHCR — servidor novo precisa do `~/.docker/config.json` copiado
- **Volumes root**: SEMPRE `chown 1000:1000` + `--force` restart, senão áudio não salva
- **Rede**: Traefik precisa estar na mesma overlay. Usar `traefik.docker.network=...`
- **Porta**: Interna 8880, Traefik expõe via label — não precisa publicar porta
- **Domínio**: `SERVER_URL` e `Host()` do Traefik devem ser iguais