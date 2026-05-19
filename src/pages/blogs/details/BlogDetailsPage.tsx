import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from "motion/react";
import { getBlogById, getBlogs, getBlogImageUrl } from '../../../api/blogsApi';
import type { DtoBlogRead } from '../../../api/blogsApi';
import imgHero from '../../../assets/plogs/details/222.png'; // Fallback hero

import './blogDetailsPage.scss';

export function BlogDetailsPage() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string; name?: string }>();
  const [blog, setBlog] = useState<DtoBlogRead | null>(null);
  const [recentBlogs, setRecentBlogs] = useState<DtoBlogRead[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!id) return;
      setIsLoading(true);
      try {
        const blogId = parseInt(id, 10);
        const [blogRes, recentRes] = await Promise.all([
          getBlogById(blogId),
          getBlogs(1, 4) // Fetch a few recent blogs
        ]);
        
        if (blogRes.success) {
          setBlog(blogRes.data);
        }
        
        if (recentRes.success) {
          // Exclude the current blog from recent posts
          setRecentBlogs(recentRes.data.filter(b => b.id !== blogId).slice(0, 3));
        }
      } catch (error) {
        console.error('Failed to fetch blog details', error);
      } finally {
        setIsLoading(false);
      }
    }
    
    fetchData();
  }, [id]);

  if (isLoading) {
    return (
      <div className="bd-page" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#1e659e', fontSize: '18px', fontWeight: 500 }}>{t('blogDetailsPage.loadingText')}</p>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="bd-page" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#1e659e', fontSize: '18px', fontWeight: 500 }}>{t('blogDetailsPage.notFoundText')}</p>
      </div>
    );
  }

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
          src={getBlogImageUrl(blog.imageUrl) || imgHero} 
          alt={blog.title || 'Blog Banner'} 
        />
        <div className="bd-heroOverlay"></div>
        <div className="bd-heroInner">
          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className="bd-heroTitle"
          >
            {blog.title}
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
            <Link to="/" className="bd-breadcrumbLink">{t('blogDetailsPage.breadcrumbHome')}</Link>
            <span className="bd-breadcrumbSep">&gt;</span>
            <Link to="/blogs" className="bd-breadcrumbLink">{t('blogDetailsPage.breadcrumbBlogs')}</Link>
            <span className="bd-breadcrumbSep">&gt;</span>
            <span className="bd-breadcrumbActive">{t('blogDetailsPage.breadcrumbActive')}</span>
          </motion.div>

          <div className="bd-splitLayout">
            
            {/* ── Left Content (Main) ── */}
            <div className="bd-mainCol">
              <article className="bd-article">
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="bd-articleMainTitle"
                >
                  {blog.title}
                </motion.h2>
                
                {blog.description && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                  >
                    {blog.description}
                  </motion.p>
                )}

                {blog.sections?.map((section) => (
                  <div key={section.id} id={`section-${section.id}`} style={{ marginTop: '40px' }}>
                    <motion.h3 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                    >
                      {section.title}
                    </motion.h3>
                    {section.imageUrl && (
                      <motion.img 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        src={getBlogImageUrl(section.imageUrl)} 
                        alt={section.title || ''} 
                        className="bd-mainImg"
                        style={{ marginTop: '20px', marginBottom: '20px' }}
                      />
                    )}
                    <motion.p
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      viewport={{ once: true }}
                    >
                      {section.content}
                    </motion.p>
                  </div>
                ))}
              </article>
            </div>

            {/* ── Right Sidebar ── */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bd-sidebarCol"
            >
              
              {/* Recent Posts Widget */}
              {recentBlogs.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.6 }}
                  className="bd-recentWidget"
                >
                  <h4 className="bd-widgetTitle">{t('blogDetailsPage.recentPostsTitle')}</h4>
                  
                  <div className="bd-recentList">
                    {recentBlogs.map(recent => {
                      const slug = recent.title ? recent.title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'blog';
                      return (
                        <motion.div whileHover={{ x: 5 }} key={recent.id}>
                          <Link to={`/blogs/details/${recent.id}/${slug}`} className="bd-recentItem">
                            <img src={getBlogImageUrl(recent.imageUrl) || imgHero} alt={recent.title || 'Recent'} className="bd-recentThumb" />
                            <div className="bd-recentInfo">
                              <h5 className="bd-recentTitle">{recent.title}</h5>
                            </div>
                          </Link>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.div>
              )}

            </motion.div>
          </div>

        </div>
      </section>

    </motion.div>
  );
}
