import OfferMessages from "./OfferMessages"

export default function MyHelpOfferCard({
  offer,
  ask,
  isExpanded,
  onToggle,
  onCollapse,
  onProfileClick,
  editingOfferId,
  setEditingOfferId,
  editOfferForm,
  setEditOfferForm,
  onSaveOfferEdit,
  onWithdrawOffer,
  activeTheme,
  messages,
  isMessagesExpanded,
  onToggleMessages,
  currentUserId,
  messageValue,
  onMessageChange,
  onSendMessage,
}) {
  const askerName = ask?.asker || "Unknown"
  const askTitle = ask?.title || "Unknown ask"
  const askBody = ask?.body || "No ask text"

  const handleRequesterClick = (event) => {
    event.stopPropagation()
    onProfileClick(ask?.user_id, askerName)
  }

  return (
    <div>
      {!isExpanded ? (
        <div
          onClick={onToggle}
          className="cursor-pointer rounded-2xl border border-stone-800 bg-stone-900/60 px-4 py-3 hover:bg-stone-900/80 transition"
        >
          <div className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
            <div className="min-w-0">
              <div
                onClick={handleRequesterClick}
                className="text-sm text-stone-400 cursor-pointer hover:underline break-words"
              >
                {askerName}
              </div>

              <div className="text-med text-white-300 break-words">
                {askTitle}
              </div>
            </div>

            <div className="shrink-0 text-sm text-stone-300">
              {offer.status || "pending"}
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-3xl border border-stone-800 bg-stone-900/60 backdrop-blur p-6 shadow-lg">
          <div className="mb-4 flex justify-end">
            <button
              onClick={onCollapse}
              className="rounded-xl border border-stone-700 px-3 py-1 text-sm text-stone-300 hover:bg-stone-900/80 transition"
            >
              Collapse
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            {/* LEFT SIDE */}
            <div className="grid gap-6 sm:grid-cols-2">
              <div>
                <div className="text-sm text-stone-400">Ask</div>
                <div className="text-xl font-semibold text-white">
                  {askTitle}
                </div>
              </div>

              <div>
                <div className="text-sm text-stone-400">Offered on</div>
                <div className="text-base text-stone-200">
                  {new Date(offer.created_at).toLocaleDateString()}
                </div>
              </div>

              <div>
                <div className="text-sm text-stone-400">Requested by</div>
                <div
                  onClick={handleRequesterClick}
                  className="text-sm text-stone-400 cursor-pointer hover:underline"
                >
                  {askerName}
                </div>
              </div>

              <div>
                <div className="text-sm text-stone-400">Status</div>
                <div className="text-base text-stone-200">
                  {offer.status || "pending"}
                </div>
              </div>
            </div>

            {/* RIGHT SIDE */}
            <div className="space-y-6">
              <div>
                <div className="text-sm text-stone-400">Original Request</div>
                <div className="text-base text-stone-200">
                  {askBody}
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between">
                  <div className="text-sm text-stone-400">Your Offer</div>

                  <button
                    onClick={() => {
                      setEditingOfferId(offer.id)
                      setEditOfferForm({
                        helper_message: offer.helper_message || "",
                      })
                    }}
                    className="rounded-xl border border-stone-700 px-3 py-1 text-xs text-stone-300 hover:bg-stone-900/80 transition"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => {
                      const confirmed = window.confirm(
                        "Are you sure you want to withdraw this offer?"
                      )

                      if (confirmed) {
                        onWithdrawOffer(offer.id)
                      }
                    }}
                    className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-1 text-sm text-red-200 hover:bg-red-500/20 transition"
                  >
                    Withdraw
                  </button>
                </div>

                {editingOfferId === offer.id ? (
                  <>
                    <textarea
                      value={editOfferForm.helper_message}
                      maxLength={500}
                      onChange={(e) =>
                        setEditOfferForm({
                          helper_message: e.target.value,
                        })
                      }
                      className="mt-2 w-full rounded-xl border border-stone-700 bg-stone-900/80 px-3 py-2 text-sm text-stone-200 outline-none"
                    />

                    <div className="mt-2 flex gap-2">
                      <button
                        onClick={() => onSaveOfferEdit(offer.id)}
                        className={`rounded-xl bg-gradient-to-r ${activeTheme.button} px-3 py-1 text-sm font-semibold text-stone-950 transition`}
                      >
                        Save
                      </button>

                      <button
                        onClick={() => {
                          setEditingOfferId(null)
                          setEditOfferForm({ helper_message: "" })
                        }}
                        className="rounded-xl border border-stone-700 px-3 py-1 text-sm text-stone-300 hover:bg-stone-900/80 transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <div className="text-base text-stone-200">
                    {offer.helper_message}
                  </div>
                )}
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
      )}
    </div>
  )
}
