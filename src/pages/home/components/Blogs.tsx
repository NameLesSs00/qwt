import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { Loader2 } from 'lucide-react'
import blog1 from '../../../assets/blogs/Subtract (2).png'
import blog2 from '../../../assets/blogs/Subtract (1).png'
import blog3 from '../../../assets/blogs/Subtract.png'
import { fadeUp, scalePop, stagger, viewport } from '../../../lib/animations'
import { getBlogs, getBlogImageUrl, type DtoBlogRead } from '../../../api/blogsApi'
import '../styles/blogs.scss'

export function Blogs() {
  const navigate = useNavigate()
  const { t, i18n } = useTranslation()
  const [blogs, setBlogs] = useState<DtoBlogRead[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    let active = true
    setIsLoading(true)
    setHasError(false)
    getBlogs(1, 3)
      .then(res => {
        if (!active) return
        if (res.success && res.data) {
          setBlogs(res.data.slice(0, 3))
        } else {
          setHasError(true)
        }
      })
      .catch(err => {
        if (!active) return
        console.error('Failed to fetch home blogs:', err)
        setHasError(true)
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })

    return () => { active = false }
  }, [i18n.language])

  const handleBlogClick = (id: number, title: string) => {
    const slug = title ? title.toLowerCase().replace(/[^a-z0-9]+/g, '-') : 'blog'
    navigate(`/blogs/details/${id}/${slug}`)
  }

  return (
    <section className="home-blogs">
      <div className="home-blogs__inner">

        {/* Header */}
        <motion.header
          className="home-blogs__header"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <h2 className="home-blogs__title">
            {t('homePage.blogs.title')} <span className="home-blogs__titleAccent">{t('homePage.blogs.titleAccent')}</span>
          </h2>
          <p className="home-blogs__sub">
            {t('homePage.blogs.sub')}
          </p>
        </motion.header>

        {/* Content Area */}
        {isLoading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
            <Loader2 className="animate-spin" size={40} color="#1e659e" />
          </div>
        ) : hasError || blogs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
            {hasError ? t('homePage.blogs.failed') : t('homePage.blogs.empty')}
          </div>
        ) : (
          /* Blog card grid – stagger scale pop */
          <motion.div
            className="home-blogs__grid"
            variants={stagger(0.15, 0.1)}
            initial="hidden"
            whileInView="visible"
            viewport={viewport}
          >
            {blogs.map((blog, index) => {
              const fallbackImage = [blog1, blog2, blog3][index % 3]
              const blogImage = getBlogImageUrl(blog.imageUrl) || fallbackImage
              const blogTitle = blog.title || 'Untitled Blog'

              return (
                <motion.article
                  key={blog.id}
                  className="blog-card"
                  variants={scalePop}
                  whileHover={{ y: -6 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleBlogClick(blog.id, blogTitle)}
                >
                  {/* Image zooms on hover */}
                  <div className="blog-card__image-wrap" style={{ overflow: 'hidden' }}>
                    <motion.img
                      src={blogImage}
                      alt={blogTitle}
                      className="blog-card__img"
                      whileHover={{ scale: 1.07, transition: { duration: 0.4, ease: 'easeOut' } }}
                    />
                    <div className="blog-card__overlay" />
                  </div>

                  <h3 className="blog-card__title">{blogTitle}</h3>

                  <div className="blog-card__action-container">
                    <motion.button
                      type="button"
                      className="blog-card__btn"
                      whileHover={{ gap: '10px', x: 3 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                      onClick={(e) => {
                        e.stopPropagation()
                        handleBlogClick(blog.id, blogTitle)
                      }}
                    >
                      {t('homePage.blogs.readMore')}
                      <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 1L17 7M17 7L11 13M17 7H1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </motion.button>
                  </div>
                </motion.article>
              )
            })}
          </motion.div>
        )}

        {/* Footer button */}
        <motion.div
          className="home-blogs__footer"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <motion.button
            className="home-blogs__moreBtn"
            whileHover={{ scale: 1.06, y: -2 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 350, damping: 18 }}
            onClick={() => navigate('/blogs')}
          >
            {t('homePage.blogs.seeMore')}
          </motion.button>
        </motion.div>

      </div>
    </section>
  )
}