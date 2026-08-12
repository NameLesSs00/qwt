import { useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Calendar, 
  User, 
  Mail, 
  Phone, 
  Globe, 
  Tag, 
  Home, 
  Compass, 
  CreditCard, 
  Hash 
} from 'lucide-react';
import type { DtoBookRead } from '../../api/bookingsApi';
import './bookingConfirmationPage.scss';

export function BookingConfirmationPage() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const booking = useMemo(() => {
    const stateBooking = (location.state as { booking?: DtoBookRead })?.booking;
    if (stateBooking) {
      return stateBooking;
    }

    try {
      const stored = sessionStorage.getItem('latestBooking');
      if (stored) {
        return JSON.parse(stored) as DtoBookRead;
      }
    } catch (e) {
      console.error('Failed to read booking from sessionStorage:', e);
    }

    return null;
  }, [location.state]);

  useEffect(() => {
    if (!booking) {
      navigate('/trips', { replace: true });
    }
  }, [booking, navigate]);

  if (!booking) {
    return (
      <div className="booking-conf-loading">
        <div className="spinner"></div>
      </div>
    );
  }

  // Calculate original subtotals sum
  const subtotalSum = (booking.tripsBookings || []).reduce((sum, item) => sum + (item.subTotal || 0), 0);
  const discount = Math.max(0, subtotalSum - booking.totalPrice);
  const hasDiscount = discount > 0.01;

  // Format date safely
  const formatBookingDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const dateObj = new Date(dateStr);
      return dateObj.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return dateStr;
    }
  };

  // Status badge styling and text helper
  const getStatusDetails = (statusStr: string) => {
    switch (statusStr) {
      case 'Confirmed':
        return {
          className: 'status-confirmed',
          label: t('bookingConfirmationPage.confirmedStatus', { defaultValue: 'Confirmed' })
        };
      case 'Finished':
        return {
          className: 'status-finished',
          label: t('bookingConfirmationPage.finishedStatus', { defaultValue: 'Finished' })
        };
      case 'Cancelled':
        return {
          className: 'status-cancelled',
          label: t('bookingConfirmationPage.cancelledStatus', { defaultValue: 'Cancelled' })
        };
      case 'Pending':
      default:
        return {
          className: 'status-pending',
          label: t('bookingConfirmationPage.pendingStatus', { defaultValue: 'Pending' })
        };
    }
  };

  const statusInfo = getStatusDetails(booking.status);

  return (
    <div className="booking-conf-page">
      <div className="booking-conf-container">
        
        {/* Success Header Hero Banner */}
        <motion.div 
          className="booking-conf-hero"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="hero-icon-container">
            <CheckCircle className="hero-icon" size={64} />
          </div>
          <h1>{t('bookingConfirmationPage.title')}</h1>
          <p>{t('bookingConfirmationPage.subtitle')}</p>
        </motion.div>

        <div className="booking-conf-grid">
          
          {/* Left Column: Details & Order Summary */}
          <div className="booking-conf-main">
            
            {/* Booking Details Card */}
            <motion.div 
              className="booking-conf-card"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <div className="card-header">
                <h2>{t('bookingConfirmationPage.bookingDetails')}</h2>
              </div>
              <div className="details-grid">
                <div className="detail-item">
                  <span className="detail-label">
                    <Hash size={16} /> {t('bookingConfirmationPage.bookingRef')}
                  </span>
                  <span className="detail-value highlight">#{booking.id}</span>
                </div>
                
                <div className="detail-item">
                  <span className="detail-label">
                    <Calendar size={16} /> {t('bookingConfirmationPage.bookingDate')}
                  </span>
                  <span className="detail-value">{formatBookingDate(booking.bookingDate || booking.createdAt)}</span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">
                    <CreditCard size={16} /> {t('bookingConfirmationPage.status')}
                  </span>
                  <span className={`status-badge ${statusInfo.className}`}>
                    {statusInfo.label}
                  </span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">
                    <User size={16} /> {t('bookingConfirmationPage.name')}
                  </span>
                  <span className="detail-value">{booking.firstName} {booking.lastName}</span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">
                    <Mail size={16} /> {t('bookingConfirmationPage.email')}
                  </span>
                  <span className="detail-value">{booking.email}</span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">
                    <Phone size={16} /> {t('bookingConfirmationPage.phone')}
                  </span>
                  <span className="detail-value">{booking.phone}</span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">
                    <Globe size={16} /> {t('bookingConfirmationPage.nationality')}
                  </span>
                  <span className="detail-value">{booking.nationality}</span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">
                    <Home size={16} /> {t('bookingConfirmationPage.hotelName')}
                  </span>
                  <span className="detail-value">{booking.hotelName || '-'}</span>
                </div>

                <div className="detail-item">
                  <span className="detail-label">
                    <Hash size={16} /> {t('bookingConfirmationPage.roomNo')}
                  </span>
                  <span className="detail-value">{booking.roomNo || '-'}</span>
                </div>
              </div>
            </motion.div>

            {/* Booked Items List */}
            <motion.div 
              className="booking-conf-card"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <div className="card-header">
                <h2>{t('bookingConfirmationPage.orderSummary')}</h2>
              </div>
              <div className="booked-trips-list">
                {(booking.tripsBookings || []).map((item, index) => (
                  <div key={`${item.id}-${index}`} className="booked-trip-item">
                    <div className="trip-info-header">
                      <h3>{item.title || t('bookingConfirmationPage.trip')}</h3>
                      <span className="trip-subtotal">€{(item.subTotal || 0).toFixed(2)}</span>
                    </div>

                    <div className="trip-details-meta">
                      <div className="meta-pill">
                        <Calendar size={14} />
                        <span>{item.leaveDate}</span>
                      </div>
                      
                      <div className="meta-pill">
                        <User size={14} />
                        <span>
                          {t('bookingConfirmationPage.guests')}: {item.noAdult + item.noChild} ({item.noAdult} {t('bookingConfirmationPage.adults')}{item.noChild > 0 ? `, ${item.noChild} ${t('bookingConfirmationPage.children')}` : ''})
                        </span>
                      </div>
                    </div>

                    <div className="trip-pricing-details">
                      {item.noAdult > 0 && (
                        <div className="price-row">
                          <span>{t('bookingConfirmationPage.adults')} ({item.noAdult} × €{item.priceForAdult.toFixed(2)})</span>
                          <span>€{(item.noAdult * item.priceForAdult).toFixed(2)}</span>
                        </div>
                      )}
                      {item.noChild > 0 && (
                        <div className="price-row">
                          <span>{t('bookingConfirmationPage.children')} ({item.noChild} × €{item.priceForChild.toFixed(2)})</span>
                          <span>€{(item.noChild * item.priceForChild).toFixed(2)}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

          </div>

          {/* Right Column: Dynamic Pricing Summary with Promo Code Callout */}
          <div className="booking-conf-sidebar">
            <motion.div 
              className="pricing-summary-card"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <h3>{t('bookingConfirmationPage.pricingBreakdown')}</h3>
              
              <div className="pricing-rows">
                <div className="pricing-row">
                  <span>{t('bookingConfirmationPage.originalTotal')}</span>
                  <span className="pricing-val">€{subtotalSum.toFixed(2)}</span>
                </div>

                {hasDiscount && (
                  <div className="pricing-row discount-row">
                    <span className="discount-label">
                      <Tag size={14} /> {t('bookingConfirmationPage.promoDiscount')}
                    </span>
                    <span className="pricing-val discount-val">-€{discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="pricing-total-divider"></div>

                <div className="pricing-row total-row">
                  <span>{t('bookingConfirmationPage.totalPaid')}</span>
                  <span className="total-val">€{booking.totalPrice.toFixed(2)}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="action-buttons">
                <button className="btn-primary" onClick={() => navigate('/trips')}>
                  <Compass size={18} />
                  {t('bookingConfirmationPage.browseMore')}
                </button>
                
                <button className="btn-secondary" onClick={() => navigate('/')}>
                  <Home size={18} />
                  {t('bookingConfirmationPage.backHome')}
                </button>
              </div>

            </motion.div>
          </div>

        </div>

      </div>
    </div>
  );
}
