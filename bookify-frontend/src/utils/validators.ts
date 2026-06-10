import { z } from 'zod'

export const loginSchema = z.object({
  username: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  password: z
    .string()
    .min(4, 'Password must be at least 4 characters')
    .max(8, 'Password must be at most 8 characters'),
})

export const signupSchema = z.object({
  username: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
  name: z
    .string()
    .min(1, 'Name is required')
    .max(30, 'Name must be at most 30 characters'),
  password: z
    .string()
    .min(4, 'Password must be at least 4 characters')
    .max(8, 'Password must be at most 8 characters'),
})

export const uploadBookSchema = z.object({
  title: z.string().min(1, 'Title is required').max(120, 'Title too long'),
  type: z.enum(['INFO', 'BOOK', 'GRAPHICAL']).refine((val) => !!val, {
    message: 'Please select a document type',
  }),
  description: z.string().max(500, 'Description too long').optional(),
  file: z.instanceof(File, { message: 'Please select a PDF file' }),
})

export const reviewSchema = z.object({
  rating: z.number().min(0.5).max(5),
  comment: z
    .string()
    .min(3, 'Review must be at least 3 characters')
    .max(2000, 'Review too long'),
})

export const commentSchema = z.object({
  content: z
    .string()
    .min(1, 'Comment cannot be empty')
    .max(1000, 'Comment too long'),
})

export const chatMessageSchema = z.object({
  message: z
    .string()
    .min(1, 'Message cannot be empty')
    .max(2000, 'Message too long'),
})

export const audioConversionSchema = z.object({
  bookId: z.number().positive('Book ID is required'),
  startPage: z.number().min(1, 'Start page must be at least 1'),
  endPage: z.number().min(1, 'End page must be at least 1'),
  voice: z.string().optional(),
})

export type LoginInput = z.infer<typeof loginSchema>
export type SignupInput = z.infer<typeof signupSchema>
export type UploadBookInput = z.infer<typeof uploadBookSchema>
export type ReviewInput = z.infer<typeof reviewSchema>
export type CommentInput = z.infer<typeof commentSchema>
export type ChatMessageInput = z.infer<typeof chatMessageSchema>
export type AudioConversionInput = z.infer<typeof audioConversionSchema>
