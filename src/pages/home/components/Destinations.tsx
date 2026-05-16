import { motion } from 'framer-motion'
import aswanImg    from '../../../assets/images/detinations/aswan.png'
import hurghadaImg from '../../../assets/images/detinations/hurghada.png'
import luxorImg    from '../../../assets/images/detinations/luxor.png'
import { fadeUp, fadeLeft, fadeRight, stagger, viewport } from '../../../lib/animations'
import '../styles/destinations.scss'

type Destination = {
  id: string; name: string; toursLabel: string; image: string; size: 'small' | 'large'
}

const destinations: Destination[] = [
  { id: 'aswan',    name: 'Aswan',    toursLabel: '5 Tours', image: aswanImg,    size: 'small' },
  { id: 'luxor',    name: 'Luxor',    toursLabel: '5 Tours', image: luxorImg,    size: 'small' },
  { id: 'hurghada', name: 'Hurghada', toursLabel: '5 Tours', image: hurghadaImg, size: 'large' },
]

// Image zoom variant used inside each card
const imgHover = { scale: 1.08, transition: { duration: 0.45, ease: 'easeOut' } }

export function Destinations() {
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
            Awasome <span className="home-destinations__titleAccent">Destiantions</span>
          </h2>
          <p className="home-destinations__sub">
            Choose your next unforgettable experience across
            <br />
            Egypt's most iconic destinations
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
                  alt={d.name}
                  whileHover={imgHover}
                />
                <div className="destination-card__overlay" aria-hidden="true" />
                <div className="destination-card__ribbon" aria-hidden="true">
                  <span>{d.toursLabel}</span>
                </div>
                <div className="destination-card__text">
                  <span className="destination-card__kicker">Travel To</span>
                  <span className="destination-card__name">{d.name}</span>
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
                alt={right.name}
                whileHover={imgHover}
              />
              <div className="destination-card__overlay" aria-hidden="true" />
              <div className="destination-card__ribbon" aria-hidden="true">
                <span>{right.toursLabel}</span>
              </div>
              <div className="destination-card__text">
                <span className="destination-card__kicker">Travel To</span>
                <span className="destination-card__name">{right.name}</span>
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
          >
            See More
          </motion.button>
        </motion.div>

      </div>
    </section>
  )
}
