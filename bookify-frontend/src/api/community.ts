import { client } from './client'
import type {
  Comment,
  CreateCommentRequest,
  CreateReviewRequest,
  Review,
  ChatMessage,
  SendChatRequest,
} from '../types/community'

export async function getReviews(bookId: number): Promise<Review[]> {
  const { data } = await client.get<Review[]>(`/books/${bookId}/reviews`)
  return data
}

export async function addReview(bookId: number, payload: CreateReviewRequest): Promise<Review> {
  const { data } = await client.post<Review>(`/books/${bookId}/reviews`, payload)
  return data
}

export async function getComments(bookId: number): Promise<Comment[]> {
  const { data } = await client.get<Comment[]>(`/books/${bookId}/comments`)
  return data
}

export async function addComment(bookId: number, payload: CreateCommentRequest): Promise<Comment> {
  const { data } = await client.post<Comment>(`/books/${bookId}/comments`, payload)
  return data
}

export async function getChatHistory(bookId: number): Promise<ChatMessage[]> {
  const { data } = await client.get<ChatMessage[]>(`/books/${bookId}/chat`)
  return data
}

export async function sendChatMessage(bookId: number, payload: SendChatRequest): Promise<ChatMessage> {
  const { data } = await client.post<ChatMessage>(`/books/${bookId}/chat`, payload)
  return data
}
