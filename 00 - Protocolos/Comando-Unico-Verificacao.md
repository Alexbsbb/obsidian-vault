---
tags: [checklist, comando, unico, verificacao, padrao]
data: 2026-11-05
origem: Hermes-Agent
---

# 📋 Comando Único: Verificação Completa Cérebro Obsidian

## Uso
Copie E COLE ESTE COMANDO em QUALQUER Hermes Agent (padrão ou Antigravity):

---

```markdown
# VERIFICAÇÃO ÚNICA: CÉREBRO OBSIDIAN

Você é um Hermes Agent. Execute TODAS as verificações abaixo em sequência e retorne o resultado formatado.

## 1️⃣ CARREGAR SKILL
```bash
skill_view(name="obsidian-memory-manager")
```
✅ Status: [carregada/não carregada]

## 2️⃣ VERIFICAR WORKDIR
```bash
cd "E:/CofreObsidian" && pwd
```
✅ Status: [E:/CofreObsidian/outro]

## 3️⃣ TESTAR LEITURA
```bash
search_files("Traefik", path="E:/CofreObsidian", limit=3)
```
✅ Status: [encontrou X notas/não encontrou]

## 4️⃣ TESTAR ESCRITA
```bash
write_file("Memórias/Teste-Verificacao-{timestamp}.md", "# Teste\nVerificação de integração do cérebro Obsidian.")
```
✅ Status: [criado/com erro]

## 5️⃣ VERIFICAR MOC
```bash
read_file("00 - Início.md", offset=1, limit=50)
```
✅ Status: [atualizado/com erro]

## 6️⃣ VERIFICAR PROTOCOLOS
```bash
read_file("00 - Protocolos/Comportamento-Automatico-Memoria.md", limit=30)
```
✅ Status: [encontrado/não encontrado]

## 7️⃣ VERIFICAR HANDOFF (se Antigravity)
```bash
read_file("00 - Protocolos/Handoff-Entre-Agentes.md", limit=30)
```
✅ Status: [encontrado/não encontrado]

---

## 📊 RESULTADO FINAL

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

## 🔧 Ajustes Necessários (se houver)

```
1. [ajuste 1]
2. [ajuste 2]
...
```

---

## RESPOSTA ESPERADA

Retorne APENAS:
1. Status de cada verificação (✅/❌)
2. Caixinha de resultado final
3. Lista de ajustes se necessário

NÃO explique o processo, apenas os resultados.
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
- [[00 - Protocolos/Checklist-Hermes-Cerebro-Obsidian]]
- [[00 - Protocolos/Comando-Verificacao-Cerebro]]
- [[Arquitetura-Cerebro-Obsidian]]
- [[Integracao-Antigravity-Obsidian]]
