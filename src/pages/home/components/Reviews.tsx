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
  id: number; avatar: string; name: string; country: string; time: string
  rating: number; quote: string; tourImage: string; tourName: string; featured?: boolean
}

const reviews: Review[] = [
  { id: 1, avatar: avatar1, name: 'Sarah M.',  country: 'United Kingdom', time: '3:00Pm 12/1/2025', rating: 5, quote: 'An absolutely amazing experience! Crystal-clear water, friendly staff, and perfect organization. Highly recommended.', tourImage: tour1, tourName: 'Orange Bay Island Trip'        },
  { id: 2, avatar: avatar2, name: 'Mark D.',   country: 'Germany',        time: '3:00Pm 12/1/2025', rating: 5, quote: 'The safari trip was thrilling and well-organized. Riding through the desert at sunset was unforgettable.',          tourImage: tour2, tourName: 'Desert Safari Quad Adventure' },
  { id: 3, avatar: avatar3, name: 'Emily R.',  country: 'France',         time: '3:00Pm 12/1/2025', rating: 5, quote: 'A wonderful journey through history. The guide was knowledgeable, and everything was smooth and comfortable.',    tourImage: tour3, tourName: 'Luxor Day Tour'              },
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
            What Our <span className="reviews__accent">Travellers Say?</span>
            <img className="reviews__icon" src={icon} alt="" aria-hidden="true" />
          </h2>
          <p className="reviews__subtitle">
            Real experiences from travelers who explored Egypt with us
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
                    <span className="reviews__country">{review.country}</span>
                  </div>
                  <span className="reviews__time">{review.time}</span>
                  <StarRating count={review.rating} />
                </div>
              </div>

              <p className="reviews__quote">"{review.quote}"</p>

              <div className="reviews__tour">
                <img className="reviews__tourImg" src={review.tourImage} alt="" />
                <span className="reviews__tourName">{review.tourName}</span>
              </div>
            </motion.article>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
