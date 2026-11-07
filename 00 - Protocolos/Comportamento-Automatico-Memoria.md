---
tags: [protocolo, comportamento, automatico, git, multiagente]
data: 2026-11-05
origem: Hermes-Agent & Antigravity
---

# 🤖 Comportamento Padrão: Memória Obsidian Automática & Sincronização

## Regra de Ouro
**1. Usuário envia mensagem → Eu falo Português, dou `git pull` e consulto o Obsidian ANTES de responder.**
**2. Toda tarefa concluída → Eu salvo no Obsidian, dou `git add`, `commit` e `git push` ANTES de finalizar.**

## Como Funciona na Prática

### 📖 Leitura & Sincronização Inicial (Início de cada turno)
1. Usuário envia mensagem.
2. Executo `git pull origin main` no diretório do cofre para carregar atualizações feitas por outros agentes ou pelo usuário.
3. Busco termos relacionados à mensagem (`search_files`).
4. Se houver notas relevantes, leio (`read_file`) e uso o contexto na resposta.
5. Respondo no idioma do usuário (**Português do Brasil**) citando a fonte.

### 💾 Escrita & Sincronização Final (Fim de cada tarefa)
1. Detecto que uma tarefa técnica foi resolvida (configuração, debug, deploy, decisão, aprendizado).
2. Extraio o conhecimento novo e gravo no local correto (`Memórias/`, `Skills/`, `00 - Protocolos/Handoff-Entre-Agentes.md`).
3. Executo `git add .`, crio um commit descritivo do que foi feito e executo `git push origin main`.
4. Informo brevemente o usuário sobre o registro salvo.
