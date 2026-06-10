export type BookType = 'INFO' | 'BOOK' | 'GRAPHICAL'

export type UploadStatus = 'PROCESSING' | 'READY' | 'FAILED'

export interface Book {
  id: number
  title: string
  type: BookType
  description?: string
  fileUrl: string
  uploadedAt: string
  status: UploadStatus
  ownerId?: number
  ownerName?: string
  isPurchased?: boolean
  price?: number
}

export interface UploadBookRequest {
  file: File
  type: BookType
  title: string
  description?: string
}

export interface BookUploadResponse {
  id: number
  title: string
  type: BookType
  fileUrl: string
  uploadedAt: string
  status: UploadStatus
}

export interface MarketplaceQuery {
  page?: number
  size?: number
  search?: string
  type?: BookType
}

export interface PaginatedBooks {
  content: Book[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}
