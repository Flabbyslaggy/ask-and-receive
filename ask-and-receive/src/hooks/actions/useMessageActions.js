import {
    sendMessage,
    markMessagesAsRead,    
} from "../../services/messageService"

export function useMessageActions({
    session,
    messageInputs,
    setMessageInputs,
    setMessages,
}) {
    async function handleSendMessage(offerId) {
        const messageText = (messageInputs[offerId] || "").trim()

        if (!messageText) return

        if (messageText.length > 300) {
            alert("Message must be 300 characters or fewer.")
            return
        }

        const { data: newMessage, error } = await sendMessage({
            offerId,
            senderUserId: session.user.id,
            messageText,
        })

        if (error) {
            console.error("Error sending message:", error)
            return
        }

        setMessages((current) => [...current, newMessage])

        setMessageInputs((current) => ({
            ...current,
            [offerId]: "",
        }))
    }

async function handleMarkMessagesAsRead(offerId) {

  const { data, error } = await markMessagesAsRead({
    offerId,
    currentUserId: session.user.id,
  })

  if (error) return

  setMessages((current) =>
    current.map((message) =>
      message.offer_id === offerId &&
      message.sender_user_id !== session.user.id
        ? { ...message, is_read: true }
        : message
    )
  )
}

    return {
        handleSendMessage,
        handleMarkMessagesAsRead,
    }
}