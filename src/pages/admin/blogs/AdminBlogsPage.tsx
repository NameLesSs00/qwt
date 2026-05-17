import { BookOpen } from 'lucide-react'

export function AdminBlogsPage() {
  return (
    <div className="admin-coming-soon">
      <div className="admin-coming-soon__icon"><BookOpen size={36} /></div>
      <h2 className="admin-coming-soon__title">Blogs</h2>
      <p className="admin-coming-soon__sub">Manage blog posts and articles. This section will be live once the API is connected.</p>
      <span className="admin-coming-soon__badge">🚀 Coming Soon</span>
    </div>
  )
}
