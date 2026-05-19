import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();

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
            {t('aboutPage.heroTitle')}
          </motion.h1>
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="about-heroSubtitle"
          >
            {t('aboutPage.heroSubtitle')}
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
            <Link to="/" className="about-breadcrumbLink">{t('aboutPage.breadcrumbHome')}</Link>
            <span className="about-breadcrumbSep">&gt;</span>
            <span className="about-breadcrumbActive">{t('aboutPage.breadcrumbActive')}</span>
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
              {t('aboutPage.introTitle')}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.12 }}
              className="about-introText"
            >
              {t('aboutPage.introText')}
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
              <h2 className="about-sectionTitle">{t('aboutPage.sectionTitle')}</h2>
              <p className="about-whoDesc">
                {t('aboutPage.whoDesc')}
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
            {t('aboutPage.offerMainTitle')}
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
              <h3 className="about-offerTitle">{t('aboutPage.offer1Title')}</h3>
              <p className="about-offerDesc">
                {t('aboutPage.offer1Desc').split('\n').map((line, idx, arr) => (
                  <span key={idx}>{line}{idx < arr.length - 1 && <br />}</span>
                ))}
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
              <h3 className="about-offerTitle">{t('aboutPage.offer2Title')}</h3>
              <p className="about-offerDesc">
                {t('aboutPage.offer2Desc').split('\n').map((line, idx, arr) => (
                  <span key={idx}>{line}{idx < arr.length - 1 && <br />}</span>
                ))}
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
              <h3 className="about-offerTitle">{t('aboutPage.offer3Title')}</h3>
              <p className="about-offerDesc">
                {t('aboutPage.offer3Desc').split('\n').map((line, idx, arr) => (
                  <span key={idx}>{line}{idx < arr.length - 1 && <br />}</span>
                ))}
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
            {t('aboutPage.ctaTitle').split('\n').map((line, idx, arr) => (
              <span key={idx}>{line}{idx < arr.length - 1 && <br />}</span>
            ))}
          </h2>
          <p className="about-ctaDesc">
            {t('aboutPage.ctaDesc')}
          </p>
          <Link to="/trips">
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="about-ctaBtn"
              type="button"
            >
              {t('aboutPage.ctaBtn')} <ArrowRight size={16} />
            </motion.button>
          </Link>
        </motion.div>
      </section>

    </motion.div>
  );
}
