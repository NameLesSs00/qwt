import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import ticketIcon  from '../../../assets/howworks/heroicons_ticket-solid.svg'
import cardIcon    from '../../../assets/howworks/solar_card-bold.svg'
import confirmIcon from '../../../assets/howworks/line-md_confirm-circle-filled.svg'
import tripIcon    from '../../../assets/howworks/entypo-social_tripadvisor.svg'
import plane       from '../../../assets/howworks/plane.png'
import linePlane   from '../../../assets/howworks/lineplane.png'
import { fadeUp, stagger, viewport } from '../../../lib/animations'
import type { Variants } from 'framer-motion'
import '../styles/howItWorks.scss'

type Step = { id: string; icon: string; cardClassName: string }

const steps: Step[] = [
  { id: 'book',    icon: ticketIcon,  cardClassName: 'is-down' },
  { id: 'pay',     icon: cardIcon,    cardClassName: 'is-up'   },
  { id: 'confirm', icon: confirmIcon, cardClassName: 'is-down' },
  { id: 'trip',    icon: tripIcon,    cardClassName: 'is-up'   },
]

// Cards with is-down drop from above; is-up rise from below
const cardVariant = (dir: 'is-up' | 'is-down'): Variants => ({
  hidden:  { opacity: 0, y: dir === 'is-down' ? -40 : 40 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 220, damping: 20 } },
})

export function HowItWorks() {
  const { t } = useTranslation()

  return (
    <section className="howworks">
      {/* Plane drifts in from right */}
      <div className="howworks__bg" aria-hidden="true">
        <motion.img
          className="howworks__plane"
          src={plane}
          alt=""
          initial={{ x: 120, opacity: 0 }}
          whileInView={{ x: 0, opacity: 1 }}
          viewport={viewport}
          transition={{ duration: 1.1, ease: 'easeOut' }}
        />
        <motion.img
          className="howworks__line"
          src={linePlane}
          alt=""
          initial={{ scaleX: 0, opacity: 0, originX: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={viewport}
          transition={{ duration: 1.0, ease: 'easeOut', delay: 0.3 }}
        />
      </div>

      <div className="howworks__inner">
        {/* Header */}
        <motion.header
          className="howworks__header"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <h2 className="howworks__title">
            {t('homePage.howItWorks.title')} <span className="howworks__titleAccent">{t('homePage.howItWorks.titleAccent')}</span>
          </h2>
          <p className="howworks__sub">{t('homePage.howItWorks.sub')}</p>
        </motion.header>

        {/* Steps – staggered, each with its own directional entry */}
        <motion.div
          className="howworks__grid"
          variants={stagger(0.15, 0.15)}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          {steps.map((s) => (
            <motion.article
              key={s.id}
              className={`howworks__card ${s.cardClassName}`}
              variants={cardVariant(s.cardClassName as 'is-up' | 'is-down')}
              whileHover={{ scale: 1.04, transition: { type: 'spring', stiffness: 400, damping: 18 } }}
            >
              {/* Icon spins once on hover */}
              <motion.div
                className="howworks__iconWrap"
                aria-hidden="true"
                whileHover={{ rotate: 360, transition: { duration: 0.55, ease: 'easeInOut' } }}
              >
                <img className="howworks__icon" src={s.icon} alt="" />
              </motion.div>
              <h3 className="howworks__cardTitle">{t(`homePage.howItWorks.steps.${s.id}.title`)}</h3>
              <p className="howworks__cardDesc">{t(`homePage.howItWorks.steps.${s.id}.desc`)}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
