import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronDown, Menu, X, Globe } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import logo from '../../assets/HurghadaFunTime.png'
import dropChevron from '../../assets/desinations/4.svg'
import cartIcon from '../../assets/cart/cartIcon.png'

import './header.scss'

type SubItem = {
  key: string
  path: string
}

type NavItem = {
  key: string
  path: string
  dropdownItems?: SubItem[]
}

const navItems: NavItem[] = [
  { key: 'home', path: '/' },
  {
    key: 'destinations',
    path: '/destinations',
    dropdownItems: [
      { key: 'luxor', path: '/destinations/luxor' },
      { key: 'redSea', path: '/destinations/red-sea' },
      { key: 'cairo', path: '/destinations/cairo' },
    ],
  },
  { key: 'trips', path: '/trips' },
  { key: 'gallery', path: '/gallery' },
  { key: 'faq', path: '/faq' },
  { key: 'blogs', path: '/blogs' },
  { key: 'aboutUs', path: '/about-us' },
  { key: 'contactUs', path: '/contact-us' },
]

export function Header() {
  const { pathname } = useLocation()
  const { i18n, t } = useTranslation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const [langDropdownOpen, setLangDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  /* Lock body scroll when mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = isMobileMenuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isMobileMenuOpen])

  /* Close on outside click */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null)
        setLangDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function toggleDropdown(key: string) {
    setOpenDropdown((prev) => (prev === key ? null : key))
  }

  return (
    <header className="site-header">
      <div className="site-header__inner" ref={dropdownRef}>
        <Link to="/" className="site-header__logo">
          <img src={logo} alt="Logoipsum" className="site-header__logoImg" />
        </Link>

        <nav className="site-header__nav">
          {navItems.map((item) => {
            const isActive =
              item.path === '/'
                ? pathname === '/'
                : pathname.startsWith(item.path)

            const hasDropdown = !!item.dropdownItems?.length
            const isOpen = openDropdown === item.key

            return (
              <div key={item.key} className="site-header__navItem">
                {/* Main nav link */}
                <Link
                  to={item.path}
                  aria-current={isActive ? 'page' : undefined}
                  className={`site-header__navLink ${isActive ? 'site-header__navLink--active' : ''}`}
                  onClick={(e) => {
                    if (hasDropdown) {
                      if (!isOpen) {
                        e.preventDefault()
                        toggleDropdown(item.key)
                      } else {
                        setOpenDropdown(null)
                      }
                    } else {
                      setOpenDropdown(null)
                    }
                  }}
                >
                  <span>{t(`header.${item.key}`)}</span>
                  {hasDropdown && (
                    <img
                      src={dropChevron}
                      alt=""
                      className={`site-header__dropChevron ${isOpen ? 'is-open' : ''}`}
                    />
                  )}
                </Link>

                {/* Dropdown panel */}
                {hasDropdown && isOpen && (
                  <div className="site-header__dropdown">
                    {item.dropdownItems!.map((sub) => (
                      <Link
                        key={sub.key}
                        to={sub.path}
                        className={`site-header__dropItem ${pathname === sub.path ? 'site-header__dropItem--active' : ''
                          }`}
                        onClick={() => setOpenDropdown(null)}
                      >
                        {t(`header.${sub.key}`)}
                      </Link>
                    ))}
                  </div>
                )}

                {/* Active underline */}
                <span
                  className={`site-header__navUnderline ${isActive ? 'site-header__navUnderline--visible' : ''}`}
                  aria-hidden="true"
                />
              </div>
            )
          })}
        </nav>

        <div className="site-header__actions">

          {/* Language Switcher */}
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <button
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', color: '#0f2f44', fontWeight: 500, fontSize: '14px' }}
              aria-label="Change Language"
            >
              <Globe size={18} />
              <span style={{ textTransform: 'uppercase' }}>{i18n.language || 'en'}</span>
            </button>

            {langDropdownOpen && (
              <div style={{ position: 'absolute', top: '100%', right: 0, marginTop: '12px', background: '#fff', borderRadius: '8px', boxShadow: '0 4px 20px rgba(0,0,0,0.1)', padding: '8px 0', minWidth: '120px', zIndex: 50 }}>
                {[
                  { code: 'en', label: 'English' },
                  { code: 'fr', label: 'Français' },
                  { code: 'ru', label: 'Русский' },
                  { code: 'ro', label: 'Română' }
                ].map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => {
                      i18n.changeLanguage(lang.code)
                      setLangDropdownOpen(false)
                      window.location.reload()
                    }}
                    style={{ display: 'block', width: '100%', textAlign: 'left', padding: '8px 16px', background: i18n.language === lang.code ? '#f8fafc' : 'none', border: 'none', cursor: 'pointer', fontSize: '14px', color: '#0f2f44' }}
                  >
                    {lang.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <Link to="/cart" className="site-header__cartLink" style={{ marginLeft: '12px' }}>
            <img src={cartIcon} alt="Cart" />
          </Link>

          <button
            type="button"
            className="site-header__mobileToggle"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Overlay */}
      <nav className={`site-header__mobileNav ${isMobileMenuOpen ? 'is-open' : ''}`}>
        <div className="site-header__mobileNavInner">
          {navItems.map((item) => (
            <div key={item.key} className="site-header__mobileNavItem">
              {item.dropdownItems ? (
                <>
                  <Link
                    to={item.path}
                    className="site-header__mobileNavLink"
                    onClick={(e) => {
                      if (openDropdown !== item.key) {
                        e.preventDefault()
                        setOpenDropdown(item.key)
                      } else {
                        setIsMobileMenuOpen(false)
                      }
                    }}
                  >
                    <span>{t(`header.${item.key}`)}</span>
                    <ChevronDown size={14} style={{ transform: openDropdown === item.key ? 'rotate(180deg)' : 'none' }} />
                  </Link>
                  {openDropdown === item.key && (
                    <div className="site-header__mobileDropdown">
                      {item.dropdownItems.map((sub) => (
                        <Link
                          key={sub.key}
                          to={sub.path}
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {t(`header.${sub.key}`)}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to={item.path}
                  className="site-header__mobileNavLink"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {t(`header.${item.key}`)}
                </Link>
              )}
            </div>
          ))}
        </div>
      </nav>
    </header>
  )
}
