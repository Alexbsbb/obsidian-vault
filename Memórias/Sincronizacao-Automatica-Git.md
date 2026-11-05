---
tags: [memoria, sincronizacao, agendador, windows, git]
data: 2026-11-05
origem: Hermes-Agent
---

# Sincronização Automática Git

## Resumo
Tarefa agendada no Windows para sincronizar o Cofre Obsidian com o GitHub a cada 2 minutos.

## Configuração

### Tarefa do Agendador
- **Nome:** `SincronizarCofreObsidian`
- **Frequência:** A cada 2 minutos
- **Script:** `E:\CofreObsidian\silent_sync.vbs`
- **Estado:** ✅ Ativo

### Scripts Envolvidos
1. **sync_obsidian.bat** — Executa git pull, add, commit, push
2. **silent_sync.vbs** — Wrapper para executar em background (sem janela)

### Conteúdo do sync_obsidian.bat
```batch
@echo off
cd /d "E:\CofreObsidian\Obsidian Vault"
git pull origin main
if %errorlevel% neq 0 (
    git pull
)
git add .
git commit -m "Auto-sync %date% %time%"
git push origin main
```

### Conteúdo do silent_sync.vbs
```vbscript
Set WshShell = CreateObject("WScript.Shell")
WshShell.Run chr(34) & "E:\CofreObsidian\sync_obsidian.bat" & chr(34), 0
Set WshShell = Nothing
```

## Problemas Resolvidos
1. **Token expirado:** Switch de HTTPS com token para SSH
2. **Chave SSH não reconhecida:** Configurado `~/.ssh/config` corretamente
3. **Agendador não persistia:** Recriado com sucesso

## Verificação
Para verificar o status da tarefa:
```bash
schtasks /query /tn "SincronizarCofreObsidian" /fo LIST
```

Para forçar execução manual:
```bash
wscript.exe "E:\CofreObsidian\silent_sync.vbs"
```

## Related
- [[Git-Obsidian-Sync]]
- [[Configuracao-SSH-Git]]
- [[Arquitetura-Cerebro-Obsidian]]
