import type { Variants } from 'framer-motion'

// ── Generic fade-up (used by most section headers) ─────────────────
export const fadeUp: Variants = {
  hidden:  { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } },
}

// ── Fade in from left ──────────────────────────────────────────────
export const fadeLeft: Variants = {
  hidden:  { opacity: 0, x: -50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.65, ease: 'easeOut' } },
}

// ── Fade in from right ─────────────────────────────────────────────
export const fadeRight: Variants = {
  hidden:  { opacity: 0, x: 50 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.65, ease: 'easeOut' } },
}

// ── Scale pop (for cards, icons) ────────────────────────────────────
export const scalePop: Variants = {
  hidden:  { opacity: 0, scale: 0.82 },
  visible: { opacity: 1, scale: 1,   transition: { type: 'spring', stiffness: 220, damping: 18 } },
}

// ── Staggered container (wraps a list of children) ─────────────────
export const stagger = (staggerSec = 0.12, delayBase = 0): Variants => ({
  hidden:  {},
  visible: { transition: { staggerChildren: staggerSec, delayChildren: delayBase } },
})

// ── Slide up with a spring feel (for FAQ items, steps) ────────────
export const springUp: Variants = {
  hidden:  { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 260, damping: 22 } },
}

// ── Common viewport settings ────────────────────────────────────────
export const viewport = { once: true, amount: 0.2 } as const
