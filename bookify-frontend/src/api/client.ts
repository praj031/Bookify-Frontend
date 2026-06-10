import axios, { AxiosError } from 'axios'
import { storage } from '../utils/storage'
import type { ApiError } from '../types/api'

export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api'

export const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
})

client.interceptors.request.use(
  (config) => {
    const token = storage.getToken()
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

client.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiError>) => {
    if (error.response) {
      const status = error.response.status
      const data = error.response.data

      if (status === 401) {
        storage.clearAuth()
        window.location.href = '/login'
        return Promise.reject(new Error('Session expired. Please log in again.'))
      }

      if (status === 403) {
        return Promise.reject(new Error('You do not have permission to perform this action.'))
      }

      if (data?.mesage) {
        return Promise.reject(new Error(data.mesage))
      }

      if (data?.errors && data.errors.length > 0) {
        const messages = data.errors.map((e) => `${e.field}: ${e.message}`).join(', ')
        return Promise.reject(new Error(messages))
      }

      return Promise.reject(new Error('An unexpected error occurred. Please try again.'))
    }

    if (error.request) {
      return Promise.reject(new Error('Network error. Please check your connection.'))
    }

    return Promise.reject(new Error(error.message || 'Unknown error'))
  }
)

export function getAuthHeaders() {
  const token = storage.getToken()
  return token ? { Authorization: `Bearer ${token}` } : {}
}
