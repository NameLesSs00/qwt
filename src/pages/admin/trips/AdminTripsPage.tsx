import { useState, useEffect } from 'react'
import {
  Plus, Edit2, Loader2, X, AlertCircle,
  ToggleLeft, ToggleRight, Image, ChevronRight, ChevronLeft
} from 'lucide-react'
import {
  getTrips, deactivateTrip, reactivateTrip, getTripImageUrl,
  type DtoTripRead
} from '../../../api/tripsApi'
import { getTripTypes, type TripTypeDto } from '../../../api/tripTypesApi'
import '../../../components/admin/admin.scss'
import { TripFormModal } from './components/TripFormModal'
import { TripImageManager } from './components/TripImageManager'

export function AdminTripsPage() {
  const [trips, setTrips] = useState<DtoTripRead[]>([])
  const [tripTypes, setTripTypes] = useState<TripTypeDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')

  // Filters
  const [search, setSearch] = useState('')
  const [destination, setDestination] = useState('')
  const [minPrice, setMinPrice] = useState<number | ''>('')
  const [maxPrice, setMaxPrice] = useState<number | ''>('')
  const [typeFilter, setTypeFilter] = useState<number | ''>('')
  const [includeInactive, setIncludeInactive] = useState(false)
  
  // Pagination
  const [pageNumber, setPageNumber] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  // Modals
  const [formModal, setFormModal] = useState<{ open: boolean; tripId?: number }>({ open: false })
  const [imageManagerTripId, setImageManagerTripId] = useState<number | null>(null)

  const fetchTrips = async () => {
    try {
      setLoading(true)
      setActionError('')
      const res = await getTrips({
        PageNumber: pageNumber,
        PageSize: pageSize,
        SearchItem: search || undefined,
        Destination: destination || undefined,
        MinPrice: minPrice !== '' ? Number(minPrice) : undefined,
        MaxPrice: maxPrice !== '' ? Number(maxPrice) : undefined,
        TypeId: typeFilter || undefined,
        includeInactive
      })
      setTrips(res.data || [])
    } catch {
      setError('Failed to load trips.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getTripTypes(1, 100).then(r => setTripTypes(r.data || []))
  }, [])

  // Reset page to 1 when any filter changes
  useEffect(() => {
    setPageNumber(1)
  }, [search, destination, minPrice, maxPrice, typeFilter, includeInactive, pageSize])

  // Fetch when filters or page changes
  useEffect(() => { 
    fetchTrips() 
  }, [pageNumber, pageSize, search, destination, minPrice, maxPrice, typeFilter, includeInactive])

  const handleToggleActive = async (trip: DtoTripRead) => {
    try {
      setActionError('')
      if (trip.isActive) {
        await deactivateTrip(trip.id)
      } else {
        await reactivateTrip(trip.id)
      }
      fetchTrips()
    } catch (err: any) {
      const msg = err?.response?.data?.Message || err?.response?.data?.message || 'Failed to update trip status.'
      setActionError(msg)
    }
  }

  const primaryImage = (trip: DtoTripRead) => {
    const primary = trip.images?.find(i => i.isPrimary)
    const first = trip.images?.[0]
    return getTripImageUrl((primary || first)?.imageUrl || null)
  }

  return (
    <div className="admin-page">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 600, color: '#0f2f44', margin: 0 }}>Trips</h2>
        <button
          onClick={() => setFormModal({ open: true })}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#1e659e', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '8px', cursor: 'pointer', fontWeight: 500 }}
        >
          <Plus size={18} /> Create Trip
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            type="text"
            placeholder="Search trips..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ padding: '9px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', flex: '1 1 200px' }}
          />
          <input
            type="text"
            placeholder="Destination..."
            value={destination}
            onChange={e => setDestination(e.target.value)}
            style={{ padding: '9px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', flex: '1 1 160px' }}
          />
          <select
            value={typeFilter}
            onChange={e => setTypeFilter(e.target.value ? Number(e.target.value) : '')}
            style={{ padding: '9px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', flex: '1 1 160px' }}
          >
            <option value="">All Types</option>
            {tripTypes.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        </div>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '14px', color: '#475569' }}>Price:</span>
            <input
              type="number"
              placeholder="Min"
              value={minPrice}
              onChange={e => setMinPrice(e.target.value ? Number(e.target.value) : '')}
              style={{ padding: '9px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', width: '100px' }}
            />
            <span style={{ color: '#94a3b8' }}>-</span>
            <input
              type="number"
              placeholder="Max"
              value={maxPrice}
              onChange={e => setMaxPrice(e.target.value ? Number(e.target.value) : '')}
              style={{ padding: '9px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', width: '100px' }}
            />
          </div>
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#475569' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', userSelect: 'none' }}>
              <input type="checkbox" checked={includeInactive} onChange={e => setIncludeInactive(e.target.checked)} />
              Include Inactive
            </label>
          </div>
        </div>
      </div>

      {/* Error Banner */}
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
        <div style={{ color: '#b91c1c', textAlign: 'center', padding: '40px' }}>{error}</div>
      ) : (
        <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
              <tr>
                <th style={{ padding: '14px 16px', fontWeight: 600, color: '#475569', fontSize: '12px', width: '60px' }}>IMG</th>
                <th style={{ padding: '14px 16px', fontWeight: 600, color: '#475569', fontSize: '12px' }}>NAME</th>
                <th style={{ padding: '14px 16px', fontWeight: 600, color: '#475569', fontSize: '12px' }}>DESTINATION</th>
                <th style={{ padding: '14px 16px', fontWeight: 600, color: '#475569', fontSize: '12px' }}>TYPE</th>
                <th style={{ padding: '14px 16px', fontWeight: 600, color: '#475569', fontSize: '12px' }}>PRICE (Adult/Child)</th>
                <th style={{ padding: '14px 16px', fontWeight: 600, color: '#475569', fontSize: '12px' }}>STATUS</th>
                <th style={{ padding: '14px 16px', fontWeight: 600, color: '#475569', fontSize: '12px', textAlign: 'right' }}>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {trips.map(trip => (
                <tr key={trip.id} style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  <td style={{ padding: '12px 16px' }}>
                    {primaryImage(trip) ? (
                      <img src={primaryImage(trip)} alt="" style={{ width: '44px', height: '44px', objectFit: 'cover', borderRadius: '6px', border: '1px solid #e2e8f0' }} />
                    ) : (
                      <div style={{ width: '44px', height: '44px', background: '#f1f5f9', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Image size={16} color="#94a3b8" />
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <div style={{ fontWeight: 600, color: '#0f2f44', fontSize: '14px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{trip.name}</div>
                    <div style={{ fontSize: '11px', color: '#94a3b8', marginTop: '2px' }}>ID #{trip.id} · {trip.markerID}</div>
                  </td>
                  <td style={{ padding: '12px 16px', color: '#475569', fontSize: '14px' }}>{trip.destination}</td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ background: '#eff6ff', color: '#1d4ed8', padding: '3px 8px', borderRadius: '99px', fontSize: '12px', fontWeight: 500 }}>{trip.tripTypeName || '—'}</span>
                  </td>
                  <td style={{ padding: '12px 16px', fontSize: '14px', color: '#0f2f44' }}>
                    €{trip.adultPrice} / €{trip.childPrice}
                  </td>
                  <td style={{ padding: '12px 16px' }}>
                    <span style={{ background: trip.isActive ? '#f0fdf4' : '#fef2f2', color: trip.isActive ? '#16a34a' : '#ef4444', padding: '3px 10px', borderRadius: '99px', fontSize: '12px', fontWeight: 600 }}>
                      {trip.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td style={{ padding: '12px 16px', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center' }}>
                      <button title="Edit" onClick={() => setFormModal({ open: true, tripId: trip.id })} style={{ background: 'none', border: 'none', color: '#3b82f6', cursor: 'pointer', padding: '4px' }}><Edit2 size={16} /></button>
                      <button title="Manage Images" onClick={() => setImageManagerTripId(trip.id)} style={{ background: 'none', border: 'none', color: '#8b5cf6', cursor: 'pointer', padding: '4px' }}><Image size={16} /></button>
                      <button title={trip.isActive ? 'Deactivate' : 'Reactivate'} onClick={() => handleToggleActive(trip)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', color: trip.isActive ? '#ef4444' : '#16a34a' }}>
                        {trip.isActive ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {trips.length === 0 && (
                <tr><td colSpan={7} style={{ padding: '60px', textAlign: 'center', color: '#64748b' }}>No trips found. Create your first trip!</td></tr>
              )}
            </tbody>
          </table>
          
          {/* Pagination Footer */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '13px', color: '#64748b' }}>Items per page:</span>
              <select
                value={pageSize}
                onChange={e => setPageSize(Number(e.target.value))}
                style={{ padding: '6px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px' }}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              <span style={{ fontSize: '13px', color: '#475569', fontWeight: 500 }}>
                Page {pageNumber}
              </span>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  onClick={() => setPageNumber(prev => Math.max(1, prev - 1))}
                  disabled={pageNumber === 1}
                  style={{ display: 'flex', alignItems: 'center', padding: '6px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: pageNumber === 1 ? 'not-allowed' : 'pointer', opacity: pageNumber === 1 ? 0.5 : 1 }}
                >
                  <ChevronLeft size={16} color="#475569" />
                </button>
                <button
                  onClick={() => setPageNumber(prev => prev + 1)}
                  disabled={trips.length < pageSize}
                  style={{ display: 'flex', alignItems: 'center', padding: '6px', background: '#fff', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: trips.length < pageSize ? 'not-allowed' : 'pointer', opacity: trips.length < pageSize ? 0.5 : 1 }}
                >
                  <ChevronRight size={16} color="#475569" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modals */}
      {formModal.open && (
        <TripFormModal
          tripId={formModal.tripId}
          tripTypes={tripTypes}
          onClose={() => setFormModal({ open: false })}
          onSaved={() => { setFormModal({ open: false }); fetchTrips() }}
        />
      )}
      {imageManagerTripId && (
        <TripImageManager
          tripId={imageManagerTripId}
          onClose={() => { setImageManagerTripId(null); fetchTrips() }}
        />
      )}
    </div>
  )
}
