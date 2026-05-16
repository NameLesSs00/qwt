import type { ReactNode } from 'react'
import { Header } from '../components/header/Header'
import { Footer } from '../components/footer/Footer'

type AppLayoutProps = {
  children?: ReactNode
}

export function AppLayout({ children }: AppLayoutProps) {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Header />
      <main className="w-full">
        {children}
      </main>
      <Footer />
    </div>
  )
}
