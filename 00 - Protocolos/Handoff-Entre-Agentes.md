---
tags: [protocolo, handoff, agentes]
data: 2026-10-30
origem: Hermes-Agent
---

# 🔄 Protocolo de Handoff Entre Agentes

## Objetivo
Garantir continuidade perfeita quando uma tarefa é transferida de um agente para outro (ex: Hermes → Claude Code) devido a limite de tokens, mudança de ferramenta ou necessidade de especialização.

## Quando Usar
- Tokens do agente atual estão esgotando (>80% de uso).
- A tarefa requer uma ferramenta específica de outro agente (ex: acesso a repositório privado que só o Claude tem configurado).
- O agente atual encontra um bloqueio técnico que outro pode resolver.

## Estrutura da Nota de Handoff
Sempre crie uma nota com o nome: `Handoff-[Data]-[TarefaResumida].md` contendo:

```markdown
---
tags: [handoff, em-andamento]
agente_origem: <Nome do Agente>
agente_destino: <Nome do Agente ou "Qualquer">
data_transicao: YYYY-MM-DD HH:MM
status: Pendente
---

# 📋 Estado da Tarefa: <Nome da Tarefa>

## 1. Contexto Geral
<Resumo de 2-3 frases sobre o objetivo final e por que isso é importante.>

## 2. O Que Já Foi Feito
- [x] Passo 1 concluído (detalhes técnicos, comandos rodados).
- [x] Passo 2 concluído.
- [ ] Passo 3 iniciado mas incompleto.

## 3. Decisões Críticas Tomadas
- Decisão A: Escolhemos X em vez de Y porque...
- Configuração B: O parâmetro Z foi definido como...

## 4. Bloqueios e Erros Encontrados
- Erro X: Ocorreu ao rodar comando Y. Solução tentada: Z (falhou).
- Bloqueio de Acesso: Falta permissão para pasta W.

## 5. Próximo Passo Imediato (Action Item)
> **Instrução direta para o próximo agente:**
> "Rode o comando `docker-compose up -d` e verifique os logs do serviço 'api'. Se falhar, consulte a nota `Logs/Erro-API-2026.md`."

## 6. Arquivos e Recursos Relevantes
- [[Caminho/Para/NotaRelacionada1]]
- [[Caminho/Para/NotaRelacionada2]]
- Link externo: [Documentação Oficial](url)
```

## Fluxo de Execução
1. **Agente Origem:** Preenche a nota acima antes de encerrar. Marca status como "Pendente".
2. **Agente Destino:** Ao iniciar, busca notas com tag `#handoff` e status `Pendente`. Lê o contexto, executa o "Próximo Passo Imediato" e atualiza a nota (marca como "Concluído" ou cria novo handoff se precisar passar adiante).
3. **Limpeza:** Após conclusão total da tarefa, mova a nota para `Arquivados/` ou marque status como "Finalizado".