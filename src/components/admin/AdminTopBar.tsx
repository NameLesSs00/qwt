import { Menu } from 'lucide-react'
import { useSelector } from 'react-redux'
import { useLocation } from 'react-router-dom'
import type { RootState } from '../../store/store'

const pageTitles: Record<string, string> = {
  '/admin/reports':    'Reports',
  '/admin/trips':      'Trips',
  '/admin/blogs':      'Blogs',
  '/admin/bookings':   'Bookings',
  '/admin/gallery':    'Gallery',
  '/admin/promo-codes': 'Promo Codes',
  '/admin/questions':  'Questions',
  '/admin/reviews':    'Reviews',
  '/admin/trip-types': 'Trip Types',
  '/admin/admins':     'Admins',
}

type Props = { onMenuClick: () => void }

export function AdminTopBar({ onMenuClick }: Props) {
  const { pathname } = useLocation()
  const adminUser = useSelector((s: RootState) => s.adminAuth.adminUser)

  const title = pageTitles[pathname] ?? 'Admin Panel'
  return (
    <header className="admin-topbar">
      <div className="admin-topbar__left">
        <button className="admin-topbar__hamburger" onClick={onMenuClick} aria-label="Toggle sidebar">
          <Menu size={22} />
        </button>
        <h1 className="admin-topbar__title">{title}</h1>
      </div>

      <div className="admin-topbar__right">
        <div className="admin-topbar__admin">
          <div>
            <div className="admin-topbar__adminName">{adminUser?.name ?? 'Admin'}</div>
            <div className="admin-topbar__adminRole">{adminUser?.role ?? 'Administrator'}</div>
          </div>
        </div>
      </div>
    </header>
  )
}
