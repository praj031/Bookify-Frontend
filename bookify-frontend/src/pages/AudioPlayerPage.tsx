import { useCallback, useEffect, useRef, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { getAudioStreamUrl, downloadAudio } from '../api/audio'
import { Card, CardBody } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Skeleton } from '../components/common/SkeletonLoader'
import { useToast } from '../components/common/Toast'
import {
  ArrowLeft,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Headphones,
  Download,
} from 'lucide-react'

export function AudioPlayerPage() {
  const [searchParams] = useSearchParams()
  const jobId = searchParams.get('jobId') || ''
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isDownloading, setIsDownloading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { showToast } = useToast()

  const streamUrl = jobId ? getAudioStreamUrl(jobId) : ''

  const handleDownload = useCallback(async () => {
    if (!jobId || isDownloading) return
    setIsDownloading(true)
    try {
      const blob = await downloadAudio(jobId)
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `audiobook-${jobId}.mp3`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      showToast('Download started', 'success')
    } catch (err) {
      showToast(err instanceof Error ? err.message : 'Download failed', 'error')
    } finally {
      setIsDownloading(false)
    }
  }, [jobId, isDownloading, showToast])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const onLoaded = () => {
      setDuration(audio.duration || 0)
      setIsLoading(false)
    }
    const onError = () => {
      setError('Failed to load audio stream. The conversion may still be processing.')
      setIsLoading(false)
    }
    const onTimeUpdate = () => setCurrentTime(audio.currentTime)
    const onEnded = () => setIsPlaying(false)
    const onPlay = () => setIsPlaying(true)
    const onPause = () => setIsPlaying(false)

    audio.addEventListener('loadedmetadata', onLoaded)
    audio.addEventListener('error', onError)
    audio.addEventListener('timeupdate', onTimeUpdate)
    audio.addEventListener('ended', onEnded)
    audio.addEventListener('play', onPlay)
    audio.addEventListener('pause', onPause)

    return () => {
      audio.removeEventListener('loadedmetadata', onLoaded)
      audio.removeEventListener('error', onError)
      audio.removeEventListener('timeupdate', onTimeUpdate)
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('play', onPlay)
      audio.removeEventListener('pause', onPause)
    }
  }, [streamUrl])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return
    if (isPlaying) {
      audio.pause()
    } else {
      audio.play().catch(() => {
        setError('Playback was blocked by the browser. Please interact with the page first.')
      })
    }
  }

  const seek = (value: number) => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = value
    setCurrentTime(value)
  }

  const skip = (seconds: number) => {
    const audio = audioRef.current
    if (!audio) return
    audio.currentTime = Math.max(0, Math.min(audio.duration || 0, audio.currentTime + seconds))
  }

  const toggleMute = () => {
    const audio = audioRef.current
    if (!audio) return
    audio.muted = !audio.muted
    setVolume(audio.muted ? 0 : 1)
  }

  const formatTime = (t: number) => {
    if (!isFinite(t)) return '0:00'
    const m = Math.floor(t / 60)
    const s = Math.floor(t % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-2">
        <Link to="/audio" className="inline-flex items-center gap-1 text-sm font-medium text-surface-600 hover:text-surface-800">
          <ArrowLeft className="h-4 w-4" /> Back to Audio
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-surface-900">AI Reading Player</h1>
        <p className="text-sm text-surface-500">Stream your converted audiobook</p>
      </div>

      <Card>
        <CardBody className="space-y-6">
          {isLoading && <Skeleton className="h-48 w-full rounded-xl" />}

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <audio ref={audioRef} src={streamUrl} preload="metadata" className="hidden" />

          {!isLoading && !error && (
            <>
              <div className="flex items-center justify-center">
                <div className="flex h-32 w-32 items-center justify-center rounded-2xl bg-primary-100">
                  <Headphones className="h-12 w-12 text-primary-600" />
                </div>
              </div>

              <div className="space-y-2">
                <input
                  type="range"
                  min={0}
                  max={duration || 1}
                  step={1}
                  value={currentTime}
                  onChange={(e) => seek(Number(e.target.value))}
                  className="w-full accent-primary-600"
                />
                <div className="flex items-center justify-between text-xs text-surface-500">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-4">
                <button onClick={() => skip(-15)} className="rounded-full p-2 text-surface-600 hover:bg-surface-100">
                  <SkipBack className="h-5 w-5" />
                </button>

                <button
                  onClick={togglePlay}
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-600 text-white shadow-md hover:bg-primary-700 transition-colors"
                >
                  {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6 ml-0.5" />}
                </button>

                <button onClick={() => skip(15)} className="rounded-full p-2 text-surface-600 hover:bg-surface-100">
                  <SkipForward className="h-5 w-5" />
                </button>
              </div>

              <div className="flex items-center justify-center gap-3">
                <button onClick={toggleMute} className="text-surface-500 hover:text-surface-700">
                  {volume === 0 ? <VolumeX className="h-5 w-5" /> : <Volume2 className="h-5 w-5" />}
                </button>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.05}
                  value={volume}
                  onChange={(e) => {
                    const v = Number(e.target.value)
                    setVolume(v)
                    if (audioRef.current) {
                      audioRef.current.volume = v
                      audioRef.current.muted = v === 0
                    }
                  }}
                  className="w-24 accent-primary-600"
                />
              </div>
            </>
          )}

          <div className="flex items-center justify-center gap-3">
            {jobId && (
              <Button variant="outline" size="sm" onClick={handleDownload} isLoading={isDownloading}>
                <Download className="h-4 w-4" /> Download
              </Button>
            )}
          </div>
        </CardBody>
      </Card>
    </div>
  )
}
