import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Minus, Plus, ArrowRight } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../components/toast/ToastProvider';
import { type DtoTripRead, getTripImageUrl } from '../../api/tripsApi';
import './checkAvailabilityModal.scss';

type CheckAvailabilityModalProps = {
  isOpen: boolean;
  onClose: () => void;
  trip?: DtoTripRead | null;
};

export function CheckAvailabilityModal({ isOpen, onClose, trip }: CheckAvailabilityModalProps) {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toast } = useToast();
  const { t } = useTranslation();
  
  const [date, setDate] = useState('');
  const [dateError, setDateError] = useState('');
  const [adultCount, setAdultCount] = useState(0);
  const [childCount, setChildCount] = useState(0);

  if (!isOpen || !trip) return null;

  const adultPrice = trip.adultPrice || 0;
  const childPrice = trip.childPrice || 0;
  const total = (adultCount * adultPrice) + (childCount * childPrice);

  const primaryImg = trip.images?.find(i => i.isPrimary) || trip.images?.[0];
  const tripImgUrl = primaryImg ? getTripImageUrl(primaryImg.imageUrl) : '';

  const handleDateChange = (val: string) => {
    setDate(val);
    setDateError('');
    if (!val) return;

    // Check min date (today)
    const todayStr = new Date().toISOString().split('T')[0];
    if (val < todayStr) {
      setDateError(t('bookingModal.selectFutureDate'));
      return;
    }

    if (trip.availableDays && trip.availableDays.length > 0) {
      const parts = val.split('-');
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const localDate = new Date(year, month, day);
      const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
      const selectedDayName = daysOfWeek[localDate.getDay()];

      if (!trip.availableDays.includes(selectedDayName)) {
        const translatedDays = trip.availableDays.map(day => t(`weekdays.${day.toLowerCase()}`, { defaultValue: day })).join(', ');
        setDateError(t('bookingModal.onlyAvailableOn', { days: translatedDays }));
      }
    }
  };

  const handleCheckout = () => {
    if (!date) {
      toast.warning(t('bookingModal.toastSelectDate'));
      return;
    }
    if (dateError) {
      toast.error(dateError);
      return;
    }
    if (adultCount === 0 && childCount === 0) {
      toast.warning(t('bookingModal.toastSelectPeople'));
      return;
    }

    addItem({
      tripId: trip.id,
      tripName: trip.name || 'Trip',
      tripImage: tripImgUrl,
      destination: trip.destination || '',
      date,
      adultCount,
      childCount,
      adultPrice,
      childPrice
    });

    onClose();
    navigate('/cart');
  };

  return (
    <AnimatePresence>
      <div className="ca-modal-overlay" onClick={onClose}>
        <motion.div 
          className="ca-modal"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => e.stopPropagation()}
        >
          <button className="ca-modal__close" onClick={onClose} aria-label="Close modal">
            <X size={24} />
          </button>

          <div className="ca-modal__content">
            {/* Left Column */}
            <div className="ca-modal__left">
              <div className="ca-section">
                <label className="ca-label">{t('bookingModal.selectDate')}</label>
                <div className="ca-input-wrap">
                  <Calendar className="ca-input-icon" size={18} color="#9CA3AF" />
                  <input 
                    type="date" 
                    className="ca-input" 
                    value={date}
                    onChange={(e) => handleDateChange(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                {trip.availableDays && trip.availableDays.length > 0 && (
                  <div style={{ fontSize: '13px', color: '#4b5563', marginTop: '8px' }}>
                    {t('bookingModal.availableDays')} <span style={{ fontWeight: 600, color: '#1e659e' }}>{trip.availableDays.map(day => t(`weekdays.${day.toLowerCase()}`, { defaultValue: day })).join(', ')}</span>
                  </div>
                )}
                {dateError && (
                  <div style={{ fontSize: '13px', color: '#dc2626', marginTop: '8px', fontWeight: 500 }}>
                    ⚠️ {dateError}
                  </div>
                )}
              </div>

              <div className="ca-section">
                <div className="ca-label-row">
                  <label className="ca-label">{t('bookingModal.quantity')}</label>
                  <span className="ca-hint">ⓘ ( {t('bookingModal.minOne')} )</span>
                </div>


                <div className="ca-quantity-box">
                  <div className="ca-quantity-row">
                    <span className="ca-quantity-name">{t('bookingModal.adult')}</span>
                    <span className="ca-quantity-price">€{adultPrice.toFixed(2)}</span>
                    <div className="ca-quantity-controls">
                      <button onClick={() => setAdultCount(prev => Math.max(0, prev - 1))} className="ca-qty-btn">
                        <Minus size={16} />
                      </button>
                      <span className="ca-qty-value">{adultCount}</span>
                      <button onClick={() => setAdultCount(prev => prev + 1)} className="ca-qty-btn">
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="ca-quantity-row">
                    <span className="ca-quantity-name">{t('bookingModal.children')}</span>
                    <span className="ca-quantity-price">€{childPrice.toFixed(2)}</span>
                    <div className="ca-quantity-controls">
                      <button onClick={() => setChildCount(prev => Math.max(0, prev - 1))} className="ca-qty-btn">
                        <Minus size={16} />
                      </button>
                      <span className="ca-qty-value">{childCount}</span>
                      <button onClick={() => setChildCount(prev => prev + 1)} className="ca-qty-btn">
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <button className="ca-checkout-btn" onClick={handleCheckout}>
                {t('bookingModal.proceedToCheckout')} <ArrowRight size={18} />
              </button>
            </div>

            {/* Right Column (Summary) */}
            <div className="ca-modal__right">
              <div className="ca-summary">
                <h3 className="ca-summary__title">{t('bookingModal.bookingSummary')}</h3>
                
                <div className="ca-summary__card">
                  {tripImgUrl && <img src={tripImgUrl} alt={trip.name || 'Trip'} className="ca-summary__img" />}
                  <div className="ca-summary__details">
                    <div className="ca-summary__card-top">
                      <h4 className="ca-summary__card-title">{trip.name}</h4>
                    </div>
                    <div className="ca-summary__date">
                      <Calendar size={14} />
                      <span>{date || 'DD/MM/YYYY'}</span>
                    </div>
                  </div>
                </div>

                <div className="ca-summary__breakdown">
                  <h5 className="ca-summary__subtitle">{t('bookingModal.package')}</h5>
                  
                  {adultCount > 0 && (
                    <div className="ca-summary__row">
                      <span>{t('bookingModal.adult')}: {adultCount} x €{adultPrice}</span>
                      <span className="ca-summary__val">€{adultCount * adultPrice}</span>
                    </div>
                  )}
                  
                  {childCount > 0 && (
                    <div className="ca-summary__row">
                      <span>{t('bookingModal.children')}: {childCount} x €{childPrice}</span>
                      <span className="ca-summary__val">€{childCount * childPrice}</span>
                    </div>
                  )}
                </div>

                <div className="ca-summary__total">
                  <span>{t('bookingModal.total')}</span>
                  <span className="ca-summary__total-val">€{total}</span>
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
