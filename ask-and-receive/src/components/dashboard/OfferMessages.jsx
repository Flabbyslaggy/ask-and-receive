export default function OfferMessages({
  offerId,
  isExpanded,
  onToggle,
  messages,
  currentUserId,
  activeTheme,
  messageValue,
  onMessageChange,
  onSendMessage,
}) {
  const charactersLeft = 300 - (messageValue || "").length

  return (
    <div className={`mt-6 rounded-2xl border ${activeTheme.inputBorder} ${activeTheme.sectionBg} p-4`}>
      <div
        onClick={onToggle}
        className={`text-sm ${activeTheme.subtleText} cursor-pointer hover:${activeTheme.primaryText} transition flex justify-between`}
      >
        <span>Messages ({messages.length})</span>
        <span>{isExpanded ? "−" : "+"}</span>
      </div>

      {isExpanded && (
        <>
          <div className="mt-3 space-y-2 max-h-80 overflow-y-auto">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex w-full ${msg.sender_user_id === currentUserId
                  ? "justify-end"
                  : "justify-start"
                  }`}
              >
                <div
                  className={`max-w-[75%] break-words rounded-2xl px-3 py-2 text-sm ${msg.sender_user_id === currentUserId
                    ? `${activeTheme.solidButton} ${activeTheme.buttonText}`
                    : `${activeTheme.cardBg} ${activeTheme.secondaryText}`
                    }`}
                >
                  {msg.message_text}
                </div>
              </div>
            ))}

            {messages.length === 0 && (
              <div className={`text-sm ${activeTheme.secondaryText}`}>No messages yet</div>
            )}
          </div>

          <div className="mt-4">
            <input
              type="text"
              value={messageValue || ""}
              onChange={(e) => onMessageChange(offerId, e.target.value)}
              maxLength={300}
              placeholder="Type a message..."
              className={`w-full rounded-xl border ${activeTheme.inputBorder} ${activeTheme.inputBg} px-3 py-2 text-sm ${activeTheme.primaryText} outline-none`}
            />
            <div
              className={`mt-1 text-right text-xs ${charactersLeft <= 10
                ? "text-red-400"
                : `${activeTheme.secondaryText}`
                }`}
            >
              {charactersLeft} characters left
            </div>
            <button
              onClick={() => onSendMessage(offerId)}
              className={`mt-2 rounded-xl bg-gradient-to-r ${activeTheme.button} px-4 py-2 text-sm font-medium ${activeTheme.buttonText} transition`}
            >
              Send
            </button>
          </div>
        </>
      )}
    </div>
  )
}
