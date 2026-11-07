---
name: rea-reverse-engineer-anything
description: Guia completo e integração da ferramenta REA (Reverse Engineer Anything) via MCP e CLI para inspeção binária, engenharia reversa de aplicações Electron/JS, .NET, Android APKs, Web e criação de ambientes RL.
tags: [antigravity-skill, engenharia-reversa, mcp, rea]
categoria: ferramentas
data: 2026-11-05
---

# REA: Reverse Engineer Anything

Repositório Oficial: [morluto/rea](https://github.com/morluto/rea)  
Documentação: [rea.tools](https://rea.tools/)  
Pacote NPM: `rea-agents` (versão instalada: `6.8.0`)

---

## 1. Visão Geral

O **REA** é um ecossistema unificado de engenharia reversa projetado especificamente para agentes de IA e desenvolvedores. Ele fornece uma interface padronizada via **Model Context Protocol (MCP)** e CLI, permitindo inspecionar executáveis, aplicativos empacotados, tráfego de rede e comportamento em tempo de execução sem acesso prévio ao código-fonte.

### Filosofia Central: Proveniência de Evidências
O REA diferencia rigorosamente:
1. **Observações:** Bytes, strings, cabeçalhos, chamadas de sistema e traces diretamente lidos.
2. **Derivações:** Estruturas decodificadas, grafos de controle de fluxo e árvores de dependência sintaticamente comprovadas.
3. **Inferências:** Hipóteses geradas pelo modelo ou heurísticas com grau de incerteza documentado.
4. **Desconhecidos (Unknowns):** Lacunas explicitamente delimitadas, impedindo alucinações.

---

## 2. Capacidades e Alvos Suportados

| Alvo | O que o REA inspeciona / extrai | Requisitos / Motores |
| :--- | :--- | :--- |
| **Aplicações JavaScript / Electron** | Módulos empacotados, arquivos ASAR, source maps, rotas IPC, pontes de renderer e add-ons nativos | Nativo (Node.js/npm) |
| **Binários Nativos (PE, ELF, Mach-O)** | Pseudocódigo, desassembly, tabelas de import/export, strings, referências cruzadas e funções | Hopper, Ghidra, IDA Pro ou Kuna |
| **Binários Go** | Versão do compilador embutido, lista de módulos, flags de build e substituições | Estático nativo (sem Go instalado) |
| **Binários Rust** | Dependências embutidas (`cargo-auditable`), versões e crate graph | Estático nativo |
| **Assemblies .NET** | Metadados, instruções CIL / IL, dependências nativas e comparações de build | Estático nativo |
| **Aplicativos Android (APK / AAB)** | Manifesto descompilado, classes Dalvik/Smali, métodos e fluxos | Headless JADX / JDK |
| **Assinaturas de APK** | Esquemas v1/v2/v3/v3.1, certificados X.509, integridade de digests | Estático nativo |
| **Metadados IL2CPP (Unity)** | `global-metadata.dat`, nomes de tipos, métodos e índices (v24, 27, 29, 31, 39) | Estático nativo (sem Unity) |
| **Pacotes Godot (.PCK)** | Inventário do arquivo, extração de assets e cabeçalhos (v2, v3, v4) | Estático nativo (sem Godot) |
| **Web e Navegador** | Estrutura DOM, scripts executados, inspeção de rede, capturas HAR/SAZ e screenshots | Navegador Chrome / Chromium |
| **Artefatos de Modelos de IA** | Metadados e tensores GGUF / safetensors, arquitetura de camadas e tipos | Estático nativo |
| **Bytecode WebAssembly (WASM)** | Validação de seções, imports/exports e descompilação WAT | WABT |
| **Bytecode EVM** | Seletores de função, offsets, inferência de argumentos e mutabilidade | Estático nativo |
| **Executáveis PyInstaller** | Extração de CArchive, versão do Python e bytecode .pyc | Estático nativo |
| **Ambientes de RL (AgentEnv)** | Construção de ambientes locais simulados para treino de agentes a partir de gravações HTTP/HAR | AgentEnv + Docker |

---

## 3. Configuração no Antigravity

* **Arquivo de Configuração MCP:** `C:\Users\PAULA\.gemini\config\mcp_config.json`
* **Definição do Servidor:**
  ```json
  {
    "mcpServers": {
      "rea": {
        "command": "cmd.exe",
        "args": [
          "/d",
          "/c",
          "npx",
          "-y",
          "rea-agents@6.8.0",
          "mcp"
        ]
      }
    }
  }
  ```
* **Skill instalada:** `C:\Users\PAULA\.gemini\config\skills\reverse-engineer-anything`
* **Node.js Homologado:** v22.23.4 (mínimo exigido para zstd decompress nativo).

---

## 4. Comandos Essenciais da CLI

```bash
# Diagnóstico de integridade do REA e dos clientes conectados
npx rea-agents doctor

# Diagnóstico com foco específico no Antigravity
npx rea-agents doctor --client antigravity

# Análise estática direta de um aplicativo JavaScript / Electron / ASAR
npx rea-agents analyze-javascript-application "D:/caminho/para/app" --json

# Criação de ambiente de Reinforcement Learning (RL) a partir de gravação de rede
rea environment-build ./session.har ./meu-ambiente --name meu-ambiente --json
```

---

## 5. Como o Agente Utiliza o REA

1. **Recepção da Demanda:** Usuário solicita entender como uma funcionalidade de um software fechado ou extraído funciona.
2. **Triagem de Alvo:** O agente escolhe a ferramenta específica do catálogo MCP de acordo com a extensão/natureza do arquivo (`analyze_javascript_application`, `open_binary`, `inspect_artifact`, etc.).
3. **Coleta de Evidências:** Retorno de trechos de pseudocódigo, traces e referências cruzadas com hashes de integridade.
4. **Reconstrução/Implementação:** O agente produz o código equivalente ou documentação fiel baseando-se estritamente nas evidências coletadas.
