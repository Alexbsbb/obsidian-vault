---
tags: [script, verificação, sistema, integração, git]
data: 2026-11-05
origem: Hermes-Agent
---

# 🔧 Script de Verificação do Sistema do Agente

## Uso
Copie E COLE em QUALQUER Hermes Agent para verificar SE SEU SISTEMA está integrado ao cérebro Obsidian:

```bash
echo "══════════════════════════════════════════" && \
echo "   VERIFICAÇÃO DO SISTEMA DO AGENTE" && \
echo "══════════════════════════════════════════" && \
echo "" && \
echo "📊 STATUS DO CÉREBRO OBSIDIAN:" && \
echo "──────────────────────────────────────────" && \
echo -n "🧠 Skill obsidian-memory-manager: " && \
(skill_view name="obsidian-memory-manager" > /dev/null 2>&1 && echo "✅ CARREGADA" || echo "❌ NÃO CARREGADA") && \
echo -n "📁 Workdir padrão: " && \
([ "$PWD" = "E:/CofreObsidian" ] && echo "✅ $PWD" || echo "⚠️  $(pwd) (deve ser E:/CofreObsidian)") && \
echo -n "📖 Consegue ler notas: " && \
(search_files "Traefik" path="E:/CofreObsidian" limit=1 > /dev/null 2>&1 && echo "✅ SIM" || echo "❌ NÃO") && \
echo -n "✍️  Consegue escrever: " && \
(write_file "Memórias/_test_write.txt" "test" 2>/dev/null && rm "Memórias/_test_write.txt" 2>/dev/null && echo "✅ SIM" || echo "❌ NÃO") && \
echo -n "🗺️  MOC atualizado: " && \
([ -f "00 - Início.md" ] && echo "✅ SIM ($(grep -c '##' '00 - Início.md' 2>/dev/null || echo 0) seções)" || echo "❌ NÃO") && \
echo "" && \
echo "🔗 STATUS DO GIT:" && \
echo "──────────────────────────────────────────" && \
echo -n "📦 Repositório: " && \
(git remote -v | grep origin | head -1 | awk '{print $2}' || echo "NÃO CONFIGURADO") && \
echo -n "🔄 Último sync: " && \
(git log --oneline -1 2>/dev/null || echo "NENHUM COMMIT") && \
echo -n "📡 Status: " && \
(git status --porcelain 2>/dev/null | wc -l | xargs -I{} echo "{} arquivo(s) pendente(s)" || echo "ERRO") && \
echo "" && \
echo "🧪 TESTE DE INTEGRACÃO:" && \
echo "──────────────────────────────────────────" && \
TESTFILE="Memórias/_integration_test_$(date +%s).md" && \
if write_file "$TESTFILE" "# Teste de Integração\nData: $(date '+%Y-%m-%d %H:%M')" 2>/dev/null; then
    echo "✅ Escrita testada com sucesso"
    rm "$TESTFILE" 2>/dev/null
else
    echo "❌ Falha na escrita"
fi && \
echo "" && \
echo "══════════════════════════════════════════" && \
echo "   RESULTADO:" && \
echo "══════════════════════════════════════════" && \
if skill_view name="obsidian-memory-manager" > /dev/null 2>&1 && \
   search_files "Traefik" path="E:/CofreObsidian" limit=1 > /dev/null 2>&1 && \
   [ -f "00 - Início.md" ]; then
    echo "✅ SISTEMA INTEGRADO AO CÉREBRO OBSIDIAN"
    echo "✅ Agente está pronto para operar"
else
    echo "❌ SISTEMA NÃO INTEGRADO"
    echo "⚠️  Execute: skill_manage action=create name=obsidian-memory-manager"
    echo "⚠️  Configure workdir para E:/CofreObsidian"
fi
```

---

## Exemplo de Saída (Sucesso)

```
══════════════════════════════════════════
   VERIFICAÇÃO DO SISTEMA DO AGENTE
══════════════════════════════════════════

📊 STATUS DO CÉREBRO OBSIDIAN:
──────────────────────────────────────────
🧠 Skill obsidian-memory-manager: ✅ CARREGADA
📁 Workdir padrão: ✅ E:/CofreObsidian
📖 Consegue ler notas: ✅ SIM
✍️  Consegue escrever: ✅ SIM
🗺️  MOC atualizado: ✅ SIM (8 seções)

🔗 STATUS DO GIT:
──────────────────────────────────────────
📦 Repositório: https://github.com/Alexbsbb/obsidian-vault.git
🔄 Último sync: f5e8217 Adicionar script único de verificação
📡 Status: 0 arquivo(s) pendente(s)

🧪 TESTE DE INTEGRACÃO:
──────────────────────────────────────────
✅ Escrita testada com sucesso

══════════════════════════════════════════
   RESULTADO:
══════════════════════════════════════════
✅ SISTEMA INTEGRADO AO CÉREBRO OBSIDIAN
✅ Agente está pronto para operar
```

---

## Exemplo de Saída (Falha)

```
...
🧠 Skill obsidian-memory-manager: ❌ NÃO CARREGADA
📁 Workdir padrão: ⚠️  C:\Users\Alex (deve ser E:/CofreObsidian)
...
❌ SISTEMA NÃO INTEGRADO
⚠️  Execute: skill_manage action=create name=obsidian-memory-manager
⚠️  Configure workdir para E:/CofreObsidian
```

---

## Related
- [[Arquitetura-Cerebro-Obsidian]]
- [[Git-Obsidian-Sync]]
- [[Integracao-Antigravity-Obsidian]]
