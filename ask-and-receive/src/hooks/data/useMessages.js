import { useEffect, useState } from "react"
import { fetchMessages } from "../../services/messageService"

export function useMessages(session) {
  const [messages, setMessages] = useState([])

  useEffect(() => {
    async function loadMessages() {
      if (!session) return

      const data = await fetchMessages()
      setMessages(data)
    }

    loadMessages()
  }, [session])

  return {
    messages,
    setMessages,
  }
}