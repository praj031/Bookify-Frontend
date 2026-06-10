import { Routes, Route } from 'react-router-dom'
import { LandingPage } from '../pages/LandingPage'
import { LoginPage } from '../pages/LoginPage'
import { SignupPage } from '../pages/SignupPage'
import { DashboardPage } from '../pages/DashboardPage'
import { UploadPage } from '../pages/UploadPage'
import { MarketplacePage } from '../pages/MarketplacePage'
import { BookDetailPage } from '../pages/BookDetailPage'
import { AudioLibraryPage } from '../pages/AudioLibraryPage'
import { AudioConverterPage } from '../pages/AudioConverterPage'
import { AudioPlayerPage } from '../pages/AudioPlayerPage'
import { SubscriptionPage } from '../pages/SubscriptionPage'
import { ProfilePage } from '../pages/ProfilePage'
import { ProtectedRoute } from '../components/common/ProtectedRoute'
import { AuthLayout } from '../components/layout/AuthLayout'

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
      <Route path="/upload" element={<ProtectedRoute><UploadPage /></ProtectedRoute>} />
      <Route path="/marketplace" element={<ProtectedRoute><MarketplacePage /></ProtectedRoute>} />
      <Route path="/books/:id" element={<ProtectedRoute><BookDetailPage /></ProtectedRoute>} />
      <Route path="/audio" element={<ProtectedRoute><AudioLibraryPage /></ProtectedRoute>} />
      <Route path="/audio/convert" element={<ProtectedRoute><AudioConverterPage /></ProtectedRoute>} />
      <Route path="/audio/player" element={<ProtectedRoute><AudioPlayerPage /></ProtectedRoute>} />
      <Route path="/subscription" element={<ProtectedRoute><SubscriptionPage /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route
        path="*"
        element={
          <AuthLayout>
            <div className="text-center">
              <h2 className="text-lg font-semibold text-surface-800">Page not found</h2>
              <p className="mt-1 text-sm text-surface-500">The page you're looking for doesn't exist.</p>
            </div>
          </AuthLayout>
        }
      />
    </Routes>
  )
}
