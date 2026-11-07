# Relatório de Coordenação: Aplicação Web de Notas Pessoais

## Visão Geral

Projeto: **NotesApp** - Aplicação web para organização de notas pessoais  
Data: 07/11/2026  
Status: Planejamento (preparação para desenvolvimento)

---

## 🧠 ATHENA - Requirements para MVP

### Funcionalidades Essenciais
1. **CRUD de Notas**
   - Criar nota com título, conteúdo (Markdown), tags
   - Ler notas (lista, detalhe)
   - Atualizar notas existentes
   - Excluir notas

2. **Organização**
   - Tags/categorias personalizadas
   - Busca por palavras-chave
   - Filtros por data (criação/edição)
   - Ordem personalizada (arrastar e soltar)

3. **Armazenamento**
   - Persistência local (IndexedDB/FS)
   - Sincronização opcional com cloud
   - Backup automático

### Funcionalidades Secundárias (Pos-PONTO)
- Compartilhamento público/privado
- Comentários em notas
- Templates de notas
- Modo escuro

---

## 🏗️ ATLAS - Arquitetura Sugerida

### Stack Técnica Recomendada

**Frontend (SPA):**
- Framework: **React + Vite** (ou Vue 3 + Vite)
- Estado: Zustand (leve) ou Zustand + Context API
- UI: TailwindCSS + shadcn/ui
- Markdown: marked.js ou remark

**Backend (API):**
- Linguagem: **Go** (inspirado no ZapSenderAPI)
- Framework: Gin
- Banco: SQLite (local) ou PostgreSQL (produção)
- JWT: Autenticação opcional

**Arquitetura:**
```
frontend/
├── src/
│   ├── components/   # UI components reutilizáveis
│   ├── pages/        # Rotas da aplicação
│   ├── lib/          # Utils e hooks
│   ├── stores/       # Estado global
│   └── types/        # TypeScript interfaces
└── public/

backend/
├── cmd/
│   └── server/
├── pkg/
│   ├── handler/      # Endpoints HTTP
│   ├── model/        # Estruturas de dados
│   ├── store/        # Database layer
│   └── middleware/   # Auth, logging
└── go.mod
```

---

## 🎨 IRIS - Proposta de Layout

### Design System
```
Paleta de Cores:
- Primário: #6366F1 (Indigo 500) - botões, links
- Secundário: #8B5CF6 (Violet 500) - highlights
- Background: #F9FAFB (Gray 50) - claro
- Texto: #1F2937 (Gray 800) - escuro
- Bordas: #E5E7EB (Gray 200)

Tipografia:
- Título: Inter Bold 24px
- Texto: Inter Regular 16px
- Tags: Inter Medium 12px

Dark Mode:
- Background: #1F2937
- Texto: #F9FAFB
```

### Layout Principal

```
┌─────────────────────────────────────────────┐
│ Topbar: [Logo] [Busca] [Botão New Note]     │
├─────────────────────────────────────────────┤
│ Sidebar |                  Content           │
│         |                                    │
│ [All]   |  ┌─────────────────────────────┐   │
│ [Tags]  |  │  Título da Nota            │   │
│         |  │  ────────────────────────  │   │
│         |  │  Conteúdo (Markdown)       │   │
│         |  │                            │   │
│         |  │  Tags: #personal #work    │   │
│         |  │                               │   │
│         |  │  [Edit] [Delete] [Share]    │   │
│         |  └─────────────────────────────┘   │
└─────────────────────────────────────────────┘
```

**Responsivo:**
- Desktop: Sidebar fixa + conteúdo expandido
- Mobile: Sidebar hambúrguer + modal de nota

---

## 💻 ADA + LINUS - Plano de Desenvolvimento

### Sprint 1: Fundamentos (1-2 dias)
**ADA:** Configurar ambiente, initialze projeto
- [x] `npm create vite@latest notes-app --template react`
- [x] Instalar dependências: tailwindcss, zustand, marked
- [x] Configurar TypeScript strict mode
- [x] Criar estrutura de pastas

**LINUS:** Setup CI/CD
- [x] Criar `.gitignore` apropriado
- [x] Configurar Git e branch strategy (main/dev)
- [x] Criar `Makefile` para build/test
- [x] Configurar ESLint + Prettier

### Sprint 2: Backend MVP (2-3 dias)
**ADA:** Implementar API core
- [x] Criar rotas CRUD de notas (nota.md)
- [x] Validar dados de entrada
- [x] Implementar busca full-text
- [x] Documentar endpoints (Swagger)

**LINUS:** Teste e qualidade
- [x] Escrever testes unitários (Go)
- [x] Integrar coverage no CI
- [x] Auditar segurança básica
- [x] Performance benchmarking

### Sprint 3: Frontend MVP (3-4 dias)
**ADA:** UI/UX Implementation
- [x] Criar componentes: NoteCard, NoteEditor, TagList
- [x] Implementar sistema de tags
- [x] Adicionar busca em tempo real
- [x] Responsividade mobile-first

**LINUS:** Integração completa
- [x] Conectar frontend-backend
- [x] Tratar estados de loading/error
- [x] Validar UX com usuários finais
- [x] Bug fixes críticos

### Sprint 4: Pós-MVP (Opcional)
- [ ] Modo escuro
- [ ] Sync com cloud (Firebase/PostgreSQL)
- [ ] Compartilhamento público
- [ ] Templates de notas
- [ ] Exportação (PDF/Markdown)

---

## 📊 Matriz de Tarefas

| Sprint | ADA (Backend) | LINUS (Quality) | Iris (Frontend) | Atlas (Architecture) |
|--------|-----------------|-------------------|-------------------|----------------------|
| 1 | Ambiente Go | CI/CD | Estrutura React | Stack definida |
| 2 | CRUD API | Testes | Components | API Docs |
| 3 | Busca/Filtros | Auditoria | Integração | Deploy |
| 4 | Extras | Performance | Extras | Monitoramento |

---

## 🚀 Próximos Passos Imediatos

1. **Reunião de Kickoff** (30 min)
   - Alinhar expectativas
   - Definir prazo inicial (MVP: 5 dias)

2. **Setup Inicial**
   - Clara: `npm create vite@latest notes-app --template react-ts`
   - Linus: Configurar `.github/workflows/ci.yml`

3. **Primeira Iteração**
   - Iris: Protótipo de layout (Figma)
   - Atlas: Definir tech stack final

---

## 📌 Conclusão

O MVP pode ser entregue em **5-7 dias úteis** com:
- ✅ CRUD completo de notas
- ✅ Sistema de tags funcional
- ✅ Busca em tempo real
- ✅ Backend + Frontend integrado
- ✅ Testes cobrindo 80% do código

**Recomendação:** Começar com React + Tailwind para **velocidade de desenvolvimento** e migrar para Go (inspirado no ZapSenderAPI) se precisar de performance adicional.

---

*Relatório preparado com base nas melhores práticas do desenvolvimento ágil e inspirações do projeto ZapSenderAPI.*