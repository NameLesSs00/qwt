import { useState, useRef, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ChevronDown, Menu, X } from 'lucide-react'
import logo from '../../assets/brand/logo.svg'
import dropChevron from '../../assets/desinations/4.svg'
import cartIcon from '../../assets/cart/cartIcon.png'

import './header.scss'

type SubItem = {
  label: string
  path: string
}

type NavItem = {
  label: string
  path: string
  dropdownItems?: SubItem[]
}

const navItems: NavItem[] = [
  { label: 'Home', path: '/' },
  {
    label: 'Destinations',
    path: '/destinations',
    dropdownItems: [
      { label: 'Luxor', path: '/destinations/luxor' },
      { label: 'Trip Details', path: '/destinations/trip-details' },
    ],
  },
  { label: 'Trips', path: '/trips' },
  { label: 'Gallery', path: '/gallery' },
  { label: 'Blogs', path: '/blogs' },
  { label: 'About Us', path: '/about-us' },
  { label: 'Contact Us', path: '/contact-us' },
]

export function Header() {
  const { pathname } = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const dropdownRef = useRef<HTMLDivElement>(null)

  /* Close on outside click */
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpenDropdown(null)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function toggleDropdown(label: string) {
    setOpenDropdown((prev) => (prev === label ? null : label))
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
            const isOpen = openDropdown === item.label

            return (
              <div key={item.label} className="site-header__navItem">
                {/* Main nav link */}
                <Link
                  to={item.path}
                  aria-current={isActive ? 'page' : undefined}
                  className={`site-header__navLink ${isActive ? 'site-header__navLink--active' : ''}`}
                  onClick={() => setOpenDropdown(null)}
                >
                  <span>{item.label}</span>
                </Link>

                {/* Dropdown arrow – only shown if item has dropdown */}
                {hasDropdown && (
                  <button
                    type="button"
                    className={`site-header__dropIndicator ${isOpen ? 'site-header__dropIndicator--open' : ''}`}
                    aria-label={`${isOpen ? 'Close' : 'Open'} ${item.label} menu`}
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      toggleDropdown(item.label)
                    }}
                  >
                    <img
                      src={dropChevron}
                      alt=""
                      className="site-header__dropChevron"
                    />
                  </button>
                )}

                {/* Dropdown panel */}
                {hasDropdown && isOpen && (
                  <div className="site-header__dropdown">
                    {item.dropdownItems!.map((sub) => (
                      <Link
                        key={sub.label}
                        to={sub.path}
                        className={`site-header__dropItem ${
                          pathname === sub.path ? 'site-header__dropItem--active' : ''
                        }`}
                        onClick={() => setOpenDropdown(null)}
                      >
                        {sub.label}
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
          <Link to="/cart" className="site-header__cartLink">
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
            <div key={item.label} className="site-header__mobileNavItem">
              {item.dropdownItems ? (
                <>
                  <button 
                    type="button"
                    className="site-header__mobileNavLink"
                    onClick={() => setOpenDropdown(openDropdown === item.label ? null : item.label)}
                  >
                    <span>{item.label}</span>
                    <ChevronDown size={14} style={{ transform: openDropdown === item.label ? 'rotate(180deg)' : 'none' }} />
                  </button>
                  {openDropdown === item.label && (
                    <div className="site-header__mobileDropdown">
                      {item.dropdownItems.map((sub) => (
                        <Link 
                          key={sub.label} 
                          to={sub.path} 
                          onClick={() => setIsMobileMenuOpen(false)}
                        >
                          {sub.label}
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
                  {item.label}
                </Link>
              )}
            </div>
          ))}
        </div>
      </nav>
    </header>
  )
}
