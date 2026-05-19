import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import aswanImg    from '../../../assets/images/detinations/aswan.png'
import hurghadaImg from '../../../assets/images/detinations/hurghada.png'
import luxorImg    from '../../../assets/images/detinations/luxor.png'
import { fadeUp, fadeLeft, fadeRight, stagger, viewport } from '../../../lib/animations'
import '../styles/destinations.scss'

type Destination = {
  id: string; nameKey: string; image: string; size: 'small' | 'large'
}

const destinations: Destination[] = [
  { id: 'aswan',    nameKey: 'aswan',    image: aswanImg,    size: 'small' },
  { id: 'luxor',    nameKey: 'luxor',    image: luxorImg,    size: 'small' },
  { id: 'hurghada', nameKey: 'hurghada', image: hurghadaImg, size: 'large' },
]

export function Destinations() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const left  = destinations.filter((d) => d.size === 'small')
  const right = destinations.find((d) => d.size === 'large')

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
            {left.map((d) => (
              <motion.article
                key={d.id}
                className="destination-card destination-card--small"
                variants={fadeLeft}
                whileHover="hover"
                style={{ overflow: 'hidden' }}
              >
                <motion.img
                  className="destination-card__img"
                  src={d.image}
                  alt={t('homePage.destinations.' + d.nameKey)}
                  whileHover={{ scale: 1.08 }}
                  transition={{ duration: 0.45, ease: 'easeOut' }}
                />
                <div className="destination-card__overlay" aria-hidden="true" />
                <div className="destination-card__ribbon" aria-hidden="true">
                  <span>{t('homePage.destinations.toursCount', { count: 5 })}</span>
                </div>
                <div className="destination-card__text">
                  <span className="destination-card__kicker">{t('homePage.destinations.travelTo')}</span>
                  <span className="destination-card__name">{t('homePage.destinations.' + d.nameKey)}</span>
                </div>
              </motion.article>
            ))}
          </motion.div>

          {/* Right card – slides from right */}
          {right && (
            <motion.article
              className="destination-card destination-card--large"
              variants={fadeRight}
              initial="hidden"
              whileInView="visible"
              viewport={viewport}
              style={{ overflow: 'hidden' }}
            >
              <motion.img
                className="destination-card__img"
                src={right.image}
                alt={t('homePage.destinations.' + right.nameKey)}
                whileHover={{ scale: 1.08 }}
                transition={{ duration: 0.45, ease: 'easeOut' }}
              />
              <div className="destination-card__overlay" aria-hidden="true" />
              <div className="destination-card__ribbon" aria-hidden="true">
                <span>{t('homePage.destinations.toursCount', { count: 5 })}</span>
              </div>
              <div className="destination-card__text">
                <span className="destination-card__kicker">{t('homePage.destinations.travelTo')}</span>
                <span className="destination-card__name">{t('homePage.destinations.' + right.nameKey)}</span>
              </div>
            </motion.article>
          )}
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
