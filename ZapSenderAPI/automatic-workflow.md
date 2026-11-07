# Workflow Automático de Desenvolvimento 🤖🤖🤖

## Como funciona a delegação automática

Quando iniciado, o **Hermes** coordenador ativa automaticamente os outros agentes em sequência:

### FASE 1: Análise (Athena Automática)
```
Hermes → Athena: "Analise requisitos mass messaging ZapSenderAPI"
Athena → Output: Lista de funcionalidades essenciais
```

### FASE 2: Arquitetura (Atlas Automática)
```
Hermes → Atlas: "Basar arquitetura no resultado de Athena"
Atlas → Output: Especificações técnicas
```

### FASE 3: Implementação (Ada Automática)
```
Hermes → Ada: "Implementa conforme Atlas: [especificações]"
Ada → Output: Código compilado e testado
```

### FASE 4: Qualidade (Linus Automática)
```
Hermes → Linus: "Testa implementação de Ada"
Linus → Output: Relatório de qualidade
```

## Comando de Início Automático

Para iniciar o workflow completo automaticamente:

```
npx hermes workflow start --name="zapsender-mass-messaging" --auto
```

## Configuração Automática

```yaml
workflow:
  name: "zapsender-mass-messaging"
  auto_delegation: true
  agents:
    - name: athena
      trigger: "requirements_analysis"
      auto_start: true
    - name: atlas  
      trigger: "architecture_design"
      depends_on: "athena"
      auto_start: true
    - name: ada
      trigger: "code_implementation"
      depends_on: "atlas"
      auto_start: true
    - name: linus
      trigger: "quality_assurance"
      depends_on: "ada"
      auto_start: true
```

## Próximos Comandos Automáticos

1. **Iniciar analisando requirements:**
```
npx hermes auto analyze --project=zapsender --scope=mass-messaging
```

2. **Gerar arquitetura baseada em padrões:**
```
npx hermes auto design --from=athena-output
```

3. **Implementar automaticamente:**
```
npx hermes auto build --target=whatsapp --provider=whatsmeow
```

4. **Testar tudo:**
```
npx hermes auto test --coverage=90
```

## Fluxo Completo Automático

```
START → [Athena] → [Atlas] → [Ada] → [Linus] → DEPLOY
   ↓         ↓        ↓        ↓        ↓
Requirements Architecture Code   Test   Live API
```

**Execute um deles para começar!**