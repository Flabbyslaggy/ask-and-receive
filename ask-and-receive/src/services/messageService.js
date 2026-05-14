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
    const { error } = await supabase.from("messages").insert([
        {
            offer_id: offerId,
            sender_user_id: senderUserId,
            message_text: messageText,
        },
    ])

    return { error }
}

export function getMessagesForOffer(messages, offerId) {
    return messages.filter((msg) => msg.offer_id === offerId)
}