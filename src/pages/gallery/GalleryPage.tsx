import { useState } from 'react'
import { Link } from 'react-router-dom';
import { ChevronDown, Plus } from 'lucide-react';
import { motion } from "motion/react";
import { ImageLightbox } from '../../components/imageLightbox/ImageLightbox'
import imgBg from '../../assets/gallery/bg.png';
import img1 from '../../assets/gallery/1.jpg';
import img2 from '../../assets/gallery/2.jpg';
import img3 from '../../assets/gallery/3.jpg';
import img4 from '../../assets/gallery/4.jpg';
import img5 from '../../assets/gallery/5.jpg';
import img6 from '../../assets/gallery/6.jpg';
import img7 from '../../assets/gallery/7.jpg';
import img8 from '../../assets/gallery/8.jpg';
import img9 from '../../assets/gallery/9.jpg';

import './galleryPage.scss';

const allImages = [img1, img2, img3, img4, img5, img6, img7, img8, img9, img1, img2, img3, img4, img5]

export function GalleryPage() {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const openLightbox = (idx: number) => setLightboxIndex(idx)
  const closeLightbox = () => setLightboxIndex(null)
  const nextImage = () => setLightboxIndex(prev => prev !== null ? (prev + 1) % allImages.length : null)
  const prevImage = () => setLightboxIndex(prev => prev !== null ? (prev - 1 + allImages.length) % allImages.length : null)

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
            <div className="gallery-resultCount">{allImages.length} Result</div>
            <div className="gallery-sortControl">
              <span className="gallery-sortLabel">Sort by</span>
              <div className="gallery-sortDropdown">
                <span>Latest</span>
                <ChevronDown size={16} color="#94a3b8" />
              </div>
            </div>
          </motion.div>

          {/* Masonry Grid */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            transition={{ staggerChildren: 0.06 }}
            className="gallery-masonry"
          >
            {allImages.map((imgSrc, idx) => (
              <motion.div
                key={idx}
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
                  src={imgSrc}
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

          {/* See More Button */}
          <div className="gallery-actionRow">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="gallery-seeMoreBtn"
              type="button"
            >
              See More
            </motion.button>
          </div>

        </div>
      </section>

      {/* Lightbox */}
      <ImageLightbox
        images={allImages}
        activeIndex={lightboxIndex}
        onClose={closeLightbox}
        onNext={nextImage}
        onPrev={prevImage}
      />

    </motion.div>
  );
}
