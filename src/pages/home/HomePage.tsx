import { HeroSlider } from './components/HeroSlider'
import { PopularTours } from './components/PopularTours'
import { Seo } from '../../components/seo/Seo'
import { useTranslation } from 'react-i18next'
import { Destinations } from './components/Destinations'
import { RecentGallery } from './components/RecentGallery'
import { HowItWorks } from './components/HowItWorks'
import { ChooseUs } from './components/ChooseUs'
import { Blogs } from './components/Blogs'
import { Ask } from './components/Ask'
import { PlanBanner } from './components/PlanBanner'
import { Reviews } from './components/Reviews'

export function HomePage() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col min-h-screen">
      <Seo 
        title={t('home')} 
        description={t('homePage.hero.slide1.description')}
        keywords="Hurghada tours, Red Sea trips, Egypt excursions, snorkeling, desert safari"
      />
      <HeroSlider />
      <PopularTours />
      <Destinations />
      <RecentGallery />
      <HowItWorks />
      <ChooseUs />
      <Blogs />
      <Ask />
      <PlanBanner />
      <Reviews />
    </div>
  )
}
