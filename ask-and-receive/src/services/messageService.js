import { supabase } from "../supabaseClient"

export async function fetchMessages() {
    const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: true })

    if (error) {
        console.error("Error fetching messages:", error)
        return []
    }

    return data
}

export async function sendMessage({
    offerId,
    senderUserId,
    messageText,
}) {
    const { data, error } = await supabase.from("messages").insert([
        {
            offer_id: offerId,
            sender_user_id: senderUserId,
            message_text: messageText,
            is_read: false,
        },
    ])
        .select()
        .single()

    if (error) {
        console.error("Error sending message:", error)
        return { error }
    }

    return { data, error }
}

export function getMessagesForOffer(messages, offerId) {
    return messages.filter((msg) => msg.offer_id === offerId)
}

export async function markMessagesAsRead({
  offerId,
  currentUserId,
}) {
   
  const { data, error } = await supabase
    .from("messages")
    .update({ is_read: true })
    .eq("offer_id", offerId)
    .neq("sender_user_id", currentUserId)
    .eq("is_read", false)
    .select()

  if (error) {
    console.error("Error marking messages as read:", error)
    return { data: [], error }
  }

  return { data, error }
}

export function getUnreadMessagesForOffer(messages, offerId, currentUserId) {
  return messages.filter(
    (message) =>
      message.offer_id === offerId &&
      message.sender_user_id !== currentUserId &&
      message.is_read === false
  )
}
