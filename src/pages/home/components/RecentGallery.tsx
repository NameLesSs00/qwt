import { useState } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import bg      from '../../../assets/recentgallery/bg.png'
import person  from '../../../assets/recentgallery/photo.png'
import aswan   from '../../../assets/recentgallery/aswan.jpg'
import dive    from '../../../assets/recentgallery/dive.jpg'
import luxor   from '../../../assets/recentgallery/luxor.jpg'
import safari  from '../../../assets/recentgallery/safari.jpg'
import see     from '../../../assets/recentgallery/see.jpg'
import temple  from '../../../assets/recentgallery/temple.jpg'
import { fadeUp, viewport } from '../../../lib/animations'
import { ImageLightbox } from '../../../components/imageLightbox/ImageLightbox'
import type { Variants } from 'framer-motion'
import type React from 'react'
import '../styles/recentGallery.scss'

type GalleryItem = { id: string; image: string; alt: string; className: string }

const items: GalleryItem[] = [
  { id: 'aswan',  image: aswan,  alt: 'Aswan',   className: 'is-aswan'  },
  { id: 'see',    image: see,    alt: 'Walkway',  className: 'is-see'    },
  { id: 'temple', image: temple, alt: 'Temple',   className: 'is-temple' },
  { id: 'luxor',  image: luxor,  alt: 'Luxor',    className: 'is-luxor'  },
  { id: 'safari', image: safari, alt: 'Safari',   className: 'is-safari' },
  { id: 'dive',   image: dive,   alt: 'Diving',   className: 'is-dive'   },
]

// Each tile enters from a slightly different angle
const tileVariants: Variants = {
  hidden:  { opacity: 0, scale: 0.88, y: 30 },
  visible: { opacity: 1, scale: 1,    y: 0,  transition: { type: 'spring', stiffness: 200, damping: 20 } },
}

const containerVariants: Variants = {
  hidden:  {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}

export function RecentGallery() {
  const navigate = useNavigate()
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const openLightbox = (idx: number) => setLightboxIndex(idx)
  const closeLightbox = () => setLightboxIndex(null)
  const nextImage = () => setLightboxIndex(prev => prev !== null ? (prev + 1) % items.length : null)
  const prevImage = () => setLightboxIndex(prev => prev !== null ? (prev - 1 + items.length) % items.length : null)

  const allImages = items.map(item => item.image)

  return (
    <section
      className="recent-gallery"
      style={{ '--recent-gallery-bg': `url(${bg})` } as React.CSSProperties}
    >
      <div className="recent-gallery__inner">

        {/* Header */}
        <motion.header
          className="recent-gallery__header"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <p className="recent-gallery__kicker">Make Your Tour More Pleasure</p>
          <h2 className="recent-gallery__title">Recent Gallery</h2>
        </motion.header>

        {/* Grid */}
        <motion.div
          className="recent-gallery__grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          {/* Person slides up */}
          <motion.div
            className="recent-gallery__person-wrapper"
            initial={{ y: 60, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={viewport}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.3 }}
          >
            <img
              className="recent-gallery__person"
              src={person}
              alt=""
              draggable="false"
            />
          </motion.div>

          {/* Photo tiles */}
          {items.map((item, idx) => (
            <motion.div
              key={item.id}
              className={`recent-gallery__item ${item.className}`}
              variants={tileVariants}
              style={{ overflow: 'hidden', cursor: 'pointer' }}
              whileHover={{ zIndex: 2, boxShadow: '0 16px 40px rgba(0,0,0,0.22)' }}
              onClick={() => openLightbox(idx)}
              role="button"
              tabIndex={0}
              aria-label={`View image ${item.alt}`}
              onKeyDown={e => e.key === 'Enter' && openLightbox(idx)}
            >
              <motion.img
                src={item.image}
                alt={item.alt}
                draggable="false"
                whileHover={{ scale: 1.1, transition: { duration: 0.4, ease: 'easeOut' } }}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              />
            </motion.div>
          ))}

          {/* Button */}
          <motion.div
            className="recent-gallery__more"
            variants={fadeUp}
          >
            <motion.button
              type="button"
              className="recent-gallery__moreBtn"
              whileHover={{ scale: 1.07, y: -2 }}
              whileTap={{ scale: 0.94 }}
              transition={{ type: 'spring', stiffness: 380, damping: 18 }}
              onClick={() => navigate('/gallery')}
            >
              See More
            </motion.button>
          </motion.div>
        </motion.div>

      </div>

      {/* Lightbox */}
      <ImageLightbox
        images={allImages}
        activeIndex={lightboxIndex}
        onClose={closeLightbox}
        onNext={nextImage}
        onPrev={prevImage}
      />
    </section>
  )
}