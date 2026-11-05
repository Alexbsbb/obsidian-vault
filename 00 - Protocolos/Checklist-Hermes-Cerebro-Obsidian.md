---
tags: [checklist, obsidian, padrao, verificação, agentes]
data: 2026-11-05
origem: Hermes-Agent
---

# ✅ Checklist: Hermes Agent com Cérebro Obsidian

## Uso
Execute este checklist em **qualquer Hermes Agent** para verificar se está seguindo a arquitetura de cérebros compartilhados.

Copie e cole este prompt no agente para testar:

```markdown
# Verificação de Cérebro Obsidian

Você está sendo configurado como parte de uma rede de agentes com cérebro compartilhado. Responda às perguntas abaixo com "SIM" ou "NÃO" e justifique brevemente:

## 1. Leitura Automática
- [ ] Você carrega a skill `obsidian-memory-manager` automaticamente?
- [ ] Antes de responder qualquer pergunta técnica, você busca no cofre `E:/CofreObsidian` usando `search_files`?
- [ ] Você incorpora contexto das notas lidas em suas respostas (citando a fonte)?
- [ ] Você consulta o MOC (`00 - Início.md`) quando não tem certeza qual nota consultar?

## 2. Escrita Automática
- [ ] Após resolver qualquer tarefa técnica (config, debug, deploy), você salva o conhecimento?
- [ ] Você usa a estrutura de diretórios correta: `Memórias/`, `Skills/`, `Logs/`?
- [ ] Você atualiza o MOC (índice mestre) quando cria nova nota?
- [ ] Você nunca salva senhas em texto puro (só mascara com `xxx...`)?

## 3. Comportamento Padrão
- [ ] Você responde SEMPRE em PT-BR (preferência do usuário)?
- [ ] Você faz validação iterativa ("ver funcionando") antes de concluir?
- [ ] Você prefere reconstruir sobre troubleshooting complexo?
- [ ] Você não repete explicações já ditas?

## 4. Sincronização
- [ ] Você sabe que o cofre está em `E:/CofreObsidian`?
- [ ] Você entende que deve usar `read_file`/`search_files`/`write_file`/`patch` para acessar?
- [ ] Você sabe que o Git sync roda a cada 2 minutos automaticamente?

Se faltarem checks, liste quais ajustes são necessários.
```

---

## Configuração Rápida para Novo Agente

### Passo 1: Adicionar Skill
```yaml
skills:
  - name: obsidian-memory-manager
    category: productivity
```

### Passo 2: Definir Workdir
Adicionar na memória do agente:
```
workdir: E:/CofreObsidian
preferencia: Para tarefas Obsidian, workdir padrão: E:\CofreObsidian
```

### Passo 3: Teste de Aceitação
Executar o checklist acima e verificar se:
- ✅ Todas as respostas técnicas consultam o cofre primeiro
- ✅ Após tarefas técnicas, novo conhecimento é salvo
- ✅ O MOC é atualizado quando relevante

---

## Exemplos de Comportamento Esperado

### ❌ Errado (Agente sem cérebro)
```
Usuário: "Como configuro o Traefik?"
Agente: [responde do conhecimento interno, sem consultar notas]
```

### ✅ Correto (Agente com cérebro)
```
Usuário: "Como configuro o Traefik?"
Agente: [search_files em E:/CofreObsidian]
        [read_file em Traefik-srv-app4.md]
        "Conforme registrado em Memórias/Traefik-srv-app4.md:
         Você precisa configurar a rede riquest3, priority=1..."
```

---

## Related
- [[00 - Protocolos/Comportamento-Automatico-Memoria]]
- [[00 - Protocolos/Handoff-Entre-Agentes]]
- [[Arquitetura-Cerebro-Obsidian]]
- [[Git-Obsidian-Sync]]
