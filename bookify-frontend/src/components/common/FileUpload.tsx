import { useCallback, useRef, useState } from 'react'
import { Upload, File, X } from 'lucide-react'
import { cn } from '../../utils/cn'
import { formatFileSize } from '../../utils/formatters'

interface FileUploadProps {
  accept?: string
  maxSize?: number
  value?: File | null
  onChange: (file: File | null) => void
  error?: string
  disabled?: boolean
}

export function FileUpload({
  accept = 'application/pdf',
  maxSize,
  value,
  onChange,
  error,
  disabled,
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFile = useCallback(
    (file: File) => {
      if (maxSize && file.size > maxSize) {
        onChange(null)
        return
      }
      onChange(file)
    },
    [maxSize, onChange]
  )

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      if (disabled) return
      const file = e.dataTransfer.files[0]
      if (file) handleFile(file)
    },
    [disabled, handleFile]
  )

  const onDragOver = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      if (!disabled) setIsDragOver(true)
    },
    [disabled]
  )

  const onDragLeave = useCallback(() => {
    setIsDragOver(false)
  }, [])

  const onInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) handleFile(file)
    },
    [handleFile]
  )

  return (
    <div className="w-full">
      <div
        onClick={() => inputRef.current?.click()}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        className={cn(
          'relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-10 transition-colors',
          isDragOver && 'border-primary-500 bg-primary-50',
          error && !isDragOver && 'border-red-300 bg-red-50',
          !isDragOver && !error && 'border-surface-300 bg-surface-50 hover:border-primary-400 hover:bg-primary-50/50',
          disabled && 'cursor-not-allowed opacity-50'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={onInputChange}
          disabled={disabled}
          className="sr-only"
        />
        {value ? (
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100">
              <File className="h-5 w-5 text-primary-600" />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-surface-800">{value.name}</p>
              <p className="text-xs text-surface-500">{formatFileSize(value.size)}</p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onChange(null)
                if (inputRef.current) inputRef.current.value = ''
              }}
              className="ml-4 rounded-full p-1 hover:bg-surface-200"
              aria-label="Remove file"
            >
              <X className="h-4 w-4 text-surface-500" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-50">
              <Upload className="h-6 w-6 text-primary-500" />
            </div>
            <p className="text-sm font-medium text-surface-700">
              Click or drag PDF here
            </p>
            <p className="text-xs text-surface-500">
              {maxSize ? `Max ${formatFileSize(maxSize)}` : 'PDF files only'}
            </p>
          </div>
        )}
      </div>
      {error && <p className="mt-1.5 text-xs text-red-600">{error}</p>}
    </div>
  )
}
