# NotesApp Development Skill

## Core Stack
- **Frontend:** React + Vite + TypeScript
- **Backend:** Go + Gin
- **Styling:** TailwindCSS
- **State:** Zustand
- **Database:** SQLite (or localStorage for offline)

## Colors
- **Primary:** #6366F1 (Indigo 500)
- **Secondary:** #64748B (Gray 500)

## Setup Commands
```bash
# Initialize
npx create-vite@latest . --template react-ts
npm install zustand marked lucide-react react-router-dom
npm install -D tailwindcss postcss autoprefixer

# Build components
# Run dev server
npm run dev
```

## Key Files
- `src/types/note.ts` - Type definitions
- `src/stores/useNotesStore.ts` - Zustand store
- `src/components/NoteCard.tsx` - Note display component
- `src/components/TagFilter.tsx` - Tag filter component

## Common Pitfalls
1. **TypeScript errors about missing modules** - Expected before `npm install`
2. **Dark mode not persisting** - Must use `localStorage` to save preference
3. **Zustand store not persisting** - Use `persist` middleware

## References
- [types/note.ts](references/note-types.ts)
- [store/use-notes-store.ts](references/use-notes-store.ts)
- [components.md](references/components.md)