import { useEffect } from "react"
import { supabase } from "../supabaseClient"

export function useRealtimeMessages({
  session,
  setMessages,
}) {
  useEffect(() => {
    if (!session) return

    const channel = supabase
      .channel("messages-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          setMessages((current) => {
            const alreadyExists = current.some(
              (msg) => msg.id === payload.new.id
            )

            if (alreadyExists) return current

            return [...current, payload.new]
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [session, setMessages])
}