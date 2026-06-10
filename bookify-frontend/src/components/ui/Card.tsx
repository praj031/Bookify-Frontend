import { cn } from '../../utils/cn'

interface CardProps {
  children: React.ReactNode
  className?: string
}

export function Card({ children, className }: CardProps) {
  return (
    <div className={cn('rounded-xl border border-surface-200 bg-surface-0 shadow-sm', className)}>
      {children}
    </div>
  )
}

export function CardHeader({ children, className }: CardProps) {
  return <div className={cn('border-b border-surface-100 px-5 py-4', className)}>{children}</div>
}

export function CardBody({ children, className }: CardProps) {
  return <div className={cn('px-5 py-4', className)}>{children}</div>
}

export function CardFooter({ children, className }: CardProps) {
  return <div className={cn('border-t border-surface-100 px-5 py-4', className)}>{children}</div>
}
