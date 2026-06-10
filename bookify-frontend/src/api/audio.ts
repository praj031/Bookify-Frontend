import { client } from './client'
import type { AudioConversionRequest, AudioUsage, ConversionJob } from '../types/audio'

export async function requestConversion(payload: AudioConversionRequest): Promise<{ conversionJobId: string }> {
  const { data } = await client.post<{ conversionJobId: string }>('/audio/convert', payload)
  return data
}

export async function downloadAudio(id: string): Promise<Blob> {
  const { data } = await client.get<Blob>(`/audio/${id}/download`, {
    responseType: 'blob',
  })
  return data
}

export function getAudioStreamUrl(id: string): string {
  const base = client.defaults.baseURL || ''
  const token = localStorage.getItem('bookify_token')
  const url = `${base}/audio/${id}/stream`
  if (!token) return url
  return `${url}?token=${encodeURIComponent(token)}`
}

export async function getAudioUsage(): Promise<AudioUsage> {
  const { data } = await client.get<AudioUsage>('/audio/usage')
  return data
}

export async function getConversionJobStatus(id: string): Promise<ConversionJob> {
  // Polling endpoint inferred from backend architecture
  const { data } = await client.get<ConversionJob>(`/audio/jobs/${id}`)
  return data
}
