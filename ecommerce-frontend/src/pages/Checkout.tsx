import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { CreditCard, CheckCircle2, XCircle, Lock, ArrowRight } from 'lucide-react'
import { useCartStore } from '../store/cart'

function normalizeImages(images: any): string[] {
  if (!images) return []
  if (Array.isArray(images)) return images
  try {
    return typeof images === 'string' ? JSON.parse(images) : []
  } catch {
    return []
  }
}

interface CartItem { quantity: number; product: { name: string; price: number; images: string | string[] } }

export default function Checkout() {
  const navigate = useNavigate()
  const { setCount } = useCartStore()
  const [cardNumber, setCardNumber] = useState('')
  const [addressId, setAddressId] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<'success' | 'failed' | null>(null)
  const [order, setOrder] = useState<any>(null)

  const { data: cart = [] } = useQuery<CartItem[]>({ queryKey: ['cart'], queryFn: () => api.get('/cart').then((r) => 
    r.data.map((item: any) => ({
      ...item,
      product: { ...item.product, images: normalizeImages(item.product.images) }
    }))
  ) })
  const { data: addresses = [] } = useQuery({ queryKey: ['addresses'], queryFn: () => api.get('/users/me/addresses').then((r) => r.data) })

  const total = cart.reduce((s, i) => s + Number(i.product.price) * i.quantity, 0)

  const handleCheckout = async () => {
    if (cardNumber.length !== 4) return
    setLoading(true)
    try {
      const res = await api.post('/orders/checkout', { cardNumber, shippingAddressId: addressId || 'default' })
      setOrder(res.data); setResult('success'); setCount(0)
    } catch (e: any) {
      setResult('failed'); setOrder(e.response?.data?.order ?? null)
    } finally { setLoading(false) }
  }

  if (result === 'success') return (
    <div className="max-w-md mx-auto text-center py-20 fade-up">
      <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <CheckCircle2 size={52} className="text-green-500" />
      </div>
      <h1 className="text-3xl font-black mb-2">Order Confirmed!</h1>
      <p className="text-gray-500 mb-1">Order #{order?.id?.slice(0, 8).toUpperCase()}</p>
      <p className="text-gray-400 text-sm mb-6">Total paid: <span className="font-bold text-violet-700">${Number(order?.totalAmount).toFixed(2)}</span></p>
      <button onClick={() => navigate('/orders')}
        className="inline-flex items-center gap-2 bg-violet-600 text-white font-bold px-7 py-3.5 rounded-full hover:bg-violet-500 transition-colors">
        View My Orders <ArrowRight size={16} />
      </button>
    </div>
  )

  if (result === 'failed') return (
    <div className="max-w-md mx-auto text-center py-20 fade-up">
      <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <XCircle size={52} className="text-red-500" />
      </div>
      <h1 className="text-3xl font-black mb-2">Payment Failed</h1>
      <p className="text-gray-500 mb-8">Card declined. Please check your details and try again.</p>
      <button onClick={() => setResult(null)}
        className="bg-violet-600 text-white font-bold px-7 py-3.5 rounded-full hover:bg-violet-500 transition-colors">
        Try Again
      </button>
    </div>
  )

  return (
    <div className="max-w-3xl mx-auto fade-up">
      <h1 className="text-3xl font-black mb-8">Checkout</h1>
      <div className="grid md:grid-cols-5 gap-6">
        {/* Left column */}
        <div className="md:col-span-3 space-y-5">
          {/* Address */}
          {addresses.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
              <h2 className="font-bold text-base mb-4">Shipping Address</h2>
              <div className="space-y-2">
                {addresses.map((a: any) => (
                  <label key={a.id} className={`flex items-start gap-3 p-3 rounded-xl border-2 cursor-pointer transition-colors ${
                    addressId === a.id ? 'border-violet-500 bg-violet-50' : 'border-gray-100 hover:border-gray-200'
                  }`}>
                    <input type="radio" name="address" value={a.id} checked={addressId === a.id} onChange={() => setAddressId(a.id)} className="mt-0.5 accent-violet-600" />
                    <div className="text-sm">
                      <p className="font-semibold">{a.street}</p>
                      <p className="text-gray-400">{a.city}, {a.state} {a.postalCode} · {a.country}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Payment */}
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
            <h2 className="font-bold text-base mb-1 flex items-center gap-2"><CreditCard size={18} className="text-violet-600" /> Payment</h2>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-5 text-xs text-amber-700">
              <span className="font-bold">Demo mode:</span> Enter <span className="font-mono font-black text-green-700 bg-green-100 px-1.5 py-0.5 rounded">1234</span> to succeed, any other 4 digits to fail.
            </div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Card Number (4 digits)</label>
            <div className="relative">
              <input
                value={cardNumber} onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, '').slice(0, 4))}
                placeholder="· · · ·"
                className="w-full border-2 border-gray-200 focus:border-violet-500 rounded-xl px-5 py-4 font-mono text-2xl text-center tracking-[0.5em] outline-none transition-colors"
              />
            </div>
            <div className="flex gap-1.5 mt-3">
              {[0,1,2,3].map((i) => (
                <div key={i} className={`h-1 flex-1 rounded-full transition-colors ${i < cardNumber.length ? 'bg-violet-500' : 'bg-gray-200'}`} />
              ))}
            </div>
          </div>
        </div>

        {/* Right column — summary */}
        <div className="md:col-span-2">
          <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm sticky top-24">
            <h2 className="font-bold text-base mb-4">Order Summary</h2>
            <div className="space-y-3 mb-5">
              {cart.map((item, i) => (
                <div key={i} className="flex gap-3 items-center">
                  <div className="w-10 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                    {item.product.images?.[0] ? <img src={item.product.images[0]} className="w-full h-full object-cover" alt="" /> : <div className="w-full h-full flex items-center justify-center text-lg">📦</div>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{item.product.name}</p>
                    <p className="text-xs text-gray-400">× {item.quantity}</p>
                  </div>
                  <p className="text-xs font-bold">${(Number(item.product.price) * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-dashed pt-4 mb-5">
              <div className="flex justify-between">
                <span className="font-bold">Total</span>
                <span className="text-xl font-black text-violet-700">${total.toFixed(2)}</span>
              </div>
            </div>
            <button onClick={handleCheckout} disabled={loading || cardNumber.length !== 4}
              className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-bold py-3.5 rounded-xl transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-violet-200">
              {loading ? 'Processing…' : <><Lock size={15} /> Pay ${total.toFixed(2)}</>}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
