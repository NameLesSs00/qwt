import { useState, useEffect } from 'react'
import { X, Loader2, Tag, Percent, Euro, Globe, MapPin } from 'lucide-react'
import { createPromoCode, type DtoPromoCodeCreate } from '../../../../api/promoCodesApi'
import { getTrips, type DtoTripRead } from '../../../../api/tripsApi'

interface Props {
  onClose: () => void
  onSaved: () => void
}

type DiscountType = 'fixed' | 'percent'
type ScopeType = 'global' | 'trip'

export function PromoCodeFormModal({ onClose, onSaved }: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [discountType, setDiscountType] = useState<DiscountType>('fixed')
  const [discountValue, setDiscountValue] = useState<number>(0)
  const [limited, setLimited] = useState<number>(1)
  const [scope, setScope] = useState<ScopeType>('global')
  const [tripId, setTripId] = useState<string>('')

  const [trips, setTrips] = useState<DtoTripRead[]>([])
  const [tripsLoading, setTripsLoading] = useState(false)

  useEffect(() => {
    setTripsLoading(true)
    getTrips({ PageSize: 500 })
      .then(res => {
        setTrips(res.data || [])
        if (res.data && res.data.length > 0) {
          setTripId(String(res.data[0].id))
        }
      })
      .catch(() => {})
      .finally(() => {
        setTripsLoading(false)
      })
  }, [])

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    border: '1.5px solid #cbd5e1',
    borderRadius: '8px',
    fontSize: '14px',
    boxSizing: 'border-box' as const,
    outline: 'none',
    transition: 'border-color 0.2s',
  }
  const labelStyle = {
    display: 'block',
    marginBottom: '6px',
    fontSize: '12px',
    fontWeight: 600,
    color: '#64748b',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  }

  const handleSubmit = async () => {
    setError('')

    if (discountValue <= 0) {
      setError('Discount value must be greater than 0.')
      return
    }
    if (limited < 1) {
      setError('Usage limit must be at least 1.')
      return
    }
    if (scope === 'trip' && (!tripId || isNaN(Number(tripId)))) {
      setError('Please enter a valid Trip ID.')
      return
    }

    const payload: DtoPromoCodeCreate = {
      discountEuro: discountType === 'fixed' ? discountValue : null,
      discountpercent: discountType === 'percent' ? discountValue : null,
      limited,
      tripId: scope === 'trip' ? Number(tripId) : null,
    }

    setLoading(true)
    try {
      await createPromoCode(payload)
      onSaved()
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.response?.data?.Message || 'Failed to create promo code.')
    } finally {
      setLoading(false)
    }
  }

  const sectionTitle = (title: string) => (
    <p style={{ margin: '0 0 14px', fontWeight: 700, color: '#0f2f44', fontSize: '15px', display: 'flex', alignItems: 'center', gap: '8px' }}>
      {title}
    </p>
  )

  return (
    <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px' }}>
      <div style={{ background: '#fff', borderRadius: '16px', width: '100%', maxWidth: '520px', maxHeight: '92vh', display: 'flex', flexDirection: 'column', boxShadow: '0 20px 60px rgba(0,0,0,0.18)' }}>

        {/* Header */}
        <div style={{ padding: '22px 26px 18px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #1e659e, #2b8dd6)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Tag size={18} color="#fff" />
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '18px', color: '#0f2f44', fontWeight: 700 }}>New Promo Code</h3>
              <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#94a3b8' }}>Fill in the details below</p>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#94a3b8', padding: '4px', borderRadius: '6px' }}>
            <X size={22} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '26px', overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '28px' }}>

          {/* Error */}
          {error && (
            <div style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#b91c1c', padding: '12px 16px', borderRadius: '8px', fontSize: '14px' }}>
              {error}
            </div>
          )}

          {/* Section 1 — Discount Type */}
          <div>
            {sectionTitle('Discount Type')}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {/* Fixed */}
              <button
                type="button"
                onClick={() => setDiscountType('fixed')}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  padding: '18px 14px', border: `2px solid ${discountType === 'fixed' ? '#1e659e' : '#e2e8f0'}`,
                  borderRadius: '12px', background: discountType === 'fixed' ? '#eff6ff' : '#fff',
                  cursor: 'pointer', transition: 'all 0.2s', gap: '8px'
                }}
              >
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: discountType === 'fixed' ? '#1e659e' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}>
                  <Euro size={16} color={discountType === 'fixed' ? '#fff' : '#94a3b8'} />
                </div>
                <span style={{ fontSize: '13px', fontWeight: 600, color: discountType === 'fixed' ? '#1e659e' : '#64748b' }}>Fixed Amount</span>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>Euros off</span>
              </button>

              {/* Percentage */}
              <button
                type="button"
                onClick={() => setDiscountType('percent')}
                style={{
                  display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                  padding: '18px 14px', border: `2px solid ${discountType === 'percent' ? '#1e659e' : '#e2e8f0'}`,
                  borderRadius: '12px', background: discountType === 'percent' ? '#eff6ff' : '#fff',
                  cursor: 'pointer', transition: 'all 0.2s', gap: '8px'
                }}
              >
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: discountType === 'percent' ? '#1e659e' : '#f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background 0.2s' }}>
                  <Percent size={16} color={discountType === 'percent' ? '#fff' : '#94a3b8'} />
                </div>
                <span style={{ fontSize: '13px', fontWeight: 600, color: discountType === 'percent' ? '#1e659e' : '#64748b' }}>Percentage</span>
                <span style={{ fontSize: '11px', color: '#94a3b8' }}>% off</span>
              </button>
            </div>
          </div>

          {/* Section 2 — Amount & Limit */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={labelStyle}>
                Discount Amount <span style={{ color: '#ef4444' }}>*</span>
                <span style={{ marginLeft: '6px', fontWeight: 400, textTransform: 'none', letterSpacing: 0, color: '#94a3b8' }}>
                  ({discountType === 'fixed' ? '€' : '%'})
                </span>
              </label>
              <input
                type="number"
                min={1}
                max={discountType === 'percent' ? 100 : undefined}
                step={discountType === 'percent' ? 1 : 0.01}
                value={discountValue}
                onChange={e => setDiscountValue(Number(e.target.value))}
                style={inputStyle}
                placeholder={discountType === 'fixed' ? 'e.g. 20' : 'e.g. 15'}
              />
            </div>

            <div>
              <label style={labelStyle}>
                Usage Limit <span style={{ color: '#ef4444' }}>*</span>
              </label>
              <input
                type="number"
                min={1}
                value={limited}
                onChange={e => setLimited(Number(e.target.value))}
                style={inputStyle}
                placeholder="e.g. 50"
              />
            </div>
          </div>

          {/* Section 3 — Scope */}
          <div>
            {sectionTitle('Scope')}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: scope === 'trip' ? '14px' : 0 }}>
              {/* Global */}
              <button
                type="button"
                onClick={() => setScope('global')}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  padding: '14px', border: `2px solid ${scope === 'global' ? '#1e659e' : '#e2e8f0'}`,
                  borderRadius: '12px', background: scope === 'global' ? '#eff6ff' : '#fff',
                  cursor: 'pointer', transition: 'all 0.2s'
                }}
              >
                <Globe size={16} color={scope === 'global' ? '#1e659e' : '#94a3b8'} />
                <span style={{ fontSize: '13px', fontWeight: 600, color: scope === 'global' ? '#1e659e' : '#64748b' }}>Global</span>
              </button>

              {/* Trip-specific */}
              <button
                type="button"
                onClick={() => setScope('trip')}
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                  padding: '14px', border: `2px solid ${scope === 'trip' ? '#1e659e' : '#e2e8f0'}`,
                  borderRadius: '12px', background: scope === 'trip' ? '#eff6ff' : '#fff',
                  cursor: 'pointer', transition: 'all 0.2s'
                }}
              >
                <MapPin size={16} color={scope === 'trip' ? '#1e659e' : '#94a3b8'} />
                <span style={{ fontSize: '13px', fontWeight: 600, color: scope === 'trip' ? '#1e659e' : '#64748b' }}>Trip-Specific</span>
              </button>
            </div>

            {scope === 'global' && (
              <p style={{ margin: 0, fontSize: '13px', color: '#64748b', background: '#f8fafc', padding: '10px 14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                This code will be valid for <strong>all trips</strong>.
              </p>
            )}

            {scope === 'trip' && (
              <div>
                <label style={labelStyle}>
                  Select Trip <span style={{ color: '#ef4444' }}>*</span>
                </label>
                {tripsLoading ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px', border: '1.5px solid #cbd5e1', borderRadius: '8px', background: '#f8fafc' }}>
                    <Loader2 size={16} className="animate-spin" color="#1e659e" />
                    <span style={{ fontSize: '14px', color: '#64748b' }}>Loading trips...</span>
                  </div>
                ) : trips.length === 0 ? (
                  <div style={{ padding: '10px 14px', border: '1.5px solid #ef4444', borderRadius: '8px', background: '#fef2f2', color: '#b91c1c', fontSize: '13px' }}>
                    No trips found. Please create a trip first!
                  </div>
                ) : (
                  <select
                    value={tripId}
                    onChange={e => setTripId(e.target.value)}
                    style={inputStyle}
                  >
                    {trips.map(t => (
                      <option key={t.id} value={t.id}>
                        #{t.id} — {t.name} ({t.destination})
                      </option>
                    ))}
                  </select>
                )}
                <p style={{ margin: '6px 0 0', fontSize: '12px', color: '#94a3b8' }}>
                  Choose which trip this promo code will apply to.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div style={{ padding: '18px 26px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0, background: '#fafafa', borderRadius: '0 0 16px 16px' }}>
          <button
            onClick={onClose}
            style={{ padding: '10px 20px', background: '#f1f5f9', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 500, color: '#475569', fontSize: '14px' }}
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 24px', background: loading ? '#7bafd0' : '#1e659e', color: '#fff', border: 'none', borderRadius: '8px', cursor: loading ? 'not-allowed' : 'pointer', fontWeight: 600, fontSize: '14px', transition: 'background 0.2s' }}
          >
            {loading && <Loader2 size={16} className="animate-spin" />}
            {loading ? 'Creating…' : 'Create Promo Code'}
          </button>
        </div>
      </div>
    </div>
  )
}
