export interface Review {
  id: number
  bookId: number
  userId: number
  userName: string
  rating: number
  comment: string
  createdAt: string
}

export interface CreateReviewRequest {
  rating: number
  comment: string
}

export interface Comment {
  id: number
  bookId: number
  userId: number
  userName: string
  content: string
  createdAt: string
}

export interface CreateCommentRequest {
  content: string
}

export interface ChatMessage {
  id: number
  bookId: number
  userId: number
  userName: string
  message: string
  createdAt: string
}

export interface SendChatRequest {
  message: string
}
