import { useState, useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { fadeUp, fadeLeft, fadeRight, stagger, viewport } from '../../../lib/animations'
import { getDestinationImageUrl, getDestinations, type DestinationDto } from '../../../api/destinationsApi'
import { getTrips } from '../../../api/tripsApi'
import '../styles/destinations.scss'

export function Destinations() {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const [destinations, setDestinations] = useState<DestinationDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchDestinations = async () => {
      try {
        setLoading(true)
        setError('')
        const res = await getDestinations(1, 6, undefined, i18n.language)
        const dests = res.data || []
        
        // Fetch all trips to calculate accurate counts manually
        try {
          const tripsRes = await getTrips({ PageSize: 1000 })
          const allTrips = tripsRes.data || []
          
          const updatedDests = dests.map(dest => {
            const count = allTrips.filter(trip => 
              (trip.destinationInfo?.name === dest.name) || (trip.destination === dest.name)
            ).length
            return { ...dest, tripsCount: count }
          })
          setDestinations(updatedDests)
        } catch (tripErr) {
          console.error("Failed to fetch trips for counting", tripErr)
          setDestinations(dests)
        }
      } catch (err) {
        setError('Unable to load destinations')
      } finally {
        setLoading(false)
      }
    }
    fetchDestinations()
  }, [i18n.language])

  const visibleDestinations = useMemo(() => destinations.slice(0, 3), [destinations])
  const left = visibleDestinations.slice(0, 2)
  const right = visibleDestinations[2]

  return (
    <section className="home-destinations">
      <div className="home-destinations__inner">

        {/* Header */}
        <motion.header
          className="home-destinations__header"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <h2 className="home-destinations__title">
            {t('homePage.destinations.title')}{' '}
            <span className="home-destinations__titleAccent">{t('homePage.destinations.titleAccent')}</span>
          </h2>
          <p className="home-destinations__sub">
            {t('homePage.destinations.sub')}
          </p>
        </motion.header>

        <div className="home-destinations__grid">

          {/* Left column – slides from left, staggered */}
          <motion.div
            className="home-destinations__left"
            variants={stagger(0.18)}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            {loading ? (
            <div style={{ padding: '40px 0', color: '#64748b', textAlign: 'center', width: '100%' }}>
              Loading destinations...
            </div>
          ) : error ? (
            <div style={{ padding: '40px 0', color: '#ef4444', textAlign: 'center', width: '100%' }}>
              {error}
            </div>
          ) : left.length > 0 ? (
            left.map((d) => (
              <motion.article
                key={d.id}
                className="destination-card destination-card--small"
                variants={fadeLeft}
                whileHover="hover"
                style={{ overflow: 'hidden', cursor: 'pointer' }}
                onClick={() => navigate(`/trips?destination=${encodeURIComponent(d.name)}`)}
              >
                <motion.img
                  className="destination-card__img"
                  src={getDestinationImageUrl(d.imageUrl)}
                  alt={d.name}
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                />
                <div className="destination-card__overlay" aria-hidden="true" />
                <div className="destination-card__ribbon" aria-hidden="true">
                  <span>{t('homePage.destinations.toursCount', { count: d.tripsCount || 0 })}</span>
                </div>
                <div className="destination-card__text">
                  <span className="destination-card__kicker">{t('homePage.destinations.travelTo')}</span>
                  <span className="destination-card__name">{d.name}</span>
                </div>
              </motion.article>
            ))
          ) : (
            <div style={{ padding: '40px 0', color: '#64748b', textAlign: 'center', width: '100%' }}>
              No destinations found.
            </div>
          )}
          </motion.div>

          {/* Right card – slides from right */}
          {right ? (
            <motion.article
              className="destination-card destination-card--large"
              variants={fadeRight}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              style={{ overflow: 'hidden', cursor: 'pointer' }}
              onClick={() => navigate(`/trips?destination=${encodeURIComponent(right.name)}`)}
            >
              <motion.img
                className="destination-card__img"
                src={getDestinationImageUrl(right.imageUrl)}
                alt={right.name}
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
              />
              <div className="destination-card__overlay" aria-hidden="true" />
              <div className="destination-card__ribbon" aria-hidden="true">
                <span>{t('homePage.destinations.toursCount', { count: right.tripsCount || 0 })}</span>
              </div>
              <div className="destination-card__text">
                <span className="destination-card__kicker">{t('homePage.destinations.travelTo')}</span>
                <span className="destination-card__name">{right.name}</span>
              </div>
            </motion.article>
          ) : null}
        </div>

        {/* More button */}
        <motion.div
          className="home-destinations__more"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <motion.button
            type="button"
            className="home-destinations__moreBtn"
            whileHover={{ scale: 1.06, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 350, damping: 18 }}
            onClick={() => navigate('/trips')}
          >
            {t('homePage.destinations.seeMore')}
          </motion.button>
        </motion.div>

      </div>
    </section>
  )
}
