import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Mail,
  MessageSquare,
  Search,
  Star,
  Trash2,
  X,
} from 'lucide-react'
import {
  deleteProjectReview,
  getProjectReviewById,
  getProjectReviews,
  type DtoProjectReviewRead,
} from '../../../api/projectReviewsApi'
import '../../../components/admin/admin.scss'

const PAGE_SIZE = 20

function StarRating({ rate }: { rate: number | null }) {
  const stars = Math.round(rate || 0)

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          size={14}
          fill={i <= stars ? '#f59e0b' : 'none'}
          color={i <= stars ? '#f59e0b' : '#cbd5e1'}
        />
      ))}
      <span style={{ marginLeft: '6px', fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
        {rate ?? '-'}
      </span>
    </div>
  )
}

function formatDate(dateString: string | null) {
  if (!dateString) return '-'

  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return dateString
  }
}

function getFullName(review: DtoProjectReviewRead) {
  return [review.firstName, review.lastName].filter(Boolean).join(' ') || '-'
}

function getErrorMessage(error: unknown, fallback: string) {
  if (typeof error === 'object' && error && 'response' in error) {
    const response = (error as { response?: { data?: { message?: string; Message?: string } } }).response
    return response?.data?.message || response?.data?.Message || fallback
  }

  return fallback
}

function DetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px' }}>
      <span style={{ color: '#475569', fontSize: '13px', fontWeight: 500 }}>{label}</span>
      <span style={{ color: '#0f2f44', fontSize: '13px', fontWeight: 600, textAlign: 'right', wordBreak: 'break-word' }}>
        {value}
      </span>
    </div>
  )
}

export function AdminProjectReviewsPage() {
  const [reviews, setReviews] = useState<DtoProjectReviewRead[]>([])
  const [pageNumber, setPageNumber] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [search, setSearch] = useState('')
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null)
  const [deleting, setDeleting] = useState(false)
  const [selectedReview, setSelectedReview] = useState<DtoProjectReviewRead | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)

  const fetchReviews = useCallback(async (page: number) => {
    try {
      setLoading(true)
      setError('')
      const response = await getProjectReviews(page, PAGE_SIZE)
      setReviews(response.data || [])
    } catch {
      setError('Failed to load project reviews. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      fetchReviews(pageNumber)
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [fetchReviews, pageNumber])

  const filteredReviews = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return reviews

    return reviews.filter((review) => (
      review.firstName?.toLowerCase().includes(q) ||
      review.lastName?.toLowerCase().includes(q) ||
      review.email?.toLowerCase().includes(q) ||
      review.comment?.toLowerCase().includes(q)
    ))
  }, [reviews, search])

  const avgRating = reviews.length
    ? (reviews.reduce((sum, review) => sum + (review.rate || 0), 0) / reviews.length).toFixed(1)
    : '-'

  const openReviewDetails = async (review: DtoProjectReviewRead) => {
    setSelectedReview(review)
    setDetailLoading(true)

    try {
      const response = await getProjectReviewById(review.id)
      setSelectedReview(response.data || review)
    } catch {
      setActionError('Failed to load full review details.')
    } finally {
      setDetailLoading(false)
    }
  }

  const executeDelete = async () => {
    if (!deleteConfirmId) return

    try {
      setDeleting(true)
      setActionError('')
      await deleteProjectReview(deleteConfirmId)
      setDeleteConfirmId(null)
      setSelectedReview((current) => (current?.id === deleteConfirmId ? null : current))
      fetchReviews(pageNumber)
    } catch (err: unknown) {
      setActionError(getErrorMessage(err, 'Failed to delete project review.'))
    } finally {
      setDeleting(false)
    }
  }

  const canGoNext = reviews.length === PAGE_SIZE

  return (
    <div className="admin-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#0f2f44', margin: 0 }}>Project Reviews</h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
            Manage customer feedback submitted for the project.
          </p>
        </div>

        {!loading && !error && (
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '8px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#1e659e' }}>{reviews.length}</div>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>This Page</div>
            </div>
            <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px', padding: '8px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#d97706', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Star size={16} fill="#f59e0b" color="#f59e0b" /> {avgRating}
              </div>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Avg. Rating</div>
            </div>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px', alignItems: 'center', flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '420px', minWidth: '240px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search by name, email, or comment..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            style={{ width: '100%', padding: '10px 14px 10px 38px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginLeft: 'auto' }}>
          <button
            onClick={() => setPageNumber((current) => Math.max(1, current - 1))}
            disabled={pageNumber === 1 || loading}
            title="Previous page"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: pageNumber === 1 || loading ? 'not-allowed' : 'pointer', color: '#475569', opacity: pageNumber === 1 || loading ? 0.5 : 1 }}
          >
            <ChevronLeft size={18} />
          </button>
          <span style={{ color: '#475569', fontSize: '13px', fontWeight: 600 }}>Page {pageNumber}</span>
          <button
            onClick={() => setPageNumber((current) => current + 1)}
            disabled={!canGoNext || loading}
            title="Next page"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '8px', cursor: !canGoNext || loading ? 'not-allowed' : 'pointer', color: '#475569', opacity: !canGoNext || loading ? 0.5 : 1 }}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {actionError && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fef2f2', border: '1px solid #fee2e2', color: '#b91c1c', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
          <span><AlertCircle size={14} style={{ marginRight: '8px', verticalAlign: 'middle' }} />{actionError}</span>
          <button onClick={() => setActionError('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}><X size={16} /></button>
        </div>
      )}

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
          <Loader2 className="animate-spin" size={40} color="#1e659e" />
        </div>
      ) : error ? (
        <div style={{ color: '#b91c1c', textAlign: 'center', padding: '40px', background: '#fef2f2', borderRadius: '12px', border: '1px solid #fecaca' }}>
          <AlertCircle size={32} style={{ marginBottom: '12px' }} />
          <div>{error}</div>
          <button onClick={() => fetchReviews(pageNumber)} style={{ marginTop: '16px', background: '#1e659e', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
            Retry
          </button>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflowX: 'auto' }}>
          <table style={{ width: '100%', minWidth: '880px', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <tr>
                <th style={{ padding: '14px 16px', fontWeight: 600, color: '#475569', fontSize: '12px' }}>CUSTOMER</th>
                <th style={{ padding: '14px 16px', fontWeight: 600, color: '#475569', fontSize: '12px' }}>CONTACT</th>
                <th style={{ padding: '14px 16px', fontWeight: 600, color: '#475569', fontSize: '12px' }}>RATING</th>
                <th style={{ padding: '14px 16px', fontWeight: 600, color: '#475569', fontSize: '12px', maxWidth: '320px' }}>COMMENT</th>
                <th style={{ padding: '14px 16px', fontWeight: 600, color: '#475569', fontSize: '12px' }}>DATE</th>
                <th style={{ padding: '14px 16px', fontWeight: 600, color: '#475569', fontSize: '12px', textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.map((review) => (
                <tr
                  key={review.id}
                  onClick={() => openReviewDetails(review)}
                  style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s', cursor: 'pointer' }}
                  onMouseEnter={(event) => (event.currentTarget.style.background = '#f8fafc')}
                  onMouseLeave={(event) => (event.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ fontWeight: 600, color: '#0f2f44', fontSize: '14px' }}>
                      {getFullName(review)}
                    </div>
                    <div style={{ color: '#94a3b8', fontSize: '12px', marginTop: '2px' }}>#{review.id}</div>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#475569', fontSize: '13px' }}>
                      <Mail size={13} color="#94a3b8" /> {review.email || '-'}
                    </span>
                  </td>
                  <td style={{ padding: '14px 16px' }}>
                    <StarRating rate={review.rate} />
                  </td>
                  <td style={{ padding: '14px 16px', maxWidth: '320px' }}>
                    {review.comment ? (
                      <div style={{ fontSize: '13px', color: '#334155', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.5' }}>
                        <MessageSquare size={12} style={{ marginRight: '6px', color: '#94a3b8', display: 'inline' }} />
                        {review.comment}
                      </div>
                    ) : (
                      <span style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }}>No comment</span>
                    )}
                  </td>
                  <td style={{ padding: '14px 16px', color: '#64748b', fontSize: '13px', whiteSpace: 'nowrap' }}>
                    {formatDate(review.createdAt)}
                  </td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }} onClick={(event) => event.stopPropagation()}>
                    <button
                      title="Delete project review"
                      onClick={() => setDeleteConfirmId(review.id)}
                      style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '6px', borderRadius: '6px' }}
                    >
                      <Trash2 size={17} />
                    </button>
                  </td>
                </tr>
              ))}

              {filteredReviews.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ padding: '72px 0', width: '100%' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%' }}>
                      <MessageSquare size={32} color="#cbd5e1" style={{ marginBottom: '12px' }} />
                      <div style={{ fontWeight: 600, color: '#94a3b8', fontSize: '15px' }}>
                        {search ? 'No project reviews match your search.' : 'No project reviews found.'}
                      </div>
                      {search && (
                        <button
                          onClick={() => setSearch('')}
                          style={{ marginTop: '12px', background: 'none', border: '1px solid #cbd5e1', padding: '6px 16px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', color: '#475569' }}
                        >
                          Clear Search
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {selectedReview && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '560px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', overflow: 'hidden' }}>
            <div style={{ padding: '20px 24px', background: '#1e659e', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Project Review Details</h3>
              <button onClick={() => setSelectedReview(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px', borderRadius: '50%' }}>
                <X size={20} />
              </button>
            </div>

            <div style={{ padding: '24px', maxHeight: '70vh', overflowY: 'auto' }}>
              {detailLoading ? (
                <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                  <Loader2 className="animate-spin" size={32} color="#1e659e" />
                </div>
              ) : (
                <>
                  <div style={{ marginBottom: '20px' }}>
                    <h4 style={{ margin: '0 0 10px', fontSize: '14px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Customer Info</h4>
                    <div style={{ background: '#f8fafc', padding: '14px 16px', borderRadius: '8px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      <DetailRow label="Name:" value={getFullName(selectedReview)} />
                      <DetailRow label="Email:" value={selectedReview.email || '-'} />
                    </div>
                  </div>

                  <div>
                    <h4 style={{ margin: '0 0 10px', fontSize: '14px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Review Details</h4>
                    <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                        <span style={{ color: '#475569', fontSize: '13px', fontWeight: 500 }}>Rating:</span>
                        <StarRating rate={selectedReview.rate} />
                      </div>
                      <DetailRow label="Submitted On:" value={formatDate(selectedReview.createdAt)} />

                      <div style={{ marginTop: '12px', borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
                        <div style={{ color: '#475569', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Comment:</div>
                        <div style={{ color: '#0f2f44', fontSize: '14px', lineHeight: '1.6', background: '#fff', padding: '10px 14px', borderRadius: '6px', border: '1px solid #e2e8f0', whiteSpace: 'pre-wrap' }}>
                          {selectedReview.comment || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>No comment provided</span>}
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>

            <div style={{ padding: '16px 24px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setSelectedReview(null)} style={{ background: '#64748b', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteConfirmId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
          <div style={{ background: '#fff', borderRadius: '12px', width: '100%', maxWidth: '400px', padding: '28px', textAlign: 'center' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: '#fee2e2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Trash2 size={24} />
            </div>
            <h3 style={{ margin: '0 0 8px', fontSize: '18px', color: '#0f2f44', fontWeight: 600 }}>Delete Project Review</h3>
            <p style={{ margin: '0 0 24px', color: '#64748b', fontSize: '14px', lineHeight: 1.5 }}>
              Are you sure you want to delete this project review? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={() => setDeleteConfirmId(null)} disabled={deleting} style={{ flex: 1, padding: '10px', background: '#f1f5f9', border: 'none', borderRadius: '8px', cursor: deleting ? 'not-allowed' : 'pointer', fontWeight: 500 }}>
                Cancel
              </button>
              <button onClick={executeDelete} disabled={deleting} style={{ flex: 1, padding: '10px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', cursor: deleting ? 'not-allowed' : 'pointer', fontWeight: 500, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                {deleting ? <Loader2 size={18} className="animate-spin" /> : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
