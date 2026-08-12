import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import icon from '../../../assets/reviews/icon.svg'
import { fadeUp, viewport } from '../../../lib/animations'
import type { Variants } from 'framer-motion'
import {
  createProjectReview,
  getProjectReviews,
  type DtoProjectReviewRead,
} from '../../../api/projectReviewsApi'
import '../styles/reviews.scss'

const INITIAL_REVIEW_LIMIT = 6
const REVIEW_INCREMENT = 10
const REVIEW_PHONE_PLACEHOLDER = '12365421321'

const cardVariant: Variants = {
  hidden: { opacity: 0, y: 50, rotate: -1.5 },
  visible: {
    opacity: 1,
    y: 0,
    rotate: 0,
    transition: { type: 'spring', stiffness: 200, damping: 22 },
  },
}

const emptyForm = {
  firstName: '',
  lastName: '',
  email: '',
  comment: '',
  rate: 5,
}

function getFullName(review: DtoProjectReviewRead) {
  return [review.firstName, review.lastName].filter(Boolean).join(' ') || review.email || 'Traveller'
}

function formatDate(dateString: string | null) {
  if (!dateString) return ''

  try {
    return new Date(dateString).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return dateString
  }
}

function StarRating({ count }: { count: number }) {
  const rating = Math.max(0, Math.min(5, Math.round(count || 0)))

  return (
    <div className="reviews__stars">
      {Array.from({ length: 5 }).map((_, i) => (
        <motion.span
          key={i}
          className={`reviews__star${i < rating ? ' reviews__star--active' : ''}`}
          initial={{ scale: 0, rotate: -30 }}
          whileInView={{ scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 400, damping: 14, delay: i * 0.07 }}
        >
          {'\u2605'}
        </motion.span>
      ))}
    </div>
  )
}

export function Reviews() {
  const { t } = useTranslation()
  const [reviews, setReviews] = useState<DtoProjectReviewRead[]>([])
  const [displayLimit, setDisplayLimit] = useState(INITIAL_REVIEW_LIMIT)
  const [isLoading, setIsLoading] = useState(true)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [loadError, setLoadError] = useState('')
  const [formData, setFormData] = useState(emptyForm)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchReviews = useCallback(async (limit: number, mode: 'initial' | 'more' | 'refresh' = 'refresh') => {
    try {
      if (mode === 'more') {
        setIsLoadingMore(true)
      } else if (mode === 'initial') {
        setIsLoading(true)
      }

      setLoadError('')
      const response = await getProjectReviews(1, limit + 1)
      const items = response.data || []
      setReviews(items.slice(0, limit))
      setHasMore(items.length > limit)
    } catch {
      setLoadError(t('homePage.reviews.loadError'))
    } finally {
      setIsLoading(false)
      setIsLoadingMore(false)
    }
  }, [t])

  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      fetchReviews(INITIAL_REVIEW_LIMIT, 'initial')
    }, 0)

    return () => window.clearTimeout(timeoutId)
  }, [fetchReviews])

  const handleShowMore = () => {
    const nextLimit = displayLimit + REVIEW_INCREMENT
    setDisplayLimit(nextLimit)
    fetchReviews(nextLimit, 'more')
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setSubmitStatus('idle')

    const firstName = formData.firstName.trim()
    const lastName = formData.lastName.trim()
    const email = formData.email.trim()
    const comment = formData.comment.trim()

    if (!firstName || !lastName || !email || !comment || formData.rate < 1) {
      setSubmitStatus('error')
      return
    }

    try {
      setIsSubmitting(true)
      await createProjectReview({
        firstName,
        lastName,
        email,
        phone: REVIEW_PHONE_PLACEHOLDER,
        comment,
        rate: formData.rate,
      })
      setFormData(emptyForm)
      setSubmitStatus('success')
      await fetchReviews(displayLimit, 'refresh')
    } catch {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section className="reviews">
      <div className="reviews__container">
        <motion.div
          className="reviews__header"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <h2 className="reviews__title">
            {t('homePage.reviews.title')} <span className="reviews__accent">{t('homePage.reviews.accent')}</span>
            <img className="reviews__icon" src={icon} alt="" aria-hidden="true" />
          </h2>
          <p className="reviews__subtitle">
            {t('homePage.reviews.sub')}
          </p>
        </motion.div>

        {isLoading ? (
          <div className="reviews__state">{t('homePage.reviews.loading')}</div>
        ) : loadError ? (
          <div className="reviews__state reviews__state--error">{loadError}</div>
        ) : reviews.length === 0 ? (
          <div className="reviews__state">{t('homePage.reviews.empty')}</div>
        ) : (
          <>
            <motion.div
              className="reviews__grid"
            >
              {reviews.map((review, index) => (
                <motion.article
                  key={review.id}
                  className="reviews__card"
                  variants={cardVariant}
                  initial="hidden"
                  animate="visible"
                  transition={{
                    type: 'spring',
                    stiffness: 220,
                    damping: 24,
                    delay: Math.min(index * 0.04, 0.28),
                  }}
                  whileHover={{ y: -6, boxShadow: '0 18px 42px rgba(30,101,158,0.13)' }}
                >
                  <div className="reviews__cardHeader">
                    <div className="reviews__meta">
                      <span className="reviews__eyebrow">{t('homePage.reviews.traveller')}</span>
                      <div className="reviews__nameRow">
                        <span className="reviews__name">{getFullName(review)}</span>
                      </div>
                      {review.email && <span className="reviews__email">{review.email}</span>}
                      {review.createdAt && <span className="reviews__time">{formatDate(review.createdAt)}</span>}
                      <StarRating count={review.rate || 0} />
                    </div>
                  </div>

                  <p className="reviews__quote">"{review.comment || ''}"</p>
                </motion.article>
              ))}
            </motion.div>

            {hasMore && (
              <div className="reviews__actions">
                <button
                  className="reviews__showMore"
                  type="button"
                  onClick={handleShowMore}
                  disabled={isLoadingMore}
                >
                  {isLoadingMore ? t('homePage.reviews.loading') : t('homePage.reviews.showMore')}
                </button>
              </div>
            )}
          </>
        )}

        <motion.div
          className="reviews__formWrap"
          variants={fadeUp}
          initial="hidden"
          whileInView="visible"
          viewport={viewport}
        >
          <div className="reviews__formHeader">
            <h3>{t('homePage.reviews.formTitle')}</h3>
            <p>{t('homePage.reviews.formSubtitle')}</p>
          </div>

          <form className="reviews__form" onSubmit={handleSubmit}>
            <div className="reviews__formGrid">
              <label className="reviews__field">
                <span>{t('homePage.reviews.firstName')}</span>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(event) => setFormData((current) => ({ ...current, firstName: event.target.value }))}
                  required
                />
              </label>

              <label className="reviews__field">
                <span>{t('homePage.reviews.lastName')}</span>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(event) => setFormData((current) => ({ ...current, lastName: event.target.value }))}
                  required
                />
              </label>

              <label className="reviews__field reviews__field--wide">
                <span>{t('homePage.reviews.email')}</span>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(event) => setFormData((current) => ({ ...current, email: event.target.value }))}
                  required
                />
              </label>
            </div>

            <div className="reviews__ratingField" aria-label={t('homePage.reviews.rating')}>
              <span>{t('homePage.reviews.rating')}</span>
              <div className="reviews__ratingButtons">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    key={rating}
                    type="button"
                    className={`reviews__ratingBtn${rating <= formData.rate ? ' active' : ''}`}
                    onClick={() => setFormData((current) => ({ ...current, rate: rating }))}
                    aria-label={`${rating} ${t('homePage.reviews.rating')}`}
                  >
                    {'\u2605'}
                  </button>
                ))}
              </div>
            </div>

            <label className="reviews__field">
              <span>{t('homePage.reviews.comment')}</span>
              <textarea
                rows={5}
                value={formData.comment}
                onChange={(event) => setFormData((current) => ({ ...current, comment: event.target.value }))}
                placeholder={t('homePage.reviews.commentPlaceholder')}
                required
              />
            </label>

            {submitStatus === 'success' && (
              <div className="reviews__message reviews__message--success">{t('homePage.reviews.success')}</div>
            )}
            {submitStatus === 'error' && (
              <div className="reviews__message reviews__message--error">{t('homePage.reviews.error')}</div>
            )}

            <button className="reviews__submit" type="submit" disabled={isSubmitting}>
              {isSubmitting ? t('homePage.reviews.submitting') : t('homePage.reviews.submit')}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  )
}
