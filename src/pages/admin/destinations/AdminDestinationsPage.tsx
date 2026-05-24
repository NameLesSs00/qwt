import { useState, useEffect, useMemo } from 'react'
import { Plus, Edit2, Trash2, Loader2, X, Search, Image as ImageIcon } from 'lucide-react'
import { useToast } from '../../../components/toast/ToastProvider'
import {
  getDestinations,
  createDestination,
  updateDestination,
  deleteDestination,
  getDestinationById,
  getDestinationImageUrl,
  type DestinationDto,
} from '../../../api/destinationsApi'
import '../../../components/admin/admin.scss'
import { DestinationFormModal } from './components/DestinationFormModal'

const DEFAULT_FORM_VALUES = {
  en: '',
  fr: '',
  ru: '',
  ro: '',
  isFeatured: false,
  imageUrl: null as string | null,
}

export function AdminDestinationsPage() {
  const [destinations, setDestinations] = useState<DestinationDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [search, setSearch] = useState('')

  const [modalOpen, setModalOpen] = useState(false)
  const [editingDestination, setEditingDestination] = useState<DestinationDto | null>(null)
  const [formValues, setFormValues] = useState(DEFAULT_FORM_VALUES)
  const [formLoading, setFormLoading] = useState(false)
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null)

  const { toast } = useToast()

  const loadDestinations = async () => {
    try {
      setLoading(true)
      setError('')
      const res = await getDestinations(1, 100, search)
      setDestinations(res.data || [])
    } catch (err) {
      setError('Failed to load destinations.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadDestinations()
  }, [search])

  const openCreateModal = () => {
    setEditingDestination(null)
    setFormValues(DEFAULT_FORM_VALUES)
    setModalOpen(true)
  }

  const openEditModal = async (destination: DestinationDto) => {
    setEditingDestination(destination)
    setModalOpen(true)
    setFormLoading(true)

    try {
      const [enRes, frRes, ruRes, roRes] = await Promise.all([
        getDestinationById(destination.id, 'en'),
        getDestinationById(destination.id, 'fr'),
        getDestinationById(destination.id, 'ru'),
        getDestinationById(destination.id, 'ro'),
      ])

      setFormValues({
        en: enRes.data?.name || destination.name,
        fr: frRes.data?.name || destination.name,
        ru: ruRes.data?.name || destination.name,
        ro: roRes.data?.name || destination.name,
        isFeatured: destination.isFeatured,
        imageUrl: destination.imageUrl,
      })
    } catch (err) {
      setFormValues({
        en: destination.name,
        fr: destination.name,
        ru: destination.name,
        ro: destination.name,
        isFeatured: destination.isFeatured,
        imageUrl: destination.imageUrl,
      })
      setActionError('Could not load translated values for this destination.')
    } finally {
      setFormLoading(false)
    }
  }

  const handleSave = async (data: FormData) => {
    try {
      setFormLoading(true)
      if (editingDestination) {
        data.append('Id', editingDestination.id.toString())
        await updateDestination(data)
        toast.success('Destination updated successfully')
      } else {
        await createDestination(data)
        toast.success('Destination created successfully')
      }
      setModalOpen(false)
      setEditingDestination(null)
      loadDestinations()
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || 'Failed to save destination.'
      setActionError(message)
      throw err
    } finally {
      setFormLoading(false)
    }
  }

  const confirmDelete = (id: number) => {
    setDeleteConfirmId(id)
  }

  const handleDelete = async () => {
    if (!deleteConfirmId) return
    try {
      setFormLoading(true)
      setActionError('')
      await deleteDestination(deleteConfirmId)
      toast.success('Destination deleted successfully')
      setDeleteConfirmId(null)
      loadDestinations()
    } catch (err: any) {
      setActionError(err?.response?.data?.message || 'Failed to delete destination.')
      setDeleteConfirmId(null)
    } finally {
      setFormLoading(false)
    }
  }

  const visibleDestinations = useMemo(() => {
    if (!search) return destinations
    const normalized = search.toLowerCase()
    return destinations.filter((destination) =>
      destination.name.toLowerCase().includes(normalized)
    )
  }, [destinations, search])

  return (
    <div className="admin-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '24px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#0f2f44', margin: 0 }}>Destinations</h2>
          <p style={{ margin: '6px 0 0', color: '#64748b', fontSize: '14px' }}>
            Manage destination cards, images and featured destinations.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#1e659e', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '10px', cursor: 'pointer', fontWeight: 600 }}
        >
          <Plus size={18} /> Add Destination
        </button>
      </div>

      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '20px' }}>
        <div style={{ flex: '1 1 320px', position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: '#94a3b8' }} />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search destinations..."
            style={{ width: '100%', padding: '12px 14px 12px 38px', border: '1px solid #cbd5e1', borderRadius: '10px', fontSize: '14px' }}
          />
        </div>
      </div>

      {actionError && (
        <div style={{ marginBottom: '20px', padding: '14px 16px', background: '#fef2f2', border: '1px solid #fee2e2', borderRadius: '10px', color: '#b91c1c', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>{actionError}</span>
          <button onClick={() => setActionError('')} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer' }}><X size={18} /></button>
        </div>
      )}

      {loading ? (
        <div style={{ padding: '64px 0', display: 'flex', justifyContent: 'center' }}>
          <Loader2 className="animate-spin" size={34} color="#1e659e" />
        </div>
      ) : error ? (
        <div style={{ padding: '48px 0', textAlign: 'center', color: '#dc2626' }}>{error}</div>
      ) : (
        <div style={{ background: '#fff', border: '1px solid #e2e8f0', borderRadius: '16px', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '640px' }}>
            <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <tr>
                <th style={{ padding: '16px', color: '#475569', fontWeight: 700, fontSize: '12px', textAlign: 'left' }}>Image</th>
                <th style={{ padding: '16px', color: '#475569', fontWeight: 700, fontSize: '12px', textAlign: 'left' }}>Destination</th>
                <th style={{ padding: '16px', color: '#475569', fontWeight: 700, fontSize: '12px', textAlign: 'center' }}>Featured</th>
                <th style={{ padding: '16px', color: '#475569', fontWeight: 700, fontSize: '12px', textAlign: 'center' }}>Tours Count</th>
                <th style={{ padding: '16px', color: '#475569', fontWeight: 700, fontSize: '12px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleDestinations.map((destination) => (
                <tr key={destination.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                  <td style={{ padding: '14px 16px' }}>
                    {destination.imageUrl ? (
                      <img src={getDestinationImageUrl(destination.imageUrl)} alt={destination.name} style={{ width: '72px', height: '56px', objectFit: 'cover', borderRadius: '12px', border: '1px solid #e2e8f0' }} />
                    ) : (
                      <div style={{ width: '72px', height: '56px', borderRadius: '12px', background: '#f1f5f9', display: 'grid', placeItems: 'center' }}>
                        <ImageIcon size={18} color="#94a3b8" />
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '14px 16px', color: '#0f172a', fontWeight: 600 }}>{destination.name}</td>
                  <td style={{ padding: '14px 16px', textAlign: 'center', color: destination.isFeatured ? '#16a34a' : '#64748b', fontWeight: 700 }}>{destination.isFeatured ? 'Yes' : 'No'}</td>
                  <td style={{ padding: '14px 16px', textAlign: 'center', color: '#334155', fontWeight: 600 }}>{destination.tripsCount}</td>
                  <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                    <button onClick={() => openEditModal(destination)} style={{ background: 'transparent', border: 'none', color: '#2563eb', cursor: 'pointer', marginRight: '16px' }} title="Edit">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => confirmDelete(destination.id)} style={{ background: 'transparent', border: 'none', color: '#dc2626', cursor: 'pointer' }} title="Delete">
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
              {visibleDestinations.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '48px 16px', textAlign: 'center', color: '#64748b' }}>
                    No destinations found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <DestinationFormModal
          existingDestination={editingDestination}
          initialValues={formValues}
          loading={formLoading}
          onClose={() => {
            setModalOpen(false)
            setEditingDestination(null)
            setFormValues(DEFAULT_FORM_VALUES)
            setActionError('')
          }}
          onSave={handleSave}
        />
      )}

      {deleteConfirmId !== null && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15, 23, 42, 0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '16px' }}>
          <div style={{ width: '100%', maxWidth: '420px', background: '#fff', borderRadius: '18px', padding: '28px', boxShadow: '0 24px 68px rgba(15, 23, 42, 0.18)', textAlign: 'center' }}>
            <div style={{ marginBottom: '18px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '52px', height: '52px', borderRadius: '50%', background: '#fee2e2', color: '#dc2626' }}>
              <Trash2 size={24} />
            </div>
            <h3 style={{ margin: '0 0 10px', fontSize: '20px', fontWeight: 700, color: '#0f172a' }}>Delete destination?</h3>
            <p style={{ margin: '0 0 24px', color: '#64748b', fontSize: '14px' }}>
              This action will remove the destination and its public card from the website.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', flexWrap: 'wrap' }}>
              <button type="button" onClick={() => setDeleteConfirmId(null)} style={{ background: '#f1f5f9', color: '#334155', border: 'none', padding: '10px 18px', borderRadius: '10px', cursor: 'pointer' }}>
                Cancel
              </button>
              <button type="button" onClick={handleDelete} disabled={formLoading} style={{ background: '#dc2626', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '10px', cursor: 'pointer', opacity: formLoading ? 0.7 : 1 }}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
