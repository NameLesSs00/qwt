import { useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import leftArrow from '../../assets/single trip/left.png'
import rightArrow from '../../assets/single trip/right.png'
import './imageLightbox.scss'

type ImageLightboxProps = {
  images: string[]
  activeIndex: number | null
  onClose: () => void
  onNext: () => void
  onPrev: () => void
}

export function ImageLightbox({ images, activeIndex, onClose, onNext, onPrev }: ImageLightboxProps) {
  const isOpen = activeIndex !== null

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!isOpen) return
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') onNext()
      if (e.key === 'ArrowLeft') onPrev()
    },
    [isOpen, onClose, onNext, onPrev]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <AnimatePresence>
      {isOpen && activeIndex !== null && (
        <motion.div
          className="lightbox__backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
        >
          {/* Close */}
          <button
            className="lightbox__close"
            onClick={onClose}
            aria-label="Close lightbox"
          >
            <X size={24} color="#fff" />
          </button>

          {/* Counter */}
          <div className="lightbox__counter">
            {activeIndex + 1} / {images.length}
          </div>

          {/* Prev */}
          <button
            className="lightbox__arrow lightbox__arrow--prev"
            onClick={(e) => { e.stopPropagation(); onPrev() }}
            aria-label="Previous image"
          >
            <img src={leftArrow} alt="Previous" />
          </button>

          {/* Image */}
          <motion.div
            className="lightbox__imageWrap"
            key={activeIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.25 }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[activeIndex]}
              alt={`Image ${activeIndex + 1}`}
              className="lightbox__image"
            />
          </motion.div>

          {/* Next */}
          <button
            className="lightbox__arrow lightbox__arrow--next"
            onClick={(e) => { e.stopPropagation(); onNext() }}
            aria-label="Next image"
          >
            <img src={rightArrow} alt="Next" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
