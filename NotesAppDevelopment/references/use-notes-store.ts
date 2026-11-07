// Zustand store implementation for NotesApp
// Usage: const useNotesStore = create<NotesState>()...

import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Note, NoteInput } from './types/note'

interface NotesState {
  notes: Note[]
  selectedNote: Note | null
  searchTerm: string
  
  // CRUD Operations
  addNote: (input: NoteInput) => void
  updateNote: (id: string, updates: Partial<Note>) => void
  deleteNote: (id: string) => void
  getNote: (id: string) => Note | undefined
  
  // State Management
  setSelectedNote: (note: Note | null) => void
  setSearchTerm: (term: string) => void
  clearAllNotes: () => void
  
  // Computed
  filteredNotes: (searchTerm: string) => Note[]
}

export const useNotesStore = create<NotesState>()(
  persist(
    (set, get) => ({
      notes: [],
      selectedNote: null,
      searchTerm: '',
      
      addNote: (input) => set((state) => ({
        notes: [
          ...state.notes,
          {
            id: crypto.randomUUID(),
            title: input.title || '',
            content: input.content || '',
            tags: input.tags || [],
            createdAt: new Date(),
            updatedAt: new Date(),
            isPinned: input.isPinned || false,
            isArchived: input.isArchived || false,
          },
        ],
      })),
      
      updateNote: (id, updates) =>
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id
              ? { ...note, ...updates, updatedAt: new Date() }
              : note,
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
      
      getNote: (id) => get().notes.find((note) => note.id === id),
      
      setSelectedNote: (note) => set({ selectedNote: note }),
      
      setSearchTerm: (term) => set({ searchTerm: term }),
      
      clearAllNotes: () => set({ notes: [], selectedNote: null }),
      
      filteredNotes: (searchTerm) => {
        const { notes } = get()
        return notes.filter((note) =>
          note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          note.content.toLowerCase().includes(searchTerm.toLowerCase()),
        )
      },
    }),
    {
      name: 'notes-app-storage',
      getOptions: (callback) => ({
        ...callback(),
        maxAge: 1000 * 60 * 60 * 24, // 24 hours
      }),
    },
  ),
)