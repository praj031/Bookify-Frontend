import { Link } from 'react-router-dom'
import {
  Sparkles,
  BookOpen,
  Headphones,
  Users,
  Shield,
  ArrowRight,
  CheckCircle,
} from 'lucide-react'

export function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-surface-0">
      <header className="mx-auto flex h-16 w-full max-w-7xl items-center justify-between px-4 lg:px-8">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-surface-900">Bookify</span>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="hidden sm:inline-flex rounded-lg px-4 py-2 text-sm font-medium text-surface-700 hover:bg-surface-100 transition-colors"
          >
            Log in
          </Link>
          <Link
            to="/signup"
            className="inline-flex items-center gap-2 rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors"
          >
            Get started
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </header>

      <section className="mx-auto w-full max-w-7xl px-4 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="text-4xl font-extrabold tracking-tight text-surface-900 sm:text-5xl lg:text-6xl">
            Turn your library into an
            <span className="text-primary-600"> AI audiobook studio</span>
          </h1>
          <p className="mt-6 text-lg leading-8 text-surface-600">
            Upload PDFs, convert them to natural-sounding audio, and share your knowledge with a global community. Built for modern learners.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-primary-600 px-6 py-3.5 text-base font-semibold text-white shadow-sm hover:bg-primary-700 transition-colors"
            >
              Start for free
              <ArrowRight className="h-5 w-5" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-xl border border-surface-300 bg-surface-0 px-6 py-3.5 text-base font-semibold text-surface-700 hover:bg-surface-50 transition-colors"
            >
              Log in
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-16 lg:px-8">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: BookOpen,
              title: 'Smart Library',
              desc: 'Organize and manage your PDFs with AI-powered categorization.',
            },
            {
              icon: Headphones,
              title: 'AI Audio',
              desc: 'Convert any book into natural audiobooks with one click.',
            },
            {
              icon: Users,
              title: 'Community',
              desc: 'Share, review, and discuss books with fellow readers.',
            },
            {
              icon: Shield,
              title: 'Secure Cloud',
              desc: 'Your documents are safely stored in scalable object storage.',
            },
          ].map((f) => (
            <div key={f.title} className="rounded-2xl border border-surface-200 bg-surface-50 p-6">
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary-100">
                <f.icon className="h-5 w-5 text-primary-600" />
              </div>
              <h3 className="text-base font-semibold text-surface-800">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-surface-500">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto w-full max-w-7xl px-4 py-16 lg:px-8">
        <div className="rounded-2xl border border-surface-200 bg-surface-50 p-8 lg:p-12">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-surface-900 sm:text-3xl">Simple pricing</h2>
            <p className="mt-3 text-surface-600">Start free and upgrade when you need more power.</p>
          </div>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-2 max-w-3xl mx-auto">
            <div className="rounded-xl border border-surface-200 bg-surface-0 p-6">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-surface-500">Free</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-surface-900">$0</span>
                <span className="text-sm text-surface-500">/month</span>
              </div>
              <ul className="mt-5 space-y-2 text-sm text-surface-600">
                {[
                  'Unlimited informational PDF uploads (≤2MB)',
                  '5 AI audio conversions',
                  'Community reviews & comments',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative rounded-xl border-2 border-primary-600 bg-surface-0 p-6">
              <div className="absolute -top-3 left-4 rounded-full bg-primary-600 px-2.5 py-0.5 text-xs font-semibold text-white">Popular</div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-surface-500">Premium</h3>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl font-bold text-surface-900">$9.99</span>
                <span className="text-sm text-surface-500">/month</span>
              </div>
              <ul className="mt-5 space-y-2 text-sm text-surface-600">
                {[
                  'Unlimited PDF uploads (up to 20MB)',
                  'Unlimited AI audio conversions',
                  'Priority processing',
                  'Advanced AI reading modes',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2">
                    <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-surface-200 py-8 text-center text-sm text-surface-500">
        Bookify · {new Date().getFullYear()}
      </footer>
    </div>
  )
}
