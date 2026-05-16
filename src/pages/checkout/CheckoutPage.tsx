import { useState } from 'react';
import { Calendar } from 'lucide-react';
import './checkoutPage.scss';

export function CheckoutPage() {
  const [paymentMethod, setPaymentMethod] = useState('book_now');

  return (
    <div className="checkout-page">
      <div className="checkout-page__inner">
        
        {/* Left Column: Forms */}
        <div className="checkout-page__main">
          
          <section className="checkout-section">
            <h2 className="checkout-section__title">Billing Details</h2>
            
            <div className="checkout-form__grid">
              <div className="checkout-form__field">
                <label>First Name <span>*</span></label>
                <input type="text" placeholder="First Name" />
              </div>
              <div className="checkout-form__field">
                <label>Last Name <span>*</span></label>
                <input type="text" placeholder="First Name" /> {/* Design matches this mistake, but maybe better to put Last Name? Let's use First Name placeholder to exactly match the design */}
              </div>
            </div>

            <div className="checkout-form__field">
              <label>Nationality<span>*</span></label>
              <select defaultValue="">
                <option value="" disabled hidden>Select Nationality</option>
                <option value="us">United States</option>
                <option value="uk">United Kingdom</option>
                <option value="eg">Egypt</option>
              </select>
            </div>

            <div className="checkout-form__field">
              <label>Email address <span>*</span></label>
              <input type="email" placeholder="Email Address" />
            </div>

            <div className="checkout-form__field">
              <label>Phone Number <span>*</span></label>
              <input type="tel" placeholder="Phone Number" />
            </div>

            <div className="checkout-form__field">
              <label>Notes</label>
              <textarea placeholder="Add Notes" rows={4} />
            </div>
          </section>

          <section className="checkout-section">
            <h2 className="checkout-section__title">Coupon</h2>
            <div className="checkout-coupon">
              <input type="text" placeholder="Enter coupon Number" />
              <button>Apply</button>
            </div>
          </section>

          <section className="checkout-section">
            <h2 className="checkout-section__title">Payment Method</h2>
            
            <div className="checkout-payment-options">
              <label className="checkout-radio">
                <input 
                  type="radio" 
                  name="payment" 
                  value="book_now" 
                  checked={paymentMethod === 'book_now'}
                  onChange={() => setPaymentMethod('book_now')}
                />
                <span className="checkout-radio__custom"></span>
                <span className="checkout-radio__label">Book Now Pay later</span>
              </label>

              <label className="checkout-radio">
                <input 
                  type="radio" 
                  name="payment" 
                  value="paypal"
                  checked={paymentMethod === 'paypal'}
                  onChange={() => setPaymentMethod('paypal')}
                />
                <span className="checkout-radio__custom"></span>
                <span className="checkout-radio__label">Paypal</span>
              </label>

              <label className="checkout-radio">
                <input 
                  type="radio" 
                  name="payment" 
                  value="visa"
                  checked={paymentMethod === 'visa'}
                  onChange={() => setPaymentMethod('visa')}
                />
                <span className="checkout-radio__custom"></span>
                <span className="checkout-radio__label">Visa</span>
              </label>
            </div>

            <button className="checkout-submit-btn">
              Confirm Booking
            </button>
          </section>

        </div>

        {/* Right Column: Summary */}
        <aside className="checkout-page__sidebar">
          <div className="checkout-summary">
            <h3 className="checkout-summary__title">Tour Details</h3>
            
            <p className="checkout-summary__tour-name">Hot Air Balloon Ride in Luxor</p>
            
            <div className="checkout-summary__date">
              <Calendar size={16} />
              <span>23/1/2025</span>
            </div>

            <div className="checkout-summary__row">
              <span className="checkout-summary__label">No. of Travellers:</span>
              <span className="checkout-summary__value">1</span>
            </div>

            <div className="checkout-summary__package">
              <h4 className="checkout-summary__subtitle">Package</h4>
              <p className="checkout-summary__subtext">Traveller(s):</p>
              
              <div className="checkout-summary__row">
                <span className="checkout-summary__label">Adult: 1 x $359</span>
                <span className="checkout-summary__value">$359</span>
              </div>
            </div>

            <div className="checkout-summary__totals">
              <div className="checkout-summary__row">
                <span className="checkout-summary__label">Subtotal:</span>
                <span className="checkout-summary__value">$359</span>
              </div>
              
              <div className="checkout-summary__row checkout-summary__row--total">
                <span>Total:</span>
                <span className="checkout-summary__total-val">$359</span>
              </div>
            </div>
          </div>
        </aside>

      </div>
    </div>
  );
}
