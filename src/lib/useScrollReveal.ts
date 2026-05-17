import { useEffect, useRef } from 'react'

/**
 * useScrollReveal
 * Attaches an IntersectionObserver to a container element and adds the
 * class `is-visible` to every child that matches `selector` once it
 * enters the viewport. No extra libraries required.
 *
 * Usage:
 *   const sectionRef = useScrollReveal<HTMLDivElement>()
 *   <section ref={sectionRef}>
 *     <h2 className="reveal-fade-up">Title</h2>
 *     <p  className="reveal-fade-up">Body</p>
 *   </section>
 */
export function useScrollReveal<T extends HTMLElement>(
  selector = '.reveal-fade-up, .reveal-fade, .reveal-scale',
  options: IntersectionObserverInit = { threshold: 0.12 },
) {
  const ref = useRef<T>(null)

  useEffect(() => {
    const container = ref.current
    if (!container) return

    const targets = Array.from(container.querySelectorAll<HTMLElement>(selector))

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible')
          observer.unobserve(entry.target)
        }
      })
    }, options)

    targets.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [selector, options])

  return ref
}
