import { client } from './client'
import type { AuthResponse, LoginRequest, SignupRequest, UserProfileResponse } from '../types/auth'

export async function login(payload: LoginRequest): Promise<AuthResponse> {
  const { data } = await client.post<AuthResponse>('/auth/login', payload)
  return data
}

export async function signup(payload: SignupRequest): Promise<AuthResponse> {
  const { data } = await client.post<AuthResponse>('/auth/signup', payload)
  return data
}

export async function getMe(): Promise<UserProfileResponse> {
  const { data } = await client.get<UserProfileResponse>('/auth/me')
  return data
}
