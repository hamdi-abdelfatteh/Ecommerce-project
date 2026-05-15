import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Link, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { useAuthStore } from '../store/auth'
import { useState } from 'react'
import { Eye, EyeOff, ArrowRight, Check } from 'lucide-react'

const schema = z.object({
  firstName: z.string().min(1, 'Required'),
  lastName: z.string().min(1, 'Required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'At least 8 characters'),
})
type Form = z.infer<typeof schema>

const perks = ['Free account, no credit card', 'Exclusive member deals', 'Order tracking & history', 'Easy returns & refunds']

export default function Register() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<Form>({ resolver: zodResolver(schema) })
  const { setAuth } = useAuthStore()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [showPw, setShowPw] = useState(false)

  const onSubmit = async (data: Form) => {
    setError('')
    try {
      const res = await api.post('/auth/register', data)
      const meRes = await api.get('/users/me', { headers: { Authorization: `Bearer ${res.data.access_token}` } })
      setAuth(meRes.data, res.data.access_token)
      navigate('/')
    } catch (e: any) {
      setError(e.response?.data?.message ?? 'Registration failed. Please try again.')
    }
  }

  return (
    <div className="min-h-screen flex">
      {/* Left panel */}
      <div className="hidden lg:flex flex-col justify-between w-1/2 bg-gradient-to-br from-violet-700 to-fuchsia-700 p-14 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none opacity-10">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="absolute rounded-full border border-white"
              style={{ width: `${160 + i * 80}px`, height: `${160 + i * 80}px`, top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }} />
          ))}
        </div>
        <Link to="/" className="relative text-2xl font-black text-white">Shop<span className="text-violet-200">Nest</span></Link>
        <div className="relative">
          <h2 className="text-4xl font-black text-white leading-snug mb-8">Join 50,000+<br />happy shoppers</h2>
          <ul className="space-y-3">
            {perks.map((p) => (
              <li key={p} className="flex items-center gap-3 text-violet-100">
                <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                  <Check size={12} className="text-white" />
                </div>
                <span className="text-sm">{p}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-violet-300 text-sm">Already trusted by thousands worldwide.</p>
      </div>

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center p-8 bg-[#f8f7ff]">
        <div className="w-full max-w-md fade-up">
          <Link to="/" className="lg:hidden text-2xl font-black mb-10 block">Shop<span className="text-violet-600">Nest</span></Link>
          <h1 className="text-3xl font-black mb-1">Create account</h1>
          <p className="text-gray-500 mb-8">It's free and always will be</p>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3 mb-5">{error}</div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">First Name</label>
                <input {...register('firstName')} placeholder="John"
                  className="w-full border-2 border-gray-200 focus:border-violet-500 rounded-xl px-4 py-3 outline-none transition-colors bg-white text-sm" />
                {errors.firstName && <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Last Name</label>
                <input {...register('lastName')} placeholder="Doe"
                  className="w-full border-2 border-gray-200 focus:border-violet-500 rounded-xl px-4 py-3 outline-none transition-colors bg-white text-sm" />
                {errors.lastName && <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>}
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Email</label>
              <input {...register('email')} type="email" placeholder="you@example.com"
                className="w-full border-2 border-gray-200 focus:border-violet-500 rounded-xl px-4 py-3 outline-none transition-colors bg-white text-sm" />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Password</label>
              <div className="relative">
                <input {...register('password')} type={showPw ? 'text' : 'password'} placeholder="Min. 8 characters"
                  className="w-full border-2 border-gray-200 focus:border-violet-500 rounded-xl px-4 py-3 outline-none transition-colors bg-white text-sm pr-11" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPw ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <button type="submit" disabled={isSubmitting}
              className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-bold py-3.5 rounded-xl transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 mt-1">
              {isSubmitting ? 'Creating account…' : <><span>Create Account</span> <ArrowRight size={16} /></>}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Already have an account?{' '}
            <Link to="/login" className="text-violet-600 font-semibold hover:text-violet-700">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
