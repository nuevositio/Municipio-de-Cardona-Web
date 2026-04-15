import { API_BASE } from './api-base'

export type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
}

export async function sendChatMessage(messages: ChatMessage[]): Promise<string> {
  const res = await fetch(`${API_BASE}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  })

  const data = await res.json()

  if (!res.ok) {
    throw new Error(data.message ?? 'Error al conectar con el asistente.')
  }

  return data.reply as string
}
