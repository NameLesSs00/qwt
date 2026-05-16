import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { motion } from "motion/react";
import imgBg from '../../assets/aboutUs/bg.png';
import imgBags from '../../assets/aboutUs/baggs.jpg';
import imgPhoto1 from '../../assets/aboutUs/photo.png';
import imgPhoto2 from '../../assets/aboutUs/photo2.png';
import imgMapBg from '../../assets/aboutUs/ground.png';
import iconJacket from '../../assets/aboutUs/tabler_jacket.svg';
import iconCamel from '../../assets/aboutUs/hugeicons_camel.svg';
import iconTemple from '../../assets/aboutUs/game-icons_egyptian-temple.svg';

import './aboutUsPage.scss';

export function AboutUsPage() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="about-page"
    >
      
      {/* ── Hero Section ── */}
      <section className="about-hero">
        <motion.img
          initial={{ scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.4, ease: "easeOut" }}
          className="about-heroBg"
          src={imgBg}
          alt="About Us Background"
        />
        <div className="about-heroOverlay"></div>
        <div className="about-heroInner">
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="about-heroTitle"
          >
            About
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="about-heroSubtitle"
          >
            People Don't Take, Trips Take People
          </motion.h2>
        </div>
      </section>

      {/* ── Content Section ── */}
      <section className="about-content">
        <div className="about-contentWrap">
          
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0, x: -16 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.45 }}
            className="about-breadcrumb"
          >
            <Link to="/" className="about-breadcrumbLink">Home</Link>
            <span className="about-breadcrumbSep">&gt;</span>
            <span className="about-breadcrumbActive">About Us</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="about-intro"
          >
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.05 }}
              className="about-introTitle"
            >
              Your Journey Begins With Us
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.12 }}
              className="about-introText"
            >
              We are a travel experiences company dedicated to creating unforgettable adventures across Egypt. From breathtaking sea trips and
              thrilling desert safaris to timeless historical tours, we help you discover destinations in a way that feels authentic, exciting, and effortless.
            </motion.p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="about-whoWeAre"
          >
            <motion.div
              initial={{ opacity: 0, x: -18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.05 }}
              className="about-whoImages"
            >
              <div className="about-whoImgCol1">
                <img src={imgBags} alt="Travel Bags" className="about-whoImgCapsule" />
              </div>
              <div className="about-whoImgCol2">
                <img src={imgPhoto1} alt="Travel Photo 1" className="about-whoImgCircle about-whoImgTop" />
                <img src={imgPhoto2} alt="Travel Photo 2" className="about-whoImgCircle about-whoImgBottom" />
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 18 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: 0.08 }}
              className="about-whoText"
            >
              <h2 className="about-sectionTitle">Who We Are ?</h2>
              <p className="about-whoDesc">
                We believe that travel is more than just visiting places it's about stories, moments,
                and memories that last a lifetime.
                Our team is made up of local experts and travel enthusiasts who know every 
                hidden gem, every perfect timing, and every detail that turns a trip into an experience.
              </p>
            </motion.div>
          </motion.div>

        </div>
      </section>

      {/* ── What We Offer Section ── */}
      <section className="about-offer" style={{ backgroundImage: `url(${imgMapBg})` }}>
        <div className="about-offerWrap">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="about-offerMainTitle"
          >
            What We Offer?
          </motion.h2>
          
          <div className="about-offerGrid">
            
            {/* Offer 1 */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.05 }}
              whileHover={{ y: -6 }}
              className="about-offerItem"
            >
              <div className="about-offerIconWrap">
                <img src={iconJacket} alt="Sea Trips" />
              </div>
              <h3 className="about-offerTitle">Sea Trips</h3>
              <p className="about-offerDesc">
                Snorkeling, Islands, crystal-clear<br/>
                waters, and relaxation.
              </p>
            </motion.div>

            {/* Offer 2 */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.12 }}
              whileHover={{ y: -6 }}
              className="about-offerItem"
            >
              <div className="about-offerIconWrap">
                <img src={iconCamel} alt="Desert Safari" />
              </div>
              <h3 className="about-offerTitle">Desert Safari</h3>
              <p className="about-offerDesc">
                Adventure, culture, and unforgettable<br/>
                desert views
              </p>
            </motion.div>

            {/* Offer 3 */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: 0.19 }}
              whileHover={{ y: -6 }}
              className="about-offerItem"
            >
              <div className="about-offerIconWrap">
                <img src={iconTemple} alt="Historical Tours" />
              </div>
              <h3 className="about-offerTitle">Historical Tours</h3>
              <p className="about-offerDesc">
                Explore Egypt's ancient wonders with<br/>
                expert guides
              </p>
            </motion.div>

          </div>
        </div>
      </section>

      {/* ── Call to Action Banner ── */}
      <section className="about-cta">
        <img className="about-ctaBg" src={imgBags} alt="Start your journey" />
        <div className="about-ctaOverlay"></div>
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55 }}
          className="about-ctaInner"
        >
          <h2 className="about-ctaTitle">
            Start your journey with<br/>us today
          </h2>
          <p className="about-ctaDesc">
            Discover your next adventure and create memories worth sharing
          </p>
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            className="about-ctaBtn"
            type="button"
          >
            Explore Trips <ArrowRight size={16} />
          </motion.button>
        </motion.div>
      </section>

    </motion.div>
  );
}
