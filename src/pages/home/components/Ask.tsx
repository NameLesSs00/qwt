import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import icon     from '../../../assets/ask/icon.svg'
import askImage from '../../../assets/ask/imageAsk.png'
import { fadeUp, fadeRight, stagger, springUp, viewport } from '../../../lib/animations'
import '../styles/ask.scss'

type FaqItem = { id: string; q: string; a: string }

export function Ask() {
  const items: FaqItem[] = useMemo(
    () => [
      { id: 'safe',     q: 'Is the hot air balloon ride safe?',    a: 'Yes, the ride is operated by licensed and experienced pilots and follows strict safety regulations.'                                              },
      { id: 'start',    q: 'What time does the tour start?',       a: 'Most tours start early in the morning. Exact pickup time will be confirmed after booking based on your location.'                                },
      { id: 'pickup',   q: 'Do you provide hotel pickup?',         a: 'Yes. Pickup and drop-off are available for most experiences. Details depend on the tour and your accommodation.'                                 },
      { id: 'duration', q: 'How long is the balloon ride?',        a: 'The flight typically lasts around 45–60 minutes depending on weather conditions and air-traffic permissions.'                                    },
    ],
    [],
  )

  const [openId, setOpenId] = useState<string>(items[0]?.id ?? '')

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
              Frequently Asked{' '}
              <span className="home-ask__titleAccent">Questions?</span>
            </h2>
          </div>
          <p className="home-ask__sub">Your Perfect Journey, Crafted with Care</p>
        </motion.header>

        <div className="home-ask__content">

          {/* FAQ list – stagger spring up */}
          <motion.div
            className="home-ask__left"
            variants={stagger(0.14, 0.05)}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            <div className="home-ask__faq" role="list">
              {items.map((it) => {
                const isOpen = it.id === openId
                return (
                  <motion.div
                    key={it.id}
                    className={`home-ask__item ${isOpen ? 'is-open' : ''}`}
                    variants={springUp}
                  >
                    <button
                      className="home-ask__question"
                      onClick={() => setOpenId(isOpen ? '' : it.id)}
                    >
                      <span>{it.q}</span>
                      <motion.span
                        animate={{ rotate: isOpen ? 180 : 0 }}
                        transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                      >
                        ˅
                      </motion.span>
                    </button>

                    {/* Smooth expand/collapse */}
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
                          {it.a}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Illustration – slides from right */}
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
