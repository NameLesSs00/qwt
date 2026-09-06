import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Seo } from '../../components/seo/Seo';
import imgBg from '../../assets/contactus/bg.png';
import iconLocation from '../../assets/contactus/Frame 193.svg';
import iconEmail from '../../assets/contactus/Frame 194.svg';
import iconPhone from '../../assets/contactus/dashicons_phone.svg'; // Or whichever phone icon exists.
import iconIg from '../../assets/contactus/iconoir_instagram.svg';
import iconTikTok from '../../assets/contactus/proicons_tiktok.svg';
// I will just use the phone icon from lucide-react if the svg isn't right, but I'll try the svg first.

import './contactUsPage.scss';

export function ContactUsPage() {
  const { t } = useTranslation();
  
  const [username, setUsername] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [message, setMessage] = useState('');

  const handleWhatsAppSubmit = () => {
    if (!username || !whatsapp || !message) return;
    const text = `username:${username}\nphone number:${whatsapp}\n\n[${message}]`;
    const encodedText = encodeURIComponent(text);
    window.open(`https://wa.me/201146098826?text=${encodedText}`, '_blank');
  };

  return (
    <div className="contact-page">
      <Seo 
        title={t('header.contactUs')} 
        description={t('contactUs.heroSubtitle')}
      />
      
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
              <div className="contact-cardText" style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <a
                  href="https://wa.me/201146098826"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'inherit', textDecoration: 'none' }}
                >
                  +201146098826
                </a>
                <a
                  href="https://wa.me/201029566523"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ color: 'inherit', textDecoration: 'none' }}
                >
                  +20 10 29566523
                </a>
              </div>
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
                {/* <a href="#" className="contact-socialBtn">
                  <img src={iconFb} alt="Facebook" />
                </a> */}
                <a href="https://www.instagram.com/hurghada.funtime?igsh=MnZ0amJ5Z3Ridm0=" target="_blank" rel="noopener noreferrer" className="contact-socialBtn">
                  <img src={iconIg} alt="Instagram" />
                </a>
                <a href="https://www.tiktok.com/@hurghada.fun.time?_r=1&_t=ZS-96vwTiRSOLE" target="_blank" rel="noopener noreferrer" className="contact-socialBtn">
                  <img src={iconTikTok} alt="TikTok" />
                </a>
                <a href="https://wa.me/201146098826" target="_blank" rel="noopener noreferrer" className="contact-socialBtn">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.66-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 0 0-3.48-8.413Z"/>
                  </svg>
                </a>
              </div>
            </div>

            {/* Right Side / Form */}
            <div className="contact-splitRight">
              <form className="contact-form">
                
                <div className="contact-formGroup">
                  <label className="contact-formLabel">{t('contactUs.usernameLabel')}</label>
                  <input type="text" className="contact-formInput" placeholder={t('contactUs.usernamePlaceholder')} value={username} onChange={e => setUsername(e.target.value)} />
                </div>

                <div className="contact-formGroup">
                  <label className="contact-formLabel">{t('contactUs.whatsappLabel')}</label>
                  <input type="tel" className="contact-formInput" placeholder={t('contactUs.whatsappPlaceholder')} value={whatsapp} onChange={e => setWhatsapp(e.target.value)} />
                </div>

                <div className="contact-formGroup">
                  <label className="contact-formLabel">{t('contactUs.messageLabel')}</label>
                  <textarea className="contact-formTextarea" placeholder={t('contactUs.messagePlaceholder')} rows={5} value={message} onChange={e => setMessage(e.target.value)}></textarea>
                </div>

                <div className="contact-formAction">
                  <button type="button" className="contact-submitBtn" onClick={handleWhatsAppSubmit}>{t('contactUs.submitBtn')}</button>
                </div>
                
              </form>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
