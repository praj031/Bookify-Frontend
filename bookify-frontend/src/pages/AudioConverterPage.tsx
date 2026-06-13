import { useEffect, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useInventory } from '../hooks/useBooks'
import { useAudioConversion, useAudioUsage } from '../hooks/useAudio'
import { useToast } from '../components/common/Toast'
import { EmptyState } from '../components/common/EmptyState'
import { Skeleton } from '../components/common/SkeletonLoader'
import { Button } from '../components/ui/Button'
import { Input } from '../components/ui/Input'
import { Badge } from '../components/ui/Badge'
import { Card, CardBody } from '../components/ui/Card'
import { audioConversionSchema, type AudioConversionInput } from '../utils/validators'
import {
  ArrowLeft,
  Headphones,
  BookOpen,
  Volume2,
  AlertTriangle,
  Wand2,
  FileText,
  BookMarked,
  Image,
} from 'lucide-react'

const voices = [
  { id: 'natural-male', name: 'Natural Male' },
  { id: 'natural-female', name: 'Natural Female' },
  { id: 'warm-narrator', name: 'Warm Narrator' },
]

const typeIcons: Record<string, React.ElementType> = {
  INFO: FileText,
  BOOK: BookMarked,
  GRAPHICAL: Image,
}

export function AudioConverterPage() {
  const { showToast } = useToast()
  const [searchParams] = useSearchParams()
  const preselectedId = Number(searchParams.get('bookId'))

  const { books, isLoading: booksLoading } = useInventory()
  const { usage } = useAudioUsage()
  const { convert, job, isLoading } = useAudioConversion()

  const [selectedBookId, setSelectedBookId] = useState<number | null>(preselectedId || null)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<AudioConversionInput>({
    resolver: zodResolver(audioConversionSchema),
    defaultValues: { startPage: 1, endPage: 50, voice: 'natural-male' },
  })

  useEffect(() => {
    if (selectedBookId) setValue('bookId', selectedBookId)
  }, [selectedBookId, setValue])

  const onSubmit = async (data: AudioConversionInput) => {
    try {
      await convert(data)
      showToast('Audio conversion started!', 'success')
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Conversion failed', 'error')
    }
  }

  const canConvert = usage ? usage.remaining > 0 || usage.plan === 'PREMIUM' : false

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center gap-2">
        <Link to="/dashboard" className="inline-flex items-center gap-1 text-sm font-medium text-surface-600 hover:text-surface-800">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-surface-900">AI Audio Converter</h1>
        <p className="text-sm text-surface-500">Turn any book into a natural-sounding audiobook</p>
      </div>

      <Card>
        <CardBody className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-surface-700">
              <span className="font-medium">Plan:</span> {usage?.plan || '...'}
            </div>
            <div className="text-sm text-surface-700">
              <span className="font-medium">Conversions used:</span> {usage?.used ?? 0} / {usage?.totalAllowed ?? 0}
            </div>
          </div>
          {usage && usage.plan === 'FREE' && (
            <div className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800 border border-amber-200">
              <AlertTriangle className="inline h-3.5 w-3.5 mr-1" />
              Free tier limited to {usage.totalAllowed} conversions total.{' '}
              <Link to="/subscription" className="font-semibold underline">Upgrade to Premium</Link> for unlimited.
            </div>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <h2 className="text-base font-semibold text-surface-800">Select a book</h2>
          {booksLoading && <Skeleton className="h-40 w-full rounded-lg" />}
          {!booksLoading && books.length === 0 && (
            <EmptyState
              icon={BookOpen}
              title="No books available"
              description="Upload a book first to convert it to audio."
              action={
                <Link to="/upload" className="text-primary-600 hover:text-primary-700 font-medium">Upload a book</Link>
              }
            />
          )}
          {!booksLoading && books.length > 0 && (
            <div className="grid gap-3 sm:grid-cols-2">
              {books.map((book) => {
                const Icon = typeIcons[book.type] || BookOpen
                const isSelected = selectedBookId === book.id
                return (
                  <button
                    key={book.id}
                    type="button"
                    onClick={() => setSelectedBookId(book.id)}
                    className={
                      isSelected
                        ? 'flex items-center gap-3 rounded-xl border-2 border-primary-500 bg-primary-50 px-4 py-3 text-left'
                        : 'flex items-center gap-3 rounded-xl border border-surface-200 bg-surface-0 px-4 py-3 text-left hover:border-surface-300'
                    }
                  >
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary-100">
                      <Icon className="h-4 w-4 text-primary-600" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-surface-900 truncate">{book.title}</p>
                      <p className="text-xs text-surface-500">{book.type}</p>
                    </div>
                    {isSelected && <Badge variant="info">Selected</Badge>}
                  </button>
                )
              })}
            </div>
          )}
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Input
                label="Start page"
                type="number"
                min={1}
                error={errors.startPage?.message}
                {...register('startPage', { valueAsNumber: true })}
              />
              <Input
                label="End page"
                type="number"
                min={1}
                error={errors.endPage?.message}
                {...register('endPage', { valueAsNumber: true })}
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-surface-700">Voice</label>
              <div className="grid gap-3 sm:grid-cols-3">
                {voices.map((v) => (
                  <label
                    key={v.id}
                    className="flex cursor-pointer items-center gap-2 rounded-lg border border-surface-200 bg-surface-0 px-3 py-2.5 hover:bg-surface-50"
                  >
                    <input
                      type="radio"
                      value={v.id}
                      {...register('voice')}
                      className="h-4 w-4 text-primary-600"
                    />
                    <Volume2 className="h-4 w-4 text-surface-500" />
                    <span className="text-sm text-surface-700">{v.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {job && (
              <div className="rounded-lg border border-primary-200 bg-primary-50 px-4 py-3 text-sm text-primary-800">
                <Wand2 className="inline h-4 w-4 mr-1" />
                Conversion job <strong>{job.id}</strong> is currently{' '}
                <Badge variant={job.status === 'FAILED' ? 'danger' : 'info'}>{job.status}</Badge>.
                {job.status === 'COMPLETED' && (
                  <Link to={`/audio/player?jobId=${job.id}`} className="ml-2 font-semibold underline">Listen now</Link>
                )}
              </div>
            )}

            <Button type="submit" fullWidth isLoading={isLoading} disabled={!canConvert || !selectedBookId}>
              <Headphones className="h-4 w-4" />
              {canConvert ? 'Start Audio Conversion' : 'No conversions remaining'}
            </Button>
          </form>
        </CardBody>
      </Card>
    </div>
  )
}
