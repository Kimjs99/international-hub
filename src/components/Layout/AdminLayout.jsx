import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Spinner from '../UI/Spinner'
import AdminSidebar from './AdminSidebar'

export default function AdminLayout() {
  const { user, loading } = useAuth()
  if (loading) return <Spinner className="h-screen" />
  if (!user) return <Navigate to="/login" replace />
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar />
      <main className="ml-64 p-8">
        <Outlet />
      </main>
    </div>
  )
}
