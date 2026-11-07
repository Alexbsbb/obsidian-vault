import { create } from 'zustand'
import { NotesState, Note } from '../types/note'

const STORAGE_KEY = 'notes-app-storage'

export const useNotesStore = create<NotesState>((set) => ({
  notes: [],
  selectedNote: null,
  searchTerm: '',
  selectedTags: [],
  
  setNotes: (notes) => set({ notes }),
  
  addNote: (note) =>
    set((state) => ({
      notes: [
        ...state.notes,
        {
          ...note,
          id: crypto.randomUUID(),
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    })),
  
  updateNote: (id, updates) =>
    set((state) => ({
      notes: state.notes.map((note) =>
        note.id === id ? { ...note, ...updates, updatedAt: new Date() } : note
      ),
      selectedNote:
        state.selectedNote?.id === id
          ? { ...state.selectedNote, ...updates, updatedAt: new Date() }
          : state.selectedNote,
    })),
  
  deleteNote: (id) =>
    set((state) => ({
      notes: state.notes.filter((note) => note.id !== id),
      selectedNote:
        state.selectedNote?.id === id ? null : state.selectedNote,
    })),
  
  setSelectedNote: (note) => set({ selectedNote: note }),
  setSearchTerm: (term) => set({ searchTerm: term }),
  setTags: (tags) => set({ selectedTags: tags }),
  clearNotes: () => set({ notes: [], selectedNote: null, searchTerm: '', selectedTags: [] }),
}))

// Persist to localStorage
if (typeof window !== 'undefined') {
  const saved = localStorage.getItem(STORAGE_KEY)
  if (saved) {
    useNotesStore.setState(JSON.parse(saved))
  }
  
  useNotesStore.subscribe((state) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  })
}