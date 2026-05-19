import { useState, useEffect } from 'react';
import { Loader2, Trash2, CheckCircle, Flag, XCircle, Search, Phone, Globe, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import {
  getBookings,
  deleteBooking,
  confirmBooking,
  finishBooking,
  BookingStatus,
  type DtoBookRead
} from '../../../api/bookingsApi';
import '../../../components/admin/admin.scss';
import { useToast } from '../../../components/toast/ToastProvider';

export function AdminBookingsPage() {
  const [bookings, setBookings] = useState<DtoBookRead[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionError, setActionError] = useState('');
  const { toast, confirm } = useToast();

  // Filters
  const [search, setSearch] = useState('');
  const [phone, setPhone] = useState('');
  const [nationality, setNationality] = useState('');
  const [statusFilter, setStatusFilter] = useState<BookingStatus | ''>('');
  
  // Pagination
  const [pageNumber, setPageNumber] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setActionError('');
      const res = await getBookings({
        PageNumber: pageNumber,
        PageSize: pageSize,
        SearchItem: search || undefined,
        Phone: phone || undefined,
        Nationality: nationality || undefined,
        Status: statusFilter === '' ? undefined : statusFilter,
      });
      setBookings(res.data || []);
    } catch {
      setError('Failed to load bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPageNumber(1);
  }, [search, phone, nationality, statusFilter, pageSize]);

  useEffect(() => {
    fetchBookings();
  }, [pageNumber, pageSize, search, phone, nationality, statusFilter]);

  const handleDelete = async (id: number) => {
    const ok = await confirm({
      title: 'Cancel Booking',
      message: 'Are you sure you want to cancel this booking? This action cannot be undone.',
      confirmLabel: 'Cancel Booking',
      danger: true
    });
    if (!ok) return;
    try {
      setActionError('');
      await deleteBooking(id);
      fetchBookings();
      toast.success('Booking cancelled successfully');
    } catch (err: any) {
      const msg = err?.response?.data?.Message || 'Failed to cancel booking.';
      setActionError(msg);
      toast.error(msg);
    }
  };

  const handleConfirm = async (id: number) => {
    try {
      setActionError('');
      await confirmBooking(id);
      fetchBookings();
      toast.success('Booking confirmed!');
    } catch (err: any) {
      const msg = err?.response?.data?.Message || 'Failed to confirm booking.';
      setActionError(msg);
      toast.error(msg);
    }
  };

  const handleFinish = async (id: number) => {
    try {
      setActionError('');
      await finishBooking(id);
      fetchBookings();
      toast.success('Booking marked as finished!');
    } catch (err: any) {
      const msg = err?.response?.data?.Message || 'Failed to finish booking.';
      setActionError(msg);
      toast.error(msg);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return <span style={{ background: '#fffbeb', color: '#b45309', border: '1px solid #fde68a', padding: '6px 12px', borderRadius: '999px', fontSize: '13px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}><div style={{width: 6, height: 6, borderRadius: '50%', background: '#b45309'}}/> Pending</span>;
      case 'Confirmed':
        return <span style={{ background: '#ecfdf5', color: '#047857', border: '1px solid #a7f3d0', padding: '6px 12px', borderRadius: '999px', fontSize: '13px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}><div style={{width: 6, height: 6, borderRadius: '50%', background: '#047857'}}/> Confirmed</span>;
      case 'Finished':
        return <span style={{ background: '#eff6ff', color: '#1d4ed8', border: '1px solid #bfdbfe', padding: '6px 12px', borderRadius: '999px', fontSize: '13px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}><div style={{width: 6, height: 6, borderRadius: '50%', background: '#1d4ed8'}}/> Finished</span>;
      case 'Cancelled':
        return <span style={{ background: '#fef2f2', color: '#b91c1c', border: '1px solid #fecaca', padding: '6px 12px', borderRadius: '999px', fontSize: '13px', fontWeight: 600, display: 'inline-flex', alignItems: 'center', gap: '6px' }}><div style={{width: 6, height: 6, borderRadius: '50%', background: '#b91c1c'}}/> Cancelled</span>;
      default:
        return null;
    }
  };

  const TABS = [
    { label: 'All Bookings', value: '' },
    { label: 'Pending', value: BookingStatus.Pending },
    { label: 'Confirmed', value: BookingStatus.Confirmed },
    { label: 'Finished', value: BookingStatus.Finished },
    { label: 'Cancelled', value: BookingStatus.Cancelled }
  ];

  return (
    <div className="admin-page" style={{ background: '#f8fafc', minHeight: '100vh', padding: '32px' }}>
      
      {/* Header Section */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <div>
          <h2 style={{ fontSize: '28px', fontWeight: 700, color: '#0f172a', margin: '0 0 8px 0' }}>Manage Bookings</h2>
          <p style={{ color: '#64748b', margin: 0, fontSize: '15px' }}>Track, confirm, and manage customer trip reservations.</p>
        </div>
      </div>

      {/* Main Card */}
      <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
        
        {/* Filters Top Bar */}
        <div style={{ padding: '24px', borderBottom: '1px solid #e2e8f0' }}>
          
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', overflowX: 'auto', paddingBottom: '4px' }}>
            {TABS.map(tab => {
              const isActive = statusFilter === tab.value;
              return (
                <button
                  key={tab.label}
                  onClick={() => setStatusFilter(tab.value as any)}
                  style={{
                    padding: '8px 16px',
                    background: isActive ? '#f1f5f9' : 'transparent',
                    color: isActive ? '#0f172a' : '#64748b',
                    border: 'none',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: isActive ? 600 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Search Inputs */}
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <div style={{ position: 'relative', flex: '1 1 250px' }}>
              <Search size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Search name or email..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                style={{ width: '100%', padding: '10px 14px 10px 38px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s', background: '#f8fafc' }}
                onFocus={(e) => { e.target.style.background = '#fff'; e.target.style.borderColor = '#1e659e'; }}
                onBlur={(e) => { e.target.style.background = '#f8fafc'; e.target.style.borderColor = '#cbd5e1'; }}
              />
            </div>
            
            <div style={{ position: 'relative', flex: '1 1 200px' }}>
              <Phone size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Phone Number..."
                value={phone}
                onChange={e => setPhone(e.target.value)}
                style={{ width: '100%', padding: '10px 14px 10px 38px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s', background: '#f8fafc' }}
                onFocus={(e) => { e.target.style.background = '#fff'; e.target.style.borderColor = '#1e659e'; }}
                onBlur={(e) => { e.target.style.background = '#f8fafc'; e.target.style.borderColor = '#cbd5e1'; }}
              />
            </div>
            
            <div style={{ position: 'relative', flex: '1 1 200px' }}>
              <Globe size={18} color="#94a3b8" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)' }} />
              <input
                type="text"
                placeholder="Nationality..."
                value={nationality}
                onChange={e => setNationality(e.target.value)}
                style={{ width: '100%', padding: '10px 14px 10px 38px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s', background: '#f8fafc' }}
                onFocus={(e) => { e.target.style.background = '#fff'; e.target.style.borderColor = '#1e659e'; }}
                onBlur={(e) => { e.target.style.background = '#f8fafc'; e.target.style.borderColor = '#cbd5e1'; }}
              />
            </div>
          </div>
        </div>

        {/* Errors */}
        {actionError && (
          <div style={{ margin: '16px 24px 0', padding: '12px 16px', background: '#fef2f2', border: '1px solid #fca5a5', color: '#991b1b', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', fontWeight: 500 }}>
            <XCircle size={18} /> {actionError}
          </div>
        )}
        {error && (
          <div style={{ margin: '16px 24px 0', padding: '12px 16px', background: '#fef2f2', border: '1px solid #fca5a5', color: '#991b1b', borderRadius: '8px', fontSize: '14px', fontWeight: 500 }}>
            {error}
          </div>
        )}

        {/* Table View */}
        <div style={{ overflowX: 'auto', minHeight: '400px' }}>
          {loading ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', color: '#64748b' }}>
              <Loader2 className="animate-spin" size={36} color="#1e659e" style={{ marginBottom: '16px' }} />
              <span>Loading bookings...</span>
            </div>
          ) : bookings.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '300px', color: '#64748b' }}>
              <Calendar size={48} color="#cbd5e1" style={{ marginBottom: '16px' }} />
              <span style={{ fontSize: '16px', fontWeight: 500, color: '#475569' }}>No bookings found</span>
              <span style={{ fontSize: '14px', marginTop: '4px' }}>Try adjusting your search filters.</span>
            </div>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                  <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Order ID</th>
                  <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Customer Info</th>
                  <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Reserved Trips</th>
                  <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Amount</th>
                  <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                  <th style={{ padding: '16px 24px', fontSize: '13px', fontWeight: 600, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b.id} style={{ borderBottom: '1px solid #e2e8f0', transition: 'background 0.2s', ':hover': { background: '#f8fafc' } } as any}>
                    <td style={{ padding: '20px 24px', fontSize: '14px', color: '#64748b', fontWeight: 500 }}>
                      #{b.id}
                      <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px' }}>
                        {new Date(b.bookingDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                    </td>
                    
                    <td style={{ padding: '20px 24px' }}>
                      <div style={{ fontSize: '14px', fontWeight: 600, color: '#0f172a', marginBottom: '4px' }}>{b.firstName} {b.lastName}</div>
                      <div style={{ fontSize: '13px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                        {b.email}
                      </div>
                      <div style={{ fontSize: '12px', color: '#94a3b8', marginTop: '4px', display: 'flex', gap: '8px', alignItems: 'center' }}>
                        <span>{b.phone}</span>
                        <span style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#cbd5e1' }} />
                        <span>{b.nationality}</span>
                      </div>
                    </td>

                    <td style={{ padding: '20px 24px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {b.tripsBookings?.map((tb, idx) => (
                          <div key={idx} style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
                            <div style={{ fontSize: '13px', fontWeight: 600, color: '#334155', marginBottom: '4px' }}>
                              {tb.title || `Trip #${tb.tripId}`}
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px', color: '#64748b' }}>
                              <span>{new Date(tb.leaveDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                              <span style={{ background: '#e2e8f0', padding: '2px 6px', borderRadius: '4px', fontWeight: 500, color: '#475569' }}>
                                {tb.noAdult + tb.noChild} Guests
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </td>

                    <td style={{ padding: '20px 24px' }}>
                      <div style={{ fontSize: '16px', fontWeight: 700, color: '#0f172a' }}>€{b.totalPrice}</div>
                      {b.code && <div style={{ fontSize: '12px', color: '#10b981', marginTop: '4px', fontWeight: 500 }}>Promo applied</div>}
                    </td>

                    <td style={{ padding: '20px 24px' }}>
                      {getStatusBadge(b.status)}
                    </td>

                    <td style={{ padding: '20px 24px', textAlign: 'right' }}>
                      <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                        {b.status === 'Pending' && (
                          <button
                            onClick={() => handleConfirm(b.id)}
                            title="Confirm Booking"
                            style={{ background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#059669', padding: '8px', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            onMouseOver={e => e.currentTarget.style.background = '#d1fae5'}
                            onMouseOut={e => e.currentTarget.style.background = '#ecfdf5'}
                          >
                            <CheckCircle size={18} />
                          </button>
                        )}
                        {b.status === 'Confirmed' && (
                          <button
                            onClick={() => handleFinish(b.id)}
                            title="Mark as Finished"
                            style={{ background: '#eff6ff', border: '1px solid #bfdbfe', color: '#2563eb', padding: '8px', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            onMouseOver={e => e.currentTarget.style.background = '#dbeafe'}
                            onMouseOut={e => e.currentTarget.style.background = '#eff6ff'}
                          >
                            <Flag size={18} />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(b.id)}
                          disabled={b.status === 'Cancelled' || b.status === 'Finished'}
                          title={b.status === 'Cancelled' ? "Booking is already cancelled" : b.status === 'Finished' ? "Booking is finished" : "Cancel Booking"}
                          style={{
                            background: (b.status === 'Cancelled' || b.status === 'Finished') ? '#f1f5f9' : '#fef2f2',
                            border: `1px solid ${(b.status === 'Cancelled' || b.status === 'Finished') ? '#e2e8f0' : '#fecaca'}`,
                            color: (b.status === 'Cancelled' || b.status === 'Finished') ? '#94a3b8' : '#dc2626',
                            padding: '8px',
                            borderRadius: '8px',
                            cursor: (b.status === 'Cancelled' || b.status === 'Finished') ? 'not-allowed' : 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                          onMouseOver={e => {
                            if (b.status !== 'Cancelled' && b.status !== 'Finished') {
                              e.currentTarget.style.background = '#fee2e2';
                            }
                          }}
                          onMouseOut={e => {
                            if (b.status !== 'Cancelled' && b.status !== 'Finished') {
                              e.currentTarget.style.background = '#fef2f2';
                            }
                          }}
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer / Pagination */}
        {!loading && bookings.length > 0 && (
          <div style={{ padding: '20px 24px', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '13px', color: '#64748b', fontWeight: 500 }}>Rows per page:</span>
              <select
                value={pageSize}
                onChange={e => {
                  setPageSize(Number(e.target.value));
                  setPageNumber(1);
                }}
                style={{ padding: '6px 32px 6px 12px', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '13px', outline: 'none', background: '#fff', cursor: 'pointer', appearance: 'none', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' fill=\'none\' viewBox=\'0 0 24 24\' stroke=\'%2364748b\'%3E%3Cpath stroke-linecap=\'round\' stroke-linejoin=\'round\' stroke-width=\'2\' d=\'M19 9l-7 7-7-7\'%3E%3C/path%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 8px center', backgroundSize: '16px' }}
              >
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
              </select>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <button
                disabled={pageNumber === 1}
                onClick={() => setPageNumber(p => Math.max(1, p - 1))}
                style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', border: '1px solid #cbd5e1', background: '#fff', color: '#334155', borderRadius: '6px', cursor: pageNumber === 1 ? 'not-allowed' : 'pointer', opacity: pageNumber === 1 ? 0.5 : 1, fontSize: '13px', fontWeight: 500, transition: 'all 0.2s' }}
              >
                <ChevronLeft size={16} /> Prev
              </button>
              <div style={{ padding: '6px 16px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px', fontSize: '13px', fontWeight: 600, color: '#0f172a' }}>
                Page {pageNumber}
              </div>
              <button
                disabled={bookings.length < pageSize}
                onClick={() => setPageNumber(p => p + 1)}
                style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '6px 12px', border: '1px solid #cbd5e1', background: '#fff', color: '#334155', borderRadius: '6px', cursor: bookings.length < pageSize ? 'not-allowed' : 'pointer', opacity: bookings.length < pageSize ? 0.5 : 1, fontSize: '13px', fontWeight: 500, transition: 'all 0.2s' }}
              >
                Next <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
