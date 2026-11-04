---
tags: [projeto, integracao, supoclip, zapsender, video-clipping]
data: 2026-10-30
origem: Hermes-Agent
status: Planejamento
---

# 🎬 Integração SupoClip → ZapSender Content Creator

## Objetivo
Trazer a funcionalidade de **recorte inteligente de vídeo (AI Video Clipping)** do SupoClip para dentro do menu **Content Creator** do ZapSender (`/content-creator`), usando a infraestrutura existente (PostgreSQL, Redis, Providers AI, Plans/Quotas).

---

## 1. Arquitetura da Integração

### 1.1 O Que Vem do SupoClip
| Componente | Função | Como Integrar |
|------------|--------|---------------|
| **Transcrição** | AssemblyAI (word-level timestamps) | Serviço novo `TranscriptionService` |
| **Seleção de Clips** | LLM (Gemini/GPT/Claude/Ollama) analisa transcrição | Reusar `SmartAIRouterService` |
| **Recorte Vertical 9:16** | FFmpeg + face detection (MediaPipe) | Worker `VideoClippingWorker` |
| **Legendas Sincronizadas** | Word-level timestamps → ASS/SRT | Serviço `SubtitleService` |
| **Títulos Hook** | LLM gera título viral | Reusar `ContentCreatorService` patterns |
| **B-roll (Pexels)** | Stock footage overlay | Opcional, serviço `BrollService` |
| **Editor Visual** | Trim/split/merge no frontend | Novo componente React no `apps/web` |

### 1.2 O Que Já Existe no ZapSender (Reutilizar)
- ✅ **PostgreSQL + Prisma** — adicionar models `VideoProject`, `VideoClip`, `TranscriptionJob`
- ✅ **Redis** — filas Bull para `video-clipping`, `transcription`
- ✅ **AI Providers** — `SmartAIRouterService` já faz cascade Groq/OpenAI/Gemini/DeepSeek
- ✅ **Plans/Quotas** — `allowAiVideosPerMonth`, `maxAiVideosPerMonth`, `mediaQuotaCycle`
- ✅ **MediaQuotaService** — já controla consumo de imagens/vídeos
- ✅ **Storage S3** — `S3StorageService` para salvar vídeos processados
- ✅ **Webhooks/Evolution** — para notificar conclusão via WhatsApp
- ✅ **Auth Multi-tenant** — `authMiddleware`, `ownerScope`

---

## 2. Mudanças no Backend (`apps/api`)

### 2.1 Novos Models Prisma (`prisma/schema.prisma`)
```prisma
model VideoProject {
  id              String   @id @default(cuid())
  userId          String
  tenantId        String?
  sourceVideoUrl  String   // URL original (S3, local, URL pública)
  sourceVideoName String
  duration        Float    // segundos
  status          VideoProjectStatus @default(PENDING)
  transcriptionId String?
  clips           VideoClip[]
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([userId])
  @@index([tenantId])
}

model TranscriptionJob {
  id              String   @id @default(cuid())
  projectId       String   @unique
  assemblyAiId    String?  // ID do job no AssemblyAI
  status          TranscriptionStatus @default(PENDING)
  transcriptText  String?  @db.Text
  wordTimestamps  Json?    // [{word, start, end, confidence}]
  language        String?
  errorMessage    String?
  createdAt       DateTime @default(now())
  completedAt     DateTime?
}

model VideoClip {
  id              String   @id @default(cuid())
  projectId       String
  index           Int      // ordem no projeto
  startTime       Float    // segundos
  endTime         Float    // segundos
  duration        Float
  title           String   // hook title gerado por IA
  hook            String
  viralityScore   Float    // 0-100
  engagementScore Float
  valueScore      Float
  shareabilityScore Float
  subtitleUrl     String?  // S3 URL do .ass/.srt
  videoUrl        String?  // S3 URL do clip renderizado (9:16)
  thumbnailUrl    String?  // S3 URL
  status          ClipStatus @default(GENERATING)
  brollSegments   Json?    // [{start, end, pexelsUrl, transition}]
  createdAt       DateTime @default(now())
  renderedAt      DateTime?

  @@index([projectId])
}

enum VideoProjectStatus { PENDING TRANSCRIBING TRANSCRIBED CLIPPING RENDERING COMPLETED FAILED }
enum TranscriptionStatus { PENDING PROCESSING COMPLETED FAILED }
enum ClipStatus { GENERATING RENDERING READY FAILED }
```

### 2.2 Novos Serviços (`apps/api/src/services/video/`)
```
services/video/
├── TranscriptionService.ts      # AssemblyAI integration
├── ClipSelectionService.ts      # LLM seleciona melhores trechos
├── SubtitleService.ts           # Gera .ass/.srt word-synced
├── VideoClippingService.ts      # FFmpeg wrapper (crop 9:16, face detect)
├── BrollService.ts              # Pexels stock footage (opcional)
├── VideoProjectService.ts       # Orquestra pipeline completo
└── VideoQuotaService.ts         # Extende MediaQuotaService para vídeos
```

### 2.3 Novas Rotas (`apps/api/src/routes/videoClipping.ts`)
```typescript
// POST   /api/content-creator/video/upload          // Upload vídeo origem
// POST   /api/content-creator/video/process         // Inicia pipeline completo
// GET    /api/content-creator/video/projects        // Lista projetos do usuário
// GET    /api/content-creator/video/projects/:id    // Detalhes + clips
// GET    /api/content-creator/video/clips/:id       // Download/stream clip
// POST   /api/content-creator/video/clips/:id/regenerate // Re-render clip
// DELETE /api/content-creator/video/projects/:id    // Remove projeto
```

### 2.4 Workers (`apps/api/src/workers/videoClippingWorker.ts`)
- Processa fila `video-clipping` (Bull)
- Steps: Transcribe → Select Clips → Render Each Clip → Generate Subtitles → Upload S3 → Notify

---

## 3. Mudanças no Frontend (`apps/web`)

### 3.1 Nova Página/Abas em `/content-creator`
```
apps/web/src/app/(dashboard)/content-creator/
├── page.tsx                    // Dashboard principal (tabs)
├── video-clipping/
│   ├── page.tsx                // Upload + lista projetos
│   ├── project/[id]/page.tsx   // Editor visual do projeto
│   └── components/
│       ├── VideoUploader.tsx
│       ├── ProjectCard.tsx
│       ├── ClipPlayer.tsx
│       ├── ClipEditor.tsx      // Trim, split, merge
│       ├── SubtitleEditor.tsx
│       ├── ExportModal.tsx     // Presets TikTok/Reels/Shorts
│       └── ProgressTracker.tsx // Real-time via Socket.io
├── text-generation/            // (já existe)
└── image-generation/           // (já existe)
```

### 3.2 Integração com Menu Existente
- Adicionar tab **"Video Clipping"** no Content Creator
- Reusar componentes de UI: `MediaQuotaBanner`, `ProviderSelector`, `ExportPresets`

---

## 4. Configuração & Secrets

### 4.1 Novas Env Vars (`.env.example`)
```bash
# AssemblyAI (obrigatório para transcrição)
ASSEMBLY_AI_API_KEY=

# FFmpeg (já deve estar no container Docker)
# Pexels (opcional para B-roll)
PEXELS_API_KEY=

# Video processing limits
MAX_VIDEO_DURATION_SECONDS=7200      # 2h max
MAX_VIDEO_UPLOAD_BYTES=4000000000    # 4GB
VIDEO_CLIPPING_CONCURRENCY=2         # Workers paralelos
```

### 4.2 Docker Compose (Produção)
- Adicionar `ffmpeg` + `libmediapipe` no `Dockerfile` do `apps/api`
- Ou criar serviço separado `video-worker` (recomendado para isolamento)

---

## 5. Pipeline de Processamento (Fluxo)

```
Usuário faz upload (MP4/MOV/WebM, até 4GB)
        │
        ▼
┌───────────────────┐
│ VideoProject      │  Cria registro no BD (status=PENDING)
│ criado no BD      │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│ Fila: transcription│  Bull job → TranscriptionService
│ (AssemblyAI)      │  1. Upload para AssemblyAI
└─────────┬─────────┘  2. Polling webhook / polling
          │           3. Salva word_timestamps no BD
          ▼           4. Atualiza status=TRANSCRIBED
┌───────────────────┐
│ Fila: clip-selection│ Bull job → ClipSelectionService
│ (LLM)             │  1. Envia transcrição + prompt para LLM
└─────────┬─────────┘  2. LLM retorna [{start, end, title, scores, broll_suggestions}]
          │           3. Cria VideoClip records (status=GENERATING)
          ▼
┌───────────────────┐
│ Fila: video-render│ Para CADA clip (paralelo até concurrency)
│ (FFmpeg)          │  1. FFmpeg crop 9:16 + face detect (center)
└─────────┬─────────┘  2. Burn subtitles (.ass) no vídeo
          │           3. Overlay hook title (primeiros 3s)
          ▼           4. B-roll overlay (se habilitado)
┌───────────────────┐  5. Upload S3 → atualiza videoUrl/thumbnailUrl
│ Finalização       │  6. Atualiza ClipStatus=READY
│ Webhook/WS        │  7. Se todos clips READY → ProjectStatus=COMPLETED
└─────────┬─────────┘  8. Socket.io emit 'video-project-completed'
          │           9. Opcional: Evolution API send WhatsApp notification
          ▼
    ✅ PRONTO NO FRONTEND
```

---

## 6. Quotas & Billing (Integração com Plan System)

| Plan Atual | `allowAiVideosPerMonth` | `maxAiVideosPerMonth` | Nova Lógica |
|------------|------------------------|----------------------|-------------|
| STARTER    | false                  | 0                    | Bloqueado |
| PRO        | true                   | 10                   | 10 clips/mês |
| ENTERPRISE | true                   | 50                   | 50 clips/mês |
| CUSTOM     | true                   | configurável         | Conforme plan |

**MediaQuotaService** já suporta `monthlyAiVideosCount` / `monthlyAiMediaResetAt` / `extraAiVideosCredits` → **estender para contar clips renderizados**.

---

## 7. Licença (AGPL-3.0) ⚠️

> **SupoClip é AGPL-3.0**. Se você **modificar o código do SupoClip e rodar como serviço acessível pela rede** (SaaS), **precisa disponibilizar o código fonte completo** para os usuários.

**Opções para ZapSender:**
1. **Manter SupoClip separado** (microserviço) → ZapSender chama via API REST → **não dispara AGPL** no código principal
2. **Fork + reimplementar** a lógica core (transcrição → LLM → FFmpeg) **do zero** no ZapSender → código próprio, sem AGPL
3. **Disponibilizar fonte** do ZapSender se integrar diretamente (AGPL viral)

**Recomendação:** Opção 2 (reimplementar core no ZapSender) ou Opção 1 (microserviço isolado). Vou seguir **Opção 2** pois o ZapSender já tem toda a infra.

---

## 8. Próximos Passos (Ordem de Execução)

| Fase | Tarefa | Estimativa |
|------|--------|------------|
| **1. Foundation** | Adicionar models Prisma + migration | 30 min |
| **2. Transcription** | `TranscriptionService` + AssemblyAI integration | 2h |
| **3. Clip Selection** | `ClipSelectionService` usando `SmartAIRouter` | 1.5h |
| **4. Video Render** | `VideoClippingService` + FFmpeg + face detect | 3h |
| **5. Subtitles** | `SubtitleService` word-synced .ass | 1h |
| **6. Orchestration** | `VideoProjectService` + Workers Bull | 2h |
| **7. API Routes** | CRUD + WebSocket progress | 1.5h |
| **8. Frontend** | Upload, Player, Editor, Export | 4h |
| **9. Quotas** | Integrar `VideoQuotaService` + Plans | 1h |
| **10. Testes** | E2E com vídeo real | 2h |

**Total estimado: ~18h de dev** (pode ser feito em sprints)

---

## 9. Referências no Cofre
- [[Memórias/Configurações Técnicas/REA-Reverse-Engineering|REA]] — para análise do código SupoClip se necessário
- [[Skills/devops/docker-swarm-stack-builder|Docker Swarm Stack Builder]] — para deploy do worker de vídeo
- `E:\ZapSender\apps\api\src\services\ai\contentCreatorService.ts` — padrão de serviços AI
- `E:\ZapSender\apps\api\src\services\ai\imageGenerationService.ts` — padrão geração mídia + quotas
- `E:\ZapSender\apps\api\src\workers\campaign.worker.ts` — padrão workers Bull

---

## 10. Decisão Necessária

**Qual abordagem você prefere?**

| Opção | Descrição | Prós | Contras |
|-------|-----------|------|---------|
| **A. Reimplementar Core** (Recomendado) | Escrever `TranscriptionService`, `ClipSelectionService`, `VideoClippingService` do zero no ZapSender, inspirado no SupoClip | Código próprio (MIT), integração nativa, controle total | Mais dev time |
| **B. Microserviço SupoClip** | Rodar SupoClip como container separado, ZapSender chama REST API | Rápido, usa código testado | AGPL isolado, 2 sistemas para manter |
| **C. Híbrido** | Usar AssemblyAI + FFmpeg do zero, mas copiar prompts/logica de seleção de clips do SupoClip | Equilíbrio | Ainda precisa cuidado com AGPL |

**Minha recomendação: Opção A** — o ZapSender já tem 80% da infra, e reimplementar garante propriedade total do código e integração perfeita com quotas/plans/billing.