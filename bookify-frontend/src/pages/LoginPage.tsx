import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, LogIn } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/common/Toast'
import { AuthLayout } from '../components/layout/AuthLayout'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { loginSchema, type LoginInput } from '../utils/validators'

export function LoginPage() {
  const { login } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginInput) => {
    try {
      await login(data)
      showToast('Welcome back!', 'success')
      navigate('/dashboard')
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Login failed', 'error')
    }
  }

  return (
    <AuthLayout>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-surface-900">Welcome back</h1>
        <p className="mt-1 text-sm text-surface-500">Log in to your Bookify account</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          error={errors.username?.message}
          {...register('username')}
        />

        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••"
            error={errors.password?.message}
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-[31px] text-surface-400 hover:text-surface-600"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>

        <Button type="submit" fullWidth isLoading={isSubmitting} className="mt-2">
          <LogIn className="h-4 w-4" />
          Log in
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-surface-500">
        Don't have an account?{' '}
        <Link to="/signup" className="font-medium text-primary-600 hover:text-primary-700">
          Sign up
        </Link>
      </p>
    </AuthLayout>
  )
}
