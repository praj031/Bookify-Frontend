import { forwardRef } from 'react'
import { cn } from '../../utils/cn'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helper?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helper, className, ...props }, ref) => {
    return (
      <div className="w-full">
        {label && (
          <label className="mb-1.5 block text-sm font-medium text-surface-700">
            {label}
            {props.required && <span className="ml-0.5 text-red-500">*</span>}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full rounded-lg border px-3.5 py-2.5 text-sm text-surface-800 placeholder:text-surface-400 transition-colors focus:border-primary-500 focus:ring-1 focus:ring-primary-500',
            error
              ? 'border-red-300 focus:border-red-500 focus:ring-red-500'
              : 'border-surface-300 hover:border-surface-400',
            className
          )}
          {...props}
        />
        {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
        {helper && !error && <p className="mt-1 text-xs text-surface-500">{helper}</p>}
      </div>
    )
  }
)

Input.displayName = 'Input'
