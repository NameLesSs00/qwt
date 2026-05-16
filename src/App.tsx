import { Routes, Route } from 'react-router-dom'
import { AppLayout } from './layouts/AppLayout'
import { HomePage } from './pages/home/HomePage'
import { DestinationsPage } from './pages/destinations/DestinationsPage'
import { LuxorPage } from './pages/destinations/luxor/LuxorPage'
import { TripDetailsPage } from './pages/destinations/tripDetails/TripDetailsPage'
import { LoginPage } from './pages/auth/LoginPage'
import { ContactUsPage } from './pages/contactUs/ContactUsPage'
import { AboutUsPage } from './pages/aboutUs/AboutUsPage'
import { GalleryPage } from './pages/gallery/GalleryPage'
import { BlogsPage } from './pages/blogs/BlogsPage'
import { BlogDetailsPage } from './pages/blogs/details/BlogDetailsPage'
import { TripsPage } from './pages/trips/TripsPage'
import { CartPage } from './pages/cart/CartPage'
import { SingleTripPage } from './pages/singleTrip/SingleTripPage'
import { CheckoutPage } from './pages/checkout/CheckoutPage'

function App() {
  return (
    <AppLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/destinations" element={<DestinationsPage />} />
        <Route path="/destinations/luxor" element={<LuxorPage />} />
        <Route path="/destinations/trip-details" element={<TripDetailsPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/contact-us" element={<ContactUsPage />} />
        <Route path="/about-us" element={<AboutUsPage />} />
        <Route path="/gallery" element={<GalleryPage />} />
        <Route path="/blogs" element={<BlogsPage />} />
        <Route path="/blogs/details" element={<BlogDetailsPage />} />
        <Route path="/trips" element={<TripsPage />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/trips/:id" element={<SingleTripPage />} />
        <Route
          path="*"
          element={
            <div className="py-16 px-8">
              <h1 className="text-2xl font-semibold text-slate-900">Page not found</h1>
            </div>
          }
        />
      </Routes>
    </AppLayout>
  )
}
 
export default App
