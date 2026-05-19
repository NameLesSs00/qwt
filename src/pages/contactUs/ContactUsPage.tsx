import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import imgBg from '../../assets/contactus/bg.png';
import iconLocation from '../../assets/contactus/Frame 193.svg';
import iconEmail from '../../assets/contactus/Frame 194.svg';
import iconPhone from '../../assets/contactus/dashicons_phone.svg'; // Or whichever phone icon exists.
import iconFb from '../../assets/contactus/basil_facebook-outline.svg';
import iconIg from '../../assets/contactus/iconoir_instagram.svg';
import iconTikTok from '../../assets/contactus/proicons_tiktok.svg';
import iconTwitter from '../../assets/contactus/prime_twitter.svg';
// I will just use the phone icon from lucide-react if the svg isn't right, but I'll try the svg first.

import './contactUsPage.scss';

export function ContactUsPage() {
  const { t } = useTranslation();

  return (
    <div className="contact-page">
      
      {/* ── Hero Section ── */}
      <section className="contact-hero">
        <img className="contact-heroBg" src={imgBg} alt="Contact Us Background" />
        <div className="contact-heroOverlay"></div>
        <div className="contact-heroInner">
          <h1 className="contact-heroTitle">{t('contactUs.heroTitle')}</h1>
          <h2 className="contact-heroSubtitle">{t('contactUs.heroSubtitle')}</h2>
        </div>
      </section>

      {/* ── Content Section ── */}
      <section className="contact-content">
        <div className="contact-contentWrap">
          
          {/* Breadcrumb */}
          <div className="contact-breadcrumb">
            <Link to="/" className="contact-breadcrumbLink">{t('contactUs.breadcrumbHome')}</Link>
            <span className="contact-breadcrumbSep">&gt;</span>
            <span className="contact-breadcrumbActive">{t('contactUs.breadcrumbActive')}</span>
          </div>

          {/* Cards Row */}
          <div className="contact-cardsRow">
            {/* Card 1: Office Location */}
            <div className="contact-card">
              <div className="contact-cardIconWrap">
                <img src={iconEmail} alt="Office Location" />
              </div>
              <h3 className="contact-cardTitle">{t('contactUs.officeLocation')}</h3>
              <p className="contact-cardText">
                {t('contactUs.officeAddress').split('\n').map((line, idx, arr) => (
                  <span key={idx}>{line}{idx < arr.length - 1 && <br />}</span>
                ))}
              </p>
            </div>

            {/* Card 2: Email Address */}
            <div className="contact-card">
              <div className="contact-cardIconWrap">
                <img src={iconLocation} alt="Email Address" />
              </div>
              <h3 className="contact-cardTitle">{t('contactUs.emailAddress')}</h3>
              <p className="contact-cardText">
                {t('contactUs.emails').split('\n').map((line, idx, arr) => (
                  <span key={idx}>{line}{idx < arr.length - 1 && <br />}</span>
                ))}
              </p>
            </div>

            {/* Card 3: Hotline */}
            <div className="contact-card">
              <div className="contact-cardIconWrap">
                <img src={iconPhone} alt="Hotline" style={{ width: 80 }} /> 
              </div>
              <h3 className="contact-cardTitle">{t('contactUs.hotline')}</h3>
              <p className="contact-cardText">
                {t('contactUs.phones').split('\n').map((line, idx, arr) => (
                  <span key={idx}>{line}{idx < arr.length - 1 && <br />}</span>
                ))}
              </p>
            </div>
          </div>

          {/* Bottom Split: Questions & Form */}
          <div className="contact-split">
            
            {/* Left Side */}
            <div className="contact-splitLeft">
              <h2 className="contact-splitTitle">
                {t('contactUs.questionsTitle').split('\n').map((line, idx, arr) => (
                  <span key={idx}>{line}{idx < arr.length - 1 && <br />}</span>
                ))}
              </h2>
              <div className="contact-socials">
                <a href="#" className="contact-socialBtn">
                  <img src={iconFb} alt="Facebook" />
                </a>
                <a href="#" className="contact-socialBtn">
                  <img src={iconIg} alt="Instagram" />
                </a>
                <a href="#" className="contact-socialBtn">
                  <img src={iconTikTok} alt="TikTok" />
                </a>
                <a href="#" className="contact-socialBtn">
                  <img src={iconTwitter} alt="X (Twitter)" />
                </a>
              </div>
            </div>

            {/* Right Side / Form */}
            <div className="contact-splitRight">
              <form className="contact-form">
                
                <div className="contact-formGroup">
                  <label className="contact-formLabel">{t('contactUs.usernameLabel')}</label>
                  <input type="text" className="contact-formInput" placeholder={t('contactUs.usernamePlaceholder')} />
                </div>

                <div className="contact-formGroup">
                  <label className="contact-formLabel">{t('contactUs.whatsappLabel')}</label>
                  <input type="tel" className="contact-formInput" placeholder={t('contactUs.whatsappPlaceholder')} />
                </div>

                <div className="contact-formGroup">
                  <label className="contact-formLabel">{t('contactUs.messageLabel')}</label>
                  <textarea className="contact-formTextarea" placeholder={t('contactUs.messagePlaceholder')} rows={5}></textarea>
                </div>

                <div className="contact-formAction">
                  <button type="button" className="contact-submitBtn">{t('contactUs.submitBtn')}</button>
                </div>
                
              </form>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
