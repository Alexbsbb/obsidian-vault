---
tags: [handoff, concluido, release, supoclip, content-creator, automacao]
agente_origem: Antigravity
agente_destino: Qualquer
data_transicao: 2026-10-31 16:40
status: Finalizado
versao: v3.6.93
---

# 📋 Handoff: Fábrica Autônoma de Conteúdo & Vídeos Virais (Release v3.6.93)

## 1. Visão Geral da Sessão
Nesta sessão foi realizada a unificação completa e a evolução do **SupoClip** para uma verdadeira **Fábrica Autônoma de Conteúdo e Vídeos Virais** no ZapSender, cobrindo:
1. **Unificação do Hub Criativo:** Eliminação da divisão entre "Criador de Conteúdo" e "SupoClip". Ambos agora coexistem em `/content-creator` com a aba nativa `SupoClip Vídeos PRO`.
2. **Compatibilidade sem Links Quebrados:** A rota legada `/video-clipping` faz redirecionamento suave para `/content-creator?tab=video-clipping`.
3. **Multi-Formato FFmpeg:** Adicionado suporte nativo a **9:16 Vertical (Blur / Crop)**, **1:1 Quadrado**, **4:5 Retrato Feed** e **16:9 Widescreen original**, com cálculo dinâmico de fontes e margens de legendas.
4. **Downloader Universal de Redes Sociais:** Criação do `VideoDownloaderService.ts` com download de **TikTok sem marca d'água** (via TikWM) e integração do **`yt-dlp`** para YouTube, Shorts, Kwai e Instagram Reels.
5. **Modos de Produção Configuráveis:**
   - **Modo Corte & Repost Puro (Vídeo Real):** Fatiamento, remoção de vinheta e legendas sem alterar o vídeo original.
   - **Modo Recriação com IA (Cenas e Estilos):** Roteirização autoral e geração de novas cenas ilustradas/faceless.
6. **Escudo Anti-Vinheta & Anti-Encerramento:** Controles para pular primeiros 3s a 15s (intro) e últimos 5s a 15s (telas finais).
7. **Atribuição Automática de Créditos:** Extração do `@autor`/canal e injeção obrigatória de linha de crédito nos geradores de copy e legendas da IA para compliance de Fair-Use.
8. **Publicação Flexível com Qualidade Preservada:** Opção de disparar para uma rede individual ou para múltiplas redes simultaneamente com CRF 20 sem pixelamento.

---

## 2. Arquivos Modificados & Implementados
- `apps/api/src/services/video/VideoDownloaderService.ts` *(Novo)*: Motor de download TikTok watermark-free + `yt-dlp`.
- `apps/api/src/services/video/VideoRendererService.ts`: Layouts multi-formato (`SQUARE_1X1`, `FEED_4X5`, `ORIGINAL_16X9`, `BLURRED_9X16`, `CROP_9X16`) e calibração de legendas.
- `apps/api/src/services/video/ClipDetectorService.ts`: Filtros anti-vinheta (`skipIntroSeconds`) e anti-encerramento (`skipOutroSeconds`).
- `apps/api/src/routes/video.ts`: Rotas `/resolve-url`, importação de links, injeção de créditos no `/clips/:id/copy`.
- `apps/api/src/workers/videoClippingWorker.ts`: Opções de layout e corte anti-vinheta no worker Bull.
- `apps/api/Dockerfile`: Instalação de `python3`, `py3-pip` e `yt-dlp` no container runner Alpine.
- `apps/web/src/config/menus.ts`: Menu unificado para *"Criador de Conteúdo & Vídeos (IA)"*.
- `apps/web/src/app/(dashboard)/content-creator/page.tsx`: Inclusão da aba nativa `SupoClip Vídeos PRO`, suporte a URL param `?tab=video-clipping` e exportação cruzada de ganchos.
- `apps/web/src/app/(dashboard)/video-clipping/page.tsx`: Redirect automático.
- `apps/web/src/components/video-clipping/VideoClippingStudio.tsx`: Interface completa com seletor de arquivos locais ou links de redes, badges de detecção, seleção de modos e exibição de créditos.
- `portainer-stack-riquest.yml`: Stack atualizada para a tag `v3.6.93`.

---

## 3. Estado das Verificações
- **TypeScript:** `npx tsc --noEmit` passou em `apps/web` e `apps/api` com 0 erros.
- **Testes Unitários:** 28 arquivos e 252 testes Vitest passando (100% de cobertura nos fluxos principais).
- **Docker Imagens:** Publicadas com sucesso no GitHub Container Registry:
  - `ghcr.io/alexbuzatto/zapsender-api:v3.6.93` (+ `latest`)
  - `ghcr.io/alexbuzatto/zapsender-web:v3.6.93` (+ `latest`)
- **Git:** Commit e tag `v3.6.93` enviados para o repositório remoto.

---

## 4. Próxima Etapa Recomendada
- No Portainer do servidor de produção, clicar em **"Update the stack"** com a tag `v3.6.93` para puxar as novas imagens e testar a importação ao vivo de um link do TikTok ou YouTube.

