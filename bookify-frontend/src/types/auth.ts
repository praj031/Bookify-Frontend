export interface UserProfileResponse {
  id: number
  username: string
  name: string
}

export interface AuthResponse {
  token: string
  user: UserProfileResponse
}

export interface LoginRequest {
  username: string
  password: string
}

export interface SignupRequest {
  username: string
  name: string
  password: string
}
