import { useCallback, useEffect, useState } from 'react'
import type { AudioUsage, ConversionJob, AudioConversionRequest } from '../types/audio'
import { requestConversion, getAudioUsage } from '../api/audio'

export function useAudioUsage() {
  const [usage, setUsage] = useState<AudioUsage | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const refetch = useCallback(async () => {
    setIsLoading(true)
    setError(null)
    try {
      const data = await getAudioUsage()
      setUsage(data)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to load usage'))
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    refetch()
  }, [refetch])

  return { usage, isLoading, error, refetch }
}

export function useAudioConversion() {
  const [job, setJob] = useState<ConversionJob | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  const convert = useCallback(async (payload: AudioConversionRequest) => {
    setIsLoading(true)
    setError(null)
    try {
      const { conversionJobId } = await requestConversion(payload)
      // Optimistically set a pending job for UI feedback
      setJob({
        id: conversionJobId,
        bookId: payload.bookId,
        status: 'PENDING',
        createdAt: new Date().toISOString(),
      })
      return conversionJobId
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Conversion request failed'))
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  return { convert, job, isLoading, error }
}
