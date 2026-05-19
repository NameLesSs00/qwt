import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import localExpertsIcon from '../../../assets/chooseUs/allOver.png'
import safeTripsIcon    from '../../../assets/chooseUs/safe.png'
import fastBookingIcon  from '../../../assets/chooseUs/speed.png'
import { fadeUp, scalePop, stagger, viewport } from '../../../lib/animations'
import '../styles/chooseUs.scss'

type Feature = { id: string; icon: string }

const features: Feature[] = [
  { id: 'local', icon: localExpertsIcon },
  { id: 'safe',  icon: safeTripsIcon    },
  { id: 'fast',  icon: fastBookingIcon  },
]

export function ChooseUs() {
  const { t } = useTranslation()

  return (
    <section className="choose-us">
      <div className="choose-us__inner">
        {/* Header – fades up */}
        <motion.header
          className="choose-us__header"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <h2 className="choose-us__title">
            {t('homePage.chooseUs.title')} <span className="choose-us__titleAccent">{t('homePage.chooseUs.titleAccent')}</span>
          </h2>
          <p className="choose-us__sub">
            {t('homePage.chooseUs.sub')}
          </p>
        </motion.header>

        {/* Cards – stagger spring-pop */}
        <motion.div
          className="choose-us__grid"
          variants={stagger(0.15, 0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          {features.map((f) => (
            <motion.article
              key={f.id}
              className="choose-us__card"
              variants={scalePop}
              whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(30,101,158,0.15)' }}
              transition={{ type: 'spring', stiffness: 320, damping: 22 }}
            >
              {/* Icon bobs on card hover via parent whileHover propagation */}
              <motion.div
                className="choose-us__iconWrap"
                aria-hidden="true"
                whileHover={{ rotate: [0, -8, 8, 0], transition: { duration: 0.5 } }}
              >
                <img className="choose-us__icon" src={f.icon} alt="" />
              </motion.div>
              <h3 className="choose-us__cardTitle">{t(`homePage.chooseUs.features.${f.id}.title`)}</h3>
              <p className="choose-us__cardDesc">{t(`homePage.chooseUs.features.${f.id}.desc`)}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
