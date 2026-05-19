import { useNavigate } from 'react-router-dom'
import bg from '../../assets/desinations/bg.png'
import bg2 from '../../assets/desinations/bg2.png'
import aswanImg from '../../assets/desinations/aswan.jpg'
import gizaImg from '../../assets/desinations/giza.jpg'
import hurghadaImg from '../../assets/desinations/hurghada.jpg'
import luxorImg from '../../assets/desinations/luxor.jpg'
import sharmImg from '../../assets/desinations/sharm.png'

import { motion } from "motion/react"

import './destinationsPage.scss'

export function DestinationsPage() {
  const navigate = useNavigate()
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="destinations-page"
    >
      <section className="destinations-hero" style={{ ['--hero-bg' as any]: `url(${bg})` }}>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="destinations-heroOverlay"
          aria-hidden="true"
        ></motion.div>
        <div className="destinations-heroInner">
          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="destinations-heroKicker"
          >
            Destination
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.2 }}
            className="destinations-heroTitle"
          >
            Where Will You Go Next
          </motion.h1>
        </div>
      </section>

      <section className="destinations-section">
        <div className="destinations-wrap">
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="destinations-breadcrumb"
          >
            <span>Home</span>
            <span className="destinations-breadcrumbSep">&gt;</span>
            <span className="destinations-breadcrumbActive">Destination</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="destinations-heading"
          >
            Go Exotic Places
          </motion.h2>

          <div className="destinations-grid">
            <motion.article
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.05 }}
              whileHover={{ y: -6 }}
              className="destinationCard destinationCardAswan"
            >
              <img className="destinationMedia" src={aswanImg} alt="Aswan" />
              <div className="destinationShade" aria-hidden="true"></div>
              <div className="destinationBookmark" aria-hidden="true">
                <span>5 Tours</span>
              </div>
              <div className="destinationText">
                <span className="destinationKicker">Travel To</span>
                <span className="destinationName">Aswan</span>
              </div>
            </motion.article>

            <motion.article
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.1 }}
              whileHover={{ y: -6 }}
              className="destinationCard destinationCardHurghada"
            >
              <img className="destinationMedia" src={hurghadaImg} alt="Hurghada" />
              <div className="destinationShade" aria-hidden="true"></div>
              <div className="destinationBookmark destinationBookmarkBlue" aria-hidden="true">
                <span>12 Tours</span>
              </div>
              <div className="destinationText">
                <span className="destinationKicker">Travel To</span>
                <span className="destinationName">Hurghada</span>
              </div>
            </motion.article>

            <motion.article
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.15 }}
              whileHover={{ y: -6 }}
              className="destinationCard destinationCardGiza"
            >
              <img className="destinationMedia" src={gizaImg} alt="Giza" />
              <div className="destinationShade" aria-hidden="true"></div>
              <div className="destinationBookmark" aria-hidden="true">
                <span>8 Tours</span>
              </div>
              <div className="destinationText">
                <span className="destinationKicker">Travel To</span>
                <span className="destinationName">Giza</span>
              </div>
            </motion.article>

            <motion.article
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.2 }}
              whileHover={{ y: -6 }}
              className="destinationCard destinationCardLuxor"
            >
              <img className="destinationMedia" src={luxorImg} alt="Luxor" />
              <div className="destinationShade" aria-hidden="true"></div>
              <div className="destinationBookmark" aria-hidden="true">
                <span>7 Tours</span>
              </div>
              <div className="destinationText">
                <span className="destinationKicker">Travel To</span>
                <span className="destinationName">Luxor</span>
              </div>
            </motion.article>

            <motion.article
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.25 }}
              whileHover={{ y: -6 }}
              className="destinationCard destinationCardSharm"
            >
              <img className="destinationMedia" src={sharmImg} alt="Sharm El Sheikh" />
              <div className="destinationShade" aria-hidden="true"></div>
              <div className="destinationBookmark" aria-hidden="true">
                <span>10 Tours</span>
              </div>
              <div className="destinationText">
                <span className="destinationKicker">Travel To</span>
                <span className="destinationName">Sharm El Sheikh</span>
              </div>
            </motion.article>
          </div>
        </div>
      </section>

      <section className="destinations-cta" aria-label="Call to action">
        <img className="destinations-ctaBgImg" src={bg2} alt="" aria-hidden="true" />
        <div className="destinations-ctaOverlay" aria-hidden="true"></div>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="destinations-ctaInner"
        >
          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="destinations-ctaTitle"
          >
            Ready to travel with real adventure and enjoy natural
          </motion.h2>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="destinations-ctaBtn"
            type="button"
            onClick={() => navigate('/trips')}
          >
            Explore Trips
          </motion.button>
        </motion.div>
      </section>
    </motion.div>
  )
}
