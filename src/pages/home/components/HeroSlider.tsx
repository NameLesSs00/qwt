import { useEffect, useState, useMemo, useRef, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import heroDesertBg from '../../../assets/images/hero_desert_bg.png'
import heroTempleBg from '../../../assets/images/hero_temple_bg.png'
import heroSeaBg from '../../../assets/images/hero_sea_bg.png'
import heroUnderwaterBg from '../../../assets/images/hero_underwater_bg.png'
import '../styles/heroSlider.scss'

type Slide = {
  title: string
  subtitle: string
  description: string
  ctaLabel: string
  image: string
}

const DRAG_THRESHOLD = 60 // px needed to trigger slide change

export function HeroSlider() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const [activeIndex, setActiveIndex] = useState(0)
  const [direction, setDirection] = useState(1) // 1 = forward, -1 = backward
  const autoPlayRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const slides = useMemo<Slide[]>(
    () => [
      {
        title: t('homePage.hero.slide1.title'),
        subtitle: t('homePage.hero.slide1.subtitle'),
        description: t('homePage.hero.slide1.description'),
        ctaLabel: t('homePage.hero.slide1.cta'),
        image: heroDesertBg,
      },
      {
        title: t('homePage.hero.slide2.title'),
        subtitle: t('homePage.hero.slide2.subtitle'),
        description: t('homePage.hero.slide2.description'),
        ctaLabel: t('homePage.hero.slide2.cta'),
        image: heroTempleBg,
      },
      {
        title: t('homePage.hero.slide3.title'),
        subtitle: t('homePage.hero.slide3.subtitle'),
        description: t('homePage.hero.slide3.description'),
        ctaLabel: t('homePage.hero.slide3.cta'),
        image: heroSeaBg,
      },
      {
        title: t('homePage.hero.slide4.title'),
        subtitle: t('homePage.hero.slide4.subtitle'),
        description: t('homePage.hero.slide4.description'),
        ctaLabel: t('homePage.hero.slide4.cta'),
        image: heroUnderwaterBg,
      },
    ],
    [t],
  )

  const goTo = useCallback((index: number, dir: number) => {
    setDirection(dir)
    setActiveIndex(index)
  }, [])

  const goNext = useCallback(() => {
    const next = (activeIndex + 1) % slides.length
    goTo(next, 1)
  }, [activeIndex, slides.length, goTo])

  const goPrev = useCallback(() => {
    const prev = (activeIndex - 1 + slides.length) % slides.length
    goTo(prev, -1)
  }, [activeIndex, slides.length, goTo])

  // Reset and restart auto-play
  const resetAutoPlay = useCallback(() => {
    if (autoPlayRef.current) clearInterval(autoPlayRef.current)
    autoPlayRef.current = setInterval(goNext, 5000)
  }, [goNext])

  useEffect(() => {
    resetAutoPlay()
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current)
    }
  }, [resetAutoPlay])

  const handleDotClick = (i: number) => {
    goTo(i, i > activeIndex ? 1 : -1)
    resetAutoPlay()
  }

  // Framer Motion drag handling
  const handleDragEnd = (_: unknown, info: { offset: { x: number } }) => {
    if (info.offset.x < -DRAG_THRESHOLD) {
      goNext()
      resetAutoPlay()
    } else if (info.offset.x > DRAG_THRESHOLD) {
      goPrev()
      resetAutoPlay()
    }
  }

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? '-100%' : '100%',
      opacity: 0,
    }),
  }

  const currentSlide = slides[activeIndex]

  return (
    <section className="home-hero">
      {/* ── Sliding Background Panels ── */}
      <div className="home-hero__track">
        <AnimatePresence initial={false} custom={direction} mode="sync">
          <motion.div
            key={activeIndex}
            className="home-hero__bg"
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
            style={{ backgroundImage: `url(${currentSlide.image})` }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.15}
            onDragEnd={handleDragEnd}
          />
        </AnimatePresence>
      </div>

      {/* ── Dark Overlay ── */}
      <div className="home-hero__overlay" />

      {/* ── Content ── */}
      <div className="home-hero__inner">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={activeIndex}
            className="home-hero__content"
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 40 : -40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -40 : 40 }}
            transition={{ duration: 0.5, ease: 'easeOut', delay: 0.15 }}
          >
            <h1 className="home-hero__title">{currentSlide.title}</h1>
            <h2 className="home-hero__subtitle">{currentSlide.subtitle}</h2>
            <p className="home-hero__desc">{currentSlide.description}</p>

            <motion.button
              className="home-hero__cta"
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/trips')}
            >
              {currentSlide.ctaLabel}
            </motion.button>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Slide Indicators ── */}
      <div className="home-hero__dots">
        {slides.map((_, i) => (
          <button
            key={i}
            className={`home-hero__dot ${i === activeIndex ? 'is-active' : ''}`}
            onClick={() => handleDotClick(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* ── Arrow Buttons ── */}
      <button className="home-hero__arrow home-hero__arrow--prev" onClick={() => { goPrev(); resetAutoPlay() }} aria-label="Previous slide">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <button className="home-hero__arrow home-hero__arrow--next" onClick={() => { goNext(); resetAutoPlay() }} aria-label="Next slide">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="9 18 15 12 9 6" />
        </svg>
      </button>
    </section>
  )
}