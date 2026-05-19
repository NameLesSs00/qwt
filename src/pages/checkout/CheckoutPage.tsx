import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Calendar, Loader2, CreditCard } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useToast } from '../../components/toast/ToastProvider';
import { createBooking } from '../../api/bookingsApi';
import './checkoutPage.scss';

export function CheckoutPage() {
  const { t } = useTranslation();
  const { items, packageTotal, clearCart } = useCart();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    nationality: '',
    code: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.nationality) {
      toast.warning(t('checkoutPage.toastFillFields'));
      return;
    }

    if (items.length === 0) {
      toast.warning(t('checkoutPage.toastEmptyCart'));
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        code: formData.code ? parseInt(formData.code) : 0,
        nationality: formData.nationality,
        tripsBookings: items.map(item => ({
          tripId: item.tripId,
          noAdult: item.adultCount,
          noChild: item.childCount,
          leaveDate: item.date
        }))
      };

      const res = await createBooking(payload);
      if (res.success) {
        clearCart();
        toast.success(t('checkoutPage.toastSuccess'));
        navigate('/');
      } else {
        toast.error(res.message || t('checkoutPage.toastFail'));
      }
    } catch (err: any) {
      console.error('Submit booking error details:', err.response?.data || err);
      const serverMsg = err.response?.data?.Message || err.response?.data?.message;
      const validationErrors = err.response?.data?.errors;
      let errorString = t('checkoutPage.toastError');
      if (serverMsg) {
        errorString = serverMsg;
      } else if (validationErrors) {
        errorString = Object.entries(validationErrors)
          .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(', ') : val}`)
          .join(' | ');
      }
      toast.error(errorString);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="checkout-empty">
        <div className="checkout-empty__content">
          <h2>{t('checkoutPage.emptyTitle')}</h2>
          <p>{t('checkoutPage.emptySub')}</p>
          <button onClick={() => navigate('/trips')} className="btn-primary">{t('checkoutPage.browseToursBtn')}</button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <div className="checkout-header">
        <h1>{t('checkoutPage.title')}</h1>
        <p>{t('checkoutPage.subtitle')}</p>
      </div>

      <div className="checkout-inner">
        {/* Main Form Area */}
        <div className="checkout-main">
          
          <div className="checkout-card">
            <div className="checkout-card__header">
              <h3><CreditCard size={20} /> {t('checkoutPage.billingDetails')}</h3>
              <span>{t('checkoutPage.requiredFields')}</span>
            </div>
            
            <div className="checkout-form">
              <div className="form-row">
                <div className="form-group">
                  <label>{t('checkoutPage.firstName')} <span>*</span></label>
                  <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="e.g. John" />
                </div>
                <div className="form-group">
                  <label>{t('checkoutPage.lastName')} <span>*</span></label>
                  <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="e.g. Doe" />
                </div>
              </div>

              <div className="form-group">
                <label>{t('checkoutPage.nationality')} <span>*</span></label>
                <div className="select-wrapper">
                  <select name="nationality" value={formData.nationality} onChange={handleChange}>
                    <option value="" disabled hidden>{t('checkoutPage.selectNationality')}</option>
                    <option value="US">{t('checkoutPage.nationalityUS')}</option>
                    <option value="UK">{t('checkoutPage.nationalityUK')}</option>
                    <option value="EG">{t('checkoutPage.nationalityEG')}</option>
                    <option value="CA">{t('checkoutPage.nationalityCA')}</option>
                    <option value="AU">{t('checkoutPage.nationalityAU')}</option>
                    <option value="FR">{t('checkoutPage.nationalityFR')}</option>
                    <option value="DE">{t('checkoutPage.nationalityDE')}</option>
                    <option value="IT">{t('checkoutPage.nationalityIT')}</option>
                    <option value="RU">{t('checkoutPage.nationalityRU')}</option>
                    <option value="Other">{t('checkoutPage.nationalityOther')}</option>
                  </select>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>{t('checkoutPage.emailAddress')} <span>*</span></label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder="john@example.com" />
                </div>
                <div className="form-group">
                  <label>{t('checkoutPage.phoneNumber')} <span>*</span></label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" />
                </div>
              </div>
            </div>
          </div>

          <div className="checkout-card">
             <div className="checkout-card__header">
              <h3>{t('checkoutPage.haveCoupon')}</h3>
            </div>
            <div className="checkout-coupon">
              <input type="text" name="code" value={formData.code} onChange={handleChange} placeholder={t('checkoutPage.promoCodePlaceholder')} />
            </div>
          </div>

        </div>

        {/* Sidebar Summary */}
        <aside className="checkout-sidebar">
          <div className="summary-card">
            <h3 className="summary-title">{t('checkoutPage.orderSummary')}</h3>
            
            <div className="summary-items">
              {items.map((item, index) => (
                <div key={`${item.tripId}-${item.date}-${index}`} className="summary-item">
                  <h4 className="summary-item__title">{item.tripName}</h4>
                  
                  <div className="summary-item__date">
                    <Calendar size={14} />
                    <span>{item.date}</span>
                  </div>

                  <div className="summary-item__guests">
                    <span className="label">{t('checkoutPage.guestsLabel')}</span>
                    <span className="value">{item.adultCount + item.childCount}</span>
                  </div>

                  <div className="summary-item__breakdown">
                    {item.adultCount > 0 && (
                      <div className="breakdown-row">
                        <span>{t('checkoutPage.adultLabel')} {item.adultCount}</span>
                        <span>€{item.adultCount * item.adultPrice}</span>
                      </div>
                    )}
                    {item.childCount > 0 && (
                      <div className="breakdown-row">
                        <span>{t('checkoutPage.childLabel')} {item.childCount}</span>
                        <span>€{item.childCount * item.childPrice}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <div className="summary-total">
              <span>{t('checkoutPage.totalAmount')}</span>
              <span className="amount">€{packageTotal}</span>
            </div>

            <button 
              className="btn-submit" 
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="spinner" size={20} /> : null}
              {isSubmitting ? t('checkoutPage.processing') : t('checkoutPage.confirmBookBtn')}
            </button>
          </div>
        </aside>

      </div>
    </div>
  );
}
