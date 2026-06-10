export interface ApiError {
  status: string
  mesage: string
  timestamp: string
  errors?: Array<{
    field: string
    message: string
  }>
}

export interface PaginatedResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
}
