import { Star } from 'lucide-react'

export function AdminReviewsPage() {
  return (
    <div className="admin-coming-soon">
      <div className="admin-coming-soon__icon"><Star size={36} /></div>
      <h2 className="admin-coming-soon__title">Reviews</h2>
      <p className="admin-coming-soon__sub">Moderate and manage customer reviews. This section will be live once the API is connected.</p>
      <span className="admin-coming-soon__badge">🚀 Coming Soon</span>
    </div>
  )
}
