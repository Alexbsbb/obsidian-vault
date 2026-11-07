# Component Patterns for NotesApp

## NoteCard Component Pattern

```tsx
export function NoteCard({ note, onDelete }: {
  note: Note
  onDelete: () => void
}) {
  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <h3 className="font-semibold text-gray-900 dark:text-white line-clamp-1">
            {note.title || 'Sem título'}
          </h3>
          <Link
            to={`/editor/${note.id}`}
            className="p-1 text-gray-500 hover:text-primary transition-colors"
            title="Editar"
          >
            <Edit size={18} />
          </Link>
        </div>
        
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-300 line-clamp-3">
          {note.content}
        </p>
        
        {note.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {note.tags.map(tag => (
              <span 
                key={tag} 
                className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}
        
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
          <span>{note.updatedAt.toLocaleDateString('pt-BR')}</span>
          <button
            onClick={onDelete}
            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}
```

## TagFilter Component Pattern

```tsx
export function TagFilter({ tags, selectedTags, onToggleTag }: {
  tags: string[]
  selectedTags: string[]
  onToggleTag: (tag: string) => void
}) {
  if (tags.length === 0) return null
  
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      {tags.map(tag => (
        <button
          key={tag}
          onClick={() => onToggleTag(tag)}
          className={`px-3 py-1 text-sm rounded-full transition-colors ${
            selectedTags.includes(tag)
              ? 'bg-primary text-white'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200'
          }`}
        >
          #{tag}
        </button>
      ))}
      {selectedTags.length > 0 && (
        <button
          onClick={() => onToggleTag('')}
          className="px-3 py-1 text-sm rounded-full bg-gray-200 dark:bg-gray-700"
        >
          Limpar
        </button>
      )}
    </div>
  )
}
```

## Layout Component Pattern

```tsx
export function Layout({ children }: { children: React.ReactNode }) {
  const [darkMode, setDarkMode] = useState(false)
  
  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true'
    setDarkMode(isDark)
    if (isDark) document.documentElement.classList.add('dark')
  }, [])
  
  const toggleDarkMode = () => {
    const newDark = !darkMode
    setDarkMode(newDark)
    localStorage.setItem('darkMode', String(newDark))
    document.documentElement.classList.toggle('dark')
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <nav className="bg-white dark:bg-gray-800 shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">NotesApp</h1>
          <button onClick={toggleDarkMode}>
            {darkMode ? '☀️' : '🌙'}
          </button>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  )
}
```

## Common Patterns

1. **Dark Mode Toggle** - Use `localStorage` to persist preference
2. **Line Clamping** - Use `line-clamp-1` and `line-clamp-3` from Tailwind
3. **Responsive Grid** - Use `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
4. **Hover States** - Always include `transition-colors` and `hover:` variants
5. **Dark Variants** - Always provide dark mode variants for colors