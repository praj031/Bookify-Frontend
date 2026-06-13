import { client } from './client'
import type {
  Book,
  BookUploadResponse,
  MarketplaceQuery,
  PaginatedBooks,
} from '../types/book'

export async function uploadBook(formData: FormData): Promise<BookUploadResponse> {
  const { data } = await client.post<BookUploadResponse>('/books/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  return data
}

export async function getInventory(): Promise<Book[]> {
  const { data } = await client.get<Book[]>('/books/inventory')
  return data
}

export async function getMarketplace(params?: MarketplaceQuery): Promise<PaginatedBooks> {
  const { data } = await client.get<PaginatedBooks>('/books/marketplace', { params })
  return data
}

export async function getBookById(id: number): Promise<Book> {
  const { data } = await client.get<Book>(`/books/${id}`)
  return data
}

export async function purchaseBook(id: number): Promise<void> {
  await client.post(`/books/${id}/purchase`)
}

export async function downloadBook(id: number): Promise<Blob> {
  const { data } = await client.get<Blob>(`/books/${id}/download`, {
    responseType: 'blob',
  })
  return data
}

export async function updateBookVisibility(
  id: number,
  visibility: 'PUBLIC' | 'PRIVATE'
): Promise<Book> {
  const { data } = await client.put<Book>(`/books/${id}/visibility`, null, {
    params: { visibility },
  })
  return data
}
