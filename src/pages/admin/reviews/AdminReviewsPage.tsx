import { useState, useEffect } from 'react'
import { Loader2, X, AlertCircle, Trash2, Star, Search, MessageSquare } from 'lucide-react'
import { getReviews, deleteReview, type DtoReviewRead } from '../../../api/reviewsApi'
import '../../../components/admin/admin.scss'

function StarRating({ rate }: { rate: number | null }) {
  const stars = Math.round(rate || 0)
  return (
    <div style={{ display: 'flex', gap: '2px' }}>
      {[1, 2, 3, 4, 5].map(i => (
        <Star
          key={i}
          size={14}
          fill={i <= stars ? '#f59e0b' : 'none'}
          color={i <= stars ? '#f59e0b' : '#cbd5e1'}
        />
      ))}
      <span style={{ marginLeft: '6px', fontSize: '12px', color: '#64748b', fontWeight: 600 }}>
        {rate ?? '—'}
      </span>
    </div>
  )
}

function formatDate(dateString: string | null) {
  if (!dateString) return '—'
  try {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    })
  } catch {
    return dateString
  }
}

export function AdminReviewsPage() {
  const [reviews, setReviews] = useState<DtoReviewRead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [deletingId, setDeletingId] = useState<number | null>(null)
  const [deletingInProgress, setDeletingInProgress] = useState(false)
  const [search, setSearch] = useState('')
  const [selectedReview, setSelectedReview] = useState<DtoReviewRead | null>(null)

  const fetchReviews = async () => {
    try {
      setLoading(true)
      setError('')
      const res = await getReviews(1, 200)
      setReviews(res.data || [])
    } catch {
      setError('Failed to load reviews. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReviews()
  }, [])

  const handleDelete = async (id: number) => {
    try {
      setDeletingInProgress(true)
      setActionError('')
      await deleteReview(id)
      setDeletingId(null)
      fetchReviews()
    } catch (err: any) {
      setActionError(err?.response?.data?.message || 'Failed to delete review.')
      setDeletingId(null)
    } finally {
      setDeletingInProgress(false)
    }
  }

  const filteredReviews = reviews.filter(r => {
    const q = search.toLowerCase()
    return (
      r.firstName?.toLowerCase().includes(q) ||
      r.lastName?.toLowerCase().includes(q) ||
      r.email?.toLowerCase().includes(q) ||
      r.comment?.toLowerCase().includes(q) ||
      r.tripName?.toLowerCase().includes(q)
    )
  })

  const avgRating = reviews.length
    ? (reviews.reduce((acc, r) => acc + (r.rate || 0), 0) / reviews.length).toFixed(1)
    : '—'

  return (
    <div className="admin-page">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#0f2f44', margin: 0 }}>Customer Reviews</h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
            Moderate reviews from customers. Click on a review to see full details or remove any that violate community guidelines.
          </p>
        </div>

        {/* Summary chips */}
        {!loading && !error && (
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '10px', padding: '8px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 700, color: '#1e659e' }}>{reviews.length}</div>
              <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 600 }}>Total Reviews</div>
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

      {/* Search */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
        <div style={{ position: 'relative', flex: 1, maxWidth: '400px' }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search by name, email, comment, or trip..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ width: '100%', padding: '10px 14px 10px 38px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }}
          />
        </div>
      </div>

      {/* Action Error Banner */}
      {actionError && (
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fef2f2', border: '1px solid #fee2e2', color: '#b91c1c', padding: '12px 16px', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }}>
          <span><AlertCircle size={14} style={{ marginRight: '8px', verticalAlign: 'middle' }} />{actionError}</span>
          <button onClick={() => setActionError('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444' }}><X size={16} /></button>
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '80px' }}>
          <Loader2 className="animate-spin" size={40} color="#1e659e" />
        </div>
      ) : error ? (
        <div style={{ color: '#b91c1c', textAlign: 'center', padding: '40px', background: '#fef2f2', borderRadius: '12px', border: '1px solid #fecaca' }}>
          <AlertCircle size={32} style={{ marginBottom: '12px' }} />
          <div>{error}</div>
          <button onClick={fetchReviews} style={{ marginTop: '16px', background: '#1e659e', color: '#fff', border: 'none', padding: '8px 20px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>
            Retry
          </button>
        </div>
      ) : (
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <tr>
                <th style={{ padding: '14px 16px', fontWeight: 600, color: '#475569', fontSize: '12px' }}>CUSTOMER</th>
                <th style={{ padding: '14px 16px', fontWeight: 600, color: '#475569', fontSize: '12px' }}>TRIP</th>
                <th style={{ padding: '14px 16px', fontWeight: 600, color: '#475569', fontSize: '12px' }}>RATING</th>
                <th style={{ padding: '14px 16px', fontWeight: 600, color: '#475569', fontSize: '12px', maxWidth: '300px' }}>COMMENT</th>
                <th style={{ padding: '14px 16px', fontWeight: 600, color: '#475569', fontSize: '12px' }}>DATE</th>
                <th style={{ padding: '14px 16px', fontWeight: 600, color: '#475569', fontSize: '12px', textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {filteredReviews.map(review => {
                return (
                  <tr
                    key={review.id}
                    onClick={() => setSelectedReview(review)}
                    style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s', cursor: 'pointer' }}
                    onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    {/* Customer */}
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ fontWeight: 600, color: '#0f2f44', fontSize: '14px' }}>
                        {[review.firstName, review.lastName].filter(Boolean).join(' ') || '—'}
                      </div>
                    </td>

                    {/* Trip */}
                    <td style={{ padding: '14px 16px', maxWidth: '180px' }}>
                      <div style={{ fontWeight: 600, color: '#0f2f44', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {review.tripName || '—'}
                      </div>
                      {review.destination && (
                        <div style={{ fontSize: '12px', color: '#64748b', marginTop: '2px' }}>
                          {review.destination}
                        </div>
                      )}
                      {review.tripTypeName && (
                        <span style={{ display: 'inline-block', marginTop: '4px', background: '#f1f5f9', color: '#475569', padding: '2px 8px', borderRadius: '99px', fontSize: '11px', fontWeight: 600 }}>
                          {review.tripTypeName}
                        </span>
                      )}
                    </td>

                    {/* Rating */}
                    <td style={{ padding: '14px 16px' }}>
                      <StarRating rate={review.rate} />
                    </td>

                    {/* Comment */}
                    <td style={{ padding: '14px 16px', maxWidth: '280px' }}>
                      {review.comment ? (
                        <div style={{ fontSize: '13px', color: '#334155', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: '1.5' }}>
                          <MessageSquare size={12} style={{ marginRight: '6px', color: '#94a3b8', flexShrink: 0, display: 'inline' }} />
                          {review.comment}
                        </div>
                      ) : (
                        <span style={{ fontSize: '12px', color: '#94a3b8', fontStyle: 'italic' }}>No comment</span>
                      )}
                    </td>

                    {/* Date */}
                    <td style={{ padding: '14px 16px', color: '#64748b', fontSize: '13px', whiteSpace: 'nowrap' }}>
                      {formatDate(review.createdAt)}
                    </td>

                    {/* Actions */}
                    <td style={{ padding: '14px 16px', textAlign: 'right' }} onClick={e => e.stopPropagation()}>
                      {deletingId === review.id ? (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                          <button
                            onClick={() => handleDelete(review.id)}
                            disabled={deletingInProgress}
                            style={{ background: '#ef4444', color: '#fff', border: 'none', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', cursor: deletingInProgress ? 'not-allowed' : 'pointer', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}
                          >
                            {deletingInProgress ? <Loader2 size={12} className="animate-spin" /> : null}
                            Confirm
                          </button>
                          <button
                            onClick={() => setDeletingId(null)}
                            disabled={deletingInProgress}
                            style={{ background: '#f1f5f9', color: '#475569', border: 'none', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          title="Delete Review"
                          onClick={() => setDeletingId(review.id)}
                          style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '6px', borderRadius: '6px' }}
                        >
                          <Trash2 size={17} />
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}

              {filteredReviews.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    style={{
                      padding: '80px 0',
                      width: '100%',
                      minWidth: '100%',
                    }}
                  >
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '100%'
                    }}>
                      <MessageSquare size={32} color="#cbd5e1" style={{ marginBottom: '12px' }} />
                      <div style={{ fontWeight: 600, color: '#94a3b8', fontSize: '15px' }}>
                        {search ? 'No reviews match your search.' : 'No reviews yet.'}
                      </div>
                      {search && (
                        <button
                          onClick={() => setSearch('')}
                          style={{
                            marginTop: '12px',
                            background: 'none',
                            border: '1px solid #cbd5e1',
                            padding: '6px 16px',
                            borderRadius: '8px',
                            fontSize: '13px',
                            cursor: 'pointer',
                            color: '#475569'
                          }}
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

      {/* Review Detail Modal */}
      {selectedReview && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(15, 23, 42, 0.6)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
          <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '600px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)', overflow: 'hidden' }}>
            {/* Header */}
            <div style={{ padding: '20px 24px', background: '#1e659e', color: '#fff', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>Review Details</h3>
              <button onClick={() => setSelectedReview(null)} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4px', borderRadius: '50%' }}>
                <X size={20} />
              </button>
            </div>

            {/* Body */}
            <div style={{ padding: '24px', maxHeight: '70vh', overflowY: 'auto' }}>
              {/* Customer Info */}
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ margin: '0 0 10px', fontSize: '14px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Customer Info</h4>
                <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: '#475569', fontSize: '13px', fontWeight: 500 }}>Name:</span>
                    <span style={{ color: '#0f2f44', fontSize: '13px', fontWeight: 600 }}>
                      {[selectedReview.firstName, selectedReview.lastName].filter(Boolean).join(' ') || '—'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Trip Info */}
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ margin: '0 0 10px', fontSize: '14px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Trip Info</h4>
                <div style={{ background: '#f8fafc', padding: '12px 16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: '#475569', fontSize: '13px', fontWeight: 500 }}>Trip Name:</span>
                    <span style={{ color: '#0f2f44', fontSize: '13px', fontWeight: 600 }}>{selectedReview.tripName || '—'}</span>
                  </div>
                  {selectedReview.destination && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ color: '#475569', fontSize: '13px', fontWeight: 500 }}>Destination:</span>
                      <span style={{ color: '#0f2f44', fontSize: '13px', fontWeight: 600 }}>{selectedReview.destination}</span>
                    </div>
                  )}
                  {selectedReview.tripTypeName && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                      <span style={{ color: '#475569', fontSize: '13px', fontWeight: 500 }}>Trip Type:</span>
                      <span style={{ color: '#0f2f44', fontSize: '13px', fontWeight: 600 }}>{selectedReview.tripTypeName}</span>
                    </div>
                  )}
                  {(selectedReview.adultPrice > 0 || selectedReview.childPrice > 0) && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: selectedReview.description ? '8px' : '0' }}>
                      <span style={{ color: '#475569', fontSize: '13px', fontWeight: 500 }}>Price Range:</span>
                      <span style={{ color: '#0f2f44', fontSize: '13px', fontWeight: 600 }}>
                        Adult: {selectedReview.adultPrice} {selectedReview.currencyName} / Child: {selectedReview.childPrice} {selectedReview.currencyName}
                      </span>
                    </div>
                  )}
                  {selectedReview.description && selectedReview.description !== 'string' && (
                    <div style={{ marginTop: '12px', borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
                      <div style={{ color: '#475569', fontSize: '13px', fontWeight: 600, marginBottom: '4px' }}>Trip Description:</div>
                      <div style={{ color: '#0f2f44', fontSize: '12px', lineHeight: '1.5', maxHeight: '80px', overflowY: 'auto' }}>
                        {selectedReview.description}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Review Info */}
              <div>
                <h4 style={{ margin: '0 0 10px', fontSize: '14px', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Review Details</h4>
                <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ color: '#475569', fontSize: '13px', fontWeight: 500 }}>Rating:</span>
                    <StarRating rate={selectedReview.rate} />
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                    <span style={{ color: '#475569', fontSize: '13px', fontWeight: 500 }}>Submitted On:</span>
                    <span style={{ color: '#0f2f44', fontSize: '13px', fontWeight: 600 }}>{formatDate(selectedReview.createdAt)}</span>
                  </div>

                  {/* Comment */}
                  <div style={{ marginTop: '12px', borderTop: '1px solid #e2e8f0', paddingTop: '12px' }}>
                    <div style={{ color: '#475569', fontSize: '13px', fontWeight: 600, marginBottom: '6px' }}>Comment:</div>
                    <div style={{ color: '#0f2f44', fontSize: '14px', lineHeight: '1.6', background: '#fff', padding: '10px 14px', borderRadius: '6px', border: '1px solid #e2e8f0', whiteSpace: 'pre-wrap' }}>
                      {selectedReview.comment || <span style={{ color: '#94a3b8', fontStyle: 'italic' }}>No comment provided</span>}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div style={{ padding: '16px 24px', background: '#f8fafc', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={() => setSelectedReview(null)} style={{ background: '#64748b', color: '#fff', border: 'none', padding: '8px 18px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
