export interface Note {
  id: string
  title: string
  content: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
}

export type NoteInput = Omit<Note, 'id' | 'createdAt' | 'updatedAt'>

export interface NotesState {
  notes: Note[]
  selectedNote: Note | null
  searchTerm: string
  selectedTags: string[]
  
  // Actions
  setNotes: (notes: Note[]) => void
  addNote: (note: NoteInput) => void
  updateNote: (id: string, note: Partial<Note>) => void
  deleteNote: (id: string) => void
  setSelectedNote: (note: Note | null) => void
  setSearchTerm: (term: string) => void
  setTags: (tags: string[]) => void
  clearNotes: () => void
}

export const NOTE_COLORS = ['#FEF3C7', '#DBEAFE', '#D1FAE5', '#FCDFEF', '#fecbca']