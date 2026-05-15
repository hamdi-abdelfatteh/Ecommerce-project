import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/api'
import { Package, Download, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

const STATUS_STYLE: Record<string, string> = {
  PENDING:   'bg-amber-50 text-amber-700 border border-amber-200',
  PAID:      'bg-green-50 text-green-700 border border-green-200',
  SHIPPED:   'bg-blue-50 text-blue-700 border border-blue-200',
  DELIVERED: 'bg-violet-50 text-violet-700 border border-violet-200',
  CANCELLED: 'bg-red-50 text-red-600 border border-red-200',
}

function OrderRow({ order }: { order: any }) {
  const [open, setOpen] = useState(false)

  const downloadInvoice = async () => {
    const res = await api.get(`/orders/${order.id}/invoice`, { responseType: 'blob' })
    const url = URL.createObjectURL(new Blob([res.data]))
    const a = document.createElement('a'); a.href = url; a.download = `invoice-${order.id.slice(0,8)}.txt`; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:border-violet-100 transition-colors">
      <div className="p-5 flex items-center gap-4 cursor-pointer" onClick={() => setOpen(!open)}>
        <div className="w-11 h-11 bg-violet-50 rounded-xl flex items-center justify-center shrink-0">
          <Package size={20} className="text-violet-600" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold font-mono text-sm">#{order.id.slice(0, 8).toUpperCase()}</p>
          <p className="text-xs text-gray-400">{new Date(order.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}</p>
        </div>
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${STATUS_STYLE[order.status] ?? 'bg-gray-100 text-gray-600'}`}>
          {order.status}
        </span>
        <p className="text-lg font-black text-violet-700 w-24 text-right">${Number(order.totalAmount).toFixed(2)}</p>
        <button className="text-gray-400 ml-1 shrink-0">{open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</button>
      </div>

      {open && (
        <div className="border-t border-gray-100 px-5 py-4 bg-gray-50">
          <div className="space-y-2 mb-4">
            {order.items?.map((item: any) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-gray-600">{item.product?.name} <span className="text-gray-400">× {item.quantity}</span></span>
                <span className="font-medium">${(Number(item.unitPrice) * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <button onClick={downloadInvoice}
            className="flex items-center gap-1.5 text-xs font-semibold text-violet-600 hover:text-violet-700 bg-white border border-violet-200 px-3 py-1.5 rounded-lg transition-colors">
            <Download size={13} /> Download Invoice
          </button>
        </div>
      )}
    </div>
  )
}

export default function Orders() {
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['orders'],
    queryFn: () => api.get('/orders').then((r) => r.data),
  })

  if (isLoading) return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => <div key={i} className="skeleton h-20 rounded-2xl" />)}
    </div>
  )

  if (orders.length === 0) return (
    <div className="text-center py-24 fade-up">
      <div className="w-24 h-24 bg-violet-50 rounded-full flex items-center justify-center mx-auto mb-6">
        <Package size={40} className="text-violet-300" />
      </div>
      <h2 className="text-2xl font-black mb-2">No orders yet</h2>
      <p className="text-gray-400">Your order history will appear here</p>
    </div>
  )

  return (
    <div className="fade-up">
      <h1 className="text-3xl font-black mb-8">My Orders</h1>
      <div className="space-y-4">
        {orders.map((order: any) => <OrderRow key={order.id} order={order} />)}
      </div>
    </div>
  )
}
