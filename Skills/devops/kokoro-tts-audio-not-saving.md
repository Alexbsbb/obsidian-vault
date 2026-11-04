---
name: kokoro-tts-audio-not-saving
description: Kokoro TTS doesn't save audio (404 Permission denied).
---

# Kokoro TTS audio not saving (Docker Swarm)

## Trigger
Kokoro FastAPI TTS retorna áudio mas o arquivo não é salvo/baixado. Sintomas nos logs do serviço:
- `ERROR temp_manager:108 | Failed to create temp file: [Errno 13] Permission denied: '/app/api/temp_files/tmpXXXX.mp3'`
- `GET /v1/download/unavailable_mp3?name=... HTTP/1.1" 404`
- `WARNING openai_compatible.py:468 | Download file not found: unavailable_mp3`

## Causa raiz
Os volumes Docker do Kokoro (`kokoro_output`, `kokoro_temp`, `kokoro_models`) foram criados como **root:root** (drwxr-xr-x) na primeira execução, mas o container roda como **appuser (uid 1000)**. Sem permissão de escrita em `temp_files`, o `temp_manager` não cria o temp `.mp3` e cai no fallback `unavailable_<format>` — ou seja, o POST devolve 200 (stream direto) mas o caminho de download aponta pra um arquivo que nunca existe.

## Passos

1. Achar mountpoints:
   ```bash
   docker volume inspect kokoro_output -f "{{.Mountpoint}}"  # => /var/lib/docker/volumes/kokoro_output/_data
   ```

2. Confirmar usuário do container:
   ```bash
   CID=$(docker ps -q --filter name=kokoro_kokoro_fastapi | head -1)
   docker exec $CID sh -c "id; ls -lan /app/api/temp_files /app/output"
   ```
   Container = appuser uid 1000; volumes root (drwxr-xr-x) = problema.

3. Corrigir permissões dos volumes (servidor root):
   ```bash
   for vol in kokoro_output kokoro_temp kokoro_models; do
     chown -R 1000:1000 "$(docker volume inspect $vol -f "{{.Mountpoint}}")"
   done
   ```
   Named volumes são bind na mesma path -> vale na hora, sem restart. Não precisa `docker service update --force`.

4. Validar. O caminho de download vem no **header `X-Download-Path`** do POST, só quando `return_download_link=True` + `stream=True`. Se `X-Download-Status` virar `unavailable`, a escrita de temp ainda falhou.

## Teste real (dentro do container)
```python
import requests, subprocess
base = "http://localhost:8880"
r = requests.post(base + "/v1/audio/speech",
    json={"model":"kokoro","input":"teste","voice":"af_heart",
          "response_format":"mp3","return_download_link":True,"stream":True}, timeout=120)
print("POST", r.status_code, "ctype", r.headers.get("Content-Type"), "bytes", len(r.content))
dlpath = r.headers.get("X-Download-Path")
dlstat = r.headers.get("X-Download-Status")   # deve ser None/vazio; "unavailable" = falhou
print("X-Download-Path:", dlpath, "| status:", dlstat)
print(subprocess.run(["find","/app","-name","tmp*.mp3"], capture_output=True,text=True).stdout)
if dlpath:
    d = requests.get(base + dlpath)
    print("DOWNLOAD", d.status_code, "bytes", len(d.content))   # esperado 200 + header ID3
```
Para rodar no container a partir de host sem sshpass (Windows/bash), codifique em base64 e pipe:
```bash
B64=$(base64 -w0 script.py)
python3 sshcmd.py "CID=\$(docker ps -q --filter name=kokoro_kokoro_fastapi | head -1); echo '$B64' | base64 -d > /tmp/t.py && docker cp /tmp/t.py \$CID:/tmp/t.py && docker exec \$CID python3 /tmp/t.py"
```

## Pitfalls
- `temp_files` vazio após request com sucesso é normal (temp_manager limpa). Só preocupa com erro no log.
- O fallback `unavailable_<format>` não é arquivo real: placeholder que o `__aenter__` grava quando a criação falha.
- Não use `response_format="json"` (dá 422). Formatos válidos: mp3/opus/aac/flac/wav/pcm.
- O download varre em `search_paths=[settings.temp_file_dir]`; baixar antes de o arquivo ser escrito (timing) dá 404.

## Acesso ao servidor srv-eclick
srv-eclick 192.168.25.102, root/senha. Sem sshpass no Windows: use helper Python paramiko (C:\Users\Alex\sshcmd.py): `python ~/sshcmd.py '<cmd>'`.