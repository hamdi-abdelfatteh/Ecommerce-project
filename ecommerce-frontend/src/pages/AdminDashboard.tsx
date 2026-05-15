import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { api } from '../lib/api'
import { Users, ShoppingBag, Package, TrendingUp, Circle, Trash2, UploadCloud } from 'lucide-react'

const STATUS_STYLE: Record<string, string> = {
  PENDING:   'bg-amber-50 text-amber-700',
  PAID:      'bg-green-50 text-green-700',
  SHIPPED:   'bg-blue-50 text-blue-700',
  DELIVERED: 'bg-violet-50 text-violet-700',
  CANCELLED: 'bg-red-50 text-red-600',
}

const STATUS_DOT: Record<string, string> = {
  PENDING: 'bg-amber-400', PAID: 'bg-green-400', SHIPPED: 'bg-blue-400',
  DELIVERED: 'bg-violet-400', CANCELLED: 'bg-red-400',
}

const STATUSES = ['PENDING', 'PAID', 'SHIPPED', 'DELIVERED', 'CANCELLED']

export default function AdminDashboard() {
  const queryClient = useQueryClient()

  const { data: stats } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => api.get('/admin/dashboard').then((r) => r.data),
  })

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => api.get('/admin/orders').then((r) => r.data),
  })

  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      api.patch(`/admin/orders/${id}/status`, { status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-orders', 'admin-dashboard'] }),
  })

  const [productForm, setProductForm] = useState({
    name: '',
    slug: '',
    description: '',
    price: '',
    brand: '',
    stock: '',
    images: '',
    categoryId: '',
  })
  const [uploadedImages, setUploadedImages] = useState<string[]>([])

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.get('/categories').then((r) => r.data),
  })

  const { data: products = [], isLoading: productsLoading } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => api.get('/products').then((r) => r.data),
  })

  const createProduct = useMutation({
    mutationFn: (payload: any) => api.post('/products', payload),
    onSuccess: () => {
      setProductForm({
        name: '',
        slug: '',
        description: '',
        price: '',
        brand: '',
        stock: '',
        images: '',
        categoryId: '',
      })
      setUploadedImages([])
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] })
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
    },
  })

  const deleteProduct = useMutation({
    mutationFn: (id: string) => api.delete(`/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-products'] })
      queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] })
    },
  })

  const handleImageUpload = async (files: FileList | null) => {
    if (!files) return
    const fileArray = Array.from(files)
    const imageUrls = await Promise.all(
      fileArray.map((file) =>
        new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => {
            if (typeof reader.result === 'string') resolve(reader.result)
            else reject(new Error('Failed to read file'))
          }
          reader.onerror = () => reject(new Error('File read error'))
          reader.readAsDataURL(file)
        }),
      ),
    )
    setUploadedImages(imageUrls)
  }

  const statCards = [
    { label: 'Total Customers', value: stats?.totalUsers ?? '—', icon: Users, gradient: 'from-blue-500 to-cyan-400', bg: 'bg-blue-50', text: 'text-blue-600' },
    { label: 'Total Orders', value: stats?.totalOrders ?? '—', icon: ShoppingBag, gradient: 'from-violet-500 to-purple-400', bg: 'bg-violet-50', text: 'text-violet-600' },
    { label: 'Products Listed', value: stats?.totalProducts ?? '—', icon: Package, gradient: 'from-rose-500 to-pink-400', bg: 'bg-rose-50', text: 'text-rose-600' },
    { label: 'Total Revenue', value: stats ? `$${Number(stats.totalRevenue).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '—', icon: TrendingUp, gradient: 'from-green-500 to-emerald-400', bg: 'bg-green-50', text: 'text-green-600' },
  ]

  return (
    <div className="fade-up">
      <div className="mb-8">
        <h1 className="text-3xl font-black">Admin Dashboard</h1>
        <p className="text-gray-400 mt-1">Manage the store, orders, products, categories, and customer activity from one place.</p>
      </div>

      <div className="grid gap-4 lg:grid-cols-2 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between gap-4 mb-5">
            <div>
              <h2 className="text-xl font-black">Add New Product</h2>
              <p className="text-gray-500 mt-1">Create a product directly from the admin dashboard.</p>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault()
              createProduct.mutate({
                name: productForm.name,
                slug: productForm.slug,
                description: productForm.description,
                price: Number(productForm.price),
                brand: productForm.brand,
                stock: Number(productForm.stock),
                images: uploadedImages.length
                  ? uploadedImages
                  : productForm.images
                      .split(',')
                      .map((url) => url.trim())
                      .filter(Boolean),
                categoryId: productForm.categoryId,
              })
            }}
            className="space-y-4"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-1 text-sm text-gray-700">
                <span>Name</span>
                <input
                  value={productForm.name}
                  onChange={(e) => setProductForm((prev) => ({ ...prev, name: e.target.value }))}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none focus:border-violet-500"
                  placeholder="Product name"
                  required
                />
              </label>
              <label className="space-y-1 text-sm text-gray-700">
                <span>Slug</span>
                <input
                  value={productForm.slug}
                  onChange={(e) => setProductForm((prev) => ({ ...prev, slug: e.target.value }))}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none focus:border-violet-500"
                  placeholder="product-slug"
                  required
                />
              </label>
            </div>

            <label className="space-y-1 text-sm text-gray-700">
              <span>Description</span>
              <textarea
                value={productForm.description}
                onChange={(e) => setProductForm((prev) => ({ ...prev, description: e.target.value }))}
                className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none focus:border-violet-500"
                rows={4}
                placeholder="Product description"
                required
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-1 text-sm text-gray-700">
                <span>Price</span>
                <input
                  type="number"
                  step="0.01"
                  value={productForm.price}
                  onChange={(e) => setProductForm((prev) => ({ ...prev, price: e.target.value }))}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none focus:border-violet-500"
                  placeholder="99.99"
                  required
                />
              </label>
              <label className="space-y-1 text-sm text-gray-700">
                <span>Stock</span>
                <input
                  type="number"
                  value={productForm.stock}
                  onChange={(e) => setProductForm((prev) => ({ ...prev, stock: e.target.value }))}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none focus:border-violet-500"
                  placeholder="10"
                  required
                />
              </label>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="space-y-1 text-sm text-gray-700">
                <span>Brand</span>
                <input
                  value={productForm.brand}
                  onChange={(e) => setProductForm((prev) => ({ ...prev, brand: e.target.value }))}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none focus:border-violet-500"
                  placeholder="Brand name"
                  required
                />
              </label>
              <label className="space-y-1 text-sm text-gray-700">
                <span>Category</span>
                <select
                  value={productForm.categoryId}
                  onChange={(e) => setProductForm((prev) => ({ ...prev, categoryId: e.target.value }))}
                  className="w-full rounded-2xl border border-gray-200 px-4 py-3 text-sm text-gray-900 outline-none focus:border-violet-500"
                  required
                >
                  <option value="">Select category</option>
                  {categories.map((category: any) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="space-y-3 text-sm text-gray-700">
              <span className="block font-semibold text-gray-900">Upload Images</span>
              <div className="rounded-3xl border border-dashed border-red-200 bg-red-50 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm font-semibold text-red-700">Upload photos from your PC</p>
                    <p className="text-xs text-red-500">Choose one or more images for the product gallery.</p>
                  </div>
                  <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-red-700 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-red-900/20 transition hover:bg-red-600">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-white">
                      <path d="M12 3V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8 11L12 15L16 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M21 15V18C21 19.1046 20.1046 20 19 20H5C3.89543 20 3 19.1046 3 18V15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                    Select image files
                    <input
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={(e) => handleImageUpload(e.target.files)}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            </div>

            {uploadedImages.length > 0 && (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {uploadedImages.map((image, index) => (
                  <div key={index} className="h-28 overflow-hidden rounded-2xl border border-red-100 bg-white shadow-sm">
                    <img src={image} alt={`Upload ${index + 1}`} className="h-full w-full object-cover" />
                  </div>
                ))}
              </div>
            )}

            <div className="flex flex-col gap-2">
              <button
                type="submit"
                disabled={createProduct.isLoading}
                className="inline-flex items-center justify-center rounded-full bg-violet-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-violet-600 disabled:cursor-not-allowed disabled:bg-gray-300"
              >
                {createProduct.isLoading ? 'Saving...' : 'Add Product'}
              </button>
              {createProduct.isSuccess && (
                <p className="text-sm text-green-600">Product added successfully.</p>
              )}
              {createProduct.isError && (
                <p className="text-sm text-red-600">Failed to add the product. Please check the inputs.</p>
              )}
            </div>
          </form>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between gap-4 mb-5">
            <div>
              <h2 className="text-xl font-black">Manage Products</h2>
              <p className="text-gray-500 mt-1">Delete old items and keep the catalog fresh.</p>
            </div>
            <span className="text-sm font-semibold text-red-600">{products.length} items</span>
          </div>

          {productsLoading ? (
            <div className="space-y-3">
              {[...Array(4)].map((_, index) => (
                <div key={index} className="h-20 rounded-2xl bg-gray-100 animate-pulse" />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-gray-400">No products available yet.</div>
          ) : (
            <div className="space-y-3 max-h-[520px] overflow-y-auto pr-1">
              {products.map((product: any) => (
                <div key={product.id} className="flex items-center gap-4 rounded-2xl border border-gray-200 p-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-gray-100">
                    {product.images?.[0] ? (
                      <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gray-200" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-sm truncate">{product.name}</p>
                    <p className="text-xs text-gray-500">{product.brand} · ${Number(product.price).toFixed(2)}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => deleteProduct.mutate(product.id)}
                    className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition hover:bg-red-100"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}

          {deleteProduct.isError && (
            <p className="text-sm text-red-600 mt-3">Failed to delete the product. Please try again.</p>
          )}
          {deleteProduct.isSuccess && (
            <p className="text-sm text-green-600 mt-3">Product deleted successfully.</p>
          )}
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map(({ label, value, icon: Icon, bg, text }) => (
          <div key={label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
            <div className={`w-11 h-11 ${bg} rounded-xl flex items-center justify-center mb-4`}>
              <Icon size={20} className={text} />
            </div>
            <p className="text-2xl font-black mb-0.5">{value}</p>
            <p className="text-xs text-gray-400 font-medium">{label}</p>
          </div>
        ))}
      </div>

      {/* Orders table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="font-black text-lg">All Orders</h2>
          <span className="text-sm text-gray-400">{orders.length} orders total</span>
        </div>

        {isLoading ? (
          <div className="p-6 space-y-4">
            {[...Array(5)].map((_, i) => <div key={i} className="skeleton h-12 rounded-xl" />)}
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-16 text-gray-400">
            <ShoppingBag size={40} className="mx-auto mb-3 text-gray-200" />
            <p className="font-medium">No orders yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 text-left">
                  <th className="px-6 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Order</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Customer</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Total</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3.5 text-xs font-bold text-gray-400 uppercase tracking-wider">Update</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {orders.map((order: any) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-mono text-xs font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-lg">
                        #{order.id.slice(0, 8).toUpperCase()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-sm">{order.user?.firstName} {order.user?.lastName}</p>
                      <p className="text-xs text-gray-400">{order.user?.email}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="px-6 py-4 font-black text-violet-700">
                      ${Number(order.totalAmount).toFixed(2)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${STATUS_STYLE[order.status] ?? 'bg-gray-100 text-gray-600'}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[order.status] ?? 'bg-gray-400'}`} />
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <select value={order.status}
                        onChange={(e) => updateStatus.mutate({ id: order.id, status: e.target.value })}
                        className="text-xs border-2 border-gray-200 hover:border-violet-300 focus:border-violet-500 rounded-xl px-2.5 py-1.5 outline-none transition-colors bg-white">
                        {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
