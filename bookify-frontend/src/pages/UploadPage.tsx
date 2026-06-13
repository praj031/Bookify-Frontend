import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link } from 'react-router-dom'
import { uploadBookSchema, type UploadBookInput } from '../utils/validators'
import { useUploadBook } from '../hooks/useBooks'
import { useAudioUsage } from '../hooks/useAudio'
import { useToast } from '../components/common/Toast'
import { FileUpload } from '../components/common/FileUpload'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { Badge } from '../components/ui/Badge'
import { Card, CardBody } from '../components/ui/Card'
import { ArrowLeft, FileText, BookMarked, Image, Info } from 'lucide-react'
import { cn } from '../utils/cn'
import type { BookType } from '../types/book'

type PlanKey = 'FREE' | 'PREMIUM'

const MAX_SIZES: Record<PlanKey, Record<BookType, number>> = {
  FREE: { INFO: 2 * 1024 * 1024, BOOK: 0, GRAPHICAL: 0 },
  PREMIUM: { INFO: 2 * 1024 * 1024, BOOK: 10 * 1024 * 1024, GRAPHICAL: 20 * 1024 * 1024 },
}

const typeOptions: Array<{ value: BookType; label: string; icon: React.ElementType; desc: string; requiresPremium: boolean }> = [
  { value: 'INFO', label: 'Informational', icon: FileText, desc: 'Text-only documents, ≤2MB', requiresPremium: false },
  { value: 'BOOK', label: 'Book', icon: BookMarked, desc: 'Standard PDFs, up to 10MB (Premium)', requiresPremium: true },
  { value: 'GRAPHICAL', label: 'Graphical', icon: Image, desc: 'Image-heavy PDFs, up to 20MB (Premium)', requiresPremium: true },
]

export function UploadPage() {
  const { showToast } = useToast()
  const { upload, isLoading } = useUploadBook()
  const { usage } = useAudioUsage()
  const [selectedType, setSelectedType] = useState<BookType>('INFO')
  const [file, setFile] = useState<File | null>(null)

  const plan: PlanKey = usage?.plan === 'PREMIUM' ? 'PREMIUM' : 'FREE'
  const limits = MAX_SIZES[plan]

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<UploadBookInput>({
    resolver: zodResolver(uploadBookSchema),
    defaultValues: { type: 'INFO' },
  })

  const handleTypeChange = (type: BookType) => {
    setSelectedType(type)
    setValue('type', type)
    if (file && limits[type] > 0 && file.size > limits[type]) {
      setError('file', { message: `File exceeds ${limits[type] / 1024 / 1024}MB limit for ${plan} plan` })
    } else {
      clearErrors('file')
    }
  }

  const handleFileChange = (f: File | null) => {
    setFile(f)
    setValue('file', f as File, { shouldValidate: true })
    if (f && limits[selectedType] > 0 && f.size > limits[selectedType]) {
      setError('file', { message: `File exceeds ${limits[selectedType] / 1024 / 1024}MB limit for ${plan} plan` })
    } else if (f && limits[selectedType] === 0) {
      setError('file', { message: `${selectedType} uploads require a Premium subscription` })
    } else {
      clearErrors('file')
    }
  }

  const onSubmit = async (data: UploadBookInput) => {
    if (!file) {
      setError('file', { message: 'Please select a PDF file' })
      return
    }
    if (limits[data.type] === 0) {
      showToast(`${data.type} uploads require a Premium subscription`, 'warning')
      return
    }
    if (file.size > limits[data.type]) {
      showToast('File size exceeds your plan limit', 'error')
      return
    }

    const formData = new FormData()
    formData.append('file', file)
    formData.append('type', data.type)
    formData.append('title', data.title)
    if (data.description) formData.append('description', data.description)

    try {
      await upload(formData)
      showToast('Book uploaded successfully!', 'success')
      setFile(null)
      setSelectedType('INFO')
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Upload failed', 'error')
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-2">
        <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm font-medium text-surface-600 hover:text-surface-800">
          <ArrowLeft className="h-4 w-4" /> Back to Library
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-surface-900">Upload Book</h1>
        <p className="text-sm text-surface-500">Upload a PDF to your personal library</p>
      </div>

      <Card>
        <CardBody>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-surface-700">Document type</label>
              <div className="grid gap-3 sm:grid-cols-3">
                {typeOptions.map((opt) => {
                  const Icon = opt.icon
                  const isActive = selectedType === opt.value
                  const isBlocked = plan === 'FREE' && opt.requiresPremium
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => handleTypeChange(opt.value)}
                      disabled={isBlocked}
                      className={cn(
                        'flex flex-col items-center gap-2 rounded-xl border px-3 py-4 text-center transition-all',
                        isActive
                          ? 'border-primary-500 bg-primary-50 text-primary-700'
                          : 'border-surface-200 bg-surface-0 text-surface-600 hover:border-surface-300',
                        isBlocked && 'opacity-50 cursor-not-allowed'
                      )}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-sm font-medium">{opt.label}</span>
                      <span className="text-xs text-surface-500">{opt.desc}</span>
                      {isBlocked && <Badge variant="warning" className="mt-1">Premium</Badge>}
                    </button>
                  )
                })}
              </div>
              {errors.type && <p className="text-xs text-red-600">{errors.type.message}</p>}
            </div>

            <FileUpload
              value={file}
              onChange={handleFileChange}
              error={errors.file?.message}
              maxSize={limits[selectedType] > 0 ? limits[selectedType] : undefined}
            />

            <Input
              label="Title"
              placeholder="Enter book title"
              error={errors.title?.message}
              {...register('title')}
            />

            <div>
              <label className="mb-1.5 block text-sm font-medium text-surface-700">Description</label>
              <textarea
                rows={3}
                className="w-full rounded-lg border border-surface-300 px-3.5 py-2.5 text-sm text-surface-800 placeholder:text-surface-400 transition-colors focus:border-primary-500 focus:ring-1 focus:ring-primary-500"
                placeholder="Optional short description"
                {...register('description')}
              />
              {errors.description && <p className="mt-1 text-xs text-red-600">{errors.description.message}</p>}
            </div>

            <div className="flex items-center gap-2 rounded-lg bg-surface-50 px-3 py-2 text-xs text-surface-500">
              <Info className="h-4 w-4 shrink-0" />
              <span>
                Current plan: <strong className="text-surface-700">{plan}</strong>. Max size for {selectedType}:{' '}
                <strong className="text-surface-700">{limits[selectedType] > 0 ? `${limits[selectedType] / 1024 / 1024}MB` : 'Blocked'}</strong>
              </span>
            </div>

            <Button type="submit" fullWidth isLoading={isLoading}>
              Upload to Library
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  )
}
