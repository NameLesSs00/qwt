import { useState, useEffect } from 'react'
import { Plus, Loader2, AlertCircle, X, Tag, Globe, MapPin, Euro, Percent } from 'lucide-react'
import {
  getPromoCodes, getGlobalPromoCodes, getTripPromoCodes,
  type DtoPromoCodeRead, type DtoPromoCodeNonDetails
} from '../../../api/promoCodesApi'
import '../../../components/admin/admin.scss'
import { PromoCodeFormModal } from './components/PromoCodeFormModal'

type Tab = 'all' | 'global' | 'trip'

type AnyPromoCode = DtoPromoCodeRead | DtoPromoCodeNonDetails

function isFullCode(code: AnyPromoCode): code is DtoPromoCodeRead {
  return 'tripId' in code
}

export function AdminPromoCodesPage() {
  const [codes, setCodes] = useState<AnyPromoCode[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [activeTab, setActiveTab] = useState<Tab>('all')
  const [showCreateModal, setShowCreateModal] = useState(false)

  const fetchCodes = async (tab: Tab = activeTab) => {
    setLoading(true)
    setError('')
    try {
      let result: AnyPromoCode[] = []
      if (tab === 'all') {
        const res = await getPromoCodes()
        result = res.data || []
      } else if (tab === 'global') {
        const res = await getGlobalPromoCodes()
        result = res.data || []
      } else {
        const res = await getTripPromoCodes()
        result = res.data || []
      }
      setCodes(result)
    } catch {
      setError('Failed to load promo codes.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchCodes(activeTab) }, [activeTab])

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab)
    setActionError('')
  }

  const formatDiscount = (code: AnyPromoCode) => {
    if (code.discountEuro != null) {
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#f0fdf4', color: '#16a34a', padding: '3px 10px', borderRadius: '99px', fontSize: '12px', fontWeight: 700 }}>
          <Euro size={11} />€{code.discountEuro} off
        </span>
      )
    }
    if (code.discountpercent != null) {
      return (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#fef9c3', color: '#ca8a04', padding: '3px 10px', borderRadius: '99px', fontSize: '12px', fontWeight: 700 }}>
          <Percent size={11} />{code.discountpercent}% off
        </span>
      )
    }
    return <span style={{ color: '#94a3b8' }}>—</span>
  }

  const tabs: { key: Tab; label: string; icon: React.ReactNode }[] = [
    { key: 'all',    label: 'All Codes',     icon: <Tag size={14} /> },
    { key: 'global', label: 'Global',        icon: <Globe size={14} /> },
    { key: 'trip',   label: 'Trip-Specific', icon: <MapPin size={14} /> },
  ]

  return (
    <div className="admin-page">

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#0f2f44', margin: 0 }}>Promo Codes</h2>
          <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>
            Create and manage discount codes for your trips
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#1e659e', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '8px', cursor: 'pointer', fontWeight: 600, fontSize: '14px' }}
        >
          <Plus size={18} /> Create Promo Code
        </button>
      </div>

      {/* Tab Bar */}
      <div style={{ display: 'flex', gap: '4px', background: '#f1f5f9', padding: '4px', borderRadius: '10px', width: 'fit-content', marginBottom: '20px' }}>
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => handleTabChange(tab.key)}
            style={{
              display: 'flex', alignItems: 'center', gap: '6px',
              padding: '8px 16px', border: 'none', borderRadius: '7px', cursor: 'pointer',
              fontSize: '13px', fontWeight: activeTab === tab.key ? 600 : 400,
              background: activeTab === tab.key ? '#fff' : 'transparent',
              color: activeTab === tab.key ? '#1e659e' : '#64748b',
              boxShadow: activeTab === tab.key ? '0 1px 4px rgba(0,0,0,0.08)' : 'none',
              transition: 'all 0.18s'
            }}
          >
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      {/* Action Error */}
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
                <th style={{ padding: '14px 16px', fontWeight: 600, color: '#475569', fontSize: '12px' }}>CODE</th>
                <th style={{ padding: '14px 16px', fontWeight: 600, color: '#475569', fontSize: '12px' }}>DISCOUNT</th>
                <th style={{ padding: '14px 16px', fontWeight: 600, color: '#475569', fontSize: '12px' }}>USAGE LIMIT</th>
                <th style={{ padding: '14px 16px', fontWeight: 600, color: '#475569', fontSize: '12px' }}>SCOPE</th>
              </tr>
            </thead>
            <tbody>
              {codes.map(code => (
                <tr
                  key={code.id}
                  style={{ borderBottom: '1px solid #f1f5f9', transition: 'background 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.background = '#f8fafc')}
                  onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                >
                  {/* Code */}
                  <td style={{ padding: '14px 16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{ width: '32px', height: '32px', background: '#eff6ff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <Tag size={14} color="#1e659e" />
                      </div>
                      <div>
                        <div style={{ fontWeight: 700, color: '#0f2f44', fontSize: '14px', fontFamily: 'monospace', letterSpacing: '0.5px' }}>
                          {code.code ?? '—'}
                        </div>
                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>ID #{code.id}</div>
                      </div>
                    </div>
                  </td>

                  {/* Discount */}
                  <td style={{ padding: '14px 16px' }}>
                    {formatDiscount(code)}
                  </td>

                  {/* Usage Limit */}
                  <td style={{ padding: '14px 16px' }}>
                    <span style={{ fontWeight: 600, color: '#0f2f44', fontSize: '14px' }}>
                      {code.limited}
                    </span>
                    <span style={{ fontSize: '12px', color: '#94a3b8', marginLeft: '4px' }}>uses</span>
                  </td>

                  {/* Scope */}
                  <td style={{ padding: '14px 16px' }}>
                    {isFullCode(code) && code.tripId != null ? (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: '#f5f3ff', color: '#7c3aed', padding: '3px 10px', borderRadius: '99px', fontSize: '12px', fontWeight: 600 }}>
                        <MapPin size={11} /> Trip #{code.tripId}
                        {code.tripName ? ` — ${code.tripName}` : ''}
                      </span>
                    ) : (
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: '#f0fdf4', color: '#16a34a', padding: '3px 10px', borderRadius: '99px', fontSize: '12px', fontWeight: 600 }}>
                        <Globe size={11} /> Global
                      </span>
                    )}
                  </td>
                </tr>
              ))}

              {codes.length === 0 && (
                <tr>
                  <td colSpan={4} style={{ padding: '60px', textAlign: 'center' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', color: '#94a3b8' }}>
                      <Tag size={36} style={{ opacity: 0.4 }} />
                      <p style={{ margin: 0, fontSize: '15px', fontWeight: 500 }}>No promo codes found</p>
                      <p style={{ margin: 0, fontSize: '13px' }}>
                        {activeTab === 'all' ? 'Create your first promo code using the button above.' : `No ${activeTab === 'global' ? 'global' : 'trip-specific'} codes yet.`}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Create Modal */}
      {showCreateModal && (
        <PromoCodeFormModal
          onClose={() => setShowCreateModal(false)}
          onSaved={() => { setShowCreateModal(false); fetchCodes(activeTab) }}
        />
      )}
    </div>
  )
}
