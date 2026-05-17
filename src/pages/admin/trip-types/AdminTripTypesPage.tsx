import { useState, useEffect, type FormEvent } from 'react'
import { Plus, Edit2, Trash2, Loader2, X, AlertCircle } from 'lucide-react'
import { getTripTypes, createTripType, updateTripType, deleteTripType, getTripTypeById, type TripTypeDto } from '../../../api/tripTypesApi'
import '../../../components/admin/admin.scss'

export function AdminTripTypesPage() {
  const [tripTypes, setTripTypes] = useState<TripTypeDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [page, setPage] = useState(1)

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null)
  const [formLoading, setFormLoading] = useState(false)

  // Trip Type uses 4 languages
  const [formData, setFormData] = useState({
    en: '',
    fr: '',
    ru: '',
    ro: ''
  })

  const fetchTripTypes = async () => {
    try {
      setLoading(true)
      setActionError('')
      const res = await getTripTypes(page, 50)
      const sorted = (res.data || []).sort((a, b) => a.id - b.id)
      setTripTypes(sorted)
    } catch (err) {
      setError('Failed to load trip types')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTripTypes()
  }, [page])

  const openCreateModal = () => {
    setEditingId(null)
    setFormData({ en: '', fr: '', ru: '', ro: '' })
    setIsModalOpen(true)
  }

  const openEditModal = async (tt: TripTypeDto) => {
    setEditingId(tt.id)
    setIsModalOpen(true)
    setFormLoading(true)
    try {
      // Parallel fetch to load all 4 translations
      const [enRes, frRes, ruRes, roRes] = await Promise.all([
        getTripTypeById(tt.id, 'en'),
        getTripTypeById(tt.id, 'fr'),
        getTripTypeById(tt.id, 'ru'),
        getTripTypeById(tt.id, 'ro')
      ])
      
      setFormData({
        en: enRes.data?.name || '',
        fr: frRes.data?.name || '',
        ru: ruRes.data?.name || '',
        ro: roRes.data?.name || ''
      })
    } catch (err) {
      setActionError('Failed to load translations for this trip type.')
      setIsModalOpen(false)
    } finally {
      setFormLoading(false)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setFormLoading(true)
    try {
      if (editingId) {
        await updateTripType({ id: editingId, name: formData })
      } else {
        await createTripType({ name: formData })
      }
      setIsModalOpen(false)
      fetchTripTypes()
    } catch (err: any) {
      alert(err?.response?.data?.message || 'Failed to save trip type')
    } finally {
      setFormLoading(false)
    }
  }

  const confirmDelete = (id: number) => {
    setDeleteConfirmId(id)
  }

  const executeDelete = async () => {
    if (!deleteConfirmId) return
    try {
      setActionError('')
      setFormLoading(true)
      await deleteTripType(deleteConfirmId)
      fetchTripTypes()
    } catch (err: any) {
      // The API returns 'Message' with an uppercase 'M' for these constraint errors
      const errMsg = err?.response?.data?.Message || err?.response?.data?.message || 'Failed to delete trip type. You may not have permission.'
      setActionError(errMsg)
    } finally {
      setDeleteConfirmId(null)
      setFormLoading(false)
    }
  }

  return (
    <div className="admin-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#0f2f44', margin: 0 }}>Trip Types</h2>
        <button
          onClick={openCreateModal}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#1e659e', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }}
        >
          <Plus size={18} /> Add Trip Type
        </button>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}><Loader2 className="animate-spin" size={32} color="#1e659e" /></div>
      ) : error ? (
        <div style={{ color: 'red', textAlign: 'center', padding: '20px' }}>{error}</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {actionError && (
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#fef2f2', border: '1px solid #fee2e2', color: '#b91c1c', padding: '12px 16px', borderRadius: '8px', fontSize: '14px' }}>
              <span>{actionError}</span>
              <button onClick={() => setActionError('')} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', display: 'flex', alignItems: 'center' }}><X size={16} /></button>
            </div>
          )}
          <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <tr>
                <th style={{ padding: '16px', fontWeight: 600, color: '#475569', fontSize: '13px' }}>ID</th>
                <th style={{ padding: '16px', fontWeight: 600, color: '#475569', fontSize: '13px' }}>Name (Localized)</th>
                <th style={{ padding: '16px', fontWeight: 600, color: '#475569', fontSize: '13px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tripTypes.map(tt => (
                <tr key={tt.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '16px', color: '#64748b', fontSize: '14px' }}>#{tt.id}</td>
                  <td style={{ padding: '16px', color: '#0f2f44', fontSize: '14px', fontWeight: 500 }}>{tt.name}</td>
                  <td style={{ padding: '16px', textAlign: 'right' }}>
                    <button onClick={() => openEditModal(tt)} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', marginRight: '16px' }} title="Edit">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => confirmDelete(tt.id)} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }} title="Delete">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {tripTypes.length === 0 && (
                <tr>
                  <td colSpan={3} style={{ padding: '32px', textAlign: 'center', color: '#64748b' }}>No trip types found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: '12px', width: '100%', maxWidth: '500px', padding: '24px', position: 'relative' }}>
            <button onClick={() => setIsModalOpen(false)} style={{ position: 'absolute', top: '16px', right: '16px', background: 'none', border: 'none', cursor: 'pointer', color: '#64748b' }}>
              <X size={20} />
            </button>
            <h3 style={{ margin: '0 0 20px', fontSize: '20px', color: '#0f2f44' }}>{editingId ? 'Edit Trip Type' : 'Add Trip Type'}</h3>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              
              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 500, color: '#475569' }}>Name (English) <span style={{ color: '#ef4444' }}>*</span></label>
                <input 
                  type="text" 
                  value={formData.en} 
                  onChange={e => setFormData({ ...formData, en: e.target.value })} 
                  required 
                  placeholder="e.g. Safari"
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }} 
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 500, color: '#475569' }}>Name (French) <span style={{ color: '#ef4444' }}>*</span></label>
                <input 
                  type="text" 
                  value={formData.fr} 
                  onChange={e => setFormData({ ...formData, fr: e.target.value })} 
                  required 
                  placeholder="e.g. Safari"
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }} 
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 500, color: '#475569' }}>Name (Russian) <span style={{ color: '#ef4444' }}>*</span></label>
                <input 
                  type="text" 
                  value={formData.ru} 
                  onChange={e => setFormData({ ...formData, ru: e.target.value })} 
                  required 
                  placeholder="e.g. Сафари"
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }} 
                />
              </div>

              <div>
                <label style={{ display: 'block', marginBottom: '6px', fontSize: '13px', fontWeight: 500, color: '#475569' }}>Name (Romanian) <span style={{ color: '#ef4444' }}>*</span></label>
                <input 
                  type="text" 
                  value={formData.ro} 
                  onChange={e => setFormData({ ...formData, ro: e.target.value })} 
                  required 
                  placeholder="e.g. Safari"
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '14px' }} 
                />
              </div>

              <div style={{ marginTop: '8px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '10px 16px', background: '#f1f5f9', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500 }}>Cancel</button>
                <button type="submit" disabled={formLoading} style={{ padding: '10px 16px', background: '#1e659e', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 500, opacity: formLoading ? 0.7 : 1 }}>
                  {formLoading ? 'Saving...' : 'Save Trip Type'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: '#fff', borderRadius: '12px', width: '100%', maxWidth: '400px', padding: '24px', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#fee2e2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <Trash2 size={24} />
            </div>
            <h3 style={{ margin: '0 0 8px', fontSize: '18px', color: '#0f2f44', fontWeight: 600 }}>Delete Trip Type</h3>
            <p style={{ margin: '0 0 24px', color: '#64748b', fontSize: '14px', lineHeight: 1.5 }}>
              Are you sure you want to delete this trip type? This action cannot be undone.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button 
                onClick={() => setDeleteConfirmId(null)} 
                style={{ padding: '10px 20px', background: '#f1f5f9', color: '#475569', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 500, flex: 1 }}
                disabled={formLoading}
              >
                Cancel
              </button>
              <button 
                onClick={executeDelete} 
                style={{ padding: '10px 20px', background: '#ef4444', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 500, flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', opacity: formLoading ? 0.7 : 1 }}
                disabled={formLoading}
              >
                {formLoading ? <Loader2 size={18} className="animate-spin" /> : 'Yes, Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
