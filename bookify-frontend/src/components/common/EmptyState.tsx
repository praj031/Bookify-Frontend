import { type LucideIcon } from 'lucide-react'
import { cn } from '../../utils/cn'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  action?: React.ReactNode
  className?: string
}

export function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div className={cn('flex flex-col items-center justify-center rounded-xl border border-dashed border-surface-300 bg-surface-0 px-6 py-16 text-center', className)}>
      <div className="mb-4 rounded-full bg-primary-50 p-3">
        <Icon className="h-6 w-6 text-primary-500" />
      </div>
      <h3 className="text-base font-semibold text-surface-800">{title}</h3>
      <p className="mt-1 max-w-xs text-sm text-surface-500">{description}</p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}
