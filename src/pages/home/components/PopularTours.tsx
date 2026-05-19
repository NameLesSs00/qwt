import { useMemo, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import type { Variants } from 'framer-motion'
import { Loader2 } from 'lucide-react'

import { getTrips, getTripImageUrl, type DtoTripRead } from '../../../api/tripsApi'
import { getTripTypes, type TripTypeDto } from '../../../api/tripTypesApi'

import beachImage   from '../../../assets/images/towns/bech.png'
import templesImage from '../../../assets/images/towns/temples.jpg'
import desertImage  from '../../../assets/images/towns/desert.jpg'
import balloonImage from '../../../assets/images/towns/pallon.jpg'
import divingImage  from '../../../assets/images/towns/diving.jpg'

import { fadeUp, stagger, viewport } from '../../../lib/animations'
import '../styles/popularTours.scss'

const fallbackImages = [beachImage, templesImage, desertImage, balloonImage, divingImage]

// Card enters from below with a spring
const cardVariant: Variants = {
  hidden:  { opacity: 0, y: 48, scale: 0.95 },
  visible: { opacity: 1, y: 0,  scale: 1, transition: { type: 'spring', stiffness: 200, damping: 22 } },
}

function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function getTripPrimaryImage(trip: DtoTripRead, index: number): string {
  const primary = trip.images?.find(i => i.isPrimary)?.imageUrl
  const first   = trip.images?.[0]?.imageUrl
  const url     = primary || first
  return url ? getTripImageUrl(url) : fallbackImages[index % fallbackImages.length]
}

export function PopularTours() {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()

  const [trips,     setTrips]     = useState<DtoTripRead[]>([])
  const [tripTypes, setTripTypes] = useState<TripTypeDto[]>([])
  const [loading,   setLoading]   = useState(true)
  const [activeTypeId, setActiveTypeId] = useState<number | null>(null) // null = "All"

  // Fetch trips & trip types in parallel on mount and on language change
  useEffect(() => {
    let active = true
    setLoading(true)

    Promise.all([
      getTrips({ PageSize: 10 }),
      getTripTypes(1, 50),
    ])
      .then(([tripsRes, typesRes]) => {
        if (!active) return
        if (tripsRes.success && tripsRes.data) setTrips(tripsRes.data)
        if (typesRes.success && typesRes.data)  setTripTypes(typesRes.data)
      })
      .catch(err => console.error('Failed to load popular tours', err))
      .finally(() => { if (active) setLoading(false) })

    return () => { active = false }
  }, [i18n.language])

  // Client-side filter: compare trip.tripTypeName case-insensitively to selected type name
  const activeTypeName = useMemo(
    () => tripTypes.find(t => t.id === activeTypeId)?.name ?? null,
    [tripTypes, activeTypeId],
  )

  const visibleTrips = useMemo(() => {
    if (!activeTypeName) return trips
    const lower = activeTypeName.toLowerCase()
    return trips.filter(t => (t.tripTypeName ?? '').toLowerCase() === lower)
  }, [trips, activeTypeName])

  const shouldMarquee = visibleTrips.length >= 4
  const displayTrips  = useMemo(
    () => shouldMarquee ? [...visibleTrips, ...visibleTrips, ...visibleTrips] : visibleTrips,
    [visibleTrips, shouldMarquee],
  )

  const handleTrip = (trip: DtoTripRead) => {
    const slug = toSlug(trip.name || 'trip')
    navigate(`/trips/${trip.id}/${slug}`)
  }

  return (
    <section className="popular-tours">
      <div className="popular-tours__headerWrap">
        <div className="popular-tours__header">

          {/* Title */}
          <motion.h2
            className="popular-tours__eyebrow"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            {t('homePage.popularTours.eyebrow')}{' '}
            <span className="popular-tours__eyebrowScript">{t('homePage.popularTours.eyebrowScript')}</span>
          </motion.h2>

          {/* Subtitle */}
          <motion.p
            className="popular-tours__sub"
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
            transition={{ delay: 0.1 }}
          >
            {t('homePage.popularTours.subtitle')}
          </motion.p>

          {/* Category tabs — loaded from backend, case-insensitive */}
          {!loading && tripTypes.length > 0 && (
            <motion.div
              className="popular-tours__tabs"
              variants={stagger(0.08, 0.2)}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
            >
              {/* "All" tab */}
              <motion.button
                key="all"
                type="button"
                className={`popular-tours__tab ${activeTypeId === null ? 'is-active' : ''}`}
                aria-selected={activeTypeId === null}
                onClick={() => setActiveTypeId(null)}
                variants={{ hidden: { opacity: 0, y: -16 }, visible: { opacity: 1, y: 0 } }}
                whileHover={{ scale: 1.06 }}
                whileTap={{ scale: 0.94 }}
                animate={activeTypeId === null ? { scale: 1.08 } : { scale: 1 }}
                transition={{ type: 'spring', stiffness: 380, damping: 18 }}
              >
                {t('homePage.popularTours.all')}
              </motion.button>

              {/* Dynamic type tabs */}
              {tripTypes.map(type => (
                <motion.button
                  key={type.id}
                  type="button"
                  className={`popular-tours__tab ${activeTypeId === type.id ? 'is-active' : ''}`}
                  aria-selected={activeTypeId === type.id}
                  onClick={() => setActiveTypeId(type.id)}
                  variants={{ hidden: { opacity: 0, y: -16 }, visible: { opacity: 1, y: 0 } }}
                  whileHover={{ scale: 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  animate={activeTypeId === type.id ? { scale: 1.08 } : { scale: 1 }}
                  transition={{ type: 'spring', stiffness: 380, damping: 18 }}
                >
                  {t('tripTypes.' + type.name.toLowerCase().replace(/\s+/g, ''), { defaultValue: type.name })}
                </motion.button>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      <div className="popular-tours__contentWrap">

        {/* Loading state */}
        {loading && (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
            <Loader2 className="animate-spin" size={40} color="#1e659e" />
          </div>
        )}

        {/* Empty / error state */}
        {!loading && displayTrips.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b', fontSize: '15px' }}>
            {t('homePage.popularTours.empty')}
          </div>
        )}

        {/* Cards */}
        {!loading && displayTrips.length > 0 && (
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTypeId ?? 'all'}
              className={`popular-tours__track ${shouldMarquee ? 'is-marquee' : 'is-centered'}`}
              variants={shouldMarquee ? undefined : stagger(0.12, 0.05)}
              initial={shouldMarquee ? undefined : 'hidden'}
              animate={shouldMarquee ? undefined : 'visible'}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
            >
              {displayTrips.map((trip, index) => (
                <motion.article
                  key={`${trip.id}-${index}`}
                  className="tour-card"
                  variants={shouldMarquee ? undefined : cardVariant}
                  whileHover={
                    shouldMarquee
                      ? undefined
                      : { y: -8, boxShadow: '0 22px 48px rgba(30,101,158,0.16)', transition: { type: 'spring', stiffness: 280, damping: 20 } }
                  }
                >
                  {/* Image */}
                  <div className="tour-card__imageWrap" style={{ overflow: 'hidden' }}>
                    <motion.img
                      className="tour-card__image"
                      src={getTripPrimaryImage(trip, index)}
                      alt={trip.name ?? 'Trip'}
                      draggable="false"
                      whileHover={{ scale: 1.08, transition: { duration: 0.4, ease: 'easeOut' } }}
                    />
                    <div className="tour-card__ribbon">
                      <span>T.R</span>
                    </div>
                  </div>

                  <div className="tour-card__body">
                    <p className="tour-card__tag">
                      {trip.tripTypeName 
                        ? t('tripTypes.' + trip.tripTypeName.toLowerCase().replace(/\s+/g, ''), { defaultValue: trip.tripTypeName }) 
                        : '—'}
                    </p>
                    <h3 className="tour-card__title">{trip.name ?? 'Unnamed Trip'}</h3>

                    <div className="tour-card__metaRow">
                      {/* Duration */}
                      <span className="tour-card__metaItem">
                        <span className="tour-card__metaIcon">
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 7V12L15 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            <path d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" stroke="currentColor" strokeWidth="2" />
                          </svg>
                        </span>
                        {trip.durationValue} {trip.durationTypeName ? t('homePage.popularTours.' + trip.durationTypeName.toLowerCase(), { defaultValue: trip.durationTypeName }) : ''}
                      </span>

                      {/* Location */}
                      <span className="tour-card__metaItem">
                        <span className="tour-card__metaIcon">
                          <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 21s7-4.35 7-11a7 7 0 1 0-14 0c0 6.65 7 11 7 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            <path d="M12 10.5a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5Z" fill="currentColor" />
                          </svg>
                        </span>
                        {trip.destination ?? '—'}
                      </span>
                    </div>

                    {/* Price */}
                    <div className="tour-card__stats">
                      <span className="tour-card__price">
                        <span className="tour-card__currency">{trip.currencyName ?? '€'}</span>
                        <span>{trip.adultPrice.toFixed(0)}</span>
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="tour-card__actions">
                      <motion.button
                        type="button"
                        className="tour-card__btnBook"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                        onClick={() => handleTrip(trip)}
                      >
                        {t('homePage.popularTours.viewTrip')}
                      </motion.button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </motion.div>
          </AnimatePresence>
        )}

        {/* See More */}
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
            onClick={() => navigate('/trips')}
          >
            {t('homePage.popularTours.seeMore')}
          </motion.button>
        </motion.div>

      </div>
    </section>
  )
}