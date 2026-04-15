import { Outlet } from 'react-router-dom'

import { ChatWidget } from '@/components/chat-widget'
import { WhatsAppFloat } from '@/components/whatsapp-float'
import { SiteFooter } from '@/layouts/site-footer'
import { SiteHeader } from '@/layouts/site-header'

export function SiteLayout() {
  return (
    <div className="min-h-screen text-[--ink-800]">
      <SiteHeader />
      <main className="mx-auto mt-4 w-full max-w-7xl rounded-3xl border border-[--line] bg-gradient-to-b from-[#eef6fc]/95 to-[#e8f3ed]/95 px-4 py-8 shadow-sm sm:px-6 md:py-10 lg:px-8">
        <Outlet />
      </main>
      <ChatWidget />
      <WhatsAppFloat />
      <SiteFooter />
    </div>
  )
}
