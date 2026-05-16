import { useState, useCallback } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ChevronDown, ChevronUp } from 'lucide-react'
import { ImageLightbox } from '../../components/imageLightbox/ImageLightbox'

// Assets
import placeholder1 from '../../assets/single trip/placeholder1.png'
import placeholder2 from '../../assets/single trip/placeholder2.png'
import placeholder3 from '../../assets/single trip/placeholder3.png'
import placeholder4 from '../../assets/single trip/placeholder4.png'
import placeholder5 from '../../assets/single trip/placeholder5.png'
import locIcon from '../../assets/single trip/proicons_location.png'
import clockIcon from '../../assets/single trip/uil_clock.png'
import groupIcon from '../../assets/single trip/mingcute_group-3-fill.png'
import tripTypeIcon from '../../assets/single trip/tripType.png'
import trueIcon from '../../assets/single trip/True.png'
import crossIcon from '../../assets/single trip/CrossRed.png'
import childrenIcon from '../../assets/single trip/childern.png'
import adultIcon from '../../assets/single trip/ri_user-fill.png'
import languageIcon from '../../assets/single trip/iconoir_language.png'
import leftArrow from '../../assets/single trip/left.png'
import rightArrow from '../../assets/single trip/right.png'
import { CheckAvailabilityModal } from '../../components/checkAvailabilityModal/CheckAvailabilityModal'

import './singleTripPage.scss'


const galleryImages = [placeholder5, placeholder1, placeholder2, placeholder3, placeholder4]

const includedItems = [
  'Hotel pickup & drop-off',
  'Hot air balloon ride (45–60 minutes)',
  'Safety briefing & professional pilot',
  'Flight certificate',
]

const excludedItems = ['Personal expenses', 'Tips']

const highlights = [
  'Sunrise balloon ride over Luxor',
  'Aerial views of ancient temples',
  'Professional pilots & full safety',
  'Perfect for photos & memories',
]

const faqs = [
  {
    question: 'Is the hot air balloon ride safe?',
    answer: 'Yes, the ride is operated by licensed and experienced pilots and follows strict safety regulations.',
  },
  {
    question: 'What time does the tour start?',
    answer: 'The tour starts at early morning (sunrise), typically around 5:00–6:00 AM depending on the season.',
  },
  {
    question: 'How long is the balloon ride?',
    answer: 'The balloon ride itself lasts 45–60 minutes in the air, with the full experience taking about 3 hours.',
  },
]

const reviews = [
  { name: 'Wade Warren', rating: 4.75, comment: 'Awesome website and funnel for your business' },
  { name: 'Sarah Johnson', rating: 5, comment: 'Absolutely breathtaking experience! Highly recommend!' },
  { name: 'Michael Chen', rating: 4.5, comment: 'Beautiful views, very professional team.' },
]

const ratingBars = [
  { stars: 5, width: 80 },
  { stars: 4, width: 65 },
  { stars: 3, width: 45 },
  { stars: 2, width: 20 },
  { stars: 1, width: 10 },
]

export function SingleTripPage() {
  // Lightbox state
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const openLightbox = (idx: number) => setLightboxIndex(idx)
  const closeLightbox = () => setLightboxIndex(null)
  const nextImage = useCallback(() =>
    setLightboxIndex(prev => prev !== null ? (prev + 1) % galleryImages.length : null), [])
  const prevImage = useCallback(() =>
    setLightboxIndex(prev => prev !== null ? (prev - 1 + galleryImages.length) % galleryImages.length : null), [])

  // FAQ accordion
  const [openFaq, setOpenFaq] = useState<number | null>(0)

  // Review carousel
  const [reviewIdx, setReviewIdx] = useState(0)

  // Star rating for form
  const [hoverStar, setHoverStar] = useState(0)
  const [selectedStar, setSelectedStar] = useState(0)
  const [comment, setComment] = useState('')

  // Booking Modal
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)

  return (
    <div className="st-page">
      {/* ── Breadcrumb ── */}
      <div className="st-breadcrumb">
        <div className="st-breadcrumb__inner">
          <Link to="/" className="st-breadcrumb__link">Home</Link>
          <span className="st-breadcrumb__sep">&gt;</span>
          <span className="st-breadcrumb__active">Trip details</span>
        </div>
      </div>

      {/* ── Hero Gallery ── */}
      <section className="st-gallery">
        <div className="st-gallery__inner">
          {/* Main large image */}
          <div
            className="st-gallery__main"
            onClick={() => openLightbox(0)}
            role="button"
            tabIndex={0}
            aria-label="View image"
            onKeyDown={e => e.key === 'Enter' && openLightbox(0)}
          >
            <img src={galleryImages[0]} alt="Trip main" />
            <div className="st-gallery__overlay"><span>View</span></div>
          </div>

          {/* 2×2 thumbnail grid */}
          <div className="st-gallery__thumbs">
            {galleryImages.slice(1, 5).map((img, idx) => (
              <div
                key={idx}
                className="st-gallery__thumb"
                onClick={() => openLightbox(idx + 1)}
                role="button"
                tabIndex={0}
                aria-label={`View image ${idx + 2}`}
                onKeyDown={e => e.key === 'Enter' && openLightbox(idx + 1)}
              >
                <img src={img} alt={`Trip thumbnail ${idx + 2}`} />
                <div className="st-gallery__overlay"><span>View</span></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main Content ── */}
      <section className="st-main">
        <div className="st-main__inner">

          {/* Left column */}
          <div className="st-main__content">

            {/* Title & description & Availability Card */}
            <div className="st-header-row">
              <div className="st-title-block">
                <h1 className="st-title">Hot Air Balloon Ride in Luxor</h1>
                <p className="st-description">
                  Experience a breathtaking hot air balloon ride over Luxor and witness Egypt's ancient temples
                  from the sky at sunrise.
                </p>
                <div className="st-location">
                  <img src={locIcon} alt="" />
                  <span>Luxor</span>
                </div>
                <div className="st-divider" />
                <div className="st-rating">
                  <Star size={16} fill="#F59E0B" color="#F59E0B" />
                  <span className="st-rating__score">4.8</span>
                  <span className="st-rating__count">Reviews (25)</span>
                </div>
              </div>

              <div className="st-availability-card">
                <div className="st-sidebar__row">
                  <img src={clockIcon} alt="" />
                  <div>
                    <div className="st-sidebar__label">Duration</div>
                    <div className="st-sidebar__value">45–60 Minutes</div>
                  </div>
                </div>

                <div className="st-sidebar__divider" />

                <div className="st-sidebar__priceRow">
                  <div className="st-sidebar__priceBlock">
                    <img src={adultIcon} alt="" />
                    <span className="st-sidebar__priceLabel">Adult</span>
                  </div>
                  <div className="st-sidebar__priceRight">
                    <div className="st-sidebar__priceFrom">From</div>
                    <div className="st-sidebar__price">$30/Person</div>
                  </div>
                </div>

                <div className="st-sidebar__priceRow">
                  <div className="st-sidebar__priceBlock">
                    <img src={childrenIcon} alt="" />
                    <span className="st-sidebar__priceLabel">Children 3-11 Years</span>
                  </div>
                  <div className="st-sidebar__priceRight">
                    <div className="st-sidebar__priceFrom">From</div>
                    <div className="st-sidebar__price">$20/Person</div>
                  </div>
                </div>

                <div className="st-sidebar__divider" />

                <button className="st-sidebar__cta" onClick={() => setIsBookingModalOpen(true)}>Check Availability</button>
              </div>
            </div>

            {/* Quick info cards */}
            <div className="st-info-cards">
              <div className="st-info-card">
                <img src={groupIcon} alt="" />
                <div>
                  <div className="st-info-card__label">Group</div>
                  <div className="st-info-card__value">1-4 Persons</div>
                </div>
              </div>
              <div className="st-info-card">
                <img src={clockIcon} alt="" />
                <div>
                  <div className="st-info-card__label">Duration</div>
                  <div className="st-info-card__value">45–60 Minutes</div>
                </div>
              </div>
              <div className="st-info-card">
                <img src={tripTypeIcon} alt="" />
                <div>
                  <div className="st-info-card__label">Tour Type</div>
                  <div className="st-info-card__value">Adventure</div>
                </div>
              </div>
            </div>

            {/* Included / Excluded */}
            <div className="st-ie">
              <h2 className="st-section-title">Included/Exclude</h2>
              <div className="st-ie__cols">
                <div className="st-ie__col">
                  <div className="st-ie__heading st-ie__heading--included">Included</div>
                  <ul>
                    {includedItems.map((item, i) => (
                      <li key={i} className="st-ie__item">
                        <img src={trueIcon} alt="Included" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="st-ie__col">
                  <div className="st-ie__heading st-ie__heading--excluded">Excluded</div>
                  <ul>
                    {excludedItems.map((item, i) => (
                      <li key={i} className="st-ie__item">
                        <img src={crossIcon} alt="Excluded" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Trip Info grid */}
            <div className="st-trip-info">
              <div className="st-trip-info__badge">Trip Info</div>
              <div className="st-trip-info__grid">
                <div className="st-trip-info__item">
                  <img src={locIcon} alt="" />
                  <div>
                    <div className="st-trip-info__label">Location</div>
                    <div className="st-trip-info__value">Luxor</div>
                  </div>
                </div>
                <div className="st-trip-info__item">
                  <img src={clockIcon} alt="" />
                  <div>
                    <div className="st-trip-info__label">Duration</div>
                    <div className="st-trip-info__value">45–60 Minutes</div>
                  </div>
                </div>
                <div className="st-trip-info__item">
                  <img src={clockIcon} alt="" />
                  <div>
                    <div className="st-trip-info__label">Time Start</div>
                    <div className="st-trip-info__value">Early Morning (Sunrise)</div>
                  </div>
                </div>
                <div className="st-trip-info__item">
                  <img src={trueIcon} alt="" />
                  <div>
                    <div className="st-trip-info__label">Availability</div>
                    <div className="st-trip-info__value">Daily</div>
                  </div>
                </div>
                <div className="st-trip-info__item">
                  <img src={languageIcon} alt="" />
                  <div>
                    <div className="st-trip-info__label">Language</div>
                    <div className="st-trip-info__value">English / Arabic</div>
                  </div>
                </div>
                <div className="st-trip-info__item">
                  <img src={groupIcon} alt="" />
                  <div>
                    <div className="st-trip-info__label">Group</div>
                    <div className="st-trip-info__value">1-4 Persons</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Highlights + FAQ side by side */}
            <div className="st-hf-row">
              {/* Tour Highlights */}
              <div className="st-highlights">
                <h2 className="st-section-title">Tour Highlights</h2>
                <ul>
                  {highlights.map((h, i) => (
                    <li key={i} className="st-highlights__item">
                      <img src={trueIcon} alt="" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* FAQ Accordion */}
              <div className="st-faq">
                <h2 className="st-section-title">Frequently Asked Questions?</h2>
                {faqs.map((faq, i) => (
                  <div key={i} className="st-faq__item">
                    <button
                      className="st-faq__question"
                      onClick={() => setOpenFaq(openFaq === i ? null : i)}
                      aria-expanded={openFaq === i}
                    >
                      <span>{faq.question}</span>
                      {openFaq === i ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                    <AnimatePresence>
                      {openFaq === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="st-faq__answer"
                        >
                          <p>{faq.answer}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ))}
              </div>
            </div>

            {/* Reviews */}
            <div className="st-reviews">
              <div className="st-reviews__comments-container">
                <div className="st-reviews__list">
                  {reviews.map((review, i) => (
                    <div key={i} className="st-reviews__card">
                      <div className="st-reviews__cardName">{review.name}</div>
                      <div className="st-reviews__cardRating">
                        <Star size={16} fill="#F59E0B" color="#F59E0B" />
                        <span>{review.rating}</span>
                      </div>
                      <p className="st-reviews__cardComment">{review.comment}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="st-reviews__summary">
                <div className="st-reviews__overall">
                  <span className="st-reviews__score">4.5</span>
                  <Star size={28} fill="#F59E0B" color="#F59E0B" />
                </div>
                <div className="st-reviews__count">653 reviews</div>
                <div className="st-reviews__bars">
                  {ratingBars.map(({ stars, width }) => (
                    <div key={stars} className="st-reviews__barRow">
                      <span>{stars}</span>
                      <Star size={12} fill="#F59E0B" color="#F59E0B" />
                      <div className="st-reviews__barTrack">
                        <div className="st-reviews__barFill" style={{ width: `${width}%` }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Add Review Form */}
            <div className="st-add-review">
              <h2 className="st-section-title">Add Review</h2>
              <p className="st-add-review__note">
                Your email address will not be published. Required fields are marked <span>*</span>
              </p>

              <div className="st-add-review__grid">
                <div className="st-add-review__field">
                  <label className="st-add-review__label">Name <span>*</span></label>
                  <input type="text" className="st-add-review__input" placeholder="Your Name" />
                </div>
                
                <div className="st-add-review__field">
                  <label className="st-add-review__label">Rating <span>*</span></label>
                  <div className="st-add-review__stars">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        type="button"
                        className="st-add-review__starBtn"
                        onMouseEnter={() => setHoverStar(star)}
                        onMouseLeave={() => setHoverStar(0)}
                        onClick={() => setSelectedStar(star)}
                        aria-label={`Rate ${star} stars`}
                      >
                        <Star
                          size={24}
                          fill={star <= (hoverStar || selectedStar) ? '#F59E0B' : '#D1D5DB'}
                          color={star <= (hoverStar || selectedStar) ? '#F59E0B' : '#D1D5DB'}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="st-add-review__field">
                <label className="st-add-review__label">Comment <span>*</span></label>
                <textarea
                  className="st-add-review__textarea"
                  placeholder="Your Review..."
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  rows={4}
                />
              </div>

              <button className="st-add-review__submit" type="button">
                Submit Review
              </button>
            </div>

          </div>


        </div>
      </section>

      {/* Lightbox */}
      <ImageLightbox
        images={galleryImages}
        activeIndex={lightboxIndex}
        onClose={closeLightbox}
        onNext={nextImage}
        onPrev={prevImage}
      />

      {/* Booking Modal */}
      <CheckAvailabilityModal 
        isOpen={isBookingModalOpen} 
        onClose={() => setIsBookingModalOpen(false)} 
      />
    </div>
  )
}
