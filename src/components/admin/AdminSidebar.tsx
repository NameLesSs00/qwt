import { NavLink } from 'react-router-dom'
import { useSelector } from 'react-redux'
import {
  BarChart2, Map, BookOpen, ShoppingBag, Image,
  Tag, HelpCircle, Star, List, Users, LogOut,
} from 'lucide-react'
import logo from '../../assets/HurghadaFunTime.png'
import type { RootState } from '../../store/store'
import './admin.scss'

import { logoutAdmin } from '../../api/adminAuthApi'

const navItems = [
  { icon: BarChart2, label: 'Reports', path: '/admin/reports' },
  { icon: Map, label: 'Trips', path: '/admin/trips' },
  { icon: Tag, label: 'Destinations', path: '/admin/destinations' },
  { icon: BookOpen, label: 'Blogs', path: '/admin/blogs' },
  { icon: ShoppingBag, label: 'Bookings', path: '/admin/bookings' },
  { icon: Image, label: 'Gallery', path: '/admin/gallery' },
  { icon: Tag, label: 'Promo Codes', path: '/admin/promo-codes' },
  { icon: HelpCircle, label: 'Questions', path: '/admin/questions' },
  { icon: Star, label: 'Reviews', path: '/admin/reviews' },
  { icon: List, label: 'Trip Types', path: '/admin/trip-types' },
  { icon: Users, label: 'Admins', path: '/admin/admins' },
]

type Props = { isOpen?: boolean; onClose?: () => void }

export function AdminSidebar({ isOpen, onClose }: Props) {
  const adminUser = useSelector((s: RootState) => s.adminAuth.adminUser)

  async function handleLogout() {
    const refreshToken = localStorage.getItem('adminRefreshToken')
    if (refreshToken) {
      try {
        await logoutAdmin(refreshToken)
      } catch (err) {
        console.error('Server logout failed', err)
      }
    }
    localStorage.removeItem('adminToken')
    localStorage.removeItem('adminRefreshToken')
    window.location.href = '/admin/login'
  }

  return (
    <aside className={`admin-sidebar${isOpen ? ' is-open' : ''}`}>
      <NavLink to="/admin/reports" className="admin-sidebar__logo" onClick={onClose}>
        <img src={logo} alt="QWT" />
        <span>Admin</span>
      </NavLink>

      <nav className="admin-sidebar__nav">
        {navItems
          .filter(({ label }) => label !== 'Admins' || adminUser?.role?.toLowerCase() === 'superadmin')
          .map(({ icon: Icon, label, path }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `admin-sidebar__navItem${isActive ? ' active' : ''}`
              }
              onClick={onClose}
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
      </nav>

      <div className="admin-sidebar__footer">
        {adminUser && (
          <div style={{ marginBottom: 12, color: 'rgba(255,255,255,0.6)', fontSize: 12 }}>
            Signed in as <strong style={{ color: '#fff' }}>{adminUser.name}</strong>
          </div>
        )}
        <button className="admin-sidebar__logoutBtn" onClick={handleLogout}>
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </aside>
  )
}
