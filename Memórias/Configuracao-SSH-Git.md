---
tags: [memoria, ssh, git, configuracao, autenticacao]
data: 2026-11-05
origem: Hermes-Agent
---

# Configuração SSH + Git para Obsidian Vault

## Resumo
Autenticação SSH configurada para o repositório `Alexbsbb/obsidian-vault` usando chave `hermes-ct`.

## Configuração Realizada

### 1. Chave SSH
- **Arquivo:** `C:\Users\Alex\.ssh\hermes-ct`
- **Configuração:** Adicionada ao `~/.ssh/config` automaticamente
```
Host github.com
  HostName github.com
  User git
  IdentityFile C:/Users/Alex/.ssh/hermes-ct
  IdentitiesOnly yes
  StrictHostKeyChecking accept-new
```

### 2. Remote Git
- **URL:** `git@github.com:Alexbsbb/obsidian-vault.git`
- **Protocolo:** SSH (não mais HTTPS)

### 3. Testes de Conexão
- ✅ SSH autenticado com sucesso no GitHub
- ✅ Fetch/push funcionando
- ✅ Permissões de I/O OK

## Script de Diagnóstico
Salvo em: `00 - Protocolos/script-check-fix-vault.sh`

Execute para verificar/reparar:
```bash
/tmp/check_fix_vault.sh
```

## Agendador de Tarefas
- **Tarefa:** `SincronizarCofreObsidian`
- **Frequência:** A cada 2 minutos
- **Comando:** `wscript.exe "E:\CofreObsidian\silent_sync.vbs"`
- **Status:** ✅ Ativo

## Related
- [[Git-Obsidian-Sync]]
- [[Arquitetura-Cerebro-Obsidian]]
- [[Script-Verificacao-Sistema]]
