import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { Link } from 'react-router-dom'
import { api } from '../lib/api'
import { Trash2, Heart, ArrowRight, ShoppingCart } from 'lucide-react'
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

export default function Wishlist() {
  const queryClient = useQueryClient()
  const { increment } = useCartStore()

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['wishlist'],
    queryFn: () => api.get('/wishlist').then((r) =>
      r.data.map((item: any) => ({
        ...item,
        product: { ...item.product, images: normalizeImages(item.product.images) }
      }))
    ),
  })

  const removeMutation = useMutation({
    mutationFn: (productId: string) => api.delete(`/wishlist/${productId}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['wishlist'] }),
  })

  const addToCart = async (productId: string) => {
    await api.post('/cart', { productId, quantity: 1 })
    increment()
  }

  if (isLoading) return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
      {[...Array(4)].map((_, i) => <div key={i} className="skeleton aspect-square rounded-2xl" />)}
    </div>
  )

  if (items.length === 0) return (
    <div className="text-center py-24 fade-up">
      <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <Heart size={40} className="text-rose-300" />
      </div>
      <h2 className="text-2xl font-black mb-2">Your wishlist is empty</h2>
      <p className="text-gray-400 mb-8">Save products you love and find them here later</p>
      <Link to="/products" className="inline-flex items-center gap-2 bg-violet-600 text-white font-bold px-7 py-3.5 rounded-full hover:bg-violet-500 transition-colors">
        Browse Products <ArrowRight size={16} />
      </Link>
    </div>
  )

  return (
    <div className="fade-up">
      <h1 className="text-3xl font-black mb-8">Wishlist <span className="text-gray-400 font-normal text-xl">({items.length})</span></h1>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {items.map((item: any) => (
          <div key={item.id} className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-violet-200 hover:shadow-lg hover:shadow-violet-100/50 transition-all">
            <Link to={`/products/${item.product.id}`} className="block aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
              {item.product.images?.[0] ? (
                <img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
              ) : <div className="w-full h-full flex items-center justify-center text-5xl">📦</div>}
            </Link>
            <div className="p-4">
              <Link to={`/products/${item.product.id}`} className="font-semibold text-sm hover:text-violet-600 transition-colors line-clamp-2 mb-2 block">
                {item.product.name}
              </Link>
              <p className="text-violet-700 font-black text-lg mb-3">${Number(item.product.price).toFixed(2)}</p>
              <div className="flex gap-2">
                <button onClick={() => addToCart(item.product.id)}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-violet-600 hover:bg-violet-500 text-white text-xs font-bold py-2 rounded-xl transition-colors">
                  <ShoppingCart size={13} /> Add to Cart
                </button>
                <button onClick={() => removeMutation.mutate(item.product.id)}
                  className="p-2 text-gray-300 hover:text-red-400 transition-colors">
                  <Trash2 size={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
