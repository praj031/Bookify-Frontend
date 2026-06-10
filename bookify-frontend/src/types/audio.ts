export interface AudioConversionRequest {
  bookId: number
  startPage: number
  endPage: number
  voice?: string
}

export interface ConversionJob {
  id: string
  bookId: number
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED'
  createdAt: string
  completedAt?: string
  downloadUrl?: string
  streamUrl?: string
}

export interface AudioUsage {
  totalAllowed: number
  used: number
  remaining: number
  plan: 'FREE' | 'PREMIUM'
}
