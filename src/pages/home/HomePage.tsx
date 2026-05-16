import { HeroSlider } from './components/HeroSlider'
import { PopularTours } from './components/PopularTours'
import { Destinations } from './components/Destinations'
import { RecentGallery } from './components/RecentGallery'
import { HowItWorks } from './components/HowItWorks'
import { ChooseUs } from './components/ChooseUs'
import { Blogs } from './components/Blogs'
import { Ask } from './components/Ask'
import { PlanBanner } from './components/PlanBanner'
import { Reviews } from './components/Reviews'

export function HomePage() {
  return (
    <div>
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
