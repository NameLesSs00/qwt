import { useState, useEffect } from 'react'
import { Loader2, Calendar, CreditCard, Users, TrendingUp, AlertCircle, RefreshCw, Trash2 } from 'lucide-react'
import { getDailyReport, getMonthlyReport, getYearlyReport, type ReportEntity } from '../../../api/reportsApi'
import '../../../components/admin/admin.scss'

export function AdminReportsPage() {
  const [daily, setDaily] = useState<ReportEntity | null>(null)
  const [monthly, setMonthly] = useState<ReportEntity | null>(null)
  const [yearly, setYearly] = useState<ReportEntity | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchReports = async () => {
    try {
      setLoading(true)
      setError('')
      const [d, m, y] = await Promise.all([
        getDailyReport(),
        getMonthlyReport(),
        getYearlyReport()
      ])
      
      setDaily(d.data || null)
      setMonthly(m.data || null)
      setYearly(y.data || null)
    } catch (err: any) {
      setError('Failed to load reports. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReports()
  }, [])



  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' }).format(amount)
  }

  const ReportSection = ({ title, data }: { title: string, data: ReportEntity | null }) => {
    const isEmpty = !data || (data.totalBookings === 0 && data.totalRevenue === 0 && data.newCustomers === 0)

    return (
      <div style={{ marginBottom: '40px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: 600, color: '#0f2f44', marginBottom: '20px', paddingBottom: '12px', borderBottom: '2px solid #e2e8f0' }}>{title}</h3>
        
        {isEmpty ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '48px 24px', background: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1', color: '#64748b' }}>
            <AlertCircle size={32} style={{ marginBottom: '12px', opacity: 0.5 }} />
            <p style={{ margin: 0, fontSize: '15px' }}>No data available for this period.</p>
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
              {/* Revenue Card */}
              <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: '#ecfdf5', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CreditCard size={28} />
                </div>
                <div>
                  <p style={{ margin: '0 0 6px', color: '#64748b', fontSize: '14px', fontWeight: 500 }}>Total Revenue</p>
                  <h4 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#0f2f44' }}>{formatCurrency(data.totalRevenue)}</h4>
                </div>
              </div>

              {/* Bookings Card */}
              <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: '#eff6ff', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Calendar size={28} />
                </div>
                <div>
                  <p style={{ margin: '0 0 6px', color: '#64748b', fontSize: '14px', fontWeight: 500 }}>Total Bookings</p>
                  <h4 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#0f2f44' }}>{data.totalBookings}</h4>
                </div>
              </div>

              {/* Customers Card */}
              <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
                <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: '#fdf4ff', color: '#d946ef', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Users size={28} />
                </div>
                <div>
                  <p style={{ margin: '0 0 6px', color: '#64748b', fontSize: '14px', fontWeight: 500 }}>New Customers</p>
                  <h4 style={{ margin: 0, fontSize: '24px', fontWeight: 700, color: '#0f2f44' }}>{data.newCustomers}</h4>
                </div>
              </div>
            </div>

            {/* Top Trips Table */}
            <div style={{ background: '#fff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
              <div style={{ padding: '20px', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <TrendingUp size={20} color="#0f2f44" />
                <h4 style={{ margin: 0, fontSize: '16px', fontWeight: 600, color: '#0f2f44' }}>Top Performing Trips</h4>
              </div>
              {data.topTrips && data.topTrips.length > 0 ? (
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                  <thead style={{ background: '#f8fafc' }}>
                    <tr>
                      <th style={{ padding: '16px 20px', fontWeight: 600, color: '#475569', fontSize: '13px' }}>Trip Title</th>
                      <th style={{ padding: '16px 20px', fontWeight: 600, color: '#475569', fontSize: '13px', textAlign: 'right', width: '150px' }}>Bookings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.topTrips.map((trip, idx) => (
                      <tr key={idx} style={{ borderTop: '1px solid #e2e8f0' }}>
                        <td style={{ padding: '16px 20px', color: '#0f2f44', fontSize: '14px', fontWeight: 500 }}>{trip.tripTitle || 'Unknown Trip'}</td>
                        <td style={{ padding: '16px 20px', color: '#64748b', fontSize: '14px', textAlign: 'right' }}>{trip.bookingCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div style={{ padding: '32px', textAlign: 'center', color: '#64748b', fontSize: '14px' }}>No trips booked in this period.</div>
              )}
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="admin-page">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#0f2f44', margin: '0 0 8px' }}>Reports & Analytics</h2>
          <p style={{ color: '#64748b', margin: 0 }}>Overview of bookings, revenue, and customer metrics.</p>
        </div>
      </div>

      {loading && !daily ? (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
          <Loader2 className="animate-spin" size={48} color="#1e659e" style={{ marginBottom: '16px' }} />
          <p style={{ color: '#64748b' }}>Crunching numbers...</p>
        </div>
      ) : error ? (
        <div style={{ display: 'flex', gap: '12px', background: '#fef2f2', border: '1px solid #fee2e2', color: '#b91c1c', padding: '16px', borderRadius: '12px', marginBottom: '24px' }}>
          <AlertCircle size={20} style={{ flexShrink: 0 }} />
          <span>{error}</span>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <ReportSection title="Today's Performance" data={daily} />
          <ReportSection title="This Month" data={monthly} />
          <ReportSection title="Year to Date" data={yearly} />
        </div>
      )}
    </div>
  )
}
