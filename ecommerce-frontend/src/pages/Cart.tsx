import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'
import { Trash2, ShoppingBag, ArrowRight, Minus, Plus, AlertTriangle } from 'lucide-react'

interface CartItem {
  id: string; quantity: number; productId: string
  product: { id: string; name: string; price: number; images: string | string[] }
}

function normalizeImages(images: string | string[] | null | undefined): string[] {
  if (!images) return []
  if (Array.isArray(images)) return images
  try {
    return typeof images === 'string' ? JSON.parse(images) : []
  } catch {
    return []
  }
}

export default function Cart() {
  const queryClient = useQueryClient()

  const { data: cartItems = [], isLoading, error } = useQuery<CartItem[]>({
    queryKey: ['cart'],
    queryFn: () => api.get('/cart').then((r) => 
      r.data.map((item: CartItem) => ({
        ...item,
        product: { ...item.product, images: normalizeImages(item.product.images) }
      }))
    ),
  })

  const items = cartItems

  // Handle general errors
  if (error) {
    return (
      <div className="text-center py-24 fade-up">
        <div className="w-24 h-24 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={40} className="text-red-300" />
        </div>
        <h2 className="text-2xl font-black mb-2">Something went wrong</h2>
        <p className="text-gray-400 mb-8">Unable to load your cart. Please try again later.</p>
        <button 
          onClick={() => window.location.reload()} 
          className="inline-flex items-center gap-2 bg-violet-600 text-white font-bold px-7 py-3.5 rounded-full hover:bg-violet-500 transition-colors"
        >
          Retry
        </button>
      </div>
    )
  }

  const updateMutation = useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      api.patch(`/cart/${productId}`, { quantity }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  })

  const removeMutation = useMutation({
    mutationFn: (productId: string) => api.delete(`/cart/${productId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  })

  const total = items.reduce((s, i) => s + Number(i.product.price) * i.quantity, 0)

  if (isLoading) return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-4">
        {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-28 rounded-2xl" />)}
      </div>
      <div className="skeleton h-64 rounded-2xl" />
    </div>
  )

  if (items.length === 0) return (
    <div className="text-center py-24 fade-up">
      <div className="w-24 h-24 bg-violet-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <ShoppingBag size={40} className="text-violet-300" />
      </div>
      <h2 className="text-2xl font-black mb-2">Your cart is empty</h2>
      <p className="text-gray-400 mb-8">Looks like you haven't added anything yet</p>
      <Link to="/products" className="inline-flex items-center gap-2 bg-violet-600 text-white font-bold px-7 py-3.5 rounded-full hover:bg-violet-500 transition-colors">
        Start Shopping <ArrowRight size={16} />
      </Link>
    </div>
  )

  return (
    <div className="fade-up">
      <div className="mb-10">
        <h1 className="text-4xl font-black mb-2">Shopping Cart</h1>
        <p className="text-gray-500 text-lg">{items.length} {items.length === 1 ? 'item' : 'items'} in your cart</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Items */}
        <div className="lg:col-span-2 space-y-5">
          {items.map((item) => (
            <div key={item.id} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md flex gap-6 items-center hover:border-violet-200 transition-all">
              <Link to={`/products/${item.productId}`} className="w-28 h-28 rounded-xl overflow-hidden bg-gray-100 shrink-0 ring-1 ring-gray-200">
                {item.product.images?.[0] ? (
                  <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover hover:scale-105 transition-transform" />
                ) : <div className="w-full h-full flex items-center justify-center text-2xl">📦</div>}
              </Link>
              <div className="flex-1 min-w-0">
                <Link to={`/products/${item.productId}`} className="font-bold text-lg text-gray-900 hover:text-violet-600 transition-colors line-clamp-2">
                  {item.product.name}
                </Link>
                <p className="text-violet-700 font-black text-2xl mt-2">${Number(item.product.price).toFixed(2)}</p>
              </div>
              <div className="flex items-center gap-4 shrink-0 flex-col">
                <div className="flex items-center border-2 border-gray-200 rounded-lg overflow-hidden bg-gray-50">
                  <button onClick={() => item.quantity > 1 && updateMutation.mutate({ productId: item.productId, quantity: item.quantity - 1 })}
                    className="px-3 py-2 hover:bg-gray-100 text-gray-600 transition-colors disabled:opacity-30 font-semibold" disabled={item.quantity <= 1}>
                    <Minus size={16} />
                  </button>
                  <span className="px-4 py-2 font-black text-base w-12 text-center">{item.quantity}</span>
                  <button onClick={() => updateMutation.mutate({ productId: item.productId, quantity: item.quantity + 1 })}
                    className="px-3 py-2 hover:bg-gray-100 text-gray-600 transition-colors font-semibold">
                    <Plus size={16} />
                  </button>
                </div>
                <p className="font-bold text-lg text-gray-900">${(Number(item.product.price) * item.quantity).toFixed(2)}</p>
                <button onClick={() => removeMutation.mutate(item.productId)} className="p-2 text-gray-400 hover:text-red-500 transition-colors hover:bg-red-50 rounded-lg">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-md p-7 h-fit sticky top-24">
          <h2 className="font-black text-2xl mb-6 text-gray-900">Order Summary</h2>
          <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
            {items.map((i) => (
              <div key={i.id} className="flex justify-between items-start">
                <span className="text-gray-700 text-sm line-clamp-2 flex-1 mr-3">{i.product.name}</span>
                <span className="text-gray-900 font-bold text-sm shrink-0">x{i.quantity} = ${(Number(i.product.price) * i.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="mb-7">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-gray-600 text-lg">Total</span>
              <span className="text-3xl font-black text-violet-700">${total.toFixed(2)}</span>
            </div>
          </div>
          <Link to="/checkout"
            className="w-full flex items-center justify-center gap-2 bg-violet-600 hover:bg-violet-500 text-white font-bold py-3.5 rounded-xl transition-all hover:scale-[1.01] active:scale-[0.99] shadow-lg shadow-violet-200">
            Checkout <ArrowRight size={16} />
          </Link>
          <Link to="/products" className="block text-center text-sm text-gray-400 hover:text-violet-600 mt-3 transition-colors">
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}
