import { cn } from '../../utils/cn'

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-pulse rounded-md bg-surface-200',
        className
      )}
    />
  )
}

export function BookCardSkeleton() {
  return (
    <div className="rounded-xl border border-surface-200 bg-surface-0 p-4 shadow-sm">
      <Skeleton className="h-40 w-full rounded-lg" />
      <Skeleton className="mt-3 h-5 w-3/4" />
      <Skeleton className="mt-2 h-4 w-1/2" />
      <div className="mt-4 flex items-center justify-between">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-8 w-20 rounded-lg" />
      </div>
    </div>
  )
}

export function ListSkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full rounded-lg" />
      ))}
    </div>
  )
}
