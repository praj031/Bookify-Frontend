import { Navigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import { MainLayout } from '../layout/MainLayout'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-surface-50">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary-300 border-t-primary-600" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  return <MainLayout>{children}</MainLayout>
}
