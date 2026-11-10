---
tags: [memoria, agente, deepseek, dsh, obsidian, integracao]
data: 2026-11-10
origem: DeepSeek-Harness
---

# 🤖 DeepSeek Harness (DSH) — Agente Integrado ao Cofre

## Resumo
O **DeepSeek Harness (DSH)** passa a operar como mais um agente da memória central compartilhada, com acesso de leitura/escrita ao cofre Obsidian e ao repositório Git, seguindo o mesmo protocolo global dos demais agentes (Hermes, Antigravity, Claude Code, Trae).

## Identificação e Ambiente
- **Agente:** DeepSeek Harness (DSH) — modelo `deepseek-flash`
- **Máquina:** Windows, usuário `PAULA`
- **Cofre local:** `D:\cofreobsidiannotepaula`
- **Repositório:** `git@github.com:Alexbsbb/obsidian-vault.git`
- **Chave SSH:** `~/.ssh/hermes-ct` (autentica no GitHub como `Alexbsbb`)
- **Workspace de sessão:** `C:\Users\PAULA\Documents\deepseek-harness\default-workspace`

> A cópia antiga `C:\Users\PAULA\Documents\Obsidian Vault` (remote `alexbuzatto/zapsenderapi`) foi **removida em 2026-11-10**. Backup do histórico Git em `default-workspace\backup-documents-obsidian-vault-2026-11-10.bundle`.

## Capacidades
- Leitura/escrita de arquivos e navegação em diretórios
- Terminal PowerShell no Windows
- Busca e leitura na web
- Subagentes e workflows para tarefas paralelas
- Skills de Office (Word/Excel/PowerPoint/PDF), engenharia reversa, diagnóstico de sandbox Windows, entre outras

## Protocolo Seguido (igual aos demais agentes)
1. **Idioma:** responder sempre em **Português do Brasil**.
2. **Início da tarefa:** executar `git pull origin main` no cofre antes de consultar notas/memórias.
3. **Consultar antes de agir:** buscar contexto no cofre (`Memórias/`, `Skills/`, `00 - Protocolos/`) antes de gerar código ou soluções.
4. **Fim da tarefa:** salvar conhecimento novo em `Memórias/`, `Skills/` ou handoff; executar `git add .`, commit descritivo e `git push origin main`.
5. **Não alucinar contexto:** o que não está registrado no cofre é tratado como desconhecido.
6. **Formato:** Markdown com frontmatter (`tags`, `data`).

## Sincronização Automática
- **Tarefa agendada:** `SincronizarCofreObsidian` (Windows Task Scheduler)
- **Frequência:** a cada 2 minutos
- **Comando:** `wscript.exe "D:\cofreobsidiannotepaula\silent_sync.vbs"`
- **Scripts no cofre:**
  - `sync_obsidian.bat` — `git pull` → `git add .` → commit (se houver mudança) → `git push`
  - `silent_sync.vbs` — executa o `.bat` em background, sem janela

## Como Invocar
- "DSH, leia o arquivo `Memórias/...`"
- "DSH, busque no cofre sobre X"
- "DSH, salve esta decisão em `Memórias/...` e sincronize"

## Equivalência de Caminhos (Hermes Linux ↔ Windows)
| Hermes (Linux/servidor) | Este PC (Windows) |
|---|---|
| `/root/Documents/Obsidian Vault` | `D:\cofreobsidiannotepaula` |
| `~/Documents/Obsidian Vault` | `D:\cofreobsidiannotepaula` |

## Relacionados
- [[00 - Protocolos/INSTRUCAO-GLOBAL-AGENTES]]
- [[00 - Protocolos/Comportamento-Automatico-Memoria]]
- [[00 - Protocolos/Handoff-Entre-Agentes]]
- [[Git-Obsidian-Sync]]
- [[Configuracao-SSH-Git]]
