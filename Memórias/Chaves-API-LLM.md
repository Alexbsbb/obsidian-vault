---
tags: [memoria, config, llm-keys]
data: 2026-10-31
origem: Hermes-Agent
---
# Chaves de API de Provedores LLM

## Visão geral
Documentação das chaves de API exportadas do `freellmapi` em 31/10/2026. Contém credenciais para múltiplos provedores de modelos de linguagem.

## Plataformas e chaves

| Plataforma | Chave (mascarada) | Observações |
|------------|-------------------|-------------|
| apinex | `sk-apx...[redacted]` | |
| bai | `sk-1xva...[redacted]` | |
| beatapi | `sk-dkEk...[redacted]` | |
| cerebras | `csk-v455...` | |
| exa | `a0b059f7...` | |
| firecrawl | `fc-bf61...` | |
| google | `AQ.Ab8...` | |
| groq | `gsk_Vjr6...` | |
| inferbase | `inf_t2fW...` | |
| iteracompute | `sk--KWV...` | |
| keenable | `keen_k3s...` | |
| kenari | `kn-3a64...` | |
| kilo | `eyJhbGci...` | JWT-based auth |
| kiosapi | `kios_live_...` | |
| linkup | `lk_ym4a...` | |
| llmtr | `llmtr-b834...` | |
| nvidia | `nvapi-3Jhp...` | |
| ollama | `dc7b5785...` | Local/inicial |
| onomeo | `sk-onomeo...` | |
| opencode | `oc_sk_560a...` | |
| openrouter | `sk-or-v1...` | Free tier disponível |
| router9 | `sk-r9k-...` | |
| serpsearch | `gt_live_...` | |
| simplellm | `sk-simplellm...` | |
| tavily | `tvly-dev...` | Busca web |
| unorouter | `sk-VJtyX...` | |
| xkiro | `sk-xt-...` | Dois tokens |
| xkiro | `sk-xt-...` | *Paula* (rótulo) |

## Aviso de segurança
- **Não compartilhe estas chaves publicamente** - podem ser usadas para acessar serviços pagos ou gerar custos indesejados
- As chaves `kilo` usam autenticação JWT
- O provedor `openrouter` tem chave gratuita (`:free`) disponível
- Verificar periodamente se as chaves ainda são válidas

## Próximos passos
- Testar conexão com provedores principais (openrouter, groq, google)
- Rotacionar chaves sensíveis quando possível
- Documentar quais provedores estão ativamente em uso