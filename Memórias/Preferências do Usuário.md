---
tags: [memoria, preferencias]
---
# Preferências do Usuário

- Responder **SEMPRE em PT-BR** (preferência explícita e reforçada).
- Respostas concisas e focadas em solução.
- Validação iterativa: **ver funcionando** antes de concluir.
- Features completas, correções diretas.
- Prefere **reconstruir** sobre troubleshoot complexo.
- Debugar via busca externa antes de concluir.
- Autoriza instalar CLIs/dependências para concluir tarefas.
- Prefere soluções que evitam reemissão desnecessária de certificados (ex: Traefik v3+ com SANs).

## WhatsApp / Voz
- **NÃO** quer mensagens fixas/pré-geradas — resposta TTS gerada dinamicamente durante a conversa (responde o que o banco/IA retornou).
- Quer **voz feminina BR, jovem, natural, sem sotaque**.
- O clone (`clone_result2.wav`) serviu só para identificar o timbre-alvo (f0≈193Hz); não é clonagem em si.
- OmniVoice em CPU (~10–19 min) é inviável para tempo real.

## Produção de Vídeos & Viralização IA (ZapSender / SupoClip)
- **Fábrica Autônoma Fim a Fim:** O objetivo é ter a IA buscando o assunto na internet, baixando ou gerando o vídeo, legendando e publicando no piloto automático.
- **Atribuição Obrigatória de Créditos:** SEMPRE mencionar a fonte e o criador original (`@autor` e link) nas legendas e copys para compliance de Fair-Use e preservação da conta contra strikes.
- **Dois Modos Claramente Separados:**
  1. *Corte & Repost Puro (Vídeo Real):* Manter o vídeo original, fatiar ganchos virais e legendar sem distorcer personagens ou cenas reais.
  2. *Recriação com IA (Faceless / Cenas):* Roteiro autoral, voz neural e imagens geradas do zero.
- **Escudo Anti-Vinheta:** Remover aberturas/vinhetas repetitivas e telas de encerramento.
- **Qualidade & Proporções:** Preservar resolução nítida (CRF 20, AAC 192k) sem pixelamento nas redes. Suportar 9:16 vertical, 1:1 quadrado, 4:5 feed e 16:9 widescreen.
- **Publicação Flexível:** Permitir publicar em uma única rede individualmente ou em todas simultaneamente (WhatsApp Status, Instagram, TikTok, YouTube).
