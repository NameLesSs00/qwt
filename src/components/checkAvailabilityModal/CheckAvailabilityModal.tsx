import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Calendar, Minus, Plus, ArrowRight } from 'lucide-react';
import placeholder5 from '../../assets/single trip/placeholder5.png';
import './checkAvailabilityModal.scss';

type CheckAvailabilityModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function CheckAvailabilityModal({ isOpen, onClose }: CheckAvailabilityModalProps) {
  const [date, setDate] = useState('');
  const [adultCount, setAdultCount] = useState(0);
  const [childCount, setChildCount] = useState(0);

  const adultPrice = 30;
  const childPrice = 15; // Assuming 15 for child to match the $45 total in the image ($30 + $15)
  
  const total = (adultCount * adultPrice) + (childCount * childPrice);

  if (!isOpen) return null;

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
                <label className="ca-label">Please select a tour date</label>
                <div className="ca-input-wrap">
                  <Calendar className="ca-input-icon" size={18} color="#9CA3AF" />
                  <input 
                    type="date" 
                    className="ca-input" 
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />
                </div>
              </div>

              <div className="ca-section">
                <div className="ca-label-row">
                  <label className="ca-label">Quantity</label>
                  <span className="ca-hint">ⓘ ( Min: 1 )</span>
                </div>
                <p className="ca-sublabel">You can select up to 50 for this package</p>

                <div className="ca-quantity-box">
                  <div className="ca-quantity-row">
                    <span className="ca-quantity-name">Adult</span>
                    <span className="ca-quantity-price">${adultPrice.toFixed(2)}</span>
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
                    <span className="ca-quantity-name">Children 3-11 years</span>
                    <span className="ca-quantity-price">${childPrice.toFixed(2)}</span>
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

              <button className="ca-checkout-btn">
                Proceed to check out <ArrowRight size={18} />
              </button>
            </div>

            {/* Right Column (Summary) */}
            <div className="ca-modal__right">
              <div className="ca-summary">
                <h3 className="ca-summary__title">Booking summary</h3>
                
                <div className="ca-summary__card">
                  <img src={placeholder5} alt="Trip" className="ca-summary__img" />
                  <div className="ca-summary__details">
                    <div className="ca-summary__card-top">
                      <h4 className="ca-summary__card-title">Hot Air Balloon Ride in Luxor</h4>
                      <button className="ca-summary__remove"><X size={14} /></button>
                    </div>
                    <div className="ca-summary__date">
                      <Calendar size={14} />
                      <span>{date || 'DD/MM/YYYY'}</span>
                    </div>
                  </div>
                </div>

                <div className="ca-summary__breakdown">
                  <h5 className="ca-summary__subtitle">Package</h5>
                  
                  {adultCount > 0 && (
                    <div className="ca-summary__row">
                      <span>Adult: {adultCount} x ${adultPrice}</span>
                      <span className="ca-summary__val">${adultCount * adultPrice}</span>
                    </div>
                  )}
                  
                  {childCount > 0 && (
                    <div className="ca-summary__row">
                      <span>Child: {childCount} x ${childPrice}</span>
                      <span className="ca-summary__val">${childCount * childPrice}</span>
                    </div>
                  )}
                </div>

                <div className="ca-summary__total">
                  <span>Total</span>
                  <span className="ca-summary__total-val">${total}</span>
                </div>
              </div>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
