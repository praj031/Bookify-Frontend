import { Navbar } from './Navbar'

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-surface-50">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-6 lg:px-8">
        {children}
      </main>
      <footer className="border-t border-surface-200 bg-surface-0 py-6 text-center text-xs text-surface-500">
        Bookify — AI Library & Audiobooks · {new Date().getFullYear()}
      </footer>
    </div>
  )
}
