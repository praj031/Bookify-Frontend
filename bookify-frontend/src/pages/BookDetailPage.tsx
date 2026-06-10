import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useBookDetail, usePurchaseBook } from '../hooks/useBooks'
import { useReviews, useComments, useChat } from '../hooks/useCommunity'
import { useToast } from '../components/common/Toast'
import { EmptyState } from '../components/common/EmptyState'
import { Skeleton } from '../components/common/SkeletonLoader'
import { Badge } from '../components/ui/Badge'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Card, CardBody, CardHeader } from '../components/ui/Card'
import { reviewSchema, commentSchema, chatMessageSchema } from '../utils/validators'
import type { ReviewInput, CommentInput, ChatMessageInput } from '../utils/validators'
import {
  ArrowLeft,
  ShoppingCart,
  Star,
  MessageCircle,
  Send,
  FileText,
  BookMarked,
  Image,
  Headphones,
  ThumbsUp,
  Clock,
} from 'lucide-react'
import { formatDate, formatDateTime } from '../utils/formatters'
import type { BookType } from '../types/book'

const typeConfig: Record<BookType, { icon: React.ElementType; label: string; color: string }> = {
  INFO: { icon: FileText, label: 'Informational', color: 'bg-blue-50 text-blue-700 border-blue-200' },
  BOOK: { icon: BookMarked, label: 'Book', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' },
  GRAPHICAL: { icon: Image, label: 'Graphical', color: 'bg-amber-50 text-amber-700 border-amber-200' },
}

type Tab = 'reviews' | 'comments' | 'chat'

export function BookDetailPage() {
  const { id } = useParams()
  const bookId = Number(id)
  const { showToast } = useToast()
  const [activeTab, setActiveTab] = useState<Tab>('reviews')

  const { book, isLoading, error } = useBookDetail(bookId)
  const { purchase, isLoading: purchasing } = usePurchaseBook()

  const {
    reviews,
    isLoading: reviewsLoading,
    createReview,
  } = useReviews(bookId)

  const {
    comments,
    isLoading: commentsLoading,
    createComment,
  } = useComments(bookId)

  const {
    messages,
    isLoading: chatLoading,
    sendMessage,
  } = useChat(bookId)

  const reviewForm = useForm<ReviewInput>({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 5, comment: '' },
  })

  const commentForm = useForm<CommentInput>({
    resolver: zodResolver(commentSchema),
  })

  const chatForm = useForm<ChatMessageInput>({
    resolver: zodResolver(chatMessageSchema),
  })

  const handlePurchase = async () => {
    try {
      await purchase(bookId)
      showToast('Book purchased successfully!', 'success')
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Purchase failed', 'error')
    }
  }

  const onReviewSubmit = async (data: ReviewInput) => {
    try {
      await createReview(data)
      reviewForm.reset()
      showToast('Review added', 'success')
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to add review', 'error')
    }
  }

  const onCommentSubmit = async (data: CommentInput) => {
    try {
      await createComment(data)
      commentForm.reset()
      showToast('Comment posted', 'success')
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to post comment', 'error')
    }
  }

  const onChatSubmit = async (data: ChatMessageInput) => {
    try {
      await sendMessage(data)
      chatForm.reset()
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Failed to send message', 'error')
    }
  }

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full rounded-xl" />
      </div>
    )
  }

  if (error || !book) {
    return (
      <div className="mx-auto max-w-4xl">
        <EmptyState
          icon={FileText}
          title="Book not found"
          description={error?.message || 'This book does not exist or has been removed.'}
          action={
            <Link to="/marketplace" className="text-primary-600 hover:text-primary-700 font-medium">
              Back to Marketplace
            </Link>
          }
        />
      </div>
    )
  }

  const config = typeConfig[book.type]
  const TypeIcon = config.icon

  const tabs: { id: Tab; label: string; count?: number }[] = [
    { id: 'reviews', label: 'Reviews', count: reviews.length },
    { id: 'comments', label: 'Comments', count: comments.length },
    { id: 'chat', label: 'Chat', count: messages.length },
  ]

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Link to="/marketplace" className="inline-flex items-center gap-1 text-sm font-medium text-surface-600 hover:text-surface-800">
        <ArrowLeft className="h-4 w-4" /> Back to Marketplace
      </Link>

      <Card>
        <CardBody className="space-y-4">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className={config.color + ' inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium'}>
                  <TypeIcon className="h-3 w-3" />
                  {config.label}
                </span>
                <Badge variant={book.status === 'READY' ? 'success' : 'warning'}>{book.status}</Badge>
              </div>
              <h1 className="text-2xl font-bold text-surface-900">{book.title}</h1>
              {book.description && <p className="text-sm text-surface-600">{book.description}</p>}
              <div className="flex items-center gap-4 text-xs text-surface-500">
                <span className="flex items-center gap-1">
                  <Clock className="h-3.5 w-3.5" /> {formatDate(book.uploadedAt)}
                </span>
                <span>By {book.ownerName || 'Unknown'}</span>
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {book.isPurchased ? (
                <div className="flex items-center gap-2 text-sm font-medium text-emerald-700">
                  <ThumbsUp className="h-4 w-4" /> Purchased
                </div>
              ) : (
                <Button onClick={handlePurchase} isLoading={purchasing} className="whitespace-nowrap">
                  <ShoppingCart className="h-4 w-4" /> Purchase
                </Button>
              )}
              <Link to={`/audio/convert?bookId=${book.id}`}>
                <Button variant="outline" className="whitespace-nowrap w-full">
                  <Headphones className="h-4 w-4" /> Convert to Audio
                </Button>
              </Link>
            </div>
          </div>
        </CardBody>
      </Card>

      <Card>
        <CardHeader className="flex items-center gap-2 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={
                activeTab === tab.id
                  ? 'rounded-lg bg-primary-50 px-3 py-1.5 text-sm font-medium text-primary-700'
                  : 'rounded-lg px-3 py-1.5 text-sm font-medium text-surface-600 hover:bg-surface-100'
              }
            >
              {tab.label}
              {typeof tab.count === 'number' && (
                <span className="ml-1 rounded-full bg-surface-200 px-1.5 py-0.5 text-xs text-surface-600">{tab.count}</span>
              )}
            </button>
          ))}
        </CardHeader>

        <CardBody>
          {activeTab === 'reviews' && (
            <div className="space-y-5">
              <form onSubmit={reviewForm.handleSubmit(onReviewSubmit)} className="space-y-3">
                <div className="flex items-center gap-2">
                  <label className="text-sm font-medium text-surface-700">Rating</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <button
                        key={n}
                        type="button"
                        onClick={() => reviewForm.setValue('rating', n)}
                        className="p-0.5"
                      >
                        <Star
                          className={`h-5 w-5 ${
                            n <= (reviewForm.watch('rating') || 0)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-surface-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <Input
                  placeholder="Write a review..."
                  {...reviewForm.register('comment')}
                  error={reviewForm.formState.errors.comment?.message}
                />
                <div className="flex justify-end">
                  <Button type="submit" size="sm" isLoading={reviewForm.formState.isSubmitting}>
                    <Star className="h-4 w-4" /> Submit Review
                  </Button>
                </div>
              </form>

              <div className="space-y-3">
                {reviewsLoading && <Skeleton className="h-24 w-full rounded-lg" />}
                {!reviewsLoading && reviews.length === 0 && (
                  <p className="text-sm text-surface-500">No reviews yet. Be the first!</p>
                )}
                {reviews.map((r) => (
                  <div key={r.id} className="rounded-lg border border-surface-200 bg-surface-50 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-surface-800">{r.userName}</span>
                      <span className="text-xs text-surface-400">{formatDate(r.createdAt)}</span>
                    </div>
                    <div className="mt-1 flex items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${
                            i < Math.round(r.rating) ? 'fill-amber-400 text-amber-400' : 'text-surface-300'
                          }`}
                        />
                      ))}
                    </div>
                    <p className="mt-2 text-sm text-surface-700">{r.comment}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'comments' && (
            <div className="space-y-5">
              <form onSubmit={commentForm.handleSubmit(onCommentSubmit)} className="flex gap-2">
                <Input
                  placeholder="Add a comment..."
                  {...commentForm.register('content')}
                  error={commentForm.formState.errors.content?.message}
                  className="flex-1"
                />
                <Button type="submit" size="sm" isLoading={commentForm.formState.isSubmitting}>
                  <MessageCircle className="h-4 w-4" /> Post
                </Button>
              </form>

              <div className="space-y-3">
                {commentsLoading && <Skeleton className="h-24 w-full rounded-lg" />}
                {!commentsLoading && comments.length === 0 && (
                  <p className="text-sm text-surface-500">No comments yet.</p>
                )}
                {comments.map((c) => (
                  <div key={c.id} className="rounded-lg border border-surface-200 bg-surface-50 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-surface-800">{c.userName}</span>
                      <span className="text-xs text-surface-400">{formatDateTime(c.createdAt)}</span>
                    </div>
                    <p className="mt-1 text-sm text-surface-700">{c.content}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="space-y-5">
              <form onSubmit={chatForm.handleSubmit(onChatSubmit)} className="flex gap-2">
                <Input
                  placeholder="Type a message..."
                  {...chatForm.register('message')}
                  error={chatForm.formState.errors.message?.message}
                  className="flex-1"
                />
                <Button type="submit" size="sm" isLoading={chatForm.formState.isSubmitting}>
                  <Send className="h-4 w-4" /> Send
                </Button>
              </form>

              <div className="space-y-3">
                {chatLoading && <Skeleton className="h-24 w-full rounded-lg" />}
                {!chatLoading && messages.length === 0 && (
                  <p className="text-sm text-surface-500">No messages yet. Start the discussion!</p>
                )}
                {messages.map((m) => (
                  <div key={m.id} className="rounded-lg border border-surface-200 bg-surface-50 p-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-surface-800">{m.userName}</span>
                      <span className="text-xs text-surface-400">{formatDateTime(m.createdAt)}</span>
                    </div>
                    <p className="mt-1 text-sm text-surface-700">{m.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardBody>
      </Card>
    </div>
  )
}
