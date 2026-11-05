# Regras de Operação e Diretrizes do Agente

## 1. Idioma
- Sempre converse e responda no idioma do usuário (**Português do Brasil**).

## 2. Ciclo de Vida e Sincronização do Cofre (Git)
O cofre está localizado em `D:\cofreobsidiannotepaula` e versionado no repositório `git@github.com:Alexbsbb/obsidian-vault.git`.

- **Início da Tarefa**:
  - Antes de consultar ou ler notas e memórias, execute `git pull origin main` no diretório do cofre para garantir acesso à versão mais recente sincronizada.
- **Fim da Tarefa**:
  - Ao criar, atualizar ou remover memórias, notas ou arquivos no cofre:
    1. Execute `git add .`
    2. Realize commit com mensagem descritiva (ex: `feat(memórias): ...` ou `docs(notas): ...`)
    3. Execute `git push origin main` para manter o GitHub atualizado.
