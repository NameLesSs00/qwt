import { Link } from 'react-router-dom';
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
  return (
    <div className="contact-page">
      
      {/* ── Hero Section ── */}
      <section className="contact-hero">
        <img className="contact-heroBg" src={imgBg} alt="Contact Us Background" />
        <div className="contact-heroOverlay"></div>
        <div className="contact-heroInner">
          <h1 className="contact-heroTitle">Contact Us</h1>
          <h2 className="contact-heroSubtitle">Let's Plan Your Next Adventure</h2>
        </div>
      </section>

      {/* ── Content Section ── */}
      <section className="contact-content">
        <div className="contact-contentWrap">
          
          {/* Breadcrumb */}
          <div className="contact-breadcrumb">
            <Link to="/" className="contact-breadcrumbLink">Home</Link>
            <span className="contact-breadcrumbSep">&gt;</span>
            <span className="contact-breadcrumbActive">contact Us</span>
          </div>

          {/* Cards Row */}
          <div className="contact-cardsRow">
            {/* Card 1: Office Location */}
            <div className="contact-card">
              <div className="contact-cardIconWrap">
                <img src={iconEmail} alt="Office Location" />
              </div>
              <h3 className="contact-cardTitle">Office Location</h3>
              <p className="contact-cardText">
                55 Main Street<br />
                2nd Floor Red sea
              </p>
            </div>

            {/* Card 2: Email Address */}
            <div className="contact-card">
              <div className="contact-cardIconWrap">
                <img src={iconLocation} alt="Email Address" />
              </div>
              <h3 className="contact-cardTitle">Email Address</h3>
              <p className="contact-cardText">
                contact@example.com<br />
                info@example.com
              </p>
            </div>

            {/* Card 3: Hotline */}
            <div className="contact-card">
              <div className="contact-cardIconWrap">
              {/* Fallback to Lucide Phone if dashicons missing but we know dashicons_phone exists */}
                <img src={iconPhone} alt="Hotline" style={{ width: 80 }} /> 
              </div>
              <h3 className="contact-cardTitle">Hotline</h3>
              <p className="contact-cardText">
                +1 (307) 778-0608<br />
                666 8888 000
              </p>
            </div>
          </div>

          {/* Bottom Split: Questions & Form */}
          <div className="contact-split">
            
            {/* Left Side */}
            <div className="contact-splitLeft">
              <h2 className="contact-splitTitle">
                Have questions? Feel free to<br />
                write us
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
                  <label className="contact-formLabel">Your name</label>
                  <input type="text" className="contact-formInput" placeholder="Enter Name" />
                </div>

                <div className="contact-formGroup">
                  <label className="contact-formLabel">Email address</label>
                  <input type="email" className="contact-formInput" placeholder="Enter Email" />
                </div>

                <div className="contact-formGroup">
                  <label className="contact-formLabel">Massage</label>
                  <textarea className="contact-formTextarea" placeholder="Write your massage" rows={5}></textarea>
                </div>

                <div className="contact-formAction">
                  <button type="button" className="contact-submitBtn">Send Message</button>
                </div>
                
              </form>
            </div>

          </div>

        </div>
      </section>

    </div>
  );
}
