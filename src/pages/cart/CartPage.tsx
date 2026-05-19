import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { X } from 'lucide-react'
import { useCart } from '../../context/CartContext'

// Assets
import locIcon from '../../assets/cart/loc.png'
import dateGrayIcon from '../../assets/cart/dateGray.png'
import peopleIcon from '../../assets/cart/people.png'
import deleteIcon from '../../assets/cart/delete.png'
import dateBlueIcon from '../../assets/cart/dateBlue.png'
import arrowRightIcon from '../../assets/cart/arrow-right.png'

import './cartPage.scss'

export function CartPage() {
  const { t } = useTranslation()
  const { items, removeItem, packageTotal } = useCart()

  return (
    <div className="cart-page">
      <div className="cart-page__container">
        {/* Left Column */}
        <div className="cart-page__main">
          <div className="cart-page__header">
            <h1 className="cart-page__title">{t('cartPage.title')}</h1>
            <p className="cart-page__subtitle">{t('cartPage.subtitle')}</p>
          </div>

          <div className="cart-page__items">
            <AnimatePresence>
              {items.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="cart-page__empty"
                >
                  <p>{t('cartPage.emptyText')}</p>
                  <Link to="/trips" className="cart-page__emptyLink">{t('cartPage.emptyLink')}</Link>
                </motion.div>
              ) : (
                items.map((item) => {
                  const uniqueKey = `${item.tripId}-${item.date}`
                  return (
                    <motion.div
                      key={uniqueKey}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="cart-page__itemCard"
                    >
                      <div className="cart-page__itemImage">
                        {item.tripImage && <img src={item.tripImage} alt={item.tripName} />}
                      </div>
                      
                      <div className="cart-page__itemDetails">
                        <div className="cart-page__itemTop">
                          <div className="cart-page__itemHeader">
                            <h3 className="cart-page__itemTitle">{item.tripName}</h3>
                          </div>
                          <button 
                            className="cart-page__removeBtn"
                            onClick={() => removeItem(item.tripId, item.date)}
                            aria-label={`${t('cartPage.removeBtn')} ${item.tripName}`}
                          >
                            <img src={deleteIcon} alt="" />
                            {t('cartPage.removeBtn')}
                          </button>
                        </div>

                        <div className="cart-page__itemInfo">
                          {item.destination && (
                            <div className="cart-page__infoRow">
                              <img src={locIcon} alt="" />
                              <span>{item.destination}</span>
                            </div>
                          )}
                          <div className="cart-page__infoRow">
                            <img src={dateGrayIcon} alt="" />
                            <span>{item.date}</span>
                          </div>
                          {item.adultCount > 0 && (
                            <div className="cart-page__infoRow">
                              <img src={peopleIcon} alt="" />
                              <span>{item.adultCount} {item.adultCount === 1 ? t('cartPage.adult') : t('cartPage.adults')}</span>
                            </div>
                          )}
                          {item.childCount > 0 && (
                            <div className="cart-page__infoRow">
                              <img src={peopleIcon} alt="" />
                              <span>{item.childCount} {item.childCount === 1 ? t('cartPage.child') : t('cartPage.children')}</span>
                            </div>
                          )}
                        </div>

                        <div className="cart-page__itemPricing">
                          <span className="cart-page__priceLabel">{t('cartPage.total')}</span>
                          <span className="cart-page__priceTotal">€{(item.adultCount * item.adultPrice) + (item.childCount * item.childPrice)}</span>
                        </div>
                      </div>
                    </motion.div>
                  )
                })
              )}
            </AnimatePresence>
          </div>

          {items.length > 0 && (
            <Link to="/checkout" className="cart-page__checkoutBtn">
              {t('cartPage.checkoutBtn')}
              <img src={arrowRightIcon} alt="" />
            </Link>
          )}
        </div>

        {/* Right Column - Summary */}
        <aside className="cart-page__sidebar">
          <div className="cart-page__summary">
            <h2 className="cart-page__summaryTitle">{t('cartPage.summaryTitle')}</h2>

            <div className="cart-page__summaryItems">
              <AnimatePresence>
                {items.map((item) => {
                  const uniqueKey = `summary-${item.tripId}-${item.date}`
                  return (
                    <motion.div
                      key={uniqueKey}
                      layout
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="cart-page__summaryCard"
                    >
                      {item.tripImage && <img src={item.tripImage} alt={item.tripName} className="cart-page__summaryImg" />}
                      <div className="cart-page__summaryCardInfo">
                        <div className="cart-page__summaryCardHeader">
                          <h4>{item.tripName}</h4>
                          <button onClick={() => removeItem(item.tripId, item.date)} aria-label="Remove item">
                            <X size={16} color="#6B7280" />
                          </button>
                        </div>
                        <div className="cart-page__summaryCardDate">
                          <img src={dateBlueIcon} alt="" />
                          <span>{item.date}</span>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </AnimatePresence>
            </div>

            <div className="cart-page__summaryBreakdown">
              <h4 className="cart-page__breakdownTitle">{t('cartPage.package')}</h4>
              {items.map(item => {
                const uniqueKey = `breakdown-${item.tripId}-${item.date}`
                return (
                  <div key={uniqueKey}>
                    {item.adultCount > 0 && (
                      <div className="cart-page__breakdownRow">
                        <span>{t('cartPage.adultLabel')}: {item.adultCount} x €{item.adultPrice}</span>
                        <span>€{item.adultCount * item.adultPrice}</span>
                      </div>
                    )}
                    {item.childCount > 0 && (
                      <div className="cart-page__breakdownRow">
                        <span>{t('cartPage.childLabel')}: {item.childCount} x €{item.childPrice}</span>
                        <span>€{item.childCount * item.childPrice}</span>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>

            <div className="cart-page__summaryTotal">
              <span>{t('cartPage.total')}</span>
              <span className="cart-page__totalAmount">€{packageTotal}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  )
}
