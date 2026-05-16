import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Variants } from 'framer-motion'
import starIcon    from '../../../assets/images/towns/mingcute_star-fill.svg'
import beachImage  from '../../../assets/images/towns/bech.png'
import templesImage from '../../../assets/images/towns/temples.jpg'
import desertImage from '../../../assets/images/towns/desert.jpg'
import balloonImage from '../../../assets/images/towns/pallon.jpg'
import divingImage from '../../../assets/images/towns/diving.jpg'
import { fadeUp, stagger, viewport } from '../../../lib/animations'
import '../styles/popularTours.scss'

type Category = 'All' | 'Sea Trips' | 'Historical Trip' | 'Safari Trips'

type Tour = {
  id: string; category: Exclude<Category, 'All'>; title: string; location: string
  duration: string; groupType: string; rating: number; reviews: number
  price: number; image: string; tag: string
}

// Card enters from below with a spring
const cardVariant: Variants = {
  hidden:  { opacity: 0, y: 48, scale: 0.95 },
  visible: { opacity: 1, y: 0,  scale: 1, transition: { type: 'spring', stiffness: 200, damping: 22 } },
}

export function PopularTours() {
  const categories: Category[] = ['All', 'Sea Trips', 'Historical Trip', 'Safari Trips']
  const [activeCategory, setActiveCategory] = useState<Category>('All')

  const tours = useMemo<Tour[]>(
    () => [
      { id: 'beach-bay',      category: 'Sea Trips',       tag: 'Sea Trip',        title: 'The Bay Island Trip',             location: 'Hurghada',        duration: 'Full Day',  groupType: 'Small Group', rating: 4.7, reviews: 345, price: 30.6, image: beachImage   },
      { id: 'luxor-day',      category: 'Historical Trip', tag: 'Historical Trip', title: 'Luxor Day Tour',                  location: 'Luxor',           duration: 'Full Day',  groupType: 'Small Group', rating: 4.8, reviews: 420, price: 85,   image: templesImage },
      { id: 'quad-adventure', category: 'Safari Trips',    tag: 'Safari Trip',     title: 'Desert Safari Quad Adventure',    location: 'Hurghada Desert', duration: '4 Hours',   groupType: 'Private',     rating: 4.8, reviews: 345, price: 26.8, image: desertImage  },
      { id: 'luxor-balloon',  category: 'Historical Trip', tag: 'Adventure',       title: 'Hot Air Balloon Ride in Luxor',   location: 'Luxor',           duration: '45-60 Min', groupType: 'Group',       rating: 4.7, reviews: 500, price: 25,   image: balloonImage },
      { id: 'snorkeling',     category: 'Sea Trips',       tag: 'Sea Trip',        title: 'Snorkeling Trip to Coral Reef',   location: 'Hurghada',        duration: 'Full Day',  groupType: 'Group',       rating: 4.7, reviews: 500, price: 25,   image: divingImage  },
    ],
    [],
  )

  const visibleTours = useMemo(
    () => activeCategory === 'All' ? tours : tours.filter((t) => t.category === activeCategory),
    [activeCategory, tours],
  )

  const shouldMarquee = visibleTours.length >= 4

  const displayTours = useMemo(
    () => shouldMarquee ? [...visibleTours, ...visibleTours, ...visibleTours] : visibleTours,
    [visibleTours, shouldMarquee],
  )

  return (
    <section className="popular-tours">
      <div className="popular-tours__headerWrap">
        <div className="popular-tours__header">

          {/* Title fades up */}
          <motion.h2
            className="popular-tours__eyebrow"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            Most Popular{' '}
            <span className="popular-tours__eyebrowScript">Tours</span>
          </motion.h2>

          {/* Subtitle fades up with slight delay */}
          <motion.p
            className="popular-tours__sub"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            transition={{ delay: 0.1 }}
          >
            Top-rated tours loved by our travelers
          </motion.p>

          {/* Category tabs – stagger in */}
          <motion.div
            className="popular-tours__tabs"
            variants={stagger(0.08, 0.2)}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            {categories.map((cat) => {
              const isActive = cat === activeCategory
              return (
                <motion.button
                  key={cat}
                  type="button"
                  className={`popular-tours__tab ${isActive ? 'is-active' : ''}`}
                  aria-selected={isActive}
                  onClick={() => setActiveCategory(cat)}
                  variants={{ hidden: { opacity: 0, y: -16 }, visible: { opacity: 1, y: 0 } }}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  animate={isActive ? { scale: 1.08 } : { scale: 1 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 18 }}
                >
                  {cat}
                </motion.button>
              )
            })}
          </motion.div>
        </div>
      </div>

      <div className="popular-tours__contentWrap">
        {/* Cards – when NOT marquee, stagger animate in; AnimatePresence handles filter changes */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            className={`popular-tours__track ${shouldMarquee ? 'is-marquee' : 'is-centered'}`}
            variants={shouldMarquee ? undefined : stagger(0.12, 0.05)}
            initial={shouldMarquee ? undefined : 'hidden'}
            animate={shouldMarquee ? undefined : 'visible'}
            exit={{ opacity: 0, transition: { duration: 0.2 } }}
          >
            {displayTours.map((tour, index) => (
              <motion.article
                key={`${tour.id}-${index}`}
                className="tour-card"
                variants={shouldMarquee ? undefined : cardVariant}
                whileHover={
                  shouldMarquee
                    ? undefined
                    : { y: -8, boxShadow: '0 22px 48px rgba(30,101,158,0.16)', transition: { type: 'spring', stiffness: 280, damping: 20 } }
                }
              >
                {/* Image zooms on card hover */}
                <div className="tour-card__imageWrap" style={{ overflow: 'hidden' }}>
                  <motion.img
                    className="tour-card__image"
                    src={tour.image}
                    alt={tour.title}
                    draggable="false"
                    whileHover={{ scale: 1.08, transition: { duration: 0.4, ease: 'easeOut' } }}
                  />
                  <div className="tour-card__ribbon">
                    <span>T.R</span>
                  </div>
                </div>

                <div className="tour-card__body">
                  <p className="tour-card__tag">{tour.tag}</p>
                  <h3 className="tour-card__title">{tour.title}</h3>

                  <div className="tour-card__metaRow">
                    <span className="tour-card__metaItem">
                      <span className="tour-card__metaIcon">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 7V12L15 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" stroke="currentColor" strokeWidth="2" />
                        </svg>
                      </span>
                      {tour.duration}
                    </span>
                    <span className="tour-card__metaItem">
                      <span className="tour-card__metaIcon">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 21s7-4.35 7-11a7 7 0 1 0-14 0c0 6.65 7 11 7 11Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                          <path d="M12 10.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" fill="currentColor" />
                        </svg>
                      </span>
                      {tour.location}
                    </span>
                    <span className="tour-card__metaItem">
                      <span className="tour-card__metaIcon">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          <path d="M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" stroke="currentColor" strokeWidth="2" />
                        </svg>
                      </span>
                      {tour.groupType}
                    </span>
                  </div>

                  <div className="tour-card__stats">
                    <span className="tour-card__rating">
                      <img src={starIcon} alt="" />
                      <span>{tour.rating.toFixed(1)}</span>
                      <span className="tour-card__reviews">({tour.reviews} Review)</span>
                    </span>
                    <span className="tour-card__price">
                      <span className="tour-card__currency">$</span>
                      <span>{tour.price.toFixed(1)} USA</span>
                    </span>
                  </div>

                  <div className="tour-card__actions">
                    <motion.button
                      type="button"
                      className="tour-card__btnBook"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                    >
                      Book Now
                    </motion.button>
                    <motion.button
                      type="button"
                      className="tour-card__btnCart"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                    >
                      Add To cart
                    </motion.button>
                  </div>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </AnimatePresence>

        <motion.div
          className="popular-tours__more"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <motion.button
            type="button"
            className="popular-tours__moreBtn"
            whileHover={{ scale: 1.06, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 360, damping: 18 }}
          >
            See More
          </motion.button>
        </motion.div>
      </div>
    </section>
  )
}