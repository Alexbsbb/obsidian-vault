---
tags: [ferramenta, rea, reverse-engineering, mcp, binary-analysis]
data: 2026-10-30
origem: Hermes-Agent
fonte: https://github.com/morluto/rea
---

# REA — Reverse Engineer Anything

## 📋 Visão Geral
**REA (Reverse Engineer Anything)** é um servidor MCP que conecta agentes a ferramentas de inspeção de:
- **Binários nativos** (pseudocódigo, assembly, strings, símbolos) — via Hopper, Ghidra, IDA
- **Apps JavaScript/Electron** (módulos, imports, source maps, IPC, native add-ons)
- **Assemblies .NET**
- **Websites** (estrutura, scripts, network, screenshots)
- **Binários Go/Rust** (versões compilador, módulos, dependências)
- **WASM, EVM bytecode, SQLite, Crash dumps, Network captures (HAR/SAZ)**

**Site:** https://rea.tools | **npm:** `rea-agents` | **Licença:** MIT

## ⚡ Instalação Rápida
```bash
# Node.js 22.x (>=22.19), 24.x (>=24.11), ou 26+ + npm obrigatórios
npx rea-agents setup
```
- Escolhe seus agentes (Claude Code, Codex, Cursor, Gemini CLI, Grok Build, etc.)
- Registra servidor MCP + instruções de workflow
- Faz backup das configs existentes
- **Reinicie o agente após setup**

## 🎯 Uso via Agente
```
"Entenda como a busca funciona no app Notes, mostre as evidências,
e construa uma feature similar pro meu projeto."
```
O agente chama REA via MCP → inspeciona o target → retorna achados com evidências → agente explica/implementa/testa.

## 🖥️ Uso via Terminal (CLI)
```bash
# Análise estática JS/Electron (sem engine nativo)
npx -y rea-agents@latest analyze-javascript-application /caminho/absoluto/app --json

# Instalar comando global `rea`
npm install --global rea-agents
rea --help

# Atualizar
rea update
# ou
npx rea-agents@latest setup
```

## 🔧 Requisitos por Target

| Target | Requisitos |
|--------|------------|
| **Nativos (ELF/PE/Mach-O)** | Hopper, Ghidra ou IDA Pro (licenciados) |
| **Go / Rust binaries** | Built-in (sem instalação extra) |
| **WASM** | WABT 1.0.42 |
| **EVM bytecode** | pwntools (Linux x64) |
| **SQLite** | Node.js 24.15+ ou 26+ |
| **Crash dumps Linux** | pwntools + opcional GDB/pwndbg |
| **JS/Electron** | Node.js + npm; Linux: `procps` (`ps`) |
| **Websites** | Chrome-family browser |
| **Network captures** | HAR/SAZ; mitmdump (Linux) |

## 🔑 Integração com Nosso Ambiente

### Para usar no srv-app4 / Hermes / Antigravity:
1. **Instale no desktop** (onde roda o agente): `npx rea-agents setup` → escolha Hermes/Claude Code
2. **Reinicie o agente** → REA aparece como ferramenta MCP
3. **Peça análise**: "Analise o binário X em /path/to/binary com REA"

### Casos de Uso Relevantes Pra Nós:
- **Debug de containers** que crasham (análise de crash dumps)
- **Inspecionar binários Go/Rust** de serviços (ex: Traefik, Portainer agent, OmniRoute)
- **Engenharia reversa de APIs** de apps Electron/desktop que usamos
- **Análise de WASM** se aparecer em frontends
- **Binários offline** (ELF layout, mitigações estáticas)

## 📚 Documentação Oficial
- **Guias:** https://rea.tools/guides/
- **Showcases:** https://rea.tools/showcase/
- **CLI & Evidence:** https://github.com/morluto/rea/blob/main/docs/cli.md
- **MCP Contracts:** https://github.com/morluto/rea/blob/main/docs/mcp-contracts.md
- **Native Investigation:** https://github.com/morluto/rea/blob/main/docs/native-investigation.md
- **JS Application Workflows:** https://github.com/morluto/rea/blob/main/docs/javascript-application-workflows.md

## ⚠️ Legal / Ética
- **Só use em software que você possui ou tem autorização** (pesquisa lícita, interoperabilidade, preservação)
- REA **não concede licença** de ferramentas comerciais (IDA Pro, Hopper, JEB)
- Cracks, keys roubadas, bypass de licença = **não autorizado**
- Ver `DISCLAIMER.md` e `SECURITY.md` no repo

## 🔗 Relacionados no Cofre
- [[Memórias/Configurações Técnicas/Traefik-srv-app4|Traefik srv-app4]] — binário Go, pode inspecionar com REA
- [[Memórias/Configurações Técnicas/Portainer-srv-app4|Portainer srv-app4]] — agent é binário Go
- [[Skills/devops/docker-swarm-stack-builder|Docker Swarm Stack Builder]] — para deployar ferramentas de análise