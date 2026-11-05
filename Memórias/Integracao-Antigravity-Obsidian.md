---
tags: [integracao, antigravity, obsidian, multi-agente]
data: 2026-11-05
origem: Hermes-Agent
---

# 🔄 Integração Antigravity + Obsidian

## Resumo
O Antigravity (agente com 1018 skills importadas) também usará o Obsidian como cérebro compartilhado, seguindo os mesmos protocolos do Hermes.

## Por que o Antigravity precisa disso?

| Scenario | Sem Obsidian | Com Obsidian |
|----------|--------------|--------------|
| Configuração Traefik | Cada agente reinventa | Consulta nota existente |
| Erros resolvidos | Perdidos entre agentes | Documentados e compartilhados |
| Tokens consumidos | ~12.000/consulta | ~800/consulta |
| Consistência | Baixa | Alta |

## Como Configurar o Antigravity

### 1. Acessar o Cofre
O Antigravity deve usar o mesmo workdir:
```
E:/CofreObsidian
```

### 2. Carregar Skills Relevantes
```yaml
skills:
  - name: obsidian-memory-manager
  - name: github-operations
  # ... outras skills do Antigravity
```

### 3. Executar Checklist
Rodar o checklist em `00 - Protocolos/Checklist-Hermes-Cerebro-Obsidian.md`

### 4. Teste de Integração
```bash
# No Antigravity, testar leitura:
search_files("Traefik", path="E:/CofreObsidian")

# Testar escrita:
write_file("Memórias/Teste-Antigravity.md", "# Teste\n...")
```

## Protocolo de Handoff

Quando Hermes e Antigravity trabalham juntos:

```
┌─────────────┐      ┌─────────────┐      ┌─────────────┐
│   Hermes    │ ───→ │  Obsidian   │ ───→ │ Antigravity │
│  (Principal)│      │  (Cérebro)  │      │  (Backup)   │
└─────────────┘      └─────────────┘      └─────────────┘
       ↓                                       ↓
  Consulta notas                          Consulta notas
  Salva conhecimento                      Salva conhecimento
```

### Regras de Handoff
1. **Ambos leem** antes de responder (não assumem conhecimento)
2. **Ambos escrevem** após resolver (padrãoDocumentado)
3. **Conflitos**: Last Write Wins (LWW) com NTP sincronizado

## Estrutura de Compartilhamento

```
E:/CofreObsidian/
├── Memórias/                    # Ambos leem/escrevem
│   ├── Traefik-srv-app4.md     # Nota compartilhada
│   ├── Git-Obsidian-Sync.md    # Nota compartilhada
│   └── ...
├── Skills/                      # Hermes mantém
│   └── devops/
├── Skills Antigravity/          # Antigravity mantém
│   └── (suas 1018 skills)
├── Memórias Antigravity/        # Antigravity mantém
│   └── (suas notas)
└── 00 - Protocolos/             # Ambos leem
    ├── Checklist-Hermes-Cerebro-Obsidian.md
    └── Handoff-Entre-Agentes.md
```

## Benefícios da Integração

1. **Contexto compartilhado**: Erros resolvidos por um ficam disponíveis para outro
2. **Economia de tokens**: Ambos consultam notas em vez de reprocesar contexto
3. **Consistência**: Configurações não divergem entre agentes
4. **Escalabilidade**: Novos agentes podem ser adicionados lendo as mesmas notas

## Teste de Integração

Para verificar se o Antigravity está integrado corretamente:

```markdown
## Checklist Antigravity

- [ ] Skill `obsidian-memory-manager` carregada?
- [ ] Workdir definido como `E:/CofreObsidian`?
- [ ] Leitura automática antes de respostas técnicas?
- [ ] Escrita automática após tarefas resolvidas?
- [ ] MOC atualizado quando relevante?
- [ ] Senhas mascaradas em notas salvas?

Se todos SIM → Integração OK ✅
```

---

## Related
- [[00 - Protocolos/Handoff-Entre-Agentes]]
- [[00 - Protocolos/Comportamento-Automatico-Memoria]]
- [[Checklist-Hermes-Cerebro-Obsidian]]
- [[Arquitetura-Cerebro-Obsidian]]
