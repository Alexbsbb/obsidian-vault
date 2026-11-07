import { useNotesStore } from '../stores/useNotesStore'
import { NoteCard } from '../components/NoteCard'
import { TagFilter } from '../components/TagFilter'
import { Link } from 'react-router-dom'

export function Home() {
  const { notes, searchTerm, setSearchTerm, selectedTags, setTags, deleteNote } = useNotesStore()
  
  const filteredNotes = notes.filter(note => {
    const matchesSearch = note.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         note.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTags = selectedTags.length === 0 || 
                        selectedTags.every(tag => note.tags.includes(tag))
    return matchesSearch && matchesTags
  })

  const uniqueTags = Array.from(new Set(notes.flatMap(n => n.tags)))

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            📝 NotesApp
          </h1>
          <Link 
            to="/editor" 
            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
          >
            + Nova Nota
          </Link>
        </div>
      </header>

      {/* Search & Filters */}
      <main className="max-w-4xl mx-auto px-4 py-6">
        <div className="mb-4">
          <input
            type="text"
            placeholder="Buscar notas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full md:w-auto flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>

        {/* Tag Filters */}
        {uniqueTags.length > 0 && (
          <TagFilter 
            tags={uniqueTags}
            selectedTags={selectedTags}
            onToggleTag={(tag) => {
              const newTags = selectedTags.includes(tag)
                ? selectedTags.filter(t => t !== tag)
                : [...selectedTags, tag]
              setTags(newTags)
            }}
          />
        )}

        {/* Notes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
          {filteredNotes.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500 dark:text-gray-400">
              <p className="text-lg">Nenhuma nota encontrada</p>
              <p className="text-sm mt-2">Crie sua primeira nota clicando em "+ Nova Nota"</p>
            </div>
          ) : (
            filteredNotes.map(note => (
              <NoteCard 
                key={note.id}
                note={note}
                onDelete={() => deleteNote(note.id)}
              />
            ))
          )}
        </div>
      </main>
    </div>
  )
}