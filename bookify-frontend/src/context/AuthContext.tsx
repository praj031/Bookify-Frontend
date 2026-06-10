import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from 'react'
import type { UserProfileResponse, AuthResponse, LoginRequest, SignupRequest } from '../types/auth'
import { storage } from '../utils/storage'
import { login as apiLogin, signup as apiSignup, getMe } from '../api/auth'

interface AuthState {
  user: UserProfileResponse | null
  isLoading: boolean
  isAuthenticated: boolean
}

interface AuthContextValue extends AuthState {
  login: (payload: LoginRequest) => Promise<void>
  signup: (payload: SignupRequest) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfileResponse | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const init = async () => {
      const token = storage.getToken()
      if (!token) {
        setIsLoading(false)
        return
      }
      try {
        const profile = await getMe()
        setUser(profile)
      } catch {
        storage.clearAuth()
      } finally {
        setIsLoading(false)
      }
    }
    init()
  }, [])

  const handleAuthResponse = useCallback((response: AuthResponse) => {
    storage.setToken(response.token)
    storage.setUser(response.user)
    setUser(response.user)
  }, [])

  const login = useCallback(async (payload: LoginRequest) => {
    const response = await apiLogin(payload)
    handleAuthResponse(response)
  }, [handleAuthResponse])

  const signup = useCallback(async (payload: SignupRequest) => {
    const response = await apiSignup(payload)
    handleAuthResponse(response)
  }, [handleAuthResponse])

  const logout = useCallback(() => {
    storage.clearAuth()
    setUser(null)
    window.location.href = '/login'
  }, [])

  const value: AuthContextValue = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    signup,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
