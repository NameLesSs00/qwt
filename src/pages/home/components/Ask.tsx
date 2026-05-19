import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ChevronDown, HelpCircle, ArrowRight } from 'lucide-react'
import { getQuestions, type DtoQuestionRead } from '../../../api/questionsApi'
import { fadeUp, fadeRight, stagger, springUp, viewport } from '../../../lib/animations'
import icon from '../../../assets/ask/icon.svg'
import askImage from '../../../assets/ask/imageAsk.png'
import '../styles/ask.scss'

export function Ask() {
  const { t, i18n } = useTranslation()
  const [questions, setQuestions] = useState<DtoQuestionRead[]>([])
  const [loading, setLoading] = useState(true)
  const [openId, setOpenId] = useState<number | null>(null)

  useEffect(() => {
    let active = true
    setLoading(true)
    getQuestions(1, 5)
      .then(res => {
        if (!active) return
        const items = res.data || []
        setQuestions(items)
        if (items.length > 0) setOpenId(items[0].id)
      })
      .catch(() => {
        if (active) setQuestions([])
      })
      .finally(() => {
        if (active) setLoading(false)
      })
    return () => { active = false }
  }, [i18n.language])

  return (
    <section className="home-ask">
      <div className="home-ask__inner">

        {/* Header */}
        <motion.header
          className="home-ask__header"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <div className="home-ask__titleWrapper">
            <motion.img
              className="home-ask__icon"
              src={icon}
              alt=""
              aria-hidden="true"
              whileHover={{ rotate: [0, -15, 15, 0], transition: { duration: 0.5 } }}
            />
            <h2 className="home-ask__title">
              {t('homePage.ask.title')}{' '}
              <span className="home-ask__titleAccent">{t('homePage.ask.titleAccent')}</span>
            </h2>
          </div>
          <p className="home-ask__sub">{t('homePage.ask.sub')}</p>
        </motion.header>

        <div className="home-ask__content">

          {/* FAQ list */}
          <motion.div
            className="home-ask__left"
            variants={stagger(0.14, 0.05)}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            {loading ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[1, 2, 3].map(i => (
                  <div key={i} style={{ height: '56px', background: '#e2e8f0', borderRadius: '8px', animation: 'pulse 1.5s ease-in-out infinite' }} />
                ))}
              </div>
            ) : questions.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', padding: '40px 0', color: '#64748b' }}>
                <HelpCircle size={40} style={{ opacity: 0.4 }} />
                <p style={{ margin: 0, fontSize: '15px' }}>{t('homePage.ask.empty')}</p>
              </div>
            ) : (
              <>
                <div className="home-ask__faq" role="list">
                  {questions.map((item) => {
                    const isOpen = item.id === openId
                    return (
                      <motion.div
                        key={item.id}
                        className={`home-ask__item ${isOpen ? 'is-open' : ''}`}
                        variants={springUp}
                      >
                        <button
                          className="home-ask__question"
                          onClick={() => setOpenId(isOpen ? null : item.id)}
                        >
                          <span>{item.text}</span>
                          <motion.span
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                          >
                            <ChevronDown size={18} />
                          </motion.span>
                        </button>

                        <AnimatePresence initial={false}>
                          {isOpen && (
                            <motion.div
                              className="home-ask__answer"
                              key="answer"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.35, ease: 'easeInOut' }}
                              style={{ overflow: 'hidden' }}
                            >
                              {item.answer}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )
                  })}
                </div>

                {/* View All Link */}
                <motion.div variants={fadeUp} style={{ marginTop: '24px' }}>
                  <Link
                    to="/faq"
                    className="home-ask__moreBtn"
                  >
                    {t('homePage.ask.viewAll')} <ArrowRight size={16} />
                  </Link>
                </motion.div>
              </>
            )}
          </motion.div>

          {/* Illustration */}
          <motion.div
            className="home-ask__illustrations"
            aria-hidden="true"
            variants={fadeRight}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            <motion.img
              src={askImage}
              alt=""
              whileHover={{ scale: 1.04, transition: { duration: 0.4 } }}
            />
          </motion.div>

        </div>
      </div>
    </section>
  )
}
