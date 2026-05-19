import { useState, useEffect } from 'react'
import { Plus, Edit2, Loader2, X, AlertCircle, Image, Trash2 } from 'lucide-react'
import { getBlogs, deleteBlog, getBlogImageUrl, type DtoBlogRead } from '../../../api/blogsApi'
import '../../../components/admin/admin.scss'
import { BlogFormModal } from './components/BlogFormModal'

export function AdminBlogsPage() {
  const [blogs, setBlogs] = useState<DtoBlogRead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')

  const [search, setSearch] = useState('')

  // Modal State
  const [modalOpen, setModalOpen] = useState(false)
  const [editingBlog, setEditingBlog] = useState<DtoBlogRead | null>(null)

  // Delete Confirmation State
  const [deletingId, setDeletingId] = useState<number | null>(null)

  const fetchBlogs = async () => {
    try {
      setLoading(true)
      setActionError('')
      const res = await getBlogs(1, 100) // Adjust pagination as needed
      setBlogs(res.data || [])
    } catch {
      setError('Failed to load blogs.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchBlogs()
  }, [])

  const handleDelete = async (id: number) => {
    try {
      setActionError('')
      await deleteBlog(id)
      setDeletingId(null)
      fetchBlogs()
    } catch (err: any) {
      setActionError(err?.response?.data?.message || 'Failed to delete blog.')
      setDeletingId(null)
    }
  }

  const openCreateModal = () => {
    setEditingBlog(null)
    setModalOpen(true)
  }

  const openEditModal = (blog: DtoBlogRead) => {
    setEditingBlog(blog)
    setModalOpen(true)
  }

  const filteredBlogs = blogs.filter(b => 
    b.title?.toLowerCase().includes(search.toLowerCase()) ||
    b.description?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="admin-page">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#0f2f44', margin: 0 }}>Blogs</h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
            Manage blog articles and content sections
          </p>
        </div>
        <button
          onClick={openCreateModal}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#1e659e', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}
        >
          <Plus size={18} /> New Blog Post
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <input
          type="text"
          placeholder="Search by title or content..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', minWidth: '280px' }}
        />
      </div>

      {/* Action Error Banner */}
      {actionError && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fef2f2', border: '1px solid #fee2e2', color: '#b91c1c', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
          <span><AlertCircle size={14} style={{ marginRight: '8px', verticalAlign: 'middle' }} />{actionError}</span>
          <button onClick={() => setActionError('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}><X size={16} /></button>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
          <Loader2 className="animate-spin" size={40} color="#1e659e" />
        </div>
      ) : error ? (
        <div style={{ color: '#b91c1c', textAlign: 'center', padding: '40px' }}>{error}</div>
      ) : (
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <tr>
                <th style={{ padding: '14px 16px', fontWeight: 600, color: '#475569', fontSize: '12px', width: '60px' }}>IMG</th>
                <th style={{ padding: '14px 16px', fontWeight: 600, color: '#475569', fontSize: '12px' }}>TITLE & SUMMARY</th>
                <th style={{ padding: '14px 16px', fontWeight: 600, color: '#475569', fontSize: '12px' }}>SECTIONS</th>
                <th style={{ padding: '14px 16px', fontWeight: 600, color: '#475569', fontSize: '12px', textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredBlogs.map(blog => (
                <tr key={blog.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  {/* Image */}
                  <td style={{ padding: '12px 16px' }}>
                    {blog.imageUrl ? (
                      <img src={getBlogImageUrl(blog.imageUrl)} alt="" style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e2e8f0' }} />
                    ) : (
                      <div style={{ width: '48px', height: '48px', background: '#f1f5f9', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Image size={18} color="#94a3b8" />
                      </div>
                    )}
                  </td>
                  
                  {/* Title & Desc */}
                  <td style={{ padding: '12px 16px', maxWidth: '300px' }}>
                    <div style={{ fontWeight: 600, color: '#0f2f44', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {blog.title || 'Untitled'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.4' }}>
                      {blog.description || 'No description provided.'}
                    </div>
                  </td>
                  
                  {/* Sections */}
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#eff6ff', color: '#1e659e', padding: '4px 10px', borderRadius: '99px', fontSize: '12px', fontWeight: 600 }}>
                      {blog.sections?.length || 0} Sections
                    </span>
                  </td>

                  {/* Actions */}
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center' }}>
                      <button 
                        title="Edit Blog" 
                        onClick={() => openEditModal(blog)} 
                        style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', padding: '6px', borderRadius: '6px' }}
                      >
                        <Edit2 size={18} />
                      </button>

                      {deletingId === blog.id ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <button onClick={() => handleDelete(blog.id)} style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', fontWeight: 600 }}>Confirm</button>
                          <button onClick={() => setDeletingId(null)} style={{ background: '#f1f5f9', color: '#475569', border: 'none', padding: '4px 8px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer' }}>Cancel</button>
                        </div>
                      ) : (
                        <button 
                          title="Delete Blog" 
                          onClick={() => setDeletingId(blog.id)} 
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '6px', borderRadius: '6px' }}
                        >
                          <Trash2 size={18} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filteredBlogs.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>
                    No blogs found. {search ? 'Try a different search term.' : 'Create your first blog post!'}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      {modalOpen && (
        <BlogFormModal
          existingBlog={editingBlog}
          onClose={() => setModalOpen(false)}
          onSaved={() => {
            setModalOpen(false)
            fetchBlogs()
          }}
        />
      )}
    </div>
  )
}
