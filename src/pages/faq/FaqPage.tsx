import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, HelpCircle, Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { getQuestions, type DtoQuestionRead } from '../../api/questionsApi'
import { fadeUp, stagger, springUp } from '../../lib/animations'
import './faqPage.scss'

export function FaqPage() {
  const { t, i18n } = useTranslation()
  const [questions, setQuestions] = useState<DtoQuestionRead[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [openId, setOpenId] = useState<number | null>(null)

  useEffect(() => {
    setLoading(true)
    getQuestions(1, 100)
      .then(res => {
        const items = res.data || []
        setQuestions(items)
        if (items.length > 0) {
          setOpenId(items[0].id)
        } else {
          setOpenId(null)
        }
        setError('')
      })
      .catch(() => setError(t('faqPage.errorText')))
      .finally(() => setLoading(false))
  }, [i18n.language, t])

  return (
    <main className="faq-page">
      {/* Hero */}
      <motion.section
        className="faq-page__hero"
        variants={fadeUp}
        initial="hidden"
        animate="visible"
      >
        <div className="faq-page__heroInner">
          <HelpCircle size={40} className="faq-page__heroIcon" />
          <h1 className="faq-page__heroTitle">{t('faqPage.heroTitle')}</h1>
          <p className="faq-page__heroSub">{t('faqPage.heroSub')}</p>
        </div>
      </motion.section>

      {/* Content */}
      <section className="faq-page__content">
        <div className="faq-page__inner">
          {loading ? (
            <div className="faq-page__loading">
              <Loader2 className="animate-spin" size={40} />
              <p>{t('faqPage.loadingText')}</p>
            </div>
          ) : error ? (
            <div className="faq-page__error">{error}</div>
          ) : questions.length === 0 ? (
            <div className="faq-page__empty">
              <HelpCircle size={48} />
              <p>{t('faqPage.emptyText')}</p>
            </div>
          ) : (
            <motion.div
              className="faq-page__list"
              variants={stagger(0.1, 0.05)}
              initial="hidden"
              animate="visible"
            >
              {questions.map(item => {
                const isOpen = item.id === openId
                return (
                  <motion.div
                    key={item.id}
                    className={`faq-page__item ${isOpen ? 'is-open' : ''}`}
                    variants={springUp}
                  >
                    <button
                      className="faq-page__question"
                      onClick={() => setOpenId(isOpen ? null : item.id)}
                      aria-expanded={isOpen}
                    >
                      <span>{item.text}</span>
                      <motion.span
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                        className="faq-page__chevron"
                      >
                        <ChevronDown size={20} />
                      </motion.span>
                    </button>

                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          className="faq-page__answer"
                          key="answer"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: 'easeInOut' }}
                          style={{ overflow: 'hidden' }}
                        >
                          <p>{item.answer}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </motion.div>
          )}
        </div>
      </section>
    </main>
  )
}
