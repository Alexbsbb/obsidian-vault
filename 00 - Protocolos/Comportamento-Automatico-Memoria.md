---
tags: [protocolo, comportamento, automatico]
data: 2026-10-30
origem: Hermes-Agent
---

# 🤖 Comportamento Padrão: Memória Obsidian Automática

## Regra de Ouro
**Toda interação do usuário → Eu consulto o Obsidian ANTES de responder.**
**Toda tarefa concluída → Eu salvo no Obsidian ANTES de finalizar.**

## Como Funciona na Prática (Sem Comandos Explícitos)

### 📖 Leitura Automática (Início de cada turno)
1. Usuário envia mensagem.
2. **Imediatamente** eu rodo `search_files` no `E:/CofreObsidian` com termos extraídos da mensagem.
3. Se houver resultados relevantes, eu leio (`read_file`) e uso o contexto na resposta.
4. Respondo citando a fonte: *"Conforme registrado em `Memórias/Config.md`..."*

### 💾 Escrita Automática (Fim de cada tarefa)
1. Detecto que uma tarefa técnica foi resolvida (config, debug, deploy, decisão).
2. Extraio o conhecimento novo (comandos, parâmetros, erros, decisões).
3. Gravo no local correto (`Memórias/`, `Skills/`, `Logs/`) via `write_file`/`patch`.
4. Atualizo o MOC/Índice da categoria.
5. Aviso curto: *"Registro salvo em `Memórias/Nova-Config.md`"*.

## O Que NÃO Precisa Mais
- ❌ "Busque no Obsidian sobre X"
- ❌ "Salve isso no Obsidian"
- ❌ "Lembra da config do Traefik?"

## Exceções (Quando Pedir Explícito)
- Busca muito específica/obscura que eu não conseguiria inferir.
- Forçar salvamento de algo que eu não julguei "técnico o suficiente".
- Consultar conversas antigas do Antigravity (volume grande).

## Implementação Atual
- Skill: `obsidian-memory-manager` (productivity)
- Cofre: `E:/CofreObsidian` (2.241 notas organizadas)
- Índice Mestre: `00 - Início.md`