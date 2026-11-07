// Type definitions for NotesApp
export interface Note {
  id: string
  title: string
  content: string
  tags: string[]
  createdAt: Date
  updatedAt: Date
  isPinned?: boolean
  isArchived?: boolean
}

export interface NoteInput {
  title?: string
  content?: string
  tags?: string[]
  isPinned?: boolean
}

export interface NotesFilters {
  searchTerm: string
  selectedTags: string[]
  dateRange?: { from: Date; to: Date }
  pinnedOnly?: boolean
  archivedOnly?: boolean
}

// UI Colors for ZapSenderTheme
export const COLORS = {
  primary: '#6366F1',    // Indigo 500
  secondary: '#64748B',  // Gray 500
  background: '#F9FAFB', // Gray 50
  text: '#1F2937',       // Gray 800
  success: '#10B981',    // Emerald 500
  warning: '#F59E0B',    // Amber 500
  danger: '#EF4444',     // Red 500
}

// Local storage keys
export const STORAGE_KEYS = {
  NOTES: 'notes-app-notes',
  SETTINGS: 'notes-app-settings',
  THEME: 'notes-app-theme',
} as const