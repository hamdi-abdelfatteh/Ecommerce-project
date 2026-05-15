import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { useAuthStore } from '../store/auth'
import { useState } from 'react'
import { Eye, EyeOff, ArrowRight } from 'lucide-react'

const schema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'At least 8 characters'),
})
type Form = z.infer<typeof schema>

export default function Login() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Form>({ resolver: zodResolver(schema) })
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [showPw, setShowPw] = useState(false)

  const onSubmit = async (data: Form) => {
    setError('')
    try {
      const res = await api.post('/auth/login', data)
      const meRes = await api.get('/users/me', { headers: { Authorization: `Bearer ${res.data.access_token}` } })
      setAuth(meRes.data, res.data.access_token)
      navigate('/')
    } catch {
      setError('Invalid email or password.')
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-[#0f0e17] p-14 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-[-100px] left-[-80px] w-[400px] h-[400px] bg-violet-700 opacity-20 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-60px] right-0 w-[300px] h-[300px] bg-fuchsia-600 opacity-15 rounded-full blur-[80px]" />
        </div>
        <Link to="/" className="relative text-2xl font-black text-white">Shop<span className="text-violet-400">Nest</span></Link>
        <div className="relative">
          <blockquote className="text-3xl font-bold text-white leading-snug mb-4">
            "The best shopping experience I've ever had."
          </blockquote>
          <p className="text-gray-400">— Sarah K., verified buyer</p>
        </div>
        <div className="relative flex gap-8 text-center">
          {[['50K+', 'Customers'], ['10K+', 'Products'], ['99%', 'Satisfaction']].map(([n, l]) => (
            <div key={l}>
              <p className="text-2xl font-black text-white">{n}</p>
              <p className="text-gray-500 text-sm">{l}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#f8f7ff]">
        <div className="w-full max-w-md fade-up">
          <Link to="/" className="lg:hidden text-2xl font-black mb-10 block">Shop<span className="text-violet-600">Nest</span></Link>
          <h1 className="text-3xl font-black mb-1">Welcome back</h1>
          <p className="text-gray-500 mb-8">Sign in to your account to continue</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-5">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
              <input {...register('email')} type="email" placeholder="you@example.com"
                className="w-full border-2 border-gray-200 focus:border-violet-500 rounded-xl px-4 py-3 outline-none transition-colors bg-white text-sm" />
              {errors.email && <p className="text-red-500 text-xs mt-1.5">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input {...register('password')} type={showPw ? 'text' : 'password'} placeholder="••••••••"
                  className="w-full border-2 border-gray-200 focus:border-violet-500 rounded-xl px-4 py-3 outline-none transition-colors bg-white text-sm pr-11" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1.5">{errors.password.message}</p>}
            </div>
            <button type="submit" disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-bold py-3.5 rounded-xl transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 mt-2">
              {isSubmitting ? 'Signing in…' : <><span>Sign In</span> <ArrowRight size={16} /></>}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{' '}
            <Link to="/register" className="text-violet-600 font-semibold hover:text-violet-700">Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
