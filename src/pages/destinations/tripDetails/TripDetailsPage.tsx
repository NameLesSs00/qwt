import { useState } from 'react'
import { Link } from 'react-router-dom'
import { MapPin, Star, Users, Clock, Compass, CheckCircle2, X, CalendarCheck, CalendarDays, Globe, User, ChevronUp, ChevronDown, ArrowLeft, ArrowRight } from 'lucide-react'
import { motion } from "motion/react"
import imgMain from '../../../assets/desinations/tripdetails/148.jpg'
import imgTopLeft from '../../../assets/desinations/tripdetails/pallon2.png'
import imgTopRight from '../../../assets/desinations/tripdetails/image.png'
import imgBotLeft from '../../../assets/desinations/tripdetails/pallon2.png'
import imgBotRight from '../../../assets/desinations/tripdetails/image.png'
import luxorHeroBg from '../../../assets/desinations/image.png'
import imgOffer from '../../../assets/desinations/tripdetails/offer.png'
import imgAvatar from '../../../assets/desinations/tripdetails/pallon.png'

import './tripDetailsPage.scss'

export function TripDetailsPage() {
  const [activeFaq, setActiveFaq] = useState<number | null>(0)
  const [currentReviewIdx, setCurrentReviewIdx] = useState(0)

  const faqs = [
    {
      question: "Is the hot air balloon ride safe?",
      answer: "Yes, the ride is operated by licensed and experienced pilots and follows strict safety regulations."
    },
    {
      question: "What time does the tour start?",
      answer: "The tour typically starts early in the morning, around 4:30 AM to 5:00 AM, to ensure you catch the breathtaking sunrise."
    },
    {
      question: "How long is the balloon ride?",
      answer: "The actual flight time is approximately 45 to 60 minutes, depending on the weather conditions of the day."
    }
  ]

  const reviews = [
    { name: "Wade Warren", rating: 4.75, content: "Awesome website and funnel for your business", image: imgAvatar },
    { name: "Jane Cooper", rating: 5.0, content: "The best experience ever! The views were spectacular.", image: imgAvatar },
    { name: "Esther Howard", rating: 4.5, content: "Incredible trip, highly recommended. The staff was professional.", image: imgAvatar },
    { name: "Cameron Williamson", rating: 4.0, content: "Great ride but it started a bit late. Still amazing views.", image: imgAvatar },
  ]

  const nextReview = () => {
    setCurrentReviewIdx((prev) => (prev + 1) % reviews.length)
  }

  const prevReview = () => {
    setCurrentReviewIdx((prev) => (prev - 1 + reviews.length) % reviews.length)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="tripd-page"
    >

      {/* ── Hero ── */}
      <section className="tripd-hero">
        <motion.img
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          className="tripd-heroBg"
          src={luxorHeroBg}
          alt=""
          aria-hidden="true"
        />
        <div className="tripd-heroOverlay" aria-hidden="true" />
        <div className="tripd-heroInner">
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="tripd-heroTagline"
          >
            Explore The East Of<br />The Egypt
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.22 }}
            className="tripd-heroWatermark"
          >
            EXPLORING<br /><span className="tripd-heroWatermarkBold">THE EAST</span>
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.34 }}
            className="tripd-heroCity"
          >
            LUXOR
          </motion.p>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="tripd-content">
        <div className="tripd-contentWrap">

          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="tripd-breadcrumb"
          >
            <Link to="/" className="tripd-breadcrumbLink">Home</Link>
            <span className="tripd-breadcrumbSep">&gt;</span>
            <span className="tripd-breadcrumbActive">Trip details</span>
          </motion.div>

          {/* Gallery */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="tripd-gallery"
          >

            {/* Large main image */}
            <div className="tripd-galleryMain">
              <img className="tripd-galleryImg" src={imgMain} alt="Luxor temple aerial with hot air balloon" />
            </div>

            {/* 2×2 thumbnail grid */}
            <div className="tripd-galleryGrid">
              <div className="tripd-galleryThumb">
                <img className="tripd-galleryImg" src={imgTopLeft} alt="Hot air balloon over Luxor temple" />
              </div>
              <div className="tripd-galleryThumb">
                <img className="tripd-galleryImg" src={imgTopRight} alt="Aerial view of Luxor ruins with balloon" />
              </div>
              <div className="tripd-galleryThumb">
                <img className="tripd-galleryImg" src={imgBotLeft} alt="Sunset over Luxor monument" />
              </div>
              <div className="tripd-galleryThumb">
                <img className="tripd-galleryImg" src={imgBotRight} alt="Luxor desert landscape" />
              </div>
            </div>
          </motion.div>
          
          {/* ── Main Details Split ── */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="tripd-mainSplit"
          >
            {/* Left column */}
            <div className="tripd-mainCol">
              <motion.h1
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: 0.06 }}
                className="tripd-title"
              >
                Hot Air Balloon Ride in Luxor
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.12 }}
                className="tripd-desc"
              >
                Experience a breathtaking hot air balloon ride over Luxor and witness Egypt's ancient temples from the sky at sunrise.
              </motion.p>
              
              <div className="tripd-metaBlock">
                <span className="tripd-metaItem">
                  <MapPin className="tripd-iconLine" size={16} /> Luxor
                </span>
              </div>
              
              <div className="tripd-metaBlock">
                <span className="tripd-metaItem">
                  <Star className="tripd-iconStar" size={16} /> <span className="tripd-metaStrong">4.8 Reviews</span> (25)
                </span>
              </div>

              <div className="tripd-quickInfo">
                <div className="tripd-qiItem">
                  <Users className="tripd-qiIcon" size={18} />
                  <div>
                    <span className="tripd-qiLabel">Group</span>
                    <span className="tripd-qiValue">1-4 Persons</span>
                  </div>
                </div>
                <div className="tripd-qiItem">
                  <Clock className="tripd-qiIcon" size={18} />
                  <div>
                    <span className="tripd-qiLabel">Duration</span>
                    <span className="tripd-qiValue">45–60 Minutes</span>
                  </div>
                </div>
                <div className="tripd-qiItem">
                  <Compass className="tripd-qiIcon" size={18} />
                  <div>
                    <span className="tripd-qiLabel">Tour Type</span>
                    <span className="tripd-qiValue">Adventure</span>
                  </div>
                </div>
              </div>

              <div className="tripd-section">
                <h2 className="tripd-sectionTitle">Included/Exclude</h2>
                <div className="tripd-incExc">
                  <div className="tripd-included">
                    <div className="tripd-incHeader tripd-incHeader--green">Included</div>
                    <ul className="tripd-checkList">
                      <li><CheckCircle2 fill="#10b981" color="#fff" size={18} className="tripd-clIcon" /> Hotel pickup & drop-off</li>
                      <li><CheckCircle2 fill="#10b981" color="#fff" size={18} className="tripd-clIcon" /> Hot air balloon ride (45–60 minutes)</li>
                      <li><CheckCircle2 fill="#10b981" color="#fff" size={18} className="tripd-clIcon" /> Safety briefing & professional pilot</li>
                      <li><CheckCircle2 fill="#10b981" color="#fff" size={18} className="tripd-clIcon" /> Flight certificate</li>
                    </ul>
                  </div>
                  <div className="tripd-excluded">
                    <div className="tripd-incHeader tripd-incHeader--red">Excluded</div>
                    <ul className="tripd-checkList">
                      <li><X color="#ef4444" size={16} className="tripd-clIcon" /> Personal expenses</li>
                      <li><X color="#ef4444" size={16} className="tripd-clIcon" /> Tips</li>
                    </ul>
                  </div>
                </div>
              </div>

              <div className="tripd-section">
                <div className="tripd-tabBtn">Trip Info</div>
                <div className="tripd-infoGridBox">
                  <div className="tripd-infoGrid">
                    <div className="tripd-igItem">
                      <MapPin className="tripd-igIcon" size={18} />
                      <div>
                        <span className="tripd-igLabel">Location</span>
                        <span className="tripd-igValue">Luxor</span>
                      </div>
                    </div>
                    <div className="tripd-igItem">
                      <Clock className="tripd-igIcon" size={18} />
                      <div>
                        <span className="tripd-igLabel">Duration</span>
                        <span className="tripd-igValue">45–60 Minutes</span>
                      </div>
                    </div>
                    <div className="tripd-igItem">
                      <CalendarCheck className="tripd-igIcon" size={18} />
                      <div>
                        <span className="tripd-igLabel">Time Start</span>
                        <span className="tripd-igValue">Early Morning (Sunrise)</span>
                      </div>
                    </div>
                    <div className="tripd-igItem">
                      <CalendarDays className="tripd-igIcon" size={18} />
                      <div>
                        <span className="tripd-igLabel">Availability</span>
                        <span className="tripd-igValue">Daily</span>
                      </div>
                    </div>
                    <div className="tripd-igItem">
                      <Globe className="tripd-igIcon" size={18} />
                      <div>
                        <span className="tripd-igLabel">Language</span>
                        <span className="tripd-igValue">English / Arabic</span>
                      </div>
                    </div>
                    <div className="tripd-igItem">
                      <Users className="tripd-igIcon" size={18} />
                      <div>
                        <span className="tripd-igLabel">Group</span>
                        <span className="tripd-igValue">1-4 Persons</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="tripd-sideCol">
              <div className="tripBookingCard">
                <div className="tripBookingCard-duration">
                  <Clock size={16} className="tripBookingCard-iconBlue" />
                  <div>
                    <span className="tripBookingCard-label">Duration</span>
                    <span className="tripBookingCard-value">45–60 Minutes</span>
                  </div>
                </div>
                
                <div className="tripBookingCard-row">
                  <div className="tripBookingCard-personType">
                    <User size={16} className="tripBookingCard-iconBlue" /> Adult
                  </div>
                  <div className="tripBookingCard-priceBox">
                    <span className="tripBookingCard-label">From</span>
                    <span className="tripBookingCard-price">$30/Person</span>
                  </div>
                </div>
                
                <div className="tripBookingCard-row tripBookingCard-row--bordered">
                  <div className="tripBookingCard-personType">
                    <Users size={16} className="tripBookingCard-iconBlue" /> Children 3-11 Years
                  </div>
                  <div className="tripBookingCard-priceBox">
                    <span className="tripBookingCard-label">From</span>
                    <span className="tripBookingCard-price">$20/Person</span>
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  className="tripBookingCard-btn"
                  type="button"
                >
                  Check Availability
                </motion.button>
              </div>

              <div className="tripOfferCard">
                <div className="tripOfferCard-content">
                  <p className="tripOfferCard-text">Get 30% Offer on<br/>Your Next Trip</p>
                  <motion.button
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className="tripOfferCard-btn"
                    type="button"
                  >
                    Book Now
                  </motion.button>
                </div>
                <img className="tripOfferCard-img" src={imgOffer} alt="30% Offer" />
              </div>
            </div>
          </motion.div>

          {/* ── Bottom Info Row ── */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="tripd-bottomRow"
          >
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="tripd-highlightsCard"
            >
              <h3 className="tripd-bottomTitle">Tour Highlights</h3>
              <ul className="tripd-checkList">
                <li><CheckCircle2 fill="#22c55e" color="#fff" size={18} className="tripd-clIcon" /> Sunrise balloon ride over Luxor</li>
                <li><CheckCircle2 fill="#22c55e" color="#fff" size={18} className="tripd-clIcon" /> Aerial views of ancient temples</li>
                <li><CheckCircle2 fill="#22c55e" color="#fff" size={18} className="tripd-clIcon" /> Professional pilots & full safety</li>
                <li><CheckCircle2 fill="#22c55e" color="#fff" size={18} className="tripd-clIcon" /> Perfect for photos & memories</li>
              </ul>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.08 }}
              className="tripd-faqCard"
            >
              <h3 className="tripd-bottomTitle">Frequently Asked Questions?</h3>
              <div className="tripd-faqList">
                {faqs.map((faq, idx) => {
                  const isActive = activeFaq === idx
                  return (
                    <div key={idx} className={`tripd-faqItem ${isActive ? 'tripd-faqItem--active' : ''}`}>
                      <motion.div
                        whileTap={{ scale: 0.995 }}
                        className="tripd-faqHeader"
                        onClick={() => setActiveFaq(isActive ? null : idx)}
                      >
                        <span>{faq.question}</span>
                        {isActive ? <ChevronUp size={20} className="tripd-faqIcon" /> : <ChevronDown size={20} className="tripd-faqIcon" />}
                      </motion.div>
                      {isActive && (
                        <div className="tripd-faqBody">
                          {faq.answer}
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            </motion.div>
          </motion.div>

          {/* ── Reviews Section ── */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="tripd-reviewsSection"
          >
            <div className="tripd-reviewsSplit">
              
              {/* Summary Left */}
              <div className="tripd-reviewsLeft">
                <div className="tripd-rsScore">
                  <span className="tripd-rsBig">4.5</span>
                  <Star fill="#f59e0b" color="#f59e0b" size={32} />
                  <div className="tripd-rsCountBadge">653 reviews</div>
                </div>
                <div className="tripd-rsBars">
                  {[5, 4, 3, 2, 1].map(stars => (
                    <div className="tripd-rsBarRow" key={stars}>
                      <span className="tripd-rsBarLabel">{stars} <Star fill="#f59e0b" color="#f59e0b" size={12} /></span>
                      <div className="tripd-rsBarTrack">
                        <div className="tripd-rsBarFill" style={{ width: stars === 5 ? '80%' : stars === 4 ? '50%' : stars === 3 ? '40%' : stars === 2 ? '20%' : '10%' }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Slider Right */}
              <div className="tripd-reviewsRight">
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="tripd-sliderBtn"
                  onClick={prevReview}
                  aria-label="Previous Review"
                  type="button"
                >
                  <ArrowLeft size={20} />
                </motion.button>
                <div className="tripd-reviewCard">
                  <img src={reviews[currentReviewIdx].image} alt={reviews[currentReviewIdx].name} className="tripd-rcAvatar" />
                  <div className="tripd-rcRating">
                    <Star fill="#f59e0b" color="#f59e0b" size={16} /> {reviews[currentReviewIdx].rating}
                  </div>
                  <div className="tripd-rcName">{reviews[currentReviewIdx].name}</div>
                  <div className="tripd-rcContent">{reviews[currentReviewIdx].content}</div>
                </div>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="tripd-sliderBtn"
                  onClick={nextReview}
                  aria-label="Next Review"
                  type="button"
                >
                  <ArrowRight size={20} />
                </motion.button>
              </div>

            </div>

            {/* Add Review Form */}
            <div className="tripd-addReview">
              <h3 className="tripd-arTitle">Add Review</h3>
              <p className="tripd-arDesc">
                Your email address will not be published. Required fields are marked <span style={{ color: '#ef4444' }}>*</span>
              </p>
              
              <div className="tripd-arRatingInput">
                <span className="tripd-arLabel">Review</span>
                <div className="tripd-arStars">
                  {[1, 2, 3, 4, 5].map(star => (
                    <Star key={star} size={20} fill="#e2e8f0" color="#e2e8f0" className="tripd-arStarEmpty" />
                  ))}
                </div>
              </div>

              <div className="tripd-arFormGroup">
                <span className="tripd-arLabel">Comment</span>
                <textarea className="tripd-arTextarea" placeholder="Text..." rows={4}></textarea>
              </div>

              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="tripd-arSubmitBtn"
                type="button"
              >
                Submit Review
              </motion.button>
            </div>
          </motion.div>

        </div>
      </section>
    </motion.div>
  )
}
