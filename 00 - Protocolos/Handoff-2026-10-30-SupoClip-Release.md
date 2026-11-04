---
tags: [handoff, concluido, release]
agente_origem: Antigravity
agente_destino: Qualquer
data_transicao: 2026-10-30 21:33
status: Finalizado
versao: v3.6.90
---

# 📋 Estado da Tarefa: Integração Completa do SupoClip (Video Clipping)

## 1. Contexto Geral
Implementação completa da funcionalidade de corte e cliping inteligente de vídeos (SupoClip) no ZapSender, com suporte multi-provedor (AssemblyAI, Groq Whisper e OpenAI Whisper), configurações direto na interface, presets de legendas virais (Hormozi, MrBeast, Minimal, Neon), enquadramento 9:16 (Fundo Desfocado e Crop), disparo nativo para WhatsApp, gerador de copy e hashtags por IA, e fila assíncrona Bull.

## 2. O Que Foi Feito
- [x] Modelagem de dados Prisma (`VideoProject`, `TranscriptionJob`, `VideoClip`) e migração SQL aplicada.
- [x] Suporte híbrido multi-provedor de transcrição com timestamps a nível de palavra: AssemblyAI, Groq Whisper (`whisper-large-v3`) e OpenAI Whisper (`whisper-1`).
- [x] Modal de Configurações de IA & Chaves diretamente na interface para cadastrar a chave da AssemblyAI ou alternar entre Groq e OpenAI sem precisar de `.env`.
- [x] Presets visuais de legendas dinâmicas no FFmpeg: `HORMOZI` (amarelo/branco bold), `MRBEAST` (verde/ciano neon), `MINIMAL` (branco clean), `NEON` (magenta/amarelo) e `NONE`.
- [x] Opções de enquadramento vertical 9:16: Fundo Desfocado inteligente (`BLURRED_9X16`) e Recorte Total Centralizado (`CROP_9X16`).
- [x] Modal de Novo Projeto completo com seleção de legendas, layout, idioma, filtros de ganchos virais e checkbox de Piloto Automático (1-Clique).
- [x] Botão de disparo direto para WhatsApp (`POST /api/video/clips/:id/share-whatsapp`) usando as instâncias conectadas.
- [x] Botão de geração de Copy Viral & Hashtags (`POST /api/video/clips/:id/copy`) formatada para TikTok, Instagram Reels e YouTube Shorts.
- [x] Edição de minutagem inicial/final de corte (`PUT /api/video/clips/:id`) e re-renderização com novo estilo.
- [x] Testes unitários Vitest: 28 arquivos, 252 testes 100% passando.
- [x] Docker Release `v3.6.90` construída e enviada com sucesso para `ghcr.io/alexbuzatto/zapsender-api:v3.6.90` e `zapsender-web:v3.6.90`.

## 3. Próximo Passo Imediato
> Atualizar a stack no Portainer para puxar a versão `v3.6.90` (`ghcr.io/alexbuzatto/zapsender-api:v3.6.90` e `zapsender-web:v3.6.90`).


