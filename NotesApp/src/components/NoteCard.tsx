import { Link } from 'react-router-dom'
import { Note, useNotesStore } from '../types/note'
import { Edit, Trash2, Tag, ChevronRight } from 'lucide-react'

interface NoteCardProps {
  note: Note
  onDelete: () => void
}

export function NoteCard({ note, onDelete }: NoteCardProps) {
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
        
        {/* Tags */}
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
        
        {/* Footer */}
        <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
          <span>
            {note.updatedAt.toLocaleDateString('pt-BR')}
          </span>
          <button
            onClick={onDelete}
            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
            title="Excluir"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}