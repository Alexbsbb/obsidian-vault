---
tags: [checklist, comando, referencia, verificacao, padrao]
data: 2026-11-05
origem: Hermes-Agent
---

# 📋 Comando: Verificação Cérebro Obsidian

## Uso
Copie e cole este comando em qualquer Hermes Agent para verificar se está seguindo a arquitetura de cérebro compartilhado.

---

## Comando Pronto (Copiar e Colar)

```markdown
# Verificação de Cérebro Obsidian

Você é um Hermes Agent e precisa verificar se está seguindo a arquitetura de cérebro compartilhado com o Obsidian.

## Execute estas verificações:

### 1. Verificar Skills
```bash
skill_view(name="obsidian-memory-manager")
```

### 2. Verificar Workdir
```bash
cd "E:/CofreObsidian" && pwd
```

### 3. Testar Leitura Automática
```bash
search_files("Traefik", path="E:/CofreObsidian")
```

### 4. Testar Escrita (se necessário)
```bash
write_file("Memórias/Teste-Verificacao.md", "# Teste\nVerificação de integração.")
```

### 5. Verificar MOC
```bash
read_file("00 - Início.md")
```

## Checklist de Aceitação

- [ ] Skill `obsidian-memory-manager` está carregada?
- [ ] Workdir padrão é `E:/CofreObsidian`?
- [ ] Você consulta o cofre ANTES de responder perguntas técnicas?
- [ ] Você salva conhecimento APÓS resolver tarefas técnicas?
- [ ] Você atualiza o MOC quando cria nova nota?
- [ ] Você responde sempre em PT-BR?
- [ ] Você valida ("ver funcionando") antes de concluir?

## Resultado

Se **todos os checks = SIM** → Cérebro Obsidian configurado ✅

Se **faltarem checks** → Listar ajustes necessários:

```
Ajustes necessários:
1. ...
2. ...
```

---

**Execute este checklist agora e retorne o resultado.**
```

---

## Versão para Antigravity

```markdown
# Verificação Antigravity + Cérebro Obsidian

Você é um agente Antigravity com 1018 skills importadas. Verifique se está integrado ao cérebro compartilhado:

1. [Mesmo checklist acima]
2. Você carrega automaticamente skills do diretório `Skills/` no cofre?
3. Você respeita as regras de handoff entre agentes (consultar `00 - Protocolos/Handoff-Entre-Agentes.md`)?
4. Você não sobrescreve notas de outros agentes sem verificar conflitos?

## Resultado Antigravity

Se **todos os checks = SIM** → Antigravity integrado ✅

Se **faltarem checks** → Listar ajustes necessários:

```
Ajustes necessários:
1. ...
2. ...
```

---

**Execute este checklist agora e retorne o resultado.**
```

---

## Onde Encontrar

- **Checklist completo:** `[[00 - Protocolos/Checklist-Hermes-Cerebro-Obsidian]]`
- **Integração Antigravity:** `[[Integracao-Antigravity-Obsidian]]`
- **Arquitetura:** `[[Arquitetura-Cerebro-Obsidian]]`
- **Sync Git:** `[[Git-Obsidian-Sync]]`

---

## Related
- [[00 - Protocolos/Checklist-Hermes-Cerebro-Obsidian]]
- [[00 - Protocolos/Handoff-Entre-Agentes]]
- [[Arquitetura-Cerebro-Obsidian]]
- [[Integracao-Antigravity-Obsidian]]
