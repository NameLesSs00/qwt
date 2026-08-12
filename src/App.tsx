import { Routes, Route, Navigate, useParams } from 'react-router-dom'
import { ScrollToTop } from './components/ScrollToTop'
import { AppLayout } from './layouts/AppLayout'

// ── Public pages ──────────────────────────────────────────────────────────────
import { HomePage }          from './pages/home/HomePage'
import { DestinationsPage }  from './pages/destinations/DestinationsPage'
import { ContactUsPage }     from './pages/contactUs/ContactUsPage'
import { AboutUsPage }       from './pages/aboutUs/AboutUsPage'
import { GalleryPage }       from './pages/gallery/GalleryPage'
import { BlogsPage }         from './pages/blogs/BlogsPage'
import { BlogDetailsPage }   from './pages/blogs/details/BlogDetailsPage'
import { TripsPage }         from './pages/trips/TripsPage'
import { CartPage }          from './pages/cart/CartPage'
import { SingleTripPage }    from './pages/singleTrip/SingleTripPage'
import { CheckoutPage }      from './pages/checkout/CheckoutPage'
import { BookingConfirmationPage } from './pages/bookingConfirmation/BookingConfirmationPage'
import { NotFoundPage }      from './pages/notFound/NotFoundPage'
import { FaqPage }           from './pages/faq/FaqPage'

// ── Admin pages ───────────────────────────────────────────────────────────────
import { AdminLoginPage }      from './pages/admin/login/AdminLoginPage'
import { AdminForgotPasswordPage } from './pages/admin/forgot-password/AdminForgotPasswordPage'
import { AdminResetPasswordPage } from './pages/admin/reset-password/AdminResetPasswordPage'
import { AdminReportsPage }    from './pages/admin/reports/AdminReportsPage'
import { AdminTripsPage }      from './pages/admin/trips/AdminTripsPage'
import { AdminBlogsPage }      from './pages/admin/blogs/AdminBlogsPage'
import { AdminBookingsPage }   from './pages/admin/bookings/AdminBookingsPage'
import { AdminGalleryPage }    from './pages/admin/gallery/AdminGalleryPage'
import { AdminPromoCodesPage } from './pages/admin/promo-codes/AdminPromoCodesPage'
import { AdminQuestionsPage }  from './pages/admin/questions/AdminQuestionsPage'
import { AdminReviewsPage }    from './pages/admin/reviews/AdminReviewsPage'
import { AdminProjectReviewsPage } from './pages/admin/project-reviews/AdminProjectReviewsPage'
import { AdminTripTypesPage }  from './pages/admin/trip-types/AdminTripTypesPage'
import { AdminDestinationsPage } from './pages/admin/destinations/AdminDestinationsPage'
import { AdminAdminsPage }     from './pages/admin/admins/AdminAdminsPage'
import { AdminGuard }          from './guards/AdminGuard'

function DestinationSlugRedirect() {
  const { slug } = useParams<{ slug: string }>()
  const destination = slug ? slug.replace(/-/g, ' ') : ''
  return <Navigate replace to={`/trips?destination=${encodeURIComponent(destination)}`} />
}

function App() {
  return (
    <>
      <ScrollToTop />
      <Routes>

      {/* ── Public site pages (rendered inside AppLayout with Header + Footer) ── */}
      <Route path="/" element={<AppLayout><HomePage /></AppLayout>} />
      <Route path="/destinations" element={<AppLayout><DestinationsPage /></AppLayout>} />
      <Route path="/destinations/:slug" element={<DestinationSlugRedirect />} />
      <Route path="/contact-us" element={<AppLayout><ContactUsPage /></AppLayout>} />
      <Route path="/about-us" element={<AppLayout><AboutUsPage /></AppLayout>} />
      <Route path="/gallery" element={<AppLayout><GalleryPage /></AppLayout>} />
      <Route path="/blogs" element={<AppLayout><BlogsPage /></AppLayout>} />
      <Route path="/blogs/details/:id/:name" element={<AppLayout><BlogDetailsPage /></AppLayout>} />
      <Route path="/blogs/details/:id" element={<AppLayout><BlogDetailsPage /></AppLayout>} />
      <Route path="/trips" element={<AppLayout><TripsPage /></AppLayout>} />
      <Route path="/trips/:id/:slug" element={<AppLayout><SingleTripPage /></AppLayout>} />
      <Route path="/trips/:id" element={<AppLayout><SingleTripPage /></AppLayout>} />
      <Route path="/cart" element={<AppLayout><CartPage /></AppLayout>} />
      <Route path="/checkout" element={<AppLayout><CheckoutPage /></AppLayout>} />
      <Route path="/booking-confirmation" element={<AppLayout><BookingConfirmationPage /></AppLayout>} />
      <Route path="/faq" element={<AppLayout><FaqPage /></AppLayout>} />

      {/* ── Admin login (standalone, no Header/Footer) ───────────────────────── */}
      <Route path="/admin/login" element={<AdminLoginPage />} />
      <Route path="/admin/forgot-password" element={<AdminForgotPasswordPage />} />
      <Route path="/admin/reset-password" element={<AdminResetPasswordPage />} />

      {/* /admin exact path → 404 (no index admin page) */}
      <Route path="/admin" element={<NotFoundPage />} />

      {/* ── Protected admin pages (AdminGuard → AdminLayout → Outlet) ─────────── */}
      <Route element={<AdminGuard />}>
        <Route path="/admin/reports"      element={<AdminReportsPage />} />
        <Route path="/admin/trips"        element={<AdminTripsPage />} />
        <Route path="/admin/destinations" element={<AdminDestinationsPage />} />
        <Route path="/admin/blogs"        element={<AdminBlogsPage />} />
        <Route path="/admin/bookings"     element={<AdminBookingsPage />} />
        <Route path="/admin/gallery"      element={<AdminGalleryPage />} />
        <Route path="/admin/promo-codes"  element={<AdminPromoCodesPage />} />
        <Route path="/admin/questions"    element={<AdminQuestionsPage />} />
        <Route path="/admin/reviews"      element={<AdminReviewsPage />} />
        <Route path="/admin/project-reviews" element={<AdminProjectReviewsPage />} />
        <Route path="/admin/trip-types"   element={<AdminTripTypesPage />} />
        <Route path="/admin/admins"       element={<AdminAdminsPage />} />
      </Route>

      {/* ── 404 catch-all ─────────────────────────────────────────────────────── */}
      <Route path="*" element={<NotFoundPage />} />

    </Routes>
    </>
  )
}

export default App
