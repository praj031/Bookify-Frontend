import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMarketplace } from '../hooks/useBooks'
import { EmptyState } from '../components/common/EmptyState'
import { BookCardSkeleton } from '../components/common/SkeletonLoader'
import { Badge } from '../components/ui/Badge'
import { Input } from '../components/ui/Input'
import { BookOpen, Search, FileText, BookMarked, Image, ChevronLeft, ChevronRight } from 'lucide-react'
import { formatDate } from '../utils/formatters'
import type { BookType } from '../types/book'

const typeFilters: { value: BookType | ''; label: string }[] = [
  { value: '', label: 'All' },
  { value: 'INFO', label: 'Info' },
  { value: 'BOOK', label: 'Book' },
  { value: 'GRAPHICAL', label: 'Graphical' },
]

const typeIcons: Record<BookType, React.ElementType> = {
  INFO: FileText,
  BOOK: BookMarked,
  GRAPHICAL: Image,
}

export function MarketplacePage() {
  const { result, isLoading, error, query, setQuery } = useMarketplace({ page: 0, size: 20 })
  const [searchInput, setSearchInput] = useState('')

  const applySearch = () => {
    setQuery((prev) => ({ ...prev, search: searchInput || undefined, page: 0 }))
  }

  const setType = (type: BookType | '') => {
    setQuery((prev) => ({ ...prev, type: type || undefined, page: 0 }))
  }

  const setPage = (page: number) => {
    if (page < 0 || (result && page >= result.totalPages)) return
    setQuery((prev) => ({ ...prev, page }))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-surface-900">Marketplace</h1>
        <p className="text-sm text-surface-500">Discover and purchase books from the community</p>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex-1">
          <div className="flex gap-2">
            <Input
              placeholder="Search by title or description..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && applySearch()}
              className="flex-1"
            />
            <button
              onClick={applySearch}
              className="inline-flex h-[42px] items-center gap-2 rounded-lg bg-primary-600 px-4 text-sm font-medium text-white hover:bg-primary-700"
            >
              <Search className="h-4 w-4" />
              Search
            </button>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {typeFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => setType(f.value)}
              className={
                query.type === f.value || (!query.type && f.value === '')
                  ? 'rounded-lg bg-primary-100 px-3 py-1.5 text-sm font-medium text-primary-700'
                  : 'rounded-lg bg-surface-100 px-3 py-1.5 text-sm font-medium text-surface-600 hover:bg-surface-200'
              }
            >
              {f.label}
            </button>
          ))}
        </div>
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

      {!isLoading && result?.content.length === 0 && (
        <EmptyState
          icon={BookOpen}
          title="No books found"
          description="Try adjusting your search or filters."
        />
      )}

      {!isLoading && result && result.content.length > 0 && (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {result.content.map((book) => {
              const Icon = typeIcons[book.type]
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
                    <Badge>{book.type}</Badge>
                  </div>

                  <h3 className="mt-3 text-base font-semibold text-surface-900 group-hover:text-primary-700 transition-colors line-clamp-1">
                    {book.title}
                  </h3>
                  {book.description && (
                    <p className="mt-1 text-sm text-surface-500 line-clamp-2">{book.description}</p>
                  )}

                  <div className="mt-auto pt-4 flex items-center justify-between text-xs text-surface-400">
                    <span>{book.ownerName || 'Community'}</span>
                    <span>{formatDate(book.uploadedAt)}</span>
                  </div>
                </Link>
              )
            })}
          </div>

          {result.totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-4">
              <button
                onClick={() => setPage(query.page! - 1)}
                disabled={query.page === 0}
                className="inline-flex items-center rounded-lg border border-surface-200 bg-surface-0 px-3 py-2 text-sm font-medium text-surface-700 hover:bg-surface-50 disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" /> Prev
              </button>
              <span className="text-sm text-surface-500">
                Page {query.page! + 1} of {result.totalPages}
              </span>
              <button
                onClick={() => setPage(query.page! + 1)}
                disabled={query.page! + 1 >= result.totalPages}
                className="inline-flex items-center rounded-lg border border-surface-200 bg-surface-0 px-3 py-2 text-sm font-medium text-surface-700 hover:bg-surface-50 disabled:opacity-50"
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </>
      )}
    </div>
  )
}
