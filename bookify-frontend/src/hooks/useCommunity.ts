import { useCallback, useEffect, useState } from 'react'
import type { Review, Comment, ChatMessage, CreateReviewRequest, CreateCommentRequest, SendChatRequest } from '../types/community'
import { getReviews, addReview, getComments, addComment, getChatHistory, sendChatMessage } from '../api/community'

export function useReviews(bookId: number) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const refetch = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getReviews(bookId)
      setReviews(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load reviews'))
    } finally {
      setIsLoading(false)
    }
  }, [bookId])

  useEffect(() => {
    refetch()
  }, [refetch])

  const createReview = useCallback(async (payload: CreateReviewRequest) => {
    const review = await addReview(bookId, payload)
    setReviews((prev) => [review, ...prev])
    return review
  }, [bookId])

  return { reviews, isLoading, error, refetch, createReview }
}

export function useComments(bookId: number) {
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const refetch = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getComments(bookId)
      setComments(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load comments'))
    } finally {
      setIsLoading(false)
    }
  }, [bookId])

  useEffect(() => {
    refetch()
  }, [refetch])

  const createComment = useCallback(async (payload: CreateCommentRequest) => {
    const comment = await addComment(bookId, payload)
    setComments((prev) => [comment, ...prev])
    return comment
  }, [bookId])

  return { comments, isLoading, error, refetch, createComment }
}

export function useChat(bookId: number) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const refetch = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getChatHistory(bookId)
      setMessages(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load chat'))
    } finally {
      setIsLoading(false)
    }
  }, [bookId])

  useEffect(() => {
    refetch()
  }, [refetch])

  const sendMessage = useCallback(async (payload: SendChatRequest) => {
    const message = await sendChatMessage(bookId, payload)
    setMessages((prev) => [...prev, message])
    return message
  }, [bookId])

  return { messages, isLoading, error, refetch, sendMessage }
}
