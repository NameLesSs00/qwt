import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

export function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    // Use requestAnimationFrame to ensure scroll happens after the new page renders
    const raf = requestAnimationFrame(() => {
      window.scrollTo(0, 0)
      document.documentElement.scrollTop = 0
      document.body.scrollTop = 0
    })
    return () => cancelAnimationFrame(raf)
  }, [pathname])

  return null
}
