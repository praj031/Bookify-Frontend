import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { Eye, EyeOff, UserPlus } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../components/common/Toast'
import { AuthLayout } from '../components/layout/AuthLayout'
import { Input } from '../components/ui/Input'
import { Button } from '../components/ui/Button'
import { signupSchema, type SignupInput } from '../utils/validators'

export function SignupPage() {
  const { signup } = useAuth()
  const { showToast } = useToast()
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupInput>({
    resolver: zodResolver(signupSchema),
  })

  const onSubmit = async (data: SignupInput) => {
    try {
      await signup(data)
      showToast('Account created successfully!', 'success')
      navigate('/dashboard')
    } catch (error) {
      showToast(error instanceof Error ? error.message : 'Signup failed', 'error')
    }
  }

  return (
    <AuthLayout>
      <div className="mb-6">
        <h1 className="text-xl font-semibold text-surface-900">Create an account</h1>
        <p className="mt-1 text-sm text-surface-500">Join Bookify and start building your AI library</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          label="Full name"
          placeholder="Jane Reader"
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="Email"
          type="email"
          placeholder="jane@example.com"
          error={errors.username?.message}
          {...register('username')}
        />

        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••"
            helper="Must be 4–8 characters"
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
          <UserPlus className="h-4 w-4" />
          Create account
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-surface-500">
        Already have an account?{' '}
        <Link to="/login" className="font-medium text-primary-600 hover:text-primary-700">
          Log in
        </Link>
      </p>
    </AuthLayout>
  )
}
