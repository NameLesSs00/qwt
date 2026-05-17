import { Navigate, Outlet } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '../store/store'
import { AdminLayout } from '../layouts/AdminLayout'

/**
 * AdminGuard — route middleware
 * If the admin is NOT authenticated, redirect to /404.
 * This hides the existence of the admin panel from unauthorized users.
 * If authenticated, render the AdminLayout with the page as <Outlet>.
 */
export function AdminGuard() {
  const isAdminAuthenticated = useSelector(
    (state: RootState) => state.adminAuth.isAdminAuthenticated
  )

  if (!isAdminAuthenticated) {
    return <Navigate to="/404" replace />
  }

  return (
    <AdminLayout>
      <Outlet />
    </AdminLayout>
  )
}
