import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';
import { ChevronDown, Plus, Loader2 } from 'lucide-react';
import { motion } from "motion/react";
import { ImageLightbox } from '../../components/imageLightbox/ImageLightbox'
import { getGalleryImages, getAbsoluteImageUrl, type GalleryImageDto } from '../../api/galleryApi'
import imgBg from '../../assets/gallery/bg.png';

import './galleryPage.scss';

export function GalleryPage() {
  const [images, setImages] = useState<GalleryImageDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  useEffect(() => {
    async function loadImages() {
      try {
        setLoading(true)
        const data = await getGalleryImages()
        setImages(data)
      } catch (err) {
        setError('Failed to load gallery images.')
      } finally {
        setLoading(false)
      }
    }
    loadImages()
  }, [])

  const openLightbox = (idx: number) => setLightboxIndex(idx)
  const closeLightbox = () => setLightboxIndex(null)
  
  const absoluteImageUrls = images.map(img => getAbsoluteImageUrl(img.imageUrl))
  
  const nextImage = () => setLightboxIndex(prev => prev !== null ? (prev + 1) % absoluteImageUrls.length : null)
  const prevImage = () => setLightboxIndex(prev => prev !== null ? (prev - 1 + absoluteImageUrls.length) % absoluteImageUrls.length : null)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="gallery-page"
    >
      
      {/* ── Hero Section ── */}
      <section className="gallery-hero">
        <motion.img
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          className="gallery-heroBg"
          src={imgBg}
          alt="Gallery Background"
        />
        <div className="gallery-heroOverlay"></div>
        <div className="gallery-heroInner">
          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="gallery-heroTitle"
          >
            Explore Moments That Tell the Story
          </motion.h1>
        </div>
      </section>

      {/* ── Content Section ── */}
      <section className="gallery-content">
        <div className="gallery-contentWrap">
          
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="gallery-breadcrumb"
          >
            <Link to="/" className="gallery-breadcrumbLink">Home</Link>
            <span className="gallery-breadcrumbSep">&gt;</span>
            <span className="gallery-breadcrumbActive">Gallery</span>
          </motion.div>

          {/* Toolbar */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="gallery-toolbar"
          >
            <div className="gallery-resultCount">{images.length} Result{images.length !== 1 && 's'}</div>
            <div className="gallery-sortControl">
              <span className="gallery-sortLabel">Sort by</span>
              <div className="gallery-sortDropdown">
                <span>Latest</span>
                <ChevronDown size={16} color="#94a3b8" />
              </div>
            </div>
          </motion.div>

          {loading ? (
            <div style={{ display: 'flex', justifyContent: 'center', padding: '60px' }}>
              <Loader2 className="animate-spin" size={36} color="#1e659e" />
            </div>
          ) : error ? (
            <div style={{ color: '#ef4444', textAlign: 'center', padding: '40px', background: '#fef2f2', borderRadius: '12px', border: '1px solid #fee2e2' }}>
              {error}
            </div>
          ) : images.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '60px', background: '#f8fafc', borderRadius: '12px', color: '#64748b' }}>
              No images in the gallery yet.
            </div>
          ) : (
            <motion.div
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: "-80px" }}
              transition={{ staggerChildren: 0.06 }}
              className="gallery-masonry"
            >
              {images.map((img, idx) => (
                <motion.div
                  key={img.id}
                  variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
                  transition={{ duration: 0.45, ease: "easeOut" }}
                  whileHover="hover"
                  className="gallery-masonryItem"
                  onClick={() => openLightbox(idx)}
                  role="button"
                  tabIndex={0}
                  aria-label={`View image ${idx + 1}`}
                  onKeyDown={e => e.key === 'Enter' && openLightbox(idx)}
                  style={{ cursor: 'pointer' }}
                >
                  <motion.img
                    variants={{ hover: { scale: 1.04 } }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    src={getAbsoluteImageUrl(img.imageUrl)}
                    alt={`Gallery item ${idx + 1}`}
                    className="gallery-img"
                  />
                  <motion.div
                    variants={{ hover: { opacity: 1 } }}
                    transition={{ duration: 0.25 }}
                    className="gallery-imgOverlay"
                  >
                    <motion.div
                      variants={{ hover: { scale: 1.06 } }}
                      transition={{ duration: 0.25 }}
                      className="gallery-zoomIcon"
                    >
                      <Plus size={24} />
                    </motion.div>
                  </motion.div>
                </motion.div>
              ))}
            </motion.div>
          )}

        </div>
      </section>

      {/* Lightbox */}
      {absoluteImageUrls.length > 0 && (
        <ImageLightbox
          images={absoluteImageUrls}
          activeIndex={lightboxIndex}
          onClose={closeLightbox}
          onNext={nextImage}
          onPrev={prevImage}
        />
      )}

    </motion.div>
  );
}
