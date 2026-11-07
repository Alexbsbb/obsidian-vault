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
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          #{tag}
        </button>
      ))}
      {selectedTags.length > 0 && (
        <button
          onClick={() => onToggleTag('')}
          className="px-3 py-1 text-sm rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
        >
          Limpar
        </button>
      )}
    </div>
  )
}