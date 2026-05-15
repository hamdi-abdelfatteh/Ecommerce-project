import { Navigate } from 'react-router-dom'
import { useAuthStore } from '../store/auth'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, token } = useAuthStore()
  if (!user || !token) return <Navigate to="/login" replace />
  return <>{children}</>
}

export function AdminRoute({ children }: { children: React.ReactNode }) {
  const { user, token } = useAuthStore()
  if (!user || !token) return <Navigate to="/login" replace />
  if (user.role !== 'ADMIN') return <Navigate to="/" replace />
  return <>{children}</>
}
