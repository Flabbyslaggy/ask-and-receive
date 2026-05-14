import OfferMessages from "./OfferMessages"

export default function RelatedOfferCard({
  offer,
  hasGratitudeStory,
  onProfileClick,
  onOpenGratitude,
  onAcceptOffer,
  onDeclineOffer,
  onFulfillOffer,
  activeTheme,
  messages,
  isMessagesExpanded,
  onToggleMessages,
  currentUserId,
  messageValue,
  onMessageChange,
  onSendMessage,
}) {
  return (
    <div className={`rounded-2xl border ${activeTheme.inputBorder} ${activeTheme.sectionBg} p-4`}>
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-3">
          <div>
            <div className="text-sm text-stone-400">Helper</div>
            <div
              onClick={() => onProfileClick(offer.user_id, offer.helper_name)}
              className="text-sm text-stone-300 cursor-pointer hover:underline"
            >
              {offer.helper_name || "Someone offered help"}
            </div>
          </div>

          <div>
            <div className="text-sm text-stone-400">Status</div>
            <div className="text-sm text-stone-200">
              {offer.status || "pending"}
            </div>
          </div>

          {offer.status === "fulfilled" && !hasGratitudeStory && (
            <div className="flex gap-2">
              <button
                onClick={() => onOpenGratitude(offer.ask_id)}
                className={`rounded-xl bg-gradient-to-r ${activeTheme.button} px-3 py-1 text-sm font-semibold text-stone-950 transition`}
              >
                Share Gratitude
              </button>
            </div>
          )}

          {offer.status === "pending" && (
            <div className="flex gap-2">
              <button
                onClick={() => onAcceptOffer(offer.id, offer.ask_id)}
                className="rounded-xl bg-green-500 px-3 py-1 text-sm font-semibold text-black hover:bg-green-400 transition"
              >
                Accept
              </button>

              <button
                onClick={() => onDeclineOffer(offer.id)}
                className="rounded-xl bg-red-500 px-3 py-1 text-sm font-semibold text-black hover:bg-red-400 transition"
              >
                Decline
              </button>
            </div>
          )}

          {offer.status === "accepted" && (
            <div className="flex gap-2">
              <button
                onClick={() => onFulfillOffer(offer.id)}
                className={`rounded-xl bg-gradient-to-r ${activeTheme.button} px-3 py-1 text-sm font-semibold text-stone-950 transition`}
              >
                Mark Fulfilled
              </button>
            </div>
          )}
        </div>

        <div className="space-y-4">
          <div>
            <div className="text-sm text-stone-400">Their Offer</div>
            <div className="mt-2 text-sm text-stone-200">
              {offer.helper_message}
            </div>
          </div>

          <OfferMessages
            offerId={offer.id}
            isExpanded={isMessagesExpanded}
            onToggle={onToggleMessages}
            messages={messages}
            currentUserId={currentUserId}
            activeTheme={activeTheme}
            messageValue={messageValue}
            onMessageChange={onMessageChange}
            onSendMessage={onSendMessage}
          />
        </div>
      </div>
    </div>
  )
}
