---
tags: [memoria, padrao, verificacao, padronizacao]
data: 2026-11-05
origem: Hermes-Agent
---

# Padrão de Verificação: Cérebro Obsidian

## Resumo
Comando único para verificar se qualquer Hermes Agent (padrão ou Antigravity) está integrado ao cérebro compartilhado.

## Comando Único (Copiar e Colar)

```markdown
# VERIFICAÇÃO ÚNICA: CÉREBRO OBSIDIAN

Você é um Hermes Agent. Execute TODAS as verificações abaixo em sequência:

## 1️⃣ CARREGAR SKILL
```bash
skill_view(name="obsidian-memory-manager")
```

## 2️⃣ VERIFICAR WORKDIR
```bash
cd "E:/CofreObsidian" && pwd
```

## 3️⃣ TESTAR LEITURA
```bash
search_files("Traefik", path="E:/CofreObsidian", limit=3)
```

## 4️⃣ TESTAR ESCRITA
```bash
write_file("Memórias/Teste-Verificacao.md", "# Teste\nVerificação de integração.")
```

## 5️⃣ VERIFICAR MOC
```bash
read_file("00 - Início.md", offset=1, limit=50)
```

## 6️⃣ VERIFICAR PROTOCOLOS
```bash
read_file("00 - Protocolos/Comportamento-Automatico-Memoria.md", limit=30)
```

## 7️⃣ VERIFICAR HANDOFF (se Antigravity)
```bash
read_file("00 - Protocolos/Handoff-Entre-Agentes.md", limit=30)
```

---

## 📊 RETORNE O RESULTADO

```
╔══════════════════════════════════════════╗
║   VERIFICAÇÃO CÉREBRO OBSIDIAN           ║
╠══════════════════════════════════════════╣
║ Skill:           [OK/ERROR]              ║
║ Workdir:         [OK/ERROR]              ║
║ Leitura:         [OK/ERROR]              ║
║ Escrita:         [OK/ERROR]              ║
║ MOC:             [OK/ERROR]              ║
║ Protocolos:      [OK/ERROR]              ║
║ Handoff (AG):    [OK/ERROR]              ║
╠══════════════════════════════════════════╣
║ TOTAL: X/7 OK                              ║
║ STATUS: [INTEGRADO/NECESSITA AJUSTES]     ║
╚══════════════════════════════════════════╝
```

Se houver erros, liste os ajustes necessários.
```

---

## Exemplo de Resposta Esperada

```
╔══════════════════════════════════════════╗
║   VERIFICAÇÃO CÉREBRO OBSIDIAN           ║
╠══════════════════════════════════════════╣
║ Skill:           ✅ OK                   ║
║ Workdir:         ✅ OK                   ║
║ Leitura:         ✅ OK (3 notas)         ║
║ Escrita:         ✅ OK                   ║
║ MOC:             ✅ OK                   ║
║ Protocolos:      ✅ OK                   ║
║ Handoff (AG):    ✅ OK                   ║
╠══════════════════════════════════════════╣
║ TOTAL: 7/7 OK                              ║
║ STATUS: ✅ INTEGRADO                       ║
╚══════════════════════════════════════════╝
```

---

## Related
- [[00 - Protocolos/Comando-Unico-Verificacao]]
- [[00 - Protocolos/Comando-Verificacao-Cerebro]]
- [[Arquitetura-Cerebro-Obsidian]]
- [[Integracao-Antigravity-Obsidian]]
