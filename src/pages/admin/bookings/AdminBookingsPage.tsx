import { ShoppingBag } from 'lucide-react'

export function AdminBookingsPage() {
  return (
    <div className="admin-coming-soon">
      <div className="admin-coming-soon__icon"><ShoppingBag size={36} /></div>
      <h2 className="admin-coming-soon__title">Bookings</h2>
      <p className="admin-coming-soon__sub">View and manage all customer bookings. This section will be live once the API is connected.</p>
      <span className="admin-coming-soon__badge">🚀 Coming Soon</span>
    </div>
  )
}
