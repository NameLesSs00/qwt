import { useEffect, useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import heroDesertBg from '../../../assets/images/hero_desert_bg.png'
import heroTempleBg from '../../../assets/images/hero_temple_bg.png'
import heroSeaBg from '../../../assets/images/hero_sea_bg.png'
import '../styles/heroSlider.scss'

type Slide = {
  title: string
  subtitle: string
  description: string
  ctaLabel: string
  image: string
}

export function HeroSlider() {
  const navigate = useNavigate()
  const { t } = useTranslation()

  const slides = useMemo<Slide[]>(
    () => [
      {
        title: "Hurghada Fun Trips",
        subtitle: "Find Your Perfect Excursion",
        description: "Discover breathtaking destinations, and book your trip with ease — all in one place.",
        ctaLabel: t('homePage.hero.slide1.cta') || "SHOW EXCURSIONS",
        image: heroDesertBg,
      },
      {
        title: "Discover Ancient Wonders",
        subtitle: "Unforgettable Historical Excursions",
        description: "Journey through time with our guided tours to Luxor, Cairo, and breathtaking ancient temples.",
        ctaLabel: t('homePage.hero.slide2.cta') || "SHOW EXCURSIONS",
        image: heroTempleBg,
      },
      {
        title: "Explore the Red Sea",
        subtitle: "Dive into crystal clear waters",
        description: "Join our snorkeling and diving excursions to see vibrant coral reefs and marine life.",
        ctaLabel: t('homePage.hero.slide3.cta') || "SHOW EXCURSIONS",
        image: heroSeaBg,
      },
    ],
    [t],
  )

  const [activeIndex, setActiveIndex] = useState(0)

  // Auto-cycle slides every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length)
    }, 5000)
    return () => clearInterval(interval)
  }, [slides.length])

  const currentSlide = slides[activeIndex]

  return (
    <section className="home-hero">
      {/* ── Background Slides ── */}
      <AnimatePresence initial={false}>
        <motion.div
          key={activeIndex}
          className="home-hero__bg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: 'easeInOut' }}
          style={{ backgroundImage: `url(${currentSlide.image})` }}
        />
      </AnimatePresence>
      
      {/* ── Dark Overlay ── */}
      <div className="home-hero__overlay"></div>

      {/* ── Content ── */}
      <div className="home-hero__inner">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeIndex}
            className="home-hero__content"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          >
            <h1 className="home-hero__title">{currentSlide.title}</h1>
            <h2 className="home-hero__subtitle">
              {currentSlide.subtitle}
            </h2>
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
            onClick={() => setActiveIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>
    </section>
  )
}