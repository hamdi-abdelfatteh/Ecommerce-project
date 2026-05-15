import { useQuery } from '@tanstack/react-query'
import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { api } from '../lib/api'
import { Search, SlidersHorizontal, ShoppingCart, Heart } from 'lucide-react'
import { useAuthStore } from '../store/auth'
import { useCartStore } from '../store/cart'

interface Product {
  id: string; name: string; price: number; brand: string
  images: string | string[]; stock: number; category: { name: string }
}

function normalizeImages(images: any): string[] {
  if (!images) return []
  if (Array.isArray(images)) return images
  try {
    return typeof images === 'string' ? JSON.parse(images) : []
  } catch {
    return []
  }
}

function ProductCard({ product }: { product: Product }) {
  const { user } = useAuthStore()
  const { increment } = useCartStore()
  const [added, setAdded] = useState(false)
  const [wishlisted, setWishlisted] = useState(false)
  const images = normalizeImages(product.images)

  const addToCart = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!user) { window.location.href = '/login'; return }
    await api.post('/cart', { productId: product.id, quantity: 1 })
    increment()
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  const toggleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault()
    if (!user) { window.location.href = '/login'; return }
    if (wishlisted) { await api.delete(`/wishlist/${product.id}`); setWishlisted(false) }
    else { await api.post(`/wishlist/${product.id}`); setWishlisted(true) }
  }

  return (
    <Link to={`/products/${product.id}`}
      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 hover:border-violet-200 hover:shadow-xl hover:shadow-violet-100/50 transition-all duration-300">
      <div className="relative aspect-square bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
        {images?.[0] ? (
          <img src={images[0]} alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">📦</div>
        )}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
            <span className="bg-gray-800 text-white text-xs font-bold px-3 py-1 rounded-full">Sold Out</span>
          </div>
        )}
        <button onClick={toggleWishlist}
          className={`absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center transition-all ${
            wishlisted ? 'bg-rose-500 text-white' : 'bg-white/80 text-gray-400 hover:text-rose-500 opacity-0 group-hover:opacity-100'
          } shadow-sm`}>
          <Heart size={15} fill={wishlisted ? 'currentColor' : 'none'} />
        </button>
        <span className="absolute top-3 left-3 bg-violet-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
          {product.category?.name}
        </span>
      </div>
      <div className="p-4">
        <p className="text-xs text-gray-400 font-medium mb-1 uppercase tracking-wide">{product.brand}</p>
        <h3 className="font-semibold text-gray-900 text-sm mb-3 line-clamp-2 leading-snug">{product.name}</h3>
        <div className="flex items-center justify-between gap-2">
          <span className="text-lg font-black text-violet-700">${Number(product.price).toFixed(2)}</span>
          <button onClick={addToCart} disabled={product.stock === 0}
            className={`flex items-center gap-1.5 text-xs font-bold px-3 py-2 rounded-xl transition-all ${
              added
                ? 'bg-green-500 text-white scale-95'
                : 'bg-violet-600 hover:bg-violet-500 text-white hover:scale-105 active:scale-95'
            } disabled:opacity-40 disabled:cursor-not-allowed`}>
            <ShoppingCart size={13} />
            {added ? 'Added!' : 'Add'}
          </button>
        </div>
      </div>
    </Link>
  )
}

export default function Products() {
  const [searchParams] = useSearchParams()
  const [search, setSearch] = useState(searchParams.get('search') ?? '')
  const [sort, setSort] = useState('')
  const [minPrice, setMinPrice] = useState('')
  const [maxPrice, setMaxPrice] = useState('')

  useEffect(() => { setSearch(searchParams.get('search') ?? '') }, [searchParams])

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['products', search, sort, minPrice, maxPrice],
    queryFn: async () => {
      const params: Record<string, string> = {}
      if (search) params.search = search
      if (sort) params.sort = sort
      if (minPrice) params.minPrice = minPrice
      if (maxPrice) params.maxPrice = maxPrice
      return api.get('/products', { params }).then((r) => r.data)
    },
  })

  return (
    <div className="fade-up">
      <div className="mb-8">
        <h1 className="text-3xl font-black mb-1">All Products</h1>
        <p className="text-gray-500">{isLoading ? 'Loading…' : `${products.length} items found`}</p>
      </div>

      {/* Filter bar */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-8 flex flex-wrap gap-3 items-center">
        <div className="flex items-center gap-2 flex-1 min-w-[180px] bg-gray-50 rounded-xl px-3 py-2">
          <Search size={16} className="text-gray-400 shrink-0" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search products…"
            className="w-full bg-transparent outline-none text-sm" />
        </div>
        <div className="flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2">
          <SlidersHorizontal size={15} className="text-gray-400" />
          <select value={sort} onChange={(e) => setSort(e.target.value)}
            className="bg-transparent text-sm outline-none text-gray-700">
            <option value="">Sort by</option>
            <option value="price_asc">Price: Low → High</option>
            <option value="price_desc">Price: High → Low</option>
            <option value="newest">Newest First</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <input value={minPrice} onChange={(e) => setMinPrice(e.target.value)} placeholder="Min $"
            className="w-20 bg-gray-50 border-0 rounded-xl px-3 py-2 text-sm outline-none text-center" />
          <span className="text-gray-300 font-bold">—</span>
          <input value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} placeholder="Max $"
            className="w-20 bg-gray-50 border-0 rounded-xl px-3 py-2 text-sm outline-none text-center" />
        </div>
        {(search || sort || minPrice || maxPrice) && (
          <button onClick={() => { setSearch(''); setSort(''); setMinPrice(''); setMaxPrice('') }}
            className="text-xs text-violet-600 font-semibold hover:text-violet-700 px-3 py-2">
            Clear filters
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="rounded-2xl overflow-hidden">
              <div className="skeleton aspect-square" />
              <div className="p-4 space-y-2">
                <div className="skeleton h-3 w-1/2 rounded" />
                <div className="skeleton h-4 w-3/4 rounded" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-24">
          <p className="text-6xl mb-4">🔍</p>
          <p className="text-xl font-bold text-gray-400">No products found</p>
          <p className="text-gray-400 text-sm mt-1">Try adjusting your filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      )}
    </div>
  )
}
