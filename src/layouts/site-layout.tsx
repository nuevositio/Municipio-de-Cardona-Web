import { Outlet } from 'react-router-dom'

import { WhatsAppFloat } from '@/components/whatsapp-float'
import { SiteFooter } from '@/layouts/site-footer'
import { SiteHeader } from '@/layouts/site-header'

export function SiteLayout() {
  return (
    <div className="min-h-screen bg-[--surface] text-[--ink-800]">
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 md:py-10 lg:px-8">
        <Outlet />
      </main>
      <WhatsAppFloat />
      <SiteFooter />
    </div>
  )
}
