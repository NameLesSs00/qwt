import { useState, type ReactNode } from 'react'
import { AdminSidebar } from '../components/admin/AdminSidebar'
import { AdminTopBar } from '../components/admin/AdminTopBar'
import '../components/admin/admin.scss'

type Props = { children: ReactNode }

export function AdminLayout({ children }: Props) {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="admin-shell">
      {sidebarOpen && (
        <div className="admin-overlay" onClick={() => setSidebarOpen(false)} />
      )}

      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="admin-main">
        <AdminTopBar onMenuClick={() => setSidebarOpen((v) => !v)} />
        <div className="admin-content">{children}</div>
      </div>
    </div>
  )
}
