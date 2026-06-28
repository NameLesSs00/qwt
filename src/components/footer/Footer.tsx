import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import footerLogo from '../../assets/HurghadaFunTime.png'

// Payment channels are currently hidden
// import applePay from '../../assets/footer/logos_apple-pay.svg'
// import googlePay from '../../assets/footer/logos_google-pay.svg'
// import mastercard from '../../assets/footer/logos_mastercard.svg'
// import paypal from '../../assets/footer/logos_paypal.svg'
// import visa from '../../assets/footer/logos_visaelectron.svg'

import instagram from '../../assets/footer/iconoir_instagram.svg'
import tiktok from '../../assets/footer/proicons_tiktok.svg'

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
              <span>+201146098826</span>
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
              {/* <a href="#" className="opacity-90 hover:opacity-100" aria-label="Facebook">
                <img src={facebook} alt="" className="h-5 w-5" />
              </a> */}
              <a href="https://www.instagram.com/hurghada.funtime?igsh=MnZ0amJ5Z3Ridm0=" target="_blank" rel="noopener noreferrer" className="opacity-90 hover:opacity-100" aria-label="Instagram">
                <img src={instagram} alt="" className="h-5 w-5" />
              </a>
              <a href="https://www.tiktok.com/@hurghada.fun.time?_r=1&_t=ZS-96vwTiRSOLE" target="_blank" rel="noopener noreferrer" className="opacity-90 hover:opacity-100" aria-label="TikTok">
                <img src={tiktok} alt="" className="h-5 w-5" />
              </a>
              <a href="https://wa.me/201146098826" className="opacity-90 hover:opacity-100" aria-label="WhatsApp">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.888-.788-1.487-1.761-1.66-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 0 0-3.48-8.413Z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-7xl flex-col items-center justify-center gap-2 px-4 py-4 text-xs text-white/70 sm:px-6 lg:px-8">
          <span>{t('footer.copyright')}</span>
          <span className="flex items-center gap-1">
            Developed by{' '}
            <a href="https://tech-gear.net/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors font-medium">
              TechGear Solutions
            </a>
          </span>
        </div>
      </div>
    </footer>
  )
}
