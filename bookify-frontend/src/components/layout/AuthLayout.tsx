import { Link } from 'react-router-dom'
import { Sparkles } from 'lucide-react'

export function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-50 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-600">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <span className="text-2xl font-bold tracking-tight text-surface-900">Bookify</span>
          </Link>
          <p className="mt-2 text-sm text-surface-500">AI-powered library management platform</p>
        </div>
        <div className="rounded-2xl border border-surface-200 bg-surface-0 p-6 shadow-sm sm:p-8">
          {children}
        </div>
      </div>
    </div>
  )
}
