---
tags: [memoria, sincronizacao, obsidian, cofre]
data: 2026-10-31
origem: Hermes-Agent
---

# Sincronização Obsidian CT200 ↔ Desktop

## Status da Sincronização

### CT200 (Alpine 3.21)
- **IP**: 192.168.2.216
- **Syncthing Device ID**: XYIVQGG-L4FATNT-LMWEGWQ-HINOKQ2-XTNEY35-S2RHGMA-33TDLDG-F32EUQH
- **Porta GUI**: 8384 (acesso: http://192.168.2.216:8384)
- **Porta Sync**: 22000 (tcp), 21027 (local-announce)
- **Pasta sincronizada**: /root/obsidian-vault
- **Username CT200**: root
- **Password CT200**: *** [redacted] - armazenado via secret

### Desktop Windows
- **Caminho cofre**: E:/CofreObsidian
- **Device ID Windows**: (consultar após instalar Syncthing)
- **Status**: Aguardando sincronização

## Configuração do Syncthing

### No CT200 (Já configurado)
```
/usr/bin/syncthing -home=/root/.config/syncthing -no-browser
Porta GUI: 0.0.0.0:8384
Folder: /root/obsidian-vault
Folder ID: obsidian-vault
```

### No Windows (Passo a passo)
1. Instalar Syncthing em https://syncthing.net/downloads/
2. Abrir http://localhost:8384
3. **Actions** → **Add Remote Device**
   - Device ID: `XYIVQGG-L4FATNT-LMWEGWQ-HINOKQ2-XTNEY35-S2RHGMA-33TDLDG-F32EUQH`
   - Name: `srv-ct200`
   - Address: `tcp://192.168.2.216:22000`
4. **Actions** → **Add Folder**
   - Folder ID: `obsidian-vault`
   - Path: `E:/CofreObsidian`
   - Devices: Marcar CT200

### No CT200 (Aceitar conexão)
1. Acessar http://192.168.2.216:8384
2. **Folders** → **Add Folder**
   - Folder ID: `obsidian-vault`
   - Path: `/root/obsidian-vault`
   - Devices: Marcar Windows

## Acesso ao Cofre no CT200

### Método 1: Navegador (mais simples)
- Instalar `nginx` ou `caddy` no CT200
- Servir `/root/obsidian-vault` como pasta estática
- Acessar via http://192.168.2.216:8080

### Método 2: Editor de texto
```bash
# Verificar conteúdo
ls -la /root/obsidian-vault/

# Ler um arquivo
cat "/root/obsidian-vault/Memórias/Configurações Técnicas/Infraestrutura-e-Servidores.md"

# Usar vim
vim /root/obsidian-vault/01\ Início.md
```

### Método 3: Obsidian via AppImage (não instalado)
- Arquivo: `/opt/obsidian/obsidian.AppImage` (download falhou, instalar manualmente)
- Alternativa: Usar Obsidian Web ou instalar dependências corretas

## Verificação de Sincronização
```bash
# No CT200
curl -s http://localhost:8384/rest/system/status | python3 -m json.tool

# Verificar arquivos sincronizados
ls -la /root/obsidian-vault/

# No Windows, verificar em:
# http://localhost:8384/rest/folder/id/obsidian-vault/status
```

## Solução de Problemas

### Syncthing não sincroniza
1. Verificar firewall: `iptables -L` ou abrir porta 22000
2. Verificar Device ID correto
3. Reiniciar serviço: `rc-service syncthing restart`

### Arquivo duplicado/errado
1. Parar sincronização em ambas as máquinas
2. Escolher pasta "mestre" (geralmente Desktop)
3. Limpar `/root/obsidian-vault/*` no CT200
4. Reiniciar sincronização

## Próximos Passos

- [ ] Instalar Syncthing no Windows
- [ ] Adicionar dispositivo remoto no CT200
- [ ] Compartilhar pasta obsidian-vault
- [ ] Testar sincronização (criar arquivo teste)
- [ ] Instalar nginx/caddy no CT200 (opcional)