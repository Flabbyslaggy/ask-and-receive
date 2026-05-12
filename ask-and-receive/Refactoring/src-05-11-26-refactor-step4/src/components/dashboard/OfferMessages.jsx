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
    <div className="mt-6 rounded-2xl border border-stone-700 bg-stone-950/30 p-4">
      <div
        onClick={onToggle}
        className="text-sm text-stone-400 cursor-pointer hover:text-white transition flex justify-between"
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
                    ? `${activeTheme.solidButton} text-stone-950`
                    : "bg-stone-800/60 text-stone-200"
                    }`}
                >
                  {msg.message_text}
                </div>
              </div>
            ))}

            {messages.length === 0 && (
              <div className="text-sm text-stone-500">No messages yet</div>
            )}
          </div>

          <div className="mt-4">
            <input
              type="text"
              value={messageValue || ""}
              onChange={(e) => onMessageChange(offerId, e.target.value)}
              maxLength={300}
              placeholder="Type a message..."
              className="w-full rounded-xl border border-stone-700 bg-stone-900/80 px-3 py-2 text-sm text-stone-100 outline-none"
            />
            <div
              className={`mt-1 text-right text-xs ${charactersLeft <= 10
                ? "text-red-400"
                : "text-stone-500"
                }`}
            >
              {charactersLeft} characters left
            </div>
            <button
              onClick={() => onSendMessage(offerId)}
              className={`mt-2 rounded-xl bg-gradient-to-r ${activeTheme.button} px-4 py-2 text-sm font-medium text-stone-950 transition`}
            >
              Send
            </button>
          </div>
        </>
      )}
    </div>
  )
}
