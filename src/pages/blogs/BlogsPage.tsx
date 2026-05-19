import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight, Search } from 'lucide-react';
import { motion } from "motion/react";

import { getBlogs, getBlogImageUrl } from '../../api/blogsApi';
import type { DtoBlogRead } from '../../api/blogsApi';

import './blogsPage.scss';

export function BlogsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [allBlogs, setAllBlogs] = useState<DtoBlogRead[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [visibleCount, setVisibleCount] = useState(6);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadBlogs() {
      try {
        setIsLoading(true);
        const res = await getBlogs();
        if (res.success) {
          setAllBlogs(res.data);
        }
      } catch (error) {
        console.error('Failed to load blogs', error);
      } finally {
        setIsLoading(false);
      }
    }
    loadBlogs();
  }, []);
  
  const filteredBlogs = allBlogs.filter(blog => {
    const titleMatch = (blog.title || '').toLowerCase().includes(searchQuery.toLowerCase());
    return titleMatch;
  });

  const blogs = filteredBlogs.slice(0, visibleCount);

  const handleSeeMore = () => {
    setVisibleCount(prev => Math.min(prev + 6, filteredBlogs.length));
  };

  const handleBlogClick = (id: number, title: string) => {
    const slug = title ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'blog';
    navigate(`/blogs/details/${id}/${slug}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="blogs-page"
    >
      <div className="blogs-wrap">
        
        {/* Breadcrumb */}
        <motion.div
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.45, delay: 0.05 }}
          className="blogs-breadcrumb"
        >
          <Link to="/" className="blogs-breadcrumbLink">{t('blogsPage.breadcrumbHome')}</Link>
          <span className="blogs-breadcrumbSep">&gt;</span>
          <span className="blogs-breadcrumbActive">{t('blogsPage.breadcrumbActive')}</span>
        </motion.div>

        {/* Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="blogs-toolbar"
        >
          <div className="blogs-filters" style={{ width: '100%', justifyContent: 'flex-end' }}>
            <div className="blogs-searchBox">
              <Search size={16} color="#94a3b8" />
              <input 
                type="text" 
                placeholder={t('blogsPage.searchPlaceholder')} 
                className="blogs-searchInput" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#64748b' }}>{t('blogsPage.loadingText')}</div>
        )}

        {/* Grid */}
        {!isLoading && (
          <div className="blogs-grid">
            {blogs.map((blog) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: 0.04 }}
                whileHover={{ y: -6 }}
                className="blogs-card"
                onClick={() => handleBlogClick(blog.id, blog.title || '')}
              >
                <div className="blogs-cardImageWrap">
                  <motion.img
                    initial={{ scale: 1.02 }}
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                    src={getBlogImageUrl(blog.imageUrl)}
                    alt={blog.title || 'Blog cover'}
                    className="blogs-cardBg"
                  />
                </div>
                <div className="blogs-cardContent">
                  <h3 className="blogs-cardTitle">{blog.title}</h3>
                  <motion.button
                    whileHover={{ scale: 1.04 }}
                    whileTap={{ scale: 0.96 }}
                    className="blogs-cardBtn"
                    type="button"
                  >
                    {t('blogsPage.readMoreBtn')} <ArrowRight size={14} />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Actions */}
        {!isLoading && visibleCount < filteredBlogs.length && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="blogs-actionRow"
          >
            <motion.button
              className="blogs-seeMoreBtn"
              onClick={handleSeeMore}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              type="button"
            >
              {t('blogsPage.seeMoreBtn')}
            </motion.button>
          </motion.div>
        )}
        
        {!isLoading && filteredBlogs.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.35 }}
            style={{ textAlign: 'center', color: '#64748b', padding: '40px 0' }}
          >
            {t('blogsPage.noBlogsFound')}
          </motion.div>
        )}

      </div>
    </motion.div>
  );
}
