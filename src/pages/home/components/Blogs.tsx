import { motion } from 'framer-motion'
import blog1 from '../../../assets/blogs/Subtract (2).png'
import blog2 from '../../../assets/blogs/Subtract (1).png'
import blog3 from '../../../assets/blogs/Subtract.png'
import { fadeUp, scalePop, stagger, viewport } from '../../../lib/animations'
import '../styles/blogs.scss'

type BlogCard = { id: string; image: string; title: string; category: string }

const cards: BlogCard[] = [
  { id: 'b1', image: blog1, title: 'Travel Tips &\nStories', category: 'atv'      },
  { id: 'b2', image: blog2, title: 'Travel Tips &\nStories', category: 'sunset'   },
  { id: 'b3', image: blog3, title: 'Travel Tips &\nStories', category: 'flyboard' },
]

export function Blogs() {
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
            From Our <span className="home-blogs__titleAccent">Blogs</span>
          </h2>
          <p className="home-blogs__sub">
            Get inspired with travel guides, helpful tips, and stories that
            make your journey across Egypt easier and more memorable.
          </p>
        </motion.header>

        {/* Blog card grid – stagger scale pop */}
        <motion.div
          className="home-blogs__grid"
          variants={stagger(0.15, 0.1)}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          {cards.map((card) => (
            <motion.article
              key={card.id}
              className="blog-card"
              variants={scalePop}
              whileHover={{ y: -6 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            >
              {/* Image zooms on hover */}
              <div className="blog-card__image-wrap" style={{ overflow: 'hidden' }}>
                <motion.img
                  src={card.image}
                  alt={card.title}
                  className="blog-card__img"
                  whileHover={{ scale: 1.07, transition: { duration: 0.4, ease: 'easeOut' } }}
                />
                <div className="blog-card__overlay" />
              </div>

              <h3 className="blog-card__title">{card.title}</h3>

              <div className="blog-card__action-container">
                <motion.button
                  type="button"
                  className="blog-card__btn"
                  whileHover={{ gap: '10px', x: 3 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                >
                  Read More
                  <svg width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M11 1L17 7M17 7L11 13M17 7H1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </motion.button>
              </div>
            </motion.article>
          ))}
        </motion.div>

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
          >
            See More
          </motion.button>
        </motion.div>

      </div>
    </section>
  )
}