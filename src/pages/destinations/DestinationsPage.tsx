import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import bg from '../../assets/desinations/bg.png'
import bg2 from '../../assets/desinations/bg2.png'
import { motion } from 'motion/react'
import { getDestinations, getDestinationImageUrl, type DestinationDto } from '../../api/destinationsApi'

import './destinationsPage.scss'

export function DestinationsPage() {
  const navigate = useNavigate()
  const { i18n } = useTranslation()
  const [destinations, setDestinations] = useState<DestinationDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setLoading(true)
        setError('')
        const res = await getDestinations(1, 12, undefined, i18n.language)
        setDestinations(res.data || [])
      } catch (err) {
        setError('Unable to load destinations.')
      } finally {
        setLoading(false)
      }
    }
    fetchDestinations()
  }, [i18n.language])

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
            {loading ? (
            <div style={{ padding: '40px 0', width: '100%', textAlign: 'center', color: '#64748b' }}>
              Loading destinations...
            </div>
          ) : error ? (
            <div style={{ padding: '40px 0', width: '100%', textAlign: 'center', color: '#dc2626' }}>
              {error}
            </div>
          ) : destinations.length === 0 ? (
            <div style={{ padding: '40px 0', width: '100%', textAlign: 'center', color: '#64748b' }}>
              No destinations found.
            </div>
          ) : (
            destinations.map((destination, index) => (
              <motion.article
                key={destination.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.05 + index * 0.05 }}
                whileHover={{ y: -6 }}
                className="destinationCard"
                style={{ cursor: 'pointer' }}
                onClick={() => navigate(`/trips?destination=${encodeURIComponent(destination.name)}`)}
              >
                <img className="destinationMedia" src={getDestinationImageUrl(destination.imageUrl)} alt={destination.name} />
                <div className="destinationShade" aria-hidden="true"></div>
                <div className="destinationBookmark" aria-hidden="true">
                  <span>{destination.tripsCount} Tours</span>
                </div>
                <div className="destinationText">
                  <span className="destinationKicker">Travel To</span>
                  <span className="destinationName">{destination.name}</span>
                </div>
              </motion.article>
            ))
          )}
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
