import { useState, useEffect, useCallback } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ImageLightbox } from '../../components/imageLightbox/ImageLightbox'
import { getTripById, getTripImageUrl, type DtoTripRead } from '../../api/tripsApi'
import { CheckAvailabilityModal } from '../../components/checkAvailabilityModal/CheckAvailabilityModal'
import { Seo } from '../../components/seo/Seo'
import { Loader2, AlertCircle, Star } from 'lucide-react'
import { getReviews, createReview, getTripAverageRating, type DtoReviewRead } from '../../api/reviewsApi'
import { useToast } from '../../components/toast/ToastProvider'

// Assets
import locIcon from '../../assets/single trip/proicons_location.png'
import clockIcon from '../../assets/single trip/uil_clock.png'
import tripTypeIcon from '../../assets/single trip/tripType.png'
import trueIcon from '../../assets/single trip/True.png'
import crossIcon from '../../assets/single trip/CrossRed.png'
import childrenIcon from '../../assets/single trip/childern.png'
import adultIcon from '../../assets/single trip/ri_user-fill.png'
import calendarIcon from '../../assets/single trip/tripType.png'
import placeholder1 from '../../assets/desinations/tripdetails/image.png'

import './singleTripPage.scss'

const SUPPORTED_LANGS = ['en', 'fr', 'ru', 'ro'] as const
type SupportedLang = typeof SUPPORTED_LANGS[number]

function getCleanLang(lang: string): SupportedLang {
  const code = lang.slice(0, 2).toLowerCase()
  return (SUPPORTED_LANGS as readonly string[]).includes(code)
    ? (code as SupportedLang)
    : 'en'
}

export function SingleTripPage() {
  const { t, i18n } = useTranslation()
  const { id } = useParams<{ id: string }>()

  const translateTripTypeName = (name: string | null): string => {
    if (!name) return '—';
    const key = `tripTypes.${name.toLowerCase().replace(/\s+/g, '')}`;
    const translated = t(key);
    return translated === key ? name : translated;
  };

  const [trip, setTrip] = useState<DtoTripRead | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Lightbox
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [lightboxImages, setLightboxImages] = useState<string[]>([])

  const openLightbox = (idx: number) => setLightboxIndex(idx)
  const closeLightbox = () => setLightboxIndex(null)
  const nextImage = useCallback(
    () => setLightboxIndex(prev => prev !== null ? (prev + 1) % lightboxImages.length : null),
    [lightboxImages.length]
  )
  const prevImage = useCallback(
    () => setLightboxIndex(prev => prev !== null ? (prev - 1 + lightboxImages.length) % lightboxImages.length : null),
    [lightboxImages.length]
  )

  // Booking modal
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)

  // Toast
  const { toast } = useToast()

  // Reviews state
  const [reviews, setReviews] = useState<DtoReviewRead[]>([])
  const [reviewsLoading, setReviewsLoading] = useState(false)
  const [averageReview, setAverageReview] = useState<{ averageRate: number; totalReviews: number } | null>(null)

  // Add Review Form state
  const [arFullName, setArFullName] = useState('')
  const [arComment, setArComment] = useState('')
  const [arRate, setArRate] = useState(5)
  const [isSubmittingReview, setIsSubmittingReview] = useState(false)

  const loadReviews = useCallback(() => {
    if (!id) return
    setReviewsLoading(true)
    Promise.all([
      getReviews(undefined, undefined, Number(id)),
      getTripAverageRating(Number(id))
    ]).then(([revRes, avgRes]) => {
      if (revRes.success && revRes.data) {
        setReviews(revRes.data)
      }
      if (avgRes.success && avgRes.data) {
        setAverageReview(avgRes.data)
      }
    }).catch(err => {
      console.error('Failed to load reviews:', err)
    }).finally(() => {
      setReviewsLoading(false)
    })
  }, [id])

  useEffect(() => {
    loadReviews()
  }, [loadReviews])

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!id) return

    if (!arFullName.trim() || !arComment.trim()) {
      toast.error(t('singleTripPage.toastFillFields'))
      return
    }

    const nameParts = arFullName.trim().split(' ')
    const firstName = nameParts[0] || 'Anonymous'
    const lastName = nameParts.slice(1).join(' ') || 'User'

    setIsSubmittingReview(true)
    try {
      const res = await createReview({
        firstName,
        lastName,
        email: 'dummy@example.com',
        phone: '0000000000',
        tripId: Number(id),
        comment: arComment,
        rate: arRate
      })

      if (res.success) {
        toast.success(t('singleTripPage.toastSuccess'))
        setArFullName('')
        setArComment('')
        setArRate(5)
        loadReviews()
      } else {
        toast.error(res.message || t('singleTripPage.toastFail'))
      }
    } catch (err: any) {
      toast.error(err?.response?.data?.message || t('singleTripPage.toastError'))
    } finally {
      setIsSubmittingReview(false)
    }
  }

  const totalCount = reviews.length
  const ratingDistribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  reviews.forEach(r => {
    const rateKey = Math.round(r.rate ?? 0) as 5|4|3|2|1
    if (ratingDistribution[rateKey] !== undefined) {
      ratingDistribution[rateKey]++
    }
  })

  const getPercentage = (stars: number) => {
    if (totalCount === 0) return 0
    return Math.round((ratingDistribution[stars as 5|4|3|2|1] / totalCount) * 100)
  }

  const avgVal = averageReview ? Number(averageReview.averageRate.toFixed(1)) : 0

  useEffect(() => {
    if (!id) return
    const lang = getCleanLang(i18n.language)
    setLoading(true)
    setError('')
    getTripById(Number(id), lang)
      .then(res => {
        if (res.success && res.data) {
          setTrip(res.data)
          // Build ordered image list: primary first
          const imgs = res.data.images || []
          const sorted = [
            ...imgs.filter(i => i.isPrimary),
            ...imgs.filter(i => !i.isPrimary),
          ]
          const urls = sorted.map(i => getTripImageUrl(i.imageUrl)).filter(Boolean)
          setLightboxImages(urls.length > 0 ? urls : [placeholder1])
        } else {
          setError(t('singleTripPage.tripNotFound'))
        }
      })
      .catch(() => setError(t('singleTripPage.errorLoadTrip')))
      .finally(() => setLoading(false))
  }, [id, i18n.language, t])

  // ── Loading State ─────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <Loader2 className="animate-spin" size={48} color="#1e659e" />
      </div>
    )
  }

  // ── Error State ───────────────────────────────────────────────────────────
  if (error || !trip) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '16px', color: '#b91c1c' }}>
        <AlertCircle size={48} />
        <p style={{ fontSize: '18px', fontWeight: 600 }}>{error || t('singleTripPage.tripNotFound')}</p>
        <Link to="/trips" style={{ color: '#1e659e', textDecoration: 'underline', fontSize: '14px' }}>{t('singleTripPage.backToTripsBtn')}</Link>
      </div>
    )
  }

  // Ordered images: primary first
  const galleryImgs = lightboxImages.length > 0 ? lightboxImages : [placeholder1]

  return (
    <div className="st-page">
      {/* ── Seo & Structured Data ── */}
      <Seo 
        title={trip.name || ''} 
        description={trip.description || undefined}
        image={galleryImgs[0]}
        type="product"
        schema={JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Product",
          "name": trip.name || '',
          "image": galleryImgs[0],
          "description": trip.description || "",
          "offers": {
            "@type": "Offer",
            "priceCurrency": "EUR",
            "price": trip.adultPrice
          }
        })}
      />

      {/* ── Breadcrumb ── */}
      <div className="st-breadcrumb">
        <div className="st-breadcrumb__inner">
          <Link to="/" className="st-breadcrumb__link">{t('singleTripPage.breadcrumbHome')}</Link>
          <span className="st-breadcrumb__sep">&gt;</span>
          <Link to="/trips" className="st-breadcrumb__link">{t('singleTripPage.breadcrumbTrips')}</Link>
          <span className="st-breadcrumb__sep">&gt;</span>
          <span className="st-breadcrumb__active">{trip.name}</span>
        </div>
      </div>

      {/* ── Hero Gallery ── */}
      <section className="st-gallery">
        <div className={`st-gallery__inner ${galleryImgs.length === 1 ? 'st-gallery__inner--single' : ''}`}>
          {/* Main large image */}
          <div
            className="st-gallery__main"
            onClick={() => openLightbox(0)}
            role="button"
            tabIndex={0}
            aria-label="View main image"
            onKeyDown={e => e.key === 'Enter' && openLightbox(0)}
          >
            <img src={galleryImgs[0]} alt={trip.name || 'Trip main'} />
            <div className="st-gallery__overlay"><span>{t('singleTripPage.viewOverlay')}</span></div>
          </div>

          {/* 2×2 thumbnail grid */}
          {galleryImgs.length > 1 && (
            <div className={`st-gallery__thumbs st-gallery__thumbs--count-${Math.min(galleryImgs.length - 1, 4)}`}>
              {galleryImgs.slice(1, 5).map((img, idx) => (
                <div
                  key={idx}
                  className="st-gallery__thumb"
                  onClick={() => openLightbox(idx + 1)}
                  role="button"
                  tabIndex={0}
                  aria-label={`View image ${idx + 2}`}
                  onKeyDown={e => e.key === 'Enter' && openLightbox(idx + 1)}
                >
                  <img src={img} alt={`${trip.name} photo ${idx + 2}`} />
                  <div className="st-gallery__overlay"><span>{t('singleTripPage.viewOverlay')}</span></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Main Content ── */}
      <section className="st-main">
        <div className="st-main__inner">
          <div className="st-main__content">

            {/* Title & description & Availability Card */}
            <div className="st-header-row">
              <div className="st-title-block">
                <h1 className="st-title">{trip.name}</h1>
                {trip.description && (
                  <p className="st-description">{trip.description}</p>
                )}
                {(trip.destinationInfo?.name || trip.destination) && (
                  <div className="st-location">
                    <img src={locIcon} alt="" />
                    <span>{trip.destinationInfo?.name || trip.destination}</span>
                  </div>
                )}
                <div className="st-divider" />
              </div>

              {/* Availability card */}
              <div className="st-availability-card">
                <div className="st-sidebar__row">
                  <img src={clockIcon} alt="" />
                  <div>
                    <div className="st-sidebar__label">{t('singleTripPage.durationLabel')}</div>
                    <div className="st-sidebar__value">
                      {trip.durationValue} {trip.durationTypeName ? t('homePage.popularTours.' + trip.durationTypeName.toLowerCase(), { defaultValue: trip.durationTypeName }) : ''}
                    </div>
                  </div>
                </div>

                <div className="st-sidebar__divider" />

                <div className="st-sidebar__priceRow">
                  <div className="st-sidebar__priceBlock">
                    <img src={adultIcon} alt="" />
                    <span className="st-sidebar__priceLabel">{t('singleTripPage.adult')}</span>
                  </div>
                  <div className="st-sidebar__priceRight">
                    <div className="st-sidebar__priceFrom">{t('singleTripPage.fromPrice')}</div>
                    <div className="st-sidebar__price">€{trip.adultPrice}/{t('singleTripPage.perPerson')}</div>
                  </div>
                </div>

                {trip.childPrice > 0 && (
                  <div className="st-sidebar__priceRow">
                    <div className="st-sidebar__priceBlock">
                      <img src={childrenIcon} alt="" />
                      <span className="st-sidebar__priceLabel">{t('singleTripPage.children')}</span>
                    </div>
                    <div className="st-sidebar__priceRight">
                      <div className="st-sidebar__priceFrom">{t('singleTripPage.fromPrice')}</div>
                      <div className="st-sidebar__price">€{trip.childPrice}/{t('singleTripPage.perPerson')}</div>
                    </div>
                  </div>
                )}

                <div className="st-sidebar__divider" />

                <button className="st-sidebar__cta" onClick={() => setIsBookingModalOpen(true)}>
                  {t('singleTripPage.checkAvailabilityBtn')}
                </button>
              </div>
            </div>

            {/* Quick info cards */}
            <div className="st-info-cards">
              {(trip.destinationInfo?.name || trip.destination) && (
                <div className="st-info-card">
                  <img src={locIcon} alt="" />
                  <div>
                    <div className="st-info-card__label">{t('singleTripPage.infoDestination')}</div>
                    <div className="st-info-card__value">{trip.destinationInfo?.name || trip.destination}</div>
                  </div>
                </div>
              )}
              <div className="st-info-card">
                <img src={clockIcon} alt="" />
                <div>
                  <div className="st-info-card__label">{t('singleTripPage.infoDuration')}</div>
                  <div className="st-info-card__value">{trip.durationValue} {trip.durationTypeName ? t('homePage.popularTours.' + trip.durationTypeName.toLowerCase(), { defaultValue: trip.durationTypeName }) : ''}</div>
                </div>
              </div>
              {trip.tripTypeName && (
                <div className="st-info-card">
                  <img src={tripTypeIcon} alt="" />
                  <div>
                    <div className="st-info-card__label">{t('singleTripPage.infoTourType')}</div>
                    <div className="st-info-card__value">{translateTripTypeName(trip.tripTypeName)}</div>
                  </div>
                </div>
              )}
              {trip.timeFrom && (
                <div className="st-info-card">
                  <img src={clockIcon} alt="" />
                  <div>
                    <div className="st-info-card__label">{t('singleTripPage.infoTimeStart')}</div>
                    <div className="st-info-card__value">{trip.timeFrom}</div>
                  </div>
                </div>
              )}
            </div>

            {/* Included / Excluded */}
            {((trip.includes && trip.includes.length > 0) || (trip.excludes && trip.excludes.length > 0)) && (
              <div className="st-ie">
                <h2 className="st-section-title">{t('singleTripPage.incExcTitle')}</h2>
                <div className="st-ie__cols">
                  {trip.includes && trip.includes.length > 0 && (
                    <div className="st-ie__col">
                      <div className="st-ie__heading st-ie__heading--included">{t('singleTripPage.included')}</div>
                      <ul>
                        {trip.includes.map((item, i) => (
                          <li key={i} className="st-ie__item">
                            <img src={trueIcon} alt="Included" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {trip.excludes && trip.excludes.length > 0 && (
                    <div className="st-ie__col">
                      <div className="st-ie__heading st-ie__heading--excluded">{t('singleTripPage.excluded')}</div>
                      <ul>
                        {trip.excludes.map((item, i) => (
                          <li key={i} className="st-ie__item">
                            <img src={crossIcon} alt="Excluded" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Trip Info Grid */}
            <div className="st-trip-info">
              <div className="st-trip-info__badge">{t('singleTripPage.tripInfoBadge')}</div>
              <div className="st-trip-info__grid">
                {(trip.destinationInfo?.name || trip.destination) && (
                  <div className="st-trip-info__item">
                    <img src={locIcon} alt="" />
                    <div>
                      <div className="st-trip-info__label">{t('singleTripPage.infoLocation')}</div>
                      <div className="st-trip-info__value">{trip.destinationInfo?.name || trip.destination}</div>
                    </div>
                  </div>
                )}
                <div className="st-trip-info__item">
                  <img src={clockIcon} alt="" />
                  <div>
                    <div className="st-trip-info__label">{t('singleTripPage.infoDuration')}</div>
                    <div className="st-trip-info__value">{trip.durationValue} {trip.durationTypeName ? t('homePage.popularTours.' + trip.durationTypeName.toLowerCase(), { defaultValue: trip.durationTypeName }) : ''}</div>
                  </div>
                </div>
                {trip.timeFrom && (
                  <div className="st-trip-info__item">
                    <img src={clockIcon} alt="" />
                    <div>
                      <div className="st-trip-info__label">{t('singleTripPage.infoTimeStart')}</div>
                      <div className="st-trip-info__value">{trip.timeFrom}</div>
                    </div>
                  </div>
                )}
                {trip.availableDays && trip.availableDays.length > 0 && (
                  <div className="st-trip-info__item">
                    <img src={calendarIcon} alt="" />
                    <div>
                      <div className="st-trip-info__label">{t('singleTripPage.infoAvailableDays')}</div>
                      <div className="st-trip-info__value">{trip.availableDays.map(day => t(`weekdays.${day.toLowerCase()}`, { defaultValue: day })).join(', ')}</div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* What to Bring */}
            {trip.whatToBring && trip.whatToBring.length > 0 && (
              <div className="st-ie" style={{ marginTop: '32px' }}>
                <h2 className="st-section-title">{t('singleTripPage.whatToBringTitle')}</h2>
                <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                  {trip.whatToBring.map((item, i) => (
                    <li key={i} className="st-ie__item">
                      <img src={trueIcon} alt="" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Tour Highlights */}
            {trip.highlights && trip.highlights.length > 0 && (
              <div className="st-highlights" style={{ width: '100%' }}>
                <h2 className="st-section-title">{t('singleTripPage.highlightsTitle')}</h2>
                <ul>
                  {trip.highlights.map((h, i) => (
                    <li key={i} className="st-highlights__item">
                      <img src={trueIcon} alt="" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Reviews Section */}
            <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: '40px', marginTop: '16px' }}>
              <h2 className="st-section-title">{t('singleTripPage.customerReviewsTitle')}</h2>
              
              <div className="st-reviews">
                {/* Summary Left */}
                <div className="st-reviews__summary">
                  <div className="st-reviews__overall">
                    <span className="st-reviews__score">{avgVal}</span>
                    <Star fill="#F59E0B" color="#F59E0B" size={28} />
                  </div>
                  <span className="st-reviews__count">{totalCount} {t('singleTripPage.reviewsCount')}</span>
                  
                  <div className="st-reviews__bars">
                    {[5, 4, 3, 2, 1].map(stars => (
                      <div className="st-reviews__barRow" key={stars}>
                        <span style={{ minWidth: '14px' }}>{stars}</span>
                        <Star fill="#F59E0B" color="#F59E0B" size={12} />
                        <div className="st-reviews__barTrack">
                          <div className="st-reviews__barFill" style={{ width: `${getPercentage(stars)}%` }} />
                        </div>
                        <span style={{ minWidth: '28px', textAlign: 'right' }}>{getPercentage(stars)}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Comments List */}
                <div className="st-reviews__comments-container">
                  {reviewsLoading ? (
                    <div style={{ display: 'flex', justifyContent: 'center', padding: '40px' }}>
                      <Loader2 className="animate-spin" size={24} color="#1e659e" />
                    </div>
                  ) : reviews.length > 0 ? (
                    <div className="st-reviews__list">
                      {reviews.map((rev, idx) => (
                        <div key={idx} className="st-reviews__card">
                          <div className="st-reviews__cardRating">
                            {[1, 2, 3, 4, 5].map(s => (
                              <Star
                                key={s}
                                size={14}
                                fill={s <= (rev.rate ?? 0) ? "#F59E0B" : "none"}
                                color={s <= (rev.rate ?? 0) ? "#F59E0B" : "#D1D5DB"}
                              />
                            ))}
                          </div>
                          <h4 className="st-reviews__cardName">
                            {rev.firstName} {rev.lastName}
                          </h4>
                          <p className="st-reviews__cardComment">
                            {rev.comment}
                          </p>
                          <div style={{ fontSize: '11px', color: '#9CA3AF', marginTop: '8px' }}>
                            {rev.createdAt ? new Date(rev.createdAt).toLocaleDateString() : '—'}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{ padding: '40px 20px', textAlign: 'center', color: '#6B7280' }}>
                      {t('singleTripPage.noReviewsYet')}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Add Review Form */}
            <div className="st-add-review">
              <h3 className="st-section-title">{t('singleTripPage.addReviewTitle')}</h3>
              <p className="st-add-review__note">
                {t('singleTripPage.requiredFieldsNote')} <span>*</span>
              </p>
              
              <form onSubmit={handleReviewSubmit}>
                <div className="st-add-review__grid">
                  <div className="st-add-review__field" style={{ gridColumn: '1 / -1' }}>
                    <label className="st-add-review__label">{t('singleTripPage.fullName', { defaultValue: 'Full Name' })} <span>*</span></label>
                    <input
                      type="text"
                      className="st-add-review__input"
                      value={arFullName}
                      onChange={e => setArFullName(e.target.value)}
                      required
                      placeholder="e.g. John Doe"
                    />
                  </div>
                </div>

                <div className="st-add-review__field" style={{ marginBottom: '24px' }}>
                  <label className="st-add-review__label">{t('singleTripPage.yourRating')} <span>*</span></label>
                  <div className="st-add-review__stars">
                    {[1, 2, 3, 4, 5].map(star => {
                      const isFilled = star <= arRate;
                      return (
                        <button
                          key={star}
                          type="button"
                          className="st-add-review__starBtn"
                          onClick={() => setArRate(star)}
                        >
                          <Star
                             size={24}
                             fill={isFilled ? "#F59E0B" : "none"}
                             color={isFilled ? "#F59E0B" : "#D1D5DB"}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="st-add-review__field" style={{ marginBottom: '24px' }}>
                  <label className="st-add-review__label">{t('singleTripPage.comment')} <span>*</span></label>
                  <textarea
                    className="st-add-review__textarea"
                    value={arComment}
                    onChange={e => setArComment(e.target.value)}
                    required
                    placeholder={t('singleTripPage.commentPlaceholder')}
                    rows={4}
                  />
                </div>

                <button
                  type="submit"
                  className="st-add-review__submit"
                  disabled={isSubmittingReview}
                  style={{ opacity: isSubmittingReview ? 0.7 : 1 }}
                >
                  {isSubmittingReview ? t('singleTripPage.submitting') : t('singleTripPage.submitBtn')}
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* Lightbox */}
      {lightboxImages.length > 0 && (
        <ImageLightbox
          images={lightboxImages}
          activeIndex={lightboxIndex}
          onClose={closeLightbox}
          onNext={nextImage}
          onPrev={prevImage}
        />
      )}

      {/* Booking Modal */}
      <CheckAvailabilityModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        trip={trip}
      />
    </div>
  )
}
