import { Navigate, Outlet, useLocation } from "react-router-dom"
import { useAuth } from "../app/auth"

export default function ProtectedRoute() {
  const { user, loading } = useAuth()
  const location = useLocation()
  if (loading) {
    return <div className="py-20 text-center text-white/70">Loading...</div>
  }
  if (!user) {
    return <Navigate to="/signin" state={{ from: location.pathname }} replace />
  }
  return <Outlet />
}
