import { Link } from 'react-router-dom'
import { useInventory } from '../hooks/useBooks'
import { EmptyState } from '../components/common/EmptyState'
import { BookCardSkeleton } from '../components/common/SkeletonLoader'
import { Badge } from '../components/ui/Badge'
import { BookOpen, Upload, FileText, BookMarked, Image } from 'lucide-react'
import { formatDate } from '../utils/formatters'
import type { BookType } from '../types/book'

const typeConfig: Record<BookType, { label: string; icon: React.ElementType; color: string }> = {
  INFO: { label: 'Info', icon: FileText, color: 'bg-blue-50 text-blue-700 border-blue-200' },
  BOOK: { label: 'Book', icon: BookMarked, color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  GRAPHICAL: { label: 'Graphical', icon: Image, color: 'bg-amber-50 text-amber-700 border-amber-200' },
}

function getBookTypeConfig(type: BookType | string | undefined) {
  if (!type || !typeConfig[type as BookType]) {
    return { label: 'Book', icon: BookOpen, color: 'bg-surface-100 text-surface-700 border-surface-200' }
  }
  return typeConfig[type as BookType]
}

export function DashboardPage() {
  const { books, isLoading, error } = useInventory()

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-surface-900">My Library</h1>
          <p className="text-sm text-surface-500">Manage your uploaded books and documents</p>
        </div>
        <Link
          to="/upload"
          className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
        >
          <Upload className="h-4 w-4" />
          Upload
        </Link>
      </div>

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error.message}
        </div>
      )}

      {isLoading && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <BookCardSkeleton key={i} />
          ))}
        </div>
      )}

      {!isLoading && books.length === 0 && (
        <EmptyState
          icon={BookOpen}
          title="No books yet"
          description="Upload your first PDF to get started with your personal library."
          action={
            <Link
              to="/upload"
              className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-primary-700"
            >
              <Upload className="h-4 w-4" />
              Upload a book
            </Link>
          }
        />
      )}

      {!isLoading && books.length > 0 && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {books.map((book) => {
            const config = getBookTypeConfig(book.type)
            const Icon = config.icon
            return (
              <Link
                key={book.id}
                to={`/books/${book.id}`}
                className="group flex flex-col rounded-xl border border-surface-200 bg-surface-0 p-5 shadow-sm transition-all hover:border-primary-300 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-50">
                    <Icon className="h-5 w-5 text-primary-600" />
                  </div>
                  <span className={config.color + ' inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium'}>
                    <Icon className="h-3 w-3" />
                    {config.label}
                  </span>
                </div>

                <h3 className="mt-3 text-base font-semibold text-surface-900 group-hover:text-primary-700 transition-colors line-clamp-1">
                  {book.title || 'Untitled'}
                </h3>
                {book.description && (
                  <p className="mt-1 text-sm text-surface-500 line-clamp-2">{book.description}</p>
                )}

                <div className="mt-auto pt-4 flex items-center justify-between text-xs text-surface-400">
                  <span>{formatDate(book.uploadedAt)}</span>
                  <Badge variant={book.status === 'READY' ? 'success' : 'warning'}>{book.status || 'UNKNOWN'}</Badge>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
