---
tags: [syncthing, obsidian, linux, docker]
data: 2026-10-31
origem: Hermes-Agent
---

# Sincronização Obsidian com Syncthing - CT200

## Status
- ✅ CT200: Syncthing instalado e rodando (OpenRC service)
- ✅ Portas: 22000/tcp udp (sync), 8384/tcp (GUI)
- ⏳ Aguardando configuração no Windows

## Device ID - CT200
```
XYIVQGG-L4FATNT-LMWEGWQ-HINOKQ2-XTNEY35-S2RHGMA-33TDLDG-F32EUQH
```

## Configuração

### CT200 (192.168.2.216)
- **OS**: Alpine 3.21
- **Service**: OpenRC - `rc-service syncthing start|status`
- **Porta GUI**: 8384 → http://192.168.2.216:8384
- **Porta Sync**: 22000
- **Vault Path**: /root/obsidian-vault
- **Config**: /root/.config/syncthing/config.xml

### Windows (Desktop)
- **Syncthing**: https://syncthing.net/downloads/
- **GUI Local**: http://localhost:8384
- **Folder ID**: `obsidian-vault`
- **Vault Path Windows**: `E:/CofreObsidian`

## Passos Completados

### 1. Instalação no CT200
```bash
ssh root@192.168.2.216
apk update && apk add syncthing syncthing-openrc
syncthing -generate=/root/.config/syncthing
sed -i 's|<address>127.0.0.1:8384</address>|<address>0.0.0.0:8384</address>|' /root/.config/syncthing/config.xml
mkdir -p /root/obsidian-vault
# Criar serviço OpenRC...
rc-update add syncthing default
rc-service syncthing start
```

### 2. Serviço OpenRC Criado
Arquivo: `/etc/init.d/syncthing`
- Auto-start no boot
- Logs em `/var/log/syncthing.log`
- Background process

## Próximos Passos (Aguardando do usuário)

### No Windows:
1. Instalar Syncthing se não tiver: https://syncthing.net/downloads/
2. Abrir http://localhost:8384
3. Adicionar Device remoto:
   - ID: `XYIVQGG-L4FATNT-LMWEGWQ-HINOKQ2-XTNEY35-S2RHGMA-33TDLDG-F32EUQH`
   - Name: CT200
   - Address: `tcp://192.168.2.216:22000`
4. Criar/Compartilhar Pasta:
   - Folder ID: `obsidian-vault`
   - Path: `E:/CofreObsidian`
   - Share with: CT200 device
5. No CT200 → Aceitar compartilhamento
6. Verificar sincronização

## Segurança

⚠️ **IMPORTANTE**: Device ID sensível! Não compartilhar.

Para produção/recomendado:
- Configurar autenticação API Key no Syncthing
- Usar túnel SSH em vez de binding 0.0.0.0
- Firewall: `iptables -A INPUT -p tcp --dport 8384 -s 192.168.2.0/24 -j ACCEPT`

## Verificação de Saúde

Script criado: `/c/Users/Alex/check_syncthing.py`

Uso:
```bash
/c/Users/Alex/AppData/Local/hermes/hermes-agent/venv/Scripts/python.exe C:/Users/Alex/check_syncthing.py
```

## Troubleshooting

| Problema | Solução |
|----------|---------|
| Vault vazio no CT200 | Verificar permissões da pasta Windows |
| Sincronização lenta | Verificar bandwidth settings no Syncthing |
| Device não aparece | Confirmar Device ID correto, porta 22000 acessível |
| GUI não carrega | Verificar `0.0.0.0:8384` binding no config.xml |