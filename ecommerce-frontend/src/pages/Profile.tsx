import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { api } from '../lib/api'
import { useAuthStore } from '../store/auth'
import { Plus, Trash2, MapPin, Check, User, Mail, Shield } from 'lucide-react'

const INPUT = "w-full border-2 border-gray-200 focus:border-violet-500 rounded-xl px-4 py-3 outline-none transition-colors bg-white text-sm"

export default function Profile() {
  const { user, setAuth, token } = useAuthStore()
  const queryClient = useQueryClient()
  const [firstName, setFirstName] = useState(user?.firstName ?? '')
  const [lastName, setLastName] = useState(user?.lastName ?? '')
  const [saved, setSaved] = useState(false)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newAddr, setNewAddr] = useState({ street: '', city: '', state: '', country: '', postalCode: '' })

  const { data: addresses = [] } = useQuery({
    queryKey: ['addresses'],
    queryFn: () => api.get('/users/me/addresses').then((r) => r.data),
  })

  const updateMutation = useMutation({
    mutationFn: () => api.patch('/users/me', { firstName, lastName }),
    onSuccess: async () => {
      const meRes = await api.get('/users/me')
      setAuth(meRes.data, token!)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    },
  })

  const addAddressMutation = useMutation({
    mutationFn: () => api.post('/users/me/addresses', newAddr),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['addresses'] })
      setShowAddForm(false)
      setNewAddr({ street: '', city: '', state: '', country: '', postalCode: '' })
    },
  })

  const removeAddressMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/users/me/addresses/${id}`),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['addresses'] }),
  })

  const addrFields = [
    { key: 'street', placeholder: 'Street address', span: 2 },
    { key: 'city', placeholder: 'City', span: 1 },
    { key: 'state', placeholder: 'State', span: 1 },
    { key: 'country', placeholder: 'Country', span: 1 },
    { key: 'postalCode', placeholder: 'Postal code', span: 1 },
  ]

  return (
    <div className="max-w-2xl mx-auto fade-up">
      <h1 className="text-3xl font-black mb-8">My Profile</h1>

      {/* Profile card */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-5">
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-2xl font-black text-white shadow-lg shadow-violet-200">
            {user?.firstName?.[0]}{user?.lastName?.[0]}
          </div>
          <div>
            <p className="font-black text-lg">{user?.firstName} {user?.lastName}</p>
            <div className="flex items-center gap-1.5 text-gray-400 text-sm mt-0.5">
              <Mail size={13} /> {user?.email}
            </div>
            <span className={`inline-flex items-center gap-1 text-xs font-bold mt-1 px-2 py-0.5 rounded-full ${
              user?.role === 'ADMIN' ? 'bg-violet-100 text-violet-700' : 'bg-gray-100 text-gray-500'
            }`}>
              <Shield size={10} /> {user?.role}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">First Name</label>
            <input value={firstName} onChange={(e) => setFirstName(e.target.value)} className={INPUT} />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-1.5">Last Name</label>
            <input value={lastName} onChange={(e) => setLastName(e.target.value)} className={INPUT} />
          </div>
        </div>

        <button onClick={() => updateMutation.mutate()} disabled={updateMutation.isPending}
          className={`flex items-center gap-2 font-bold px-5 py-2.5 rounded-xl text-sm transition-all ${
            saved ? 'bg-green-500 text-white' : 'bg-violet-600 hover:bg-violet-500 text-white'
          } disabled:opacity-60`}>
          {saved ? <><Check size={15} /> Saved!</> : 'Save Changes'}
        </button>
      </div>

      {/* Addresses */}
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <h2 className="font-black text-lg flex items-center gap-2"><MapPin size={18} className="text-violet-600" /> Shipping Addresses</h2>
          <button onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-1.5 text-sm font-semibold text-violet-600 hover:text-violet-700 bg-violet-50 hover:bg-violet-100 px-3 py-1.5 rounded-xl transition-colors">
            <Plus size={15} /> Add New
          </button>
        </div>

        {showAddForm && (
          <div className="bg-violet-50 rounded-2xl p-5 mb-5 border border-violet-100">
            <p className="font-semibold text-sm mb-4">New Address</p>
            <div className="grid grid-cols-2 gap-3 mb-4">
              {addrFields.map(({ key, placeholder, span }) => (
                <input key={key} placeholder={placeholder}
                  value={(newAddr as any)[key]} onChange={(e) => setNewAddr({ ...newAddr, [key]: e.target.value })}
                  className={`border-2 border-violet-200 focus:border-violet-500 rounded-xl px-4 py-2.5 text-sm outline-none bg-white transition-colors ${span === 2 ? 'col-span-2' : ''}`} />
              ))}
            </div>
            <div className="flex gap-2">
              <button onClick={() => addAddressMutation.mutate()} disabled={addAddressMutation.isPending}
                className="bg-violet-600 text-white font-bold px-5 py-2 rounded-xl text-sm hover:bg-violet-500 transition-colors disabled:opacity-60">
                Save Address
              </button>
              <button onClick={() => setShowAddForm(false)} className="text-gray-500 font-medium px-4 py-2 text-sm hover:text-gray-700">
                Cancel
              </button>
            </div>
          </div>
        )}

        {addresses.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            <MapPin size={32} className="mx-auto mb-2 text-gray-200" />
            <p className="text-sm">No addresses saved yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {addresses.map((addr: any) => (
              <div key={addr.id} className="flex items-start justify-between p-4 bg-gray-50 hover:bg-violet-50 rounded-xl border border-gray-100 hover:border-violet-100 transition-colors group">
                <div className="text-sm">
                  <p className="font-semibold text-gray-900">{addr.street}</p>
                  <p className="text-gray-400 mt-0.5">{addr.city}, {addr.state} {addr.postalCode}</p>
                  <p className="text-gray-400">{addr.country}</p>
                </div>
                <button onClick={() => removeAddressMutation.mutate(addr.id)}
                  className="p-2 text-gray-200 group-hover:text-red-400 transition-colors">
                  <Trash2 size={15} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
