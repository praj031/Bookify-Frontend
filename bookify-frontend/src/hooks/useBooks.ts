import { useCallback, useEffect, useState } from 'react'
import type { Book, MarketplaceQuery, PaginatedBooks } from '../types/book'
import { getInventory, getMarketplace, getBookById, purchaseBook, uploadBook } from '../api/books'

function isArrayResponse<T>(data: unknown): data is T[] {
  return Array.isArray(data)
}

function isPaginatedResponse(data: unknown): data is PaginatedBooks {
  return (
    typeof data === 'object' &&
    data !== null &&
    'content' in data &&
    Array.isArray((data as PaginatedBooks).content)
  )
}

export function useInventory() {
  const [books, setBooks] = useState<Book[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const refetch = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getInventory()
      if (isArrayResponse<Book>(data)) {
        setBooks(data)
      } else {
        setBooks([])
        console.warn('Inventory API returned non-array response:', data)
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load inventory'))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { books, isLoading, error, refetch }
}

export function useMarketplace(initialQuery?: MarketplaceQuery) {
  const [result, setResult] = useState<PaginatedBooks | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [query, setQuery] = useState<MarketplaceQuery>(initialQuery || { page: 0, size: 20 })

  const fetch = useCallback(async (params: MarketplaceQuery) => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getMarketplace(params)
      if (isPaginatedResponse(data)) {
        setResult(data)
      } else {
        setResult({ content: [], page: 0, size: 20, totalElements: 0, totalPages: 0 })
        console.warn('Marketplace API returned non-paginated response:', data)
      }
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load marketplace'))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    fetch(query)
  }, [query, fetch])

  return { result, isLoading, error, query, setQuery, refetch: () => fetch(query) }
}

export function useBookDetail(id: number) {
  const [book, setBook] = useState<Book | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false
    setIsLoading(true)
    setError(null)
    getBookById(id)
      .then((data) => {
        if (!cancelled) setBook(data)
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err : new Error('Failed to load book'))
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [id])

  return { book, isLoading, error }
}

export function usePurchaseBook() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const purchase = useCallback(async (bookId: number) => {
    setIsLoading(true)
    setError(null)
    try {
      await purchaseBook(bookId)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Purchase failed'))
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { purchase, isLoading, error }
}

export function useUploadBook() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [progress, setProgress] = useState(0)

  const upload = useCallback(async (formData: FormData, _onProgress?: (percent: number) => void) => {
    setIsLoading(true)
    setError(null)
    setProgress(0)
    try {
      const data = await uploadBook(formData)
      setProgress(100)
      return data
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Upload failed'))
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { upload, isLoading, error, progress }
}
