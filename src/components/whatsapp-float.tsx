import { MessageCircle } from 'lucide-react'

const WHATSAPP_NUMBER = '59897961163'
const WHATSAPP_DISPLAY = '097 961 163'

export function WhatsAppFloat() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}`}
      target="_blank"
      rel="noreferrer"
      aria-label={`WhatsApp ${WHATSAPP_DISPLAY}`}
      className="fixed bottom-5 right-5 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#22c55e] text-white shadow-lg transition-transform hover:scale-105 hover:bg-[#16a34a] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#22c55e]"
    >
      <MessageCircle size={18} />
    </a>
  )
}
