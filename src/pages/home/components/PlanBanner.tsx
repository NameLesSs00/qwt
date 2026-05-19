import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import view   from '../../../assets/plan/view.png'
import vector from '../../../assets/plan/Vector.svg'
import tree   from '../../../assets/plan/tree.png'
import tree2  from '../../../assets/plan/tree2.png'
import noise  from '../../../assets/plan/noise.png'
import { fadeLeft, fadeRight, viewport } from '../../../lib/animations'
import '../styles/planBanner.scss'

export function PlanBanner() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  return (
    <section className="plan-banner">
      <div className="plan-banner__bg">
        <div
          className="plan-banner__noise"
          style={{ backgroundImage: `url(${noise})` }}
          aria-hidden="true"
        />

        <img className="plan-banner__curve" src={vector} alt="" aria-hidden="true" />

        {/* Trees drift up from bottom */}
        <motion.img
          className="plan-banner__tree"
          src={tree}
          alt=""
          aria-hidden="true"
          initial={{ y: 60, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={viewport}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.2 }}
        />
        <motion.img
          className="plan-banner__tree2"
          src={tree2}
          alt=""
          aria-hidden="true"
          initial={{ y: 60, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={viewport}
          transition={{ duration: 0.9, ease: 'easeOut', delay: 0.35 }}
        />

        <div className="plan-banner__inner">

          {/* Image – slides from left */}
          <motion.div
            className="plan-banner__left"
            variants={fadeLeft}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            <img className="plan-banner__img" src={view} alt="Resort view" />
          </motion.div>

          {/* Text content – slides from right */}
          <motion.div
            className="plan-banner__content"
            variants={fadeRight}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            <h2 className="plan-banner__title">
              {t('homePage.planBanner.title')}
            </h2>
            <p className="plan-banner__sub">
              {t('homePage.planBanner.sub')}
            </p>

            <motion.button
              type="button"
              className="plan-banner__btn"
              whileHover={{ scale: 1.07, y: -3 }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 380, damping: 18 }}
              onClick={() => navigate('/trips')}
            >
              {t('homePage.planBanner.bookNow')}
            </motion.button>
          </motion.div>

        </div>
      </div>
    </section>
  )
}