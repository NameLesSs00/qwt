import { Link } from 'react-router-dom'
import { motion } from "motion/react"
import luxorHeroBg from '../../../assets/desinations/image.png'
import imgCard1 from '../../../assets/desinations/luxor.jpg'
import imgCard3 from '../../../assets/desinations/image1.jpg'
// @ts-ignore – Vite resolves filenames with spaces via ?url
import imgCard2 from '../../../assets/desinations/d4irzigou51qb9huuot0 (5).png'
import iconClock from '../../../assets/desinations/8.svg'
import iconPin from '../../../assets/desinations/6.svg'
import iconGroup from '../../../assets/desinations/5.svg'
import iconStar from '../../../assets/desinations/7.svg'
import iconDollar from '../../../assets/desinations/3.svg'
import iconChevron from '../../../assets/desinations/1.svg'

import './luxorPage.scss'

interface Trip {
  id: number
  tag: string
  title: string
  duration: string
  location: string
  groupType: string
  rating: number
  reviews: number
  price: number
  image: string
}

const trips: Trip[] = [
  {
    id: 1,
    tag: 'Historical Trip',
    title: 'Luxor Day Tour',
    duration: 'Full Day',
    location: 'Luxor',
    groupType: 'Small Group',
    rating: 4.8,
    reviews: 420,
    price: 85,
    image: imgCard1,
  },
  {
    id: 2,
    tag: 'Historical Trip',
    title: 'Luxor Day Tour',
    duration: 'Full Day',
    location: 'Luxor',
    groupType: 'Small Group',
    rating: 4.8,
    reviews: 420,
    price: 85,
    image: imgCard2,
  },
  {
    id: 3,
    tag: 'Historical Trip',
    title: 'Luxor Day Tour',
    duration: 'Full Day',
    location: 'Luxor',
    groupType: 'Small Group',
    rating: 4.8,
    reviews: 420,
    price: 85,
    image: imgCard2,
  },
  {
    id: 4,
    tag: 'Historical Trip',
    title: 'Luxor Day Tour',
    duration: 'Full Day',
    location: 'Luxor',
    groupType: 'Small Group',
    rating: 4.8,
    reviews: 420,
    price: 85,
    image: imgCard3,
  },
  {
    id: 5,
    tag: 'Historical Trip',
    title: 'Luxor Day Tour',
    duration: 'Full Day',
    location: 'Luxor',
    groupType: 'Small Group',
    rating: 4.8,
    reviews: 420,
    price: 85,
    image: imgCard3,
  },
]

export function LuxorPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="luxor-page"
    >

      {/* ── Hero ── */}
      <section className="luxor-hero">
        <motion.img
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          className="luxor-heroBg"
          src={luxorHeroBg}
          alt=""
          aria-hidden="true"
        />
        <div className="luxor-heroOverlay" aria-hidden="true" />
        <div className="luxor-heroInner">
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="luxor-heroTagline"
          >
            Explore The East Of<br />The Egypt
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.22 }}
            className="luxor-heroWatermark"
          >
            EXPLORING<br /><span className="luxor-heroWatermarkBold">THE EAST</span>
          </motion.p>
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.34 }}
            className="luxor-heroCity"
          >
            LUXOR
          </motion.p>
        </div>
      </section>

      {/* ── Content ── */}
      <section className="luxor-content">
        <div className="luxor-contentWrap">

          {/* Top bar */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="luxor-topBar"
          >
            <span className="luxor-tripsCount">5 Trips Found</span>

            <div className="luxor-breadcrumb">
              <Link to="/" className="luxor-breadcrumbLink">Home</Link>
              <span className="luxor-breadcrumbSep">&gt;</span>
              <Link to="/destinations" className="luxor-breadcrumbLink">Destination</Link>
              <span className="luxor-breadcrumbSep">&gt;</span>
              <span className="luxor-breadcrumbActive">Luxor</span>
            </div>

            <div className="luxor-sortWrap">
              <label className="luxor-sortLabel" htmlFor="luxor-sort">Sort by</label>
              <div className="luxor-selectWrap">
                <select className="luxor-select" id="luxor-sort">
                  <option>Latest</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Top Rated</option>
                </select>
                <img className="luxor-selectChevron" src={iconChevron} alt="" aria-hidden="true" />
              </div>
            </div>
          </motion.div>

          {/* Grid */}
          <div className="luxor-grid">
            {trips.map((trip) => (
              <motion.article
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: trip.id * 0.05 }}
                whileHover={{ y: -6 }}
                key={trip.id}
                className="luxor-card"
              >
                <div className="luxor-cardImgWrap">
                  <img className="luxor-cardImg" src={trip.image} alt={trip.title} />
                </div>
                <div className="luxor-cardBody">
                  <p className="luxor-cardTag">{trip.tag}</p>
                  <h3 className="luxor-cardTitle">{trip.title}</h3>
                  <div className="luxor-cardMeta">
                    <span className="luxor-cardMetaItem">
                      <img src={iconClock} alt="" aria-hidden="true" className="luxor-cardMetaIcon" />
                      {trip.duration}
                    </span>
                    <span className="luxor-cardMetaDot" aria-hidden="true" />
                    <span className="luxor-cardMetaItem">
                      <img src={iconPin} alt="" aria-hidden="true" className="luxor-cardMetaIcon" />
                      {trip.location}
                    </span>
                    <span className="luxor-cardMetaDot" aria-hidden="true" />
                    <span className="luxor-cardMetaItem">
                      <img src={iconGroup} alt="" aria-hidden="true" className="luxor-cardMetaIcon" />
                      {trip.groupType}
                    </span>
                  </div>
                  <div className="luxor-cardFooter">
                    <span className="luxor-cardRating">
                      <img src={iconStar} alt="Rating" className="luxor-cardRatingIcon" />
                      {trip.rating} ({trip.reviews} Reviews)
                    </span>
                    <span className="luxor-cardPrice">
                      <img src={iconDollar} alt="Price" className="luxor-cardPriceIcon" />
                      <span className="luxor-cardPriceValue">{trip.price} USA</span>
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>

        </div>
      </section>
    </motion.div>
  )
}
