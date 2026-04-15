import { Bot, Send, X } from 'lucide-react'
import { useEffect, useRef, useState } from 'react'

import { type ChatMessage, sendChatMessage } from '@/lib/chat-api'

const WELCOME: ChatMessage = {
  role: 'assistant',
  content: '¡Hola! Soy Cardona Asiste 👋 Podés consultarme sobre trámites, el Teatro Artigas, el PGR y otros servicios del Municipio. ¿En qué te puedo ayudar?',
}

export function ChatWidget() {
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([WELCOME])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
      inputRef.current?.focus()
    }
  }, [open, messages])

  async function handleSend() {
    const text = input.trim()
    if (!text || loading) return

    const userMsg: ChatMessage = { role: 'user', content: text }
    const updated = [...messages, userMsg]
    setMessages(updated)
    setInput('')
    setError(null)
    setLoading(true)

    try {
      // Enviamos solo los últimos 10 mensajes para no exceder tokens
      const history = updated.slice(-10)
      const reply = await sendChatMessage(history)
      setMessages([...updated, { role: 'assistant', content: reply }])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al conectar con el asistente.')
    } finally {
      setLoading(false)
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <>
      {/* Burbuja de apertura */}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? 'Cerrar asistente' : 'Abrir asistente virtual'}
        className="fixed bottom-20 right-5 z-50 grid h-12 w-12 place-content-center rounded-full shadow-lg transition-transform hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white"
        style={{ backgroundColor: 'var(--brand-blue)' }}
      >
        {open ? <X size={18} color="white" /> : <Bot size={18} color="white" />}
      </button>

      {/* Ventana del chat */}
      {open && (
        <div
          className="fixed bottom-36 right-5 z-50 flex w-[340px] max-w-[calc(100vw-2.5rem)] flex-col overflow-hidden rounded-2xl shadow-2xl"
          style={{ border: '1px solid rgba(0,0,0,0.1)', backgroundColor: '#fff', height: '460px' }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-3 px-4 py-3"
            style={{ backgroundColor: 'var(--brand-blue)' }}
          >
            <span className="grid h-8 w-8 place-content-center rounded-full bg-white/20">
              <Bot size={16} color="white" />
            </span>
            <div>
              <p className="text-sm font-semibold text-white">Cardona Asiste</p>
              <p className="text-xs text-white/70">Asistente virtual municipal</p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Cerrar"
              className="ml-auto grid h-7 w-7 place-content-center rounded-full text-white/70 transition hover:bg-white/20 hover:text-white"
            >
              <X size={15} />
            </button>
          </div>

          {/* Mensajes */}
          <div className="flex-1 overflow-y-auto px-3 py-3 space-y-3">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className="max-w-[80%] rounded-2xl px-3 py-2 text-sm leading-relaxed"
                  style={
                    msg.role === 'user'
                      ? { backgroundColor: 'var(--brand-blue)', color: '#fff', borderBottomRightRadius: '4px' }
                      : { backgroundColor: '#f1f5f9', color: '#1e293b', borderBottomLeftRadius: '4px' }
                  }
                >
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1 rounded-2xl bg-[#f1f5f9] px-4 py-2.5" style={{ borderBottomLeftRadius: '4px' }}>
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: '0ms' }} />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: '150ms' }} />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-slate-400" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            )}

            {error && (
              <p className="text-center text-xs text-red-500">{error}</p>
            )}

            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="flex items-center gap-2 border-t border-slate-100 px-3 py-2.5">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              maxLength={500}
              disabled={loading}
              placeholder="Escribí tu consulta..."
              className="flex-1 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-[--brand-blue] focus:ring-2 focus:ring-[--brand-blue]/20 disabled:opacity-50"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              aria-label="Enviar"
              className="grid h-9 w-9 shrink-0 place-content-center rounded-xl text-white transition hover:opacity-90 disabled:opacity-40"
              style={{ backgroundColor: 'var(--brand-blue)' }}
            >
              <Send size={15} />
            </button>
          </div>
        </div>
      )}
    </>
  )
}
