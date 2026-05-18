import RelatedOfferCard from "./RelatedOfferCard"

export default function MyAskCard({
  ask,
  relatedOffers,
  relatedStory,
  isFulfilled,
  expandedAskId,
  setExpandedAskId,
  editingAskId,
  setEditingAskId,
  editAskForm,
  setEditAskForm,
  handleSaveAskEdit,
  handleDeleteAsk,
  activeTheme,
  handleProfileClick,
  setGratitudeAskId,
  setIsGratitudeOpen,
  handleAcceptOffer,
  handleDeclineOffer,
  handleFulfillOffer,
  getMessagesForOffer,
  expandedMessagesOfferId,
  setExpandedMessagesOfferId,
  currentUserId,
  messageInputs,
  setMessageInputs,
  handleSendMessage,
  editingStoryId,
  setEditingStoryId,
  editStoryForm,
  setEditStoryForm,
  handleDeleteStory,
  handleSaveStoryEdit,
  stories,
}) {
  return (
    <div className="w-full min-w-0">
      {expandedAskId !== ask.id ? (
        <div
          onClick={() =>
            setExpandedAskId((current) => (current === ask.id ? null : ask.id))
          }
          className={`flex w-full min-w-0 cursor-pointer items-center justify-between gap-3 rounded-2xl border ${activeTheme.cardBorder} ${activeTheme.cardBg} px-4 py-3 transition ${activeTheme.hoverSurface}`}
        >
          <div className="min-w-0">
            <div className={`text-sm ${activeTheme.primaryText}`}>My Ask</div>
            <div className={`break-words text-base font-medium ${activeTheme.primaryText}`}>
  {ask.title}
</div>
          </div>

          <div className={`text-sm ${activeTheme.mutedText}`}>
            {isFulfilled ? "fulfilled" : "open"}
          </div>
        </div>
      ) : (
        <div className={`w-full min-w-0 rounded-3xl border ${activeTheme.cardBorder} ${activeTheme.cardBg} p-4 shadow-lg backdrop-blur sm:p-6`}>
          <div className="mb-4 flex justify-end gap-2">
            {editingAskId === ask.id ? (
              <>
                <button
                  onClick={() => handleSaveAskEdit(ask.id)}
                  className={`rounded-xl bg-gradient-to-r ${activeTheme.button} px-3 py-1 text-sm font-semibold ${activeTheme.buttonText} transition`}
                >
                  Save
                </button>

                <button
                  onClick={() => {
                    setEditingAskId(null)
                    setEditAskForm({ title: "", body: "" })
                  }}
                  className={`rounded-xl border ${activeTheme.mutedBorder} px-3 py-1 text-sm ${activeTheme.mutedText} transition ${activeTheme.hoverSurface}`}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setEditingAskId(ask.id)
                  setEditAskForm({ title: ask.title, body: ask.body })
                }}
                className={`rounded-xl border ${activeTheme.mutedBorder} px-3 py-1 text-sm ${activeTheme.mutedText} transition ${activeTheme.hoverSurface}`}
              >
                Edit
              </button>
            )}

            <button
              type="button"
              onClick={() => handleDeleteAsk(ask.id)}
              className={`rounded-xl border ${activeTheme.dangerBorder} ${activeTheme.dangerBg} px-3 py-1 text-sm ${activeTheme.dangerText} ${activeTheme.dangerHover} transition`}
            >
              Delete
            </button>

            <button
              onClick={() => setExpandedAskId(null)}
              className={`rounded-xl border ${activeTheme.mutedBorder} px-3 py-1 text-sm ${activeTheme.mutedText} transition ${activeTheme.hoverSurface}`}
            >
              Collapse
            </button>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div>
                <div className={`text-sm ${activeTheme.subtleText}`}>Ask</div>

                {editingAskId === ask.id ? (
                  <input
                    type="text"
                    value={editAskForm.title}
                    maxLength={80}
                    onChange={(e) =>
                      setEditAskForm((current) => ({
                        ...current,
                        title: e.target.value,
                      }))
                    }
                    className={`mt-1 w-full rounded-xl border ${activeTheme.inputBorder} ${activeTheme.inputBg} px-3 py-2 text-sm ${activeTheme.primaryText} outline-none`}
                  />
                ) : (
                  <div className={`text-xl font-semibold ${activeTheme.primaryText}`}>
                    {ask.title}
                  </div>
                )}
              </div>

              <div>
                <div className={`text-sm ${activeTheme.subtleText}`}>Category</div>
                <div className={`text-base ${activeTheme.secondaryText}`}>{ask.category}</div>
              </div>

              <div>
                <div className={`text-sm ${activeTheme.subtleText}`}>Asked on</div>
                <div className={`text-base ${activeTheme.secondaryText}`}>
                  {new Date(ask.created_at).toLocaleDateString()}
                </div>
              </div>

              <div>
                {isFulfilled ? (
                  <div
                    className={`inline-block rounded-2xl border px-3 py-1 text-sm font-medium ${activeTheme.badge}`}
                  >
                    Fulfilled
                  </div>
                ) : (
                  <div className={`inline-block rounded-2xl border ${activeTheme.mutedBorder} px-3 py-1 text-sm ${activeTheme.mutedText}`}>
                    Open
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <div className={`text-sm ${activeTheme.subtleText}`}>Details</div>

                {editingAskId === ask.id ? (
                  <textarea
                    value={editAskForm.body}
                    maxLength={500}
                    onChange={(e) =>
                      setEditAskForm((current) => ({
                        ...current,
                        body: e.target.value,
                      }))
                    }
                    className={`mt-1 w-full rounded-xl border ${activeTheme.inputBorder} ${activeTheme.inputBg} px-3 py-2 text-sm ${activeTheme.secondaryText} outline-none`}
                  />
                ) : (
                  <div className={`text-base ${activeTheme.secondaryText}`}>{ask.body}</div>
                )}
              </div>
            </div>
          </div>

          {relatedOffers.length > 0 && (
            <div className="mt-6">
              <div className={`text-sm ${activeTheme.subtleText}`}>Offers on this ask</div>

              <div className="mt-3 space-y-3">
                {relatedOffers.map((offer) => (
                  <RelatedOfferCard
                    key={offer.id}
                    offer={offer}
                    hasGratitudeStory={stories.some(
                      (s) => s.ask_id === offer.ask_id
                    )}
                    onProfileClick={handleProfileClick}
                    onOpenGratitude={(askId) => {
                      setGratitudeAskId(askId)
                      setIsGratitudeOpen(true)
                    }}
                    onAcceptOffer={handleAcceptOffer}
                    onDeclineOffer={handleDeclineOffer}
                    onFulfillOffer={handleFulfillOffer}
                    activeTheme={activeTheme}
                    messages={getMessagesForOffer(offer.id)}
                    isMessagesExpanded={expandedMessagesOfferId === offer.id}
                    onToggleMessages={() =>
                      setExpandedMessagesOfferId((current) =>
                        current === offer.id ? null : offer.id
                      )
                    }
                    currentUserId={currentUserId}
                    messageValue={messageInputs[offer.id] || ""}
                    onMessageChange={(offerId, value) =>
                      setMessageInputs((current) => ({
                        ...current,
                        [offerId]: value,
                      }))
                    }
                    onSendMessage={handleSendMessage}
                  />
                ))}
              </div>
            </div>
          )}

          {relatedStory && (
            <div className={`mt-6 rounded-2xl border ${activeTheme.inputBorder} ${activeTheme.sectionBg} p-4`}>
              <div className="mb-3 flex items-start justify-between gap-3">
                <div>
                  <div className={`text-sm ${activeTheme.subtleText}`}>Gratitude</div>
                  <div className={`text-base font-medium ${activeTheme.primaryText}`}>
                    {relatedStory.title}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingStoryId(relatedStory.id)
                      setEditStoryForm({
                        title: relatedStory.title,
                        body: relatedStory.body,
                      })
                    }}
                    className={`rounded-xl border ${activeTheme.mutedBorder} px-3 py-1 text-sm ${activeTheme.mutedText} transition ${activeTheme.hoverSurface}`}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => handleDeleteStory(relatedStory.id)}
                    className={`rounded-xl border ${activeTheme.dangerBorder} ${activeTheme.dangerBg} px-3 py-1 text-sm ${activeTheme.dangerText} ${activeTheme.dangerHover} transition`}
                  >
                    Delete
                  </button>
                </div>
              </div>

              {editingStoryId === relatedStory.id ? (
                <div className="grid gap-3">
                  <input
                    type="text"
                    value={editStoryForm.title}
                    maxLength={80}
                    onChange={(e) =>
                      setEditStoryForm((current) => ({
                        ...current,
                        title: e.target.value,
                      }))
                    }
                    className={`rounded-xl border ${activeTheme.inputBorder} ${activeTheme.inputBg} px-3 py-2 text-sm ${activeTheme.primaryText} outline-none`}
                  />

                  <textarea
                    value={editStoryForm.body}
                    maxLength={500}
                    onChange={(e) =>
                      setEditStoryForm((current) => ({
                        ...current,
                        body: e.target.value,
                      }))
                    }
                    className={`rounded-xl border ${activeTheme.inputBorder} ${activeTheme.inputBg} px-3 py-2 text-sm ${activeTheme.secondaryText} outline-none`}
                  />

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleSaveStoryEdit(relatedStory.id)}
                      className={`rounded-xl bg-gradient-to-r ${activeTheme.button} px-3 py-1 text-sm font-semibold ${activeTheme.buttonText} transition`}
                    >
                      Save
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setEditingStoryId(null)
                        setEditStoryForm({ title: "", body: "" })
                      }}
                      className={`rounded-xl border ${activeTheme.mutedBorder} px-3 py-1 text-sm ${activeTheme.mutedText} transition ${activeTheme.hoverSurface}`}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className={`text-sm ${activeTheme.secondaryText}`}>{relatedStory.body}</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
