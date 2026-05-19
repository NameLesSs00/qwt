import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import icon    from '../../../assets/reviews/icon.svg'
import avatar1 from '../../../assets/reviews/1.jpg'
import avatar2 from '../../../assets/reviews/2.jpg'
import avatar3 from '../../../assets/reviews/3.jpg'
import tour1   from '../../../assets/reviews/4.png'
import tour2   from '../../../assets/reviews/5.jpg'
import tour3   from '../../../assets/reviews/6.png'
import { fadeUp, stagger, viewport } from '../../../lib/animations'
import type { Variants } from 'framer-motion'
import '../styles/reviews.scss'

interface Review {
  id: number
  key: string
  avatar: string
  name: string
  time: string
  rating: number
  tourImage: string
  featured?: boolean
}

const reviews: Review[] = [
  { id: 1, key: 'steve', avatar: avatar1, name: 'Steve M.', time: '3:00Pm 12/1/2025', rating: 5, tourImage: tour1 },
  { id: 2, key: 'marta', avatar: avatar2, name: 'Marta D.', time: '3:00Pm 12/1/2025', rating: 5, tourImage: tour2 },
  { id: 3, key: 'eric',  avatar: avatar3, name: 'Eric R.',  time: '3:00Pm 12/1/2025', rating: 5, tourImage: tour3 },
]

// Card tilts slightly as it rises in
const cardVariant: Variants = {
  hidden:  { opacity: 0, y: 50, rotate: -1.5 },
  visible: { opacity: 1, y: 0,  rotate: 0, transition: { type: 'spring', stiffness: 200, damping: 22 } },
}

function StarRating({ count }: { count: number }) {
  return (
    <div className="reviews__stars">
      {Array.from({ length: count }).map((_, i) => (
        <motion.span
          key={i}
          className="reviews__star"
          initial={{ scale: 0, rotate: -30 }}
          whileInView={{ scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 400, damping: 14, delay: i * 0.07 }}
        >
          ★
        </motion.span>
      ))}
    </div>
  )
}

export function Reviews() {
  const { t } = useTranslation()

  return (
    <section className="reviews">
      <div className="reviews__container">

        {/* Header */}
        <motion.div
          className="reviews__header"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <h2 className="reviews__title">
            {t('homePage.reviews.title')} <span className="reviews__accent">{t('homePage.reviews.accent')}</span>
            <img className="reviews__icon" src={icon} alt="" aria-hidden="true" />
          </h2>
          <p className="reviews__subtitle">
            {t('homePage.reviews.sub')}
          </p>
        </motion.div>

        {/* Cards – stagger with tilt snap */}
        <motion.div
          className="reviews__grid"
          variants={stagger(0.18, 0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          {reviews.map((review) => (
            <motion.article
              key={review.id}
              className={`reviews__card ${review.featured ? 'reviews__card--featured' : ''}`}
              variants={cardVariant}
              whileHover={{ y: -6, boxShadow: '0 18px 42px rgba(30,101,158,0.13)' }}
              transition={{ type: 'spring', stiffness: 300, damping: 22 }}
            >
              <div className="reviews__cardHeader">
                <motion.img
                  className="reviews__avatar"
                  src={review.avatar}
                  alt={review.name}
                  whileHover={{ scale: 1.08 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 16 }}
                />
                <div className="reviews__meta">
                  <div className="reviews__nameRow">
                    <span className="reviews__name">{review.name} –</span>
                    <span className="reviews__country">{t(`homePage.reviews.${review.key}.country`)}</span>
                  </div>
                  <span className="reviews__time">{review.time}</span>
                  <StarRating count={review.rating} />
                </div>
              </div>

              <p className="reviews__quote">"{t(`homePage.reviews.${review.key}.quote`)}"</p>

              <div className="reviews__tour">
                <img className="reviews__tourImg" src={review.tourImage} alt="" />
                <span className="reviews__tourName">{t(`homePage.reviews.${review.key}.tourName`)}</span>
              </div>
            </motion.article>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
