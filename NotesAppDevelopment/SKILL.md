---
name: notes-app-development
description: Build personal notes web application with React + Go backend.
version: 1.0.0
author: Hermes Agent
license: MIT
---

# Notes App Development

## When to Use
Run this skill when creating a personal notes web application with modern tooling.

## Core Stack
- **Frontend:** React + Vite + TypeScript
- **Backend:** Go + Gin
- **Styling:** TailwindCSS
- **State:** Zustand
- **Database:** SQLite (or localStorage for offline)

## Colors
- **Primary:** #6366F1 (Indigo 500)
- **Text:** #64748B (Gray 500)
- **Background:** #F9FAFB (Gray 50)

## Procedure

### 1. Initialize Frontend
```bash
cd NotesApp
npm create vite@latest . --template react-ts
npm install
npm install zustand marked lucide-react react-router-dom
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### 2. Setup Tailwind
Configure `tailwind.config.ts` with color theme.

### 3. Create Core Types
Define `Note` interface with id, title, content, tags, createdAt, updatedAt.

### 4. Create Zustand Store
Implement store with CRUD operations and localStorage persistence.

### 5. Build Components
- `Layout.tsx` - Navigation + dark mode toggle
- `NoteCard.tsx` - Individual note display
- `TagFilter.tsx` - Tag selection UI

### 6. Build Pages
- `Home.tsx` - Notes grid with search/filter
- `Editor.tsx` - Note creation/editing with markdown

### 7. Initialize Backend
```bash
cd NotesAppBackend
go mod init notes-backend
go get github.com/gin-gonic/gin gorm.io/gorm gorm.io/driver/sqlite
```

### 8. Create API Endpoints
- POST /api/v1/notes - Create note
- GET /api/v1/notes - List notes
- GET /api/v1/notes/:id - Get note
- PUT /api/v1/notes/:id - Update note
- DELETE /api/v1/notes/:id - Delete note

## Pitfalls

**Don't install react-router-dom for offline-first notes app** - localStorage approach is simpler and works without backend API calls.

**TypeScript errors about missing modules are expected** - Run `npm install` first before starting dev server.

**Zustand store won't persist without localStorage sync** - Always include `localStorage.setItem()` sync in the store.

**Dark mode must persist across reloads** - Store preference in localStorage and apply on initial load.

## References
- [src/types/note.ts](references/note-types.ts) - Type definitions
- [src/stores/useNotesStore.ts](references/use-notes-store.ts) - Store implementation
- [src/components/](references/components/) - Component patterns