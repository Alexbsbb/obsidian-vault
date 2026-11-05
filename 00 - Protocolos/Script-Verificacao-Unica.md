---
tags: [script, verificacao, padrao, unico]
data: 2026-11-05
origem: Hermes-Agent
---

# 🚀 Script Único: Verificação Cérebro Obsidian

## Uso
Copie E COLE EM QUALQUER TERMINAL DO AGENTE:

```bash
# VERIFICAÇÃO COMPLETA DO CÉREBRO OBSIDIAN
echo "=== VERIFICANDO CÉREBRO OBSIDIAN ===" && \
cd "E:/CofreObsidian" && \
echo "📁 Workdir: $(pwd)" && \
echo "📦 Skill: $(skill_view obsidian-memory-manager 2>/dev/null | head -1 || echo 'NÃO CARREGADA')" && \
echo "📖 Teste Leitura: $(search_files 'Traefik' path='E:/CofreObsidian' limit=1 2>/dev/null | head -1 || echo 'ERRO')" && \
echo "✍️  Teste Escrita: $(write_file 'Memórias/Verificacao-Teste.txt' 'OK' 2>/dev/null && echo '✅ OK' || echo '❌ ERRO')" && \
echo "🗺️  MOC: $(grep -c '##' '00 - Início.md' 2>/dev/null || echo 'ERRO') seções encontradas" && \
echo "📋 Protocolos: $(ls '00 - Protocolos/' 2>/dev/null | wc -l || echo '0') arquivos" && \
echo "🔗 Handoff: $(cat '00 - Protocolos/Handoff-Entre-Agentes.md' 2>/dev/null | head -3 || echo 'NÃO ENCONTRADO')" && \
rm -f 'Memórias/Verificacao-Teste.txt' 2>/dev/null && \
echo "" && \
echo "✅ VERIFICAÇÃO CONCLUÍDA"
```

---

## Versão Compacta (uma linha)

```bash
cd "E:/CofreObsidian" && echo "Workdir: $(pwd)" && echo "Skill: $(skill_view obsidian-memory-manager 2>/dev/null | head -1)" && echo "Leitura: $(search_files Traefik 2>/dev/null | head -1)" && echo "Escrita: $(write_file Memórias/teste-$(date +%s).txt OK 2>/dev/null && rm Memórias/teste-*.txt 2>/dev/null && echo OK || echo ERRO)" && echo "MOC: $(grep -c '##' 00\ -\ Início.md 2>/dev/null || echo 0) seções"
```

---

## Resultado Esperado

```
=== VERIFICANDO CÉREBRO OBSIDIAN ===
📁 Workdir: E:/CofreObsidian
📦 Skill: ✅ Carregada - obsidian-memory-manager
📖 Teste Leitura: Memórias/Configurações Técnicas/Traefik-srv-app4.md
✍️  Teste Escrita: ✅ OK
🗺️  MOC: 8 seções encontradas
📋 Protocolos: 5 arquivos
🔗 Handoff: Protocolo de troca de contexto entre agentes

✅ VERIFICAÇÃO CONCLUÍDA
```

---

## Related
- [[00 - Protocolos/Comando-Unico-Verificacao]]
- [[Arquitetura-Cerebro-Obsidian]]
- [[Integracao-Antigravity-Obsidian]]
