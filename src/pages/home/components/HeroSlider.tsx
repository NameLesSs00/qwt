import { useEffect, useRef, useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { Variants } from 'framer-motion'
import heroDesertPc from '../../../assets/images/hero-desert-pc.png'
import heroHistoricalPc from '../../../assets/images/hero-historical-pc.png'
import heroSeaPc from '../../../assets/images/seaImagePc.png'
import heroSeaMobile from '../../../assets/images/hero-sea-mobile.png'
import heroFooterImage from '../../../assets/images/HeroFotterImage.png'
import '../styles/heroSlider.scss'

type Slide = {
  title: string
  description: string
  ctaLabel: string
  image: string
  imagePosition?: string
  imageScale?: number
}

// ── Timing constants ──────────────────────────────────────────────
const TYPE_SPEED_MS   = 55   // ms per character while typing
const ERASE_SPEED_MS  = 28   // ms per character while erasing
const PAUSE_AFTER_MS  = 1800 // pause when title is fully typed
const PAUSE_SLIDE_MS  = 400  // brief pause before typing next slide

// ── Image animation ───────────────────────────────────────────────
const imageVariants: Variants = {
  hidden:  { x: -40, opacity: 0, scale: 0.96 },
  visible: { x: 0,   opacity: 1, scale: 1, transition: { duration: 0.6, ease: 'easeOut' } },
  exit:    { x:  40, opacity: 0, scale: 0.96, transition: { duration: 0.3, ease: 'easeIn'  } },
}

// ── Static content variants (description fades in once per slide) ─
const descVariants: Variants = {
  hidden:  { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0,  transition: { duration: 0.45, ease: 'easeOut', delay: 0.15 } },
  exit:    { opacity: 0, y: -8, transition: { duration: 0.25, ease: 'easeIn'  } },
}

// ── Hook: typewriter ──────────────────────────────────────────────
function useTypewriter(fullText: string, onDone: () => void, isPaused: boolean) {
  const [displayed, setDisplayed]   = useState('')
  const [phase, setPhase]           = useState<'typing' | 'pausing' | 'erasing'>('typing')
  const fullTextRef                  = useRef(fullText)
  const onDoneRef                    = useRef(onDone)

  // Keep refs up-to-date
  useEffect(() => { fullTextRef.current  = fullText }, [fullText])
  useEffect(() => { onDoneRef.current    = onDone   }, [onDone])

  // Reset whenever the target text changes (new slide)
  useEffect(() => {
    setDisplayed('')
    setPhase('typing')
  }, [fullText])

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>

    if (phase === 'typing') {
      const target = fullTextRef.current
      if (displayed.length < target.length) {
        timer = setTimeout(
          () => setDisplayed(target.slice(0, displayed.length + 1)),
          TYPE_SPEED_MS,
        )
      } else {
        // Fully typed → pause
        timer = setTimeout(() => setPhase('pausing'), PAUSE_AFTER_MS)
      }
    } else if (phase === 'pausing') {
      // After pause, start erasing ONLY if not hovered
      if (!isPaused) {
        timer = setTimeout(() => setPhase('erasing'), 0)
      }
    } else {
      // Erasing
      if (displayed.length > 0) {
        timer = setTimeout(
          () => setDisplayed((prev) => prev.slice(0, -1)),
          ERASE_SPEED_MS,
        )
      } else {
        // Fully erased → signal parent to advance slide
        if (!isPaused) {
          timer = setTimeout(() => onDoneRef.current(), PAUSE_SLIDE_MS)
        }
      }
    }

    return () => clearTimeout(timer)
  }, [displayed, phase, isPaused])

  return { displayed, phase }
}

// ─────────────────────────────────────────────────────────────────
export function HeroSlider() {
  const slides = useMemo<Slide[]>(
    () => [
      {
        title: 'Feel the Thrill of the Egyptian Desert',
        description:
          'Ride quad bikes, explore golden dunes, and experience authentic Bedouin life under the desert sky.',
        ctaLabel: 'Explore Desert Trips',
        image: heroDesertPc,
        imagePosition: 'center 80%',
        imageScale: 1.1,
      },
      {
        title: 'Walk Through Thousands of Years of History',
        description:
          "Discover ancient temples, majestic pyramids, and the timeless stories of Egypt's civilization.",
        ctaLabel: 'Explore Historical Trips',
        image: heroHistoricalPc,
        imagePosition: 'center 80%',
        imageScale: 1.1,
      },
      {
        title: "Escape to Egypt's Most Stunning Islands",
        description:
          'Crystal-clear waters, colorful coral reefs, and unforgettable island adventures in the Red Sea.',
        ctaLabel: 'Explore Sea Trips',
        image: heroSeaPc,
        imagePosition: 'center',
        imageScale: 1,
      },
    ],
    [],
  )

  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused,    setIsPaused]    = useState(false)

  const advanceSlide = () => {
    if (!isPaused) {
      setActiveIndex((prev) => (prev + 1) % slides.length)
    }
  }

  const currentSlide = slides[activeIndex]

  const { displayed, phase } = useTypewriter(currentSlide.title, advanceSlide, isPaused)

  // Colorize the last word of the displayed portion
  const words        = displayed.split(' ')
  const lastWord     = words[words.length - 1]
  const beforeLast   = words.slice(0, -1).join(' ')
  const showLastBlue = displayed.length === currentSlide.title.length // only color when complete

  return (
    <section
      className="home-hero"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="home-hero__inner">
        {/* ── Content ────────────────────────────────────────── */}
        <div className="home-hero__content">
          {/* Title with typewriter */}
          <h1 className="home-hero__title">
            {showLastBlue ? (
              <>
                {beforeLast && <span>{beforeLast} </span>}
                <span className="home-hero__titleLast">{lastWord}</span>
              </>
            ) : (
              <span>{displayed || '\u200B'}</span>
            )}
            {/* Blinking cursor */}
            <span
              className={`home-hero__cursor ${phase === 'pausing' ? 'home-hero__cursor--hidden' : ''}`}
              aria-hidden="true"
            >
              |
            </span>
          </h1>

          {/* Description fades per slide */}
          <AnimatePresence mode="wait">
            <motion.p
              key={activeIndex}
              className="home-hero__desc"
              variants={descVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {currentSlide.description}
            </motion.p>
          </AnimatePresence>

          {/* Single CTA – pop on hover */}
          <motion.button
            className="home-hero__cta"
            type="button"
            whileHover={{ scale: 1.07, y: -3 }}
            whileTap={{ scale: 0.94 }}
            transition={{ type: 'spring', stiffness: 380, damping: 18 }}
          >
            <span>{currentSlide.ctaLabel}</span>
            <span className="home-hero__ctaIcon" aria-hidden="true">→</span>
          </motion.button>
        </div>

        {/* ── Visual ─────────────────────────────────────────── */}
        <div className="home-hero__visual">
          <div className="hero-visual-frame" aria-hidden="true">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                className="hero-visual-content"
                variants={imageVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                style={{
                  ['--hero-image-position' as string]: currentSlide.imagePosition ?? 'center',
                  ['--hero-image-scale'    as string]: String(currentSlide.imageScale ?? 1),
                } as React.CSSProperties}
              >
                <picture>
                  <source
                    media="(max-width: 640px)"
                    srcSet={activeIndex === 2 ? heroSeaMobile : currentSlide.image}
                  />
                  <img
                    className="home-hero__frameImage"
                    src={currentSlide.image}
                    alt=""
                  />
                </picture>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* ── Footer ─────────────────────────────────────────────── */}
      <div className="home-hero__footer">
        <div className="home-hero__dots" role="tablist" aria-label="Hero slides">
          {slides.map((_, i) => {
            const isActive = i === activeIndex
            return (
              <motion.button
                key={i}
                type="button"
                className={`home-hero__dot ${isActive ? 'is-active' : ''}`}
                aria-label={`Go to slide ${i + 1}`}
                aria-selected={isActive}
                onClick={() => setActiveIndex(i)}
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  scale: isActive ? 1.2 : 1,
                  backgroundColor: isActive ? '#1e659e' : '#cbd5e1',
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 10 }}
              />
            )
          })}
        </div>

        <div className="home-hero__bgStrip" aria-hidden="true">
          <img src={heroFooterImage} alt="" className="home-hero__bgStripImg" />
        </div>
      </div>
    </section>
  )
}