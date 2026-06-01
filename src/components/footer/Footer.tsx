import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import footerLogo from '../../assets/HurghadaFunTime.png'

// Payment channels are currently hidden
// import applePay from '../../assets/footer/logos_apple-pay.svg'
// import googlePay from '../../assets/footer/logos_google-pay.svg'
// import mastercard from '../../assets/footer/logos_mastercard.svg'
// import paypal from '../../assets/footer/logos_paypal.svg'
// import visa from '../../assets/footer/logos_visaelectron.svg'

import facebook from '../../assets/footer/basil_facebook-outline.svg'
import instagram from '../../assets/footer/iconoir_instagram.svg'
import tiktok from '../../assets/footer/proicons_tiktok.svg'
import twitterX from '../../assets/footer/prime_twitter.svg'

import phoneIcon from '../../assets/footer/solar_phone-outline.svg'
import emailIcon from '../../assets/footer/streamline-plump_web.svg'
import locationIcon from '../../assets/footer/mingcute_location-line.svg'
import arrowDownIcon from '../../assets/footer/iconamoon_arrow-down-2-duotone.svg'

type LinkItem = {
  key: string
  href: string
  hasMenu?: boolean
}

const quickAction: LinkItem[] = [
  { key: 'home', href: '/' },
  { key: 'destinations', href: '/destinations' },
  { key: 'trips', href: '/trips' },
  { key: 'gallery', href: '/gallery' },
  { key: 'aboutUs', href: '/about-us' },
  { key: 'blogs', href: '/blogs' },
  { key: 'contactUs', href: '/contact-us' },
  { key: 'faq', href: '/faq' },
]

export function Footer() {
  const { t } = useTranslation()

  return (
    <footer className="bg-gradient-to-b from-[#1F6C8B] to-[#0E3A53] text-white">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="space-y-5 flex flex-col items-center">
          <div className="flex items-center justify-center w-full">
            <img src={footerLogo} alt="Logoipsum" className="h-24 w-auto object-contain rounded-md" />
          </div>
          <p className="max-w-sm text-sm leading-6 text-white/80 text-center">
            {t('footer.description')}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold tracking-wide text-white/95">{t('footer.quickAction')}</h3>
          <ul className="mt-5 space-y-3 text-sm text-white/80">
            {quickAction.map((item) => (
              <li key={item.key}>
                <Link to={item.href} className="inline-flex items-center gap-2 hover:text-white transition-colors">
                  <span>{t(`footer.links.${item.key}`)}</span>
                  {item.hasMenu ? <img src={arrowDownIcon} alt="" className="h-4 w-4 opacity-70" /> : null}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold tracking-wide text-white/95">{t('footer.contactUs')}</h3>
          <div className="mt-5 space-y-4 text-sm text-white/80">
            <div className="flex items-center gap-3">
              <img src={phoneIcon} alt="" className="h-5 w-5" />
              <span>{t('footer.phone')}</span>
            </div>
            <div className="flex items-center gap-3">
              <img src={emailIcon} alt="" className="h-5 w-5" />
              <span>{t('footer.email')}</span>
            </div>
            <div className="flex items-center gap-3">
              <img src={locationIcon} alt="" className="h-5 w-5" />
              <span>{t('footer.address')}</span>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          {/* <div>
            <h3 className="text-sm font-semibold tracking-wide text-white/95">{t('footer.paymentChannels')}</h3>
            <div className="mt-5 flex flex-wrap items-center gap-2.5">
              <img src={paypal} alt="PayPal" className="h-4 w-6" />
              <img src={visa} alt="Visa" className="h-4 w-8" />
              <img src={applePay} alt="Apple Pay" className="h-4 w-9" />
              <img src={mastercard} alt="Mastercard" className="h-4 w-8" />
              <img src={googlePay} alt="Google Pay" className="h-4 w-9" />
            </div>
          </div> */}

          <div>
            <h3 className="text-sm font-semibold tracking-wide text-white/95">{t('footer.followUs')}</h3>
            <div className="mt-5 flex items-center gap-4">
              <a href="#" className="opacity-90 hover:opacity-100" aria-label="Facebook">
                <img src={facebook} alt="" className="h-5 w-5" />
              </a>
              <a href="#" className="opacity-90 hover:opacity-100" aria-label="Instagram">
                <img src={instagram} alt="" className="h-5 w-5" />
              </a>
              <a href="#" className="opacity-90 hover:opacity-100" aria-label="TikTok">
                <img src={tiktok} alt="" className="h-5 w-5" />
              </a>
              <a href="#" className="opacity-90 hover:opacity-100" aria-label="X">
                <img src={twitterX} alt="" className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-center px-4 py-4 text-xs text-white/70 sm:px-6 lg:px-8">
          {t('footer.copyright')}
        </div>
      </div>
    </footer>
  )
}
