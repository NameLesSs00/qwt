import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

// Assets
import placeHolderImage1 from '../../assets/cart/placeHolderImage1.png'
import placeHolderImage2 from '../../assets/cart/placeHolderImage2.png'
import locIcon from '../../assets/cart/loc.png'
import dateGrayIcon from '../../assets/cart/dateGray.png'
import peopleIcon from '../../assets/cart/people.png'
import deleteIcon from '../../assets/cart/delete.png'
import dateBlueIcon from '../../assets/cart/dateBlue.png'
import arrowRightIcon from '../../assets/cart/arrow-right.png'

import './cartPage.scss'

type CartItem = {
  id: string
  title: string
  category: string
  location: string
  date: string
  adults: number
  pricePerPerson: number
  image: string
}

const initialCartItems: CartItem[] = [
  {
    id: '1',
    title: 'Hot Air Balloon Ride – Luxor',
    category: 'Historical',
    location: 'Luxor',
    date: '18 June 2026',
    adults: 2,
    pricePerPerson: 30,
    image: placeHolderImage1,
  },
  {
    id: '2',
    title: 'Orange Bay Island Trip',
    category: 'Sea Trip',
    location: 'Hurghada',
    date: '20 June 2026',
    adults: 2,
    pricePerPerson: 35,
    image: placeHolderImage2,
  },
]

export function CartPage() {
  const [items, setItems] = useState<CartItem[]>(initialCartItems)

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  // Calculate totals
  const packageTotal = items.reduce((acc, item) => acc + item.pricePerPerson * item.adults, 0)
  const medicalInsurance = 20
  const totalAmount = packageTotal + medicalInsurance

  return (
    <div className="cart-page">
      <div className="cart-page__container">
        {/* Left Column */}
        <div className="cart-page__main">
          <div className="cart-page__header">
            <h1 className="cart-page__title">Booking Cart</h1>
            <p className="cart-page__subtitle">Review your selected tours before payment</p>
          </div>

          <div className="cart-page__items">
            <AnimatePresence>
              {items.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="cart-page__empty"
                >
                  <p>Your cart is empty.</p>
                  <Link to="/destinations" className="cart-page__emptyLink">Browse Tours</Link>
                </motion.div>
              ) : (
                items.map((item) => (
                  <motion.div
                    key={item.id}
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="cart-page__itemCard"
                  >
                    <div className="cart-page__itemImage">
                      <img src={item.image} alt={item.title} />
                    </div>
                    
                    <div className="cart-page__itemDetails">
                      <div className="cart-page__itemTop">
                        <div className="cart-page__itemHeader">
                          <h3 className="cart-page__itemTitle">{item.title}</h3>
                          <span className={`cart-page__itemBadge cart-page__itemBadge--${item.category.toLowerCase().replace(' ', '-')}`}>
                            {item.category}
                          </span>
                        </div>
                        <button 
                          className="cart-page__removeBtn"
                          onClick={() => removeItem(item.id)}
                          aria-label={`Remove ${item.title}`}
                        >
                          <img src={deleteIcon} alt="" />
                          Remove
                        </button>
                      </div>

                      <div className="cart-page__itemInfo">
                        <div className="cart-page__infoRow">
                          <img src={locIcon} alt="" />
                          <span>{item.location}</span>
                        </div>
                        <div className="cart-page__infoRow">
                          <img src={dateGrayIcon} alt="" />
                          <span>{item.date}</span>
                        </div>
                        <div className="cart-page__infoRow">
                          <img src={peopleIcon} alt="" />
                          <span>{item.adults} Adults</span>
                        </div>
                      </div>

                      <div className="cart-page__itemPricing">
                        <span className="cart-page__priceLabel">${item.pricePerPerson} per person</span>
                        <span className="cart-page__priceTotal">${item.pricePerPerson * item.adults}</span>
                      </div>
                    </div>
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>

          {items.length > 0 && (
            <button className="cart-page__checkoutBtn">
              Proceed to check out
              <img src={arrowRightIcon} alt="" />
            </button>
          )}
        </div>

        {/* Right Column - Summary */}
        <aside className="cart-page__sidebar">
          <div className="cart-page__summary">
            <h2 className="cart-page__summaryTitle">Booking summary</h2>

            <div className="cart-page__summaryItems">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div
                    key={`summary-${item.id}`}
                    layout
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="cart-page__summaryCard"
                  >
                    <img src={item.image} alt={item.title} className="cart-page__summaryImg" />
                    <div className="cart-page__summaryCardInfo">
                      <div className="cart-page__summaryCardHeader">
                        <h4>{item.title}</h4>
                        <button onClick={() => removeItem(item.id)} aria-label="Remove item">
                          <X size={16} color="#6B7280" />
                        </button>
                      </div>
                      <div className="cart-page__summaryCardDate">
                        <img src={dateBlueIcon} alt="" />
                        <span>{item.date}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            <div className="cart-page__summaryBreakdown">
              <h4 className="cart-page__breakdownTitle">Package</h4>
              {items.map(item => (
                <div key={`breakdown-${item.id}`} className="cart-page__breakdownRow">
                  <span>Adult: {item.adults} x${item.pricePerPerson}</span>
                  <span>${item.adults * item.pricePerPerson}</span>
                </div>
              ))}
              
              <h4 className="cart-page__breakdownTitle cart-page__breakdownTitle--mt">Extra Services</h4>
              <div className="cart-page__breakdownRow">
                <span>Medical insurance</span>
                <span>${medicalInsurance}</span>
              </div>
            </div>

            <div className="cart-page__summaryTotal">
              <span>Total</span>
              <span className="cart-page__totalAmount">${totalAmount}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
