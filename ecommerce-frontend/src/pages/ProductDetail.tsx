import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useParams, useNavigate } from 'react-router-dom'
import { api } from '../lib/api'
import { useAuthStore } from '../store/auth'
import { useCartStore } from '../store/cart'
import { useState } from 'react'
import { Heart, ShoppingCart, Star, ArrowLeft, Minus, Plus, Check } from 'lucide-react'

function normalizeImages(images: any): string[] {
  if (!images) return []
  if (Array.isArray(images)) return images
  try {
    return typeof images === 'string' ? JSON.parse(images) : []
  } catch {
    return []
  }
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>()
  const { user } = useAuthStore()
  const { increment } = useCartStore()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const [qty, setQty] = useState(1)
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [cartAdded, setCartAdded] = useState(false)
  const [wishlisted, setWishlisted] = useState(false)
  const [hoveredStar, setHoveredStar] = useState(0)

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: () => api.get(`/products/${id}`).then((r) => ({
      ...r.data,
      images: normalizeImages(r.data.images)
    })),
  })

  const reviewMutation = useMutation({
    mutationFn: () => api.post(`/products/${id}/reviews`, { rating, comment }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['product', id] }); setComment('') },
  })

  const addToCart = async () => {
    if (!user) { navigate('/login'); return }
    await api.post('/cart', { productId: id, quantity: qty })
    for (let i = 0; i < qty; i++) increment()
    setCartAdded(true)
    setTimeout(() => setCartAdded(false), 2200)
  }

  const toggleWishlist = async () => {
    if (!user) { navigate('/login'); return }
    if (wishlisted) { await api.delete(`/wishlist/${id}`); setWishlisted(false) }
    else { await api.post(`/wishlist/${id}`); setWishlisted(true) }
  }

  if (isLoading) return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
      <div className="skeleton aspect-square rounded-3xl" />
      <div className="space-y-4 pt-4">
        <div className="skeleton h-5 w-1/3 rounded-full" />
        <div className="skeleton h-8 w-2/3 rounded-xl" />
        <div className="skeleton h-10 w-1/4 rounded-xl" />
        <div className="skeleton h-24 rounded-xl" />
      </div>
    </div>
  )
  if (!product) return <div>Product not found</div>

  const avgRating = product.reviews?.length
    ? product.reviews.reduce((s: number, r: any) => s + r.rating, 0) / product.reviews.length
    : null

  return (
    <div className="fade-up">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-400 hover:text-violet-600 mb-8 transition-colors font-medium text-sm">
        <ArrowLeft size={16} /> Back to Products
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 mb-10">
        {/* Image */}
        <div className="aspect-square rounded-3xl overflow-hidden bg-gradient-to-br from-violet-50 to-gray-100 shadow-inner">
          {product.images?.[0] ? (
            <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[8rem]">📦</div>
          )}
        </div>

        {/* Info */}
        <div className="flex flex-col justify-between py-2">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="bg-violet-100 text-violet-700 text-xs font-bold px-3 py-1 rounded-full">{product.category?.name}</span>
              <span className="text-gray-400 text-sm">{product.brand}</span>
            </div>
            <h1 className="text-3xl font-black leading-tight mb-4">{product.name}</h1>

            {avgRating !== null && (
              <div className="flex items-center gap-2 mb-4">
                <div className="flex">
                  {[1,2,3,4,5].map((s) => (
                    <Star key={s} size={16} className={s <= Math.round(avgRating) ? 'text-amber-400 fill-amber-400' : 'text-gray-200 fill-gray-200'} />
                  ))}
                </div>
                <span className="font-semibold text-sm">{avgRating.toFixed(1)}</span>
                <span className="text-gray-400 text-sm">({product.reviews.length} reviews)</span>
              </div>
            )}

            <p className="text-4xl font-black text-violet-700 mb-5">${Number(product.price).toFixed(2)}</p>
            <p className="text-gray-600 leading-relaxed mb-6">{product.description}</p>

            <div className={`inline-flex items-center gap-2 text-sm font-semibold px-3 py-1.5 rounded-full mb-6 ${
              product.stock > 0 ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
            }`}>
              <span className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-green-500' : 'bg-red-500'}`} />
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </div>
          </div>

          <div className="space-y-4">
            {/* Qty */}
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-gray-600">Quantity</span>
              <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                <button onClick={() => setQty(Math.max(1, qty - 1))} className="px-3 py-2 hover:bg-gray-50 transition-colors">
                  <Minus size={14} />
                </button>
                <span className="px-4 py-2 font-bold text-sm min-w-[40px] text-center">{qty}</span>
                <button onClick={() => setQty(Math.min(product.stock, qty + 1))} className="px-3 py-2 hover:bg-gray-50 transition-colors">
                  <Plus size={14} />
                </button>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={addToCart} disabled={product.stock === 0}
                className={`flex-1 flex items-center justify-center gap-2 font-bold py-3.5 rounded-2xl transition-all ${
                  cartAdded
                    ? 'bg-green-500 text-white scale-95'
                    : 'bg-violet-600 hover:bg-violet-500 text-white hover:scale-[1.01] active:scale-[0.99]'
                } disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-violet-200`}>
                {cartAdded ? <><Check size={18} /> Added to Cart</> : <><ShoppingCart size={18} /> Add to Cart</>}
              </button>
              <button onClick={toggleWishlist}
                className={`p-3.5 rounded-2xl border-2 transition-all ${
                  wishlisted ? 'border-rose-500 bg-rose-50 text-rose-500' : 'border-gray-200 text-gray-400 hover:border-rose-300 hover:text-rose-400'
                }`}>
                <Heart size={20} fill={wishlisted ? 'currentColor' : 'none'} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="bg-white rounded-3xl border border-gray-100 p-8 shadow-sm">
        <h2 className="text-xl font-black mb-6">Customer Reviews</h2>

        {user && (
          <div className="mb-8 p-5 bg-violet-50 rounded-2xl border border-violet-100">
            <p className="font-semibold mb-3 text-sm">Write a Review</p>
            <div className="flex gap-1 mb-3">
              {[1,2,3,4,5].map((s) => (
                <button key={s} onMouseEnter={() => setHoveredStar(s)} onMouseLeave={() => setHoveredStar(0)} onClick={() => setRating(s)}>
                  <Star size={24} className={s <= (hoveredStar || rating) ? 'text-amber-400 fill-amber-400' : 'text-gray-300'} />
                </button>
              ))}
            </div>
            <textarea value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Share your experience with this product…" rows={3}
              className="w-full border-2 border-violet-200 focus:border-violet-400 rounded-xl px-4 py-3 text-sm outline-none mb-3 resize-none bg-white transition-colors" />
            <button onClick={() => reviewMutation.mutate()} disabled={reviewMutation.isPending}
              className="bg-violet-600 hover:bg-violet-500 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors disabled:opacity-60">
              {reviewMutation.isPending ? 'Submitting…' : 'Submit Review'}
            </button>
          </div>
        )}

        {product.reviews?.length === 0 ? (
          <div className="text-center py-10 text-gray-400">
            <Star size={40} className="mx-auto mb-3 text-gray-200" />
            <p className="font-medium">No reviews yet</p>
            <p className="text-sm">Be the first to share your experience!</p>
          </div>
        ) : (
          <div className="space-y-5">
            {product.reviews?.map((r: any) => (
              <div key={r.id} className="flex gap-4 pb-5 border-b border-gray-100 last:border-0">
                <div className="w-10 h-10 rounded-full bg-violet-100 flex items-center justify-center text-sm font-bold text-violet-700 shrink-0">
                  {r.user?.firstName?.[0]}{r.user?.lastName?.[0]}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm">{r.user?.firstName} {r.user?.lastName}</span>
                    <div className="flex">
                      {[1,2,3,4,5].map((s) => (
                        <Star key={s} size={13} className={s <= r.rating ? 'text-amber-400 fill-amber-400' : 'text-gray-200'} />
                      ))}
                    </div>
                  </div>
                  {r.comment && <p className="text-sm text-gray-600">{r.comment}</p>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
