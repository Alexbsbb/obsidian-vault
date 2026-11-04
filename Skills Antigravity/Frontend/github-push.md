---
tags: [antigravity-skill, frontend]
categoria: "Frontend"
origem: Antigravity
---

# github-push

**Descrição:** Automates git pull, add, commit, and push for GitHub synchronization.

---

## Conteúdo Original

---
description: Automates git pull, add, commit, and push for GitHub synchronization.
---
tags: [antigravity-skill]
categoria: sem-categoria

Este workflow automatiza o processo de sincronização com o GitHub.

// turbo
1. Verifique o status atual do repositório
```powershell
git status
```

// turbo
2. Sincronize com o repositório remoto (Pull)
```powershell
git pull
```

// turbo
3. Adicione todos os arquivos modificados
```powershell
git add .
```

// turbo
4. Realize o commit (você pode alterar a mensagem se desejar)
```powershell
git commit -m "Auto-sync: $(Get-Date -Format 'yyyy-MM-dd HH:mm:ss')"
```

// turbo
5. Envie as modificações para o GitHub (Push)
```powershell
git push
```

