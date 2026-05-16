import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from "motion/react";
import imgHero from '../../../assets/plogs/details/222.png';
import imgMain from '../../../assets/plogs/details/i 1.png';
import iconUser from '../../../assets/plogs/details/ri_user-fill.svg';
import iconCategory from '../../../assets/plogs/details/nrk_category-active.svg';
import iconQuote from '../../../assets/plogs/details/Quote Icon.svg';

// Recent Posts mock images
import imgRecent1 from '../../../assets/plogs/details/Frame 153.png';
import imgRecent2 from '../../../assets/plogs/details/Frame 153-1.png';

import './blogDetailsPage.scss';

export function BlogDetailsPage() {
  const [activeSection, setActiveSection] = useState('everything');

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['everything', 'expect', 'wear', 'when', 'safety'];
      const offsets = sections.map(id => {
        const el = document.getElementById(id);
        return { id, top: el ? el.getBoundingClientRect().top : Infinity };
      });
      // Find latest section that is near the top of viewport
      const passedSections = offsets.filter(item => item.top <= 200);
      if (passedSections.length > 0) {
        setActiveSection(passedSections[passedSections.length - 1].id);
      } else {
        setActiveSection('everything');
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const y = el.getBoundingClientRect().top + window.scrollY - 100; // offset for sticky header
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const steps = [
    { id: 'everything', label: 'Everything You Need' },
    { id: 'expect', label: 'What to Expect?' },
    { id: 'wear', label: 'What to Wear?' },
    { id: 'when', label: 'When You Go?' },
    { id: 'safety', label: 'About Safety' },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      transition={{ duration: 0.5 }}
      className="bd-page"
    >
      
      {/* ── Hero Banner ── */}
      <section className="bd-hero">
        <motion.img 
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="bd-heroBg" 
          src={imgHero} 
          alt="Blog Banner" 
        />
        <div className="bd-heroOverlay"></div>
        <div className="bd-heroInner">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="bd-heroTitle"
          >
            Everything You Need to Know Before a Desert Safari
          </motion.h1>
        </div>
      </section>

      {/* ── Main Layout ── */}
      <section className="bd-contentSection">
        <div className="bd-contentWrap">
          
          {/* Breadcrumb */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="bd-breadcrumb"
          >
            <Link to="/" className="bd-breadcrumbLink">Home</Link>
            <span className="bd-breadcrumbSep">&gt;</span>
            <Link to="/blogs" className="bd-breadcrumbLink">Blogs</Link>
            <span className="bd-breadcrumbSep">&gt;</span>
            <span className="bd-breadcrumbActive">Blog details</span>
          </motion.div>

          <div className="bd-splitLayout">
            
            {/* ── Left Content (Main) ── */}
            <div className="bd-mainCol">
              
              <img src={imgMain} alt="Safari ATV" className="bd-mainImg" />
              
              <div className="bd-metaRow">
                <div className="bd-metaLeft">
                  <motion.span 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bd-metaItem"
                  >
                    <img src={iconUser} alt="User" /> Admin
                  </motion.span>
                  <motion.span 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bd-metaItem"
                  >
                    <img src={iconCategory} alt="Category" /> Safari
                  </motion.span>
                </div>
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  className="bd-metaRight"
                >
                  12 Jan 2026
                </motion.div>
              </div>

              <article className="bd-article">
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  id="everything" 
                  className="bd-articleMainTitle"
                >
                  Everything You Need to Know Before a Desert Safari
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 }}
                >
                  A desert safari is one of the most exciting experiences you can have in Egypt. From riding quad bikes across golden dunes to enjoying breathtaking desert sunsets, this adventure combines adrenaline, culture, and nature. Before you go, here's everything you need to know to be fully prepared.
                </motion.p>

                <motion.h3 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  id="expect"
                >
                  What to Expect on a Desert Safari
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                >
                  Most desert safari trips include thrilling activities such as quad biking or jeep rides, camel riding, and visits to traditional Bedouin villages. Many tours also offer tea, dinner, or stargazing experiences under the desert sky.
                </motion.p>

                <motion.h3 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  id="wear"
                >
                  What to Wear
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                >
                  Choose comfortable, lightweight clothing and closed shoes suitable for sand. Sunglasses, sunscreen, and a scarf are highly recommended to protect you from the sun and dust.
                </motion.p>

                <motion.h3 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  id="when"
                >
                  Best Time to Go
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                >
                  The best time for a desert safari is during the early morning or late afternoon, especially around sunset. These times offer cooler temperatures and stunning views of the desert landscape.
                </motion.p>

                <motion.h3 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  id="safety"
                >
                  Safety Tips
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                >
                  Always follow your guide's instructions, wear protective gear when riding quad bikes, and stay hydrated throughout the trip. Desert safaris are safe when organized by experienced and licensed operators.
                </motion.p>
              </article>

              {/* Comments Section */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bd-commentsSection"
              >
                <h3 className="bd-sectionTitle">Comments</h3>
                
                <motion.div 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="bd-commentBlock"
                >
                  <div className="bd-quoteHeader">
                    <img src={iconQuote} alt="Quote" className="bd-quoteIcon" />
                    <span className="bd-commentAuthor">Emily R</span>
                  </div>
                  <p className="bd-commentText">
                    Great content! I appreciate how you explained the experience step by step. It made the whole safari feel less intimidating.
                  </p>
                </motion.div>
              </motion.div>

              {/* Add Comment Form */}
              <div className="bd-addCommentSection">
                <h3 className="bd-sectionTitle">Add Comment</h3>
                
                <form className="bd-commentForm">
                  <div className="bd-formGroup">
                    <label>Your name</label>
                    <motion.input 
                      whileFocus={{ scale: 1.01, borderColor: "#1e659e" }}
                      type="text" 
                      placeholder="Enter Name" 
                    />
                  </div>
                  
                  <div className="bd-formGroup">
                    <label>Email</label>
                    <motion.input 
                      whileFocus={{ scale: 1.01, borderColor: "#1e659e" }}
                      type="email" 
                      placeholder="Enter Email" 
                    />
                  </div>

                  <div className="bd-formGroup">
                    <label>Comment</label>
                    <motion.textarea 
                      whileFocus={{ scale: 1.01, borderColor: "#1e659e" }}
                      placeholder="Text..." 
                      rows={4}
                    ></motion.textarea>
                  </div>

                  <div className="bd-formAction">
                    <motion.button 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      type="button" 
                      className="bd-submitBtn"
                    >
                      Post Comment
                    </motion.button>
                  </div>
                </form>
              </div>

            </div>

            {/* ── Right Sidebar ── */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bd-sidebarCol"
            >
              
              {/* Table of Contents / Stepper */}
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.4, delay: 0.4 }}
                className="bd-tocWidget"
              >
                <ul className="bd-stepper">
                  {steps.map((step, idx) => (
                    <motion.li 
                      key={step.id} 
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 + idx * 0.1 }}
                      className={`bd-stepperItem ${activeSection === step.id ? 'active' : ''}`}
                      onClick={() => scrollToSection(step.id)}
                    >
                      <motion.span 
                        animate={activeSection === step.id ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                        transition={{ repeat: activeSection === step.id ? Infinity : 0, duration: 2 }}
                        className="bd-stepDot"
                      ></motion.span>
                      <span className="bd-stepText">{step.label}</span>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>

              {/* Recent Posts Widget */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.6 }}
                className="bd-recentWidget"
              >
                <h4 className="bd-widgetTitle">Recent Posts</h4>
                
                <div className="bd-recentList">
                  <motion.div whileHover={{ x: 5 }}>
                    <Link to="#" className="bd-recentItem">
                      <img src={imgRecent1} alt="Recent 1" className="bd-recentThumb" />
                      <div className="bd-recentInfo">
                        <h5 className="bd-recentTitle">A Beginner's Guide to Visiting Luxor</h5>
                        <span className="bd-recentComments">25 Comments</span>
                      </div>
                    </Link>
                  </motion.div>

                  <motion.div whileHover={{ x: 5 }}>
                    <Link to="#" className="bd-recentItem">
                      <img src={imgRecent2} alt="Recent 2" className="bd-recentThumb" />
                      <div className="bd-recentInfo">
                        <h5 className="bd-recentTitle">Top 7 Snorkeling Spots in the Red Sea</h5>
                        <span className="bd-recentComments">25 Comments</span>
                      </div>
                    </Link>
                  </motion.div>

                  <motion.div whileHover={{ x: 5 }}>
                    <Link to="#" className="bd-recentItem">
                      <img src={imgRecent2} alt="Recent 3" className="bd-recentThumb" />
                      <div className="bd-recentInfo">
                        <h5 className="bd-recentTitle">Top 7 Snorkeling Spots in the Red Sea</h5>
                        <span className="bd-recentComments">25 Comments</span>
                      </div>
                    </Link>
                  </motion.div>
                </div>
              </motion.div>

            </motion.div>
          </div>

        </div>
      </section>

    </motion.div>
  );
}
