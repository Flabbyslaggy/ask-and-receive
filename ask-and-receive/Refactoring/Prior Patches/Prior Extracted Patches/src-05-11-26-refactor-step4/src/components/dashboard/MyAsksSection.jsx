import RelatedOfferCard from "./RelatedOfferCard"

export default function MyAsksSection({
  myAsks,
  offersForMyAsks,
  stories,
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
}) {
  if (myAsks.length === 0) return null

  return (
    <section className="mx-auto mt-10 max-w-4xl px-6">
      <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-6 backdrop-blur">
        <h2 className="text-2xl font-semibold text-white">My Asks</h2>

        <div className="mt-4 grid gap-4">
          {myAsks.map((ask) => {
            const relatedOffers = offersForMyAsks.filter(
              (offer) => offer.ask_id === ask.id
            )
            const relatedStory = stories.find((story) => story.ask_id === ask.id)
            const isFulfilled = offersForMyAsks.some(
              (offer) => offer.ask_id === ask.id && offer.status === "fulfilled"
            )

            return (
              <div key={ask.id}>
                {expandedAskId !== ask.id ? (
                  <div
                    onClick={() =>
                      setExpandedAskId((current) =>
                        current === ask.id ? null : ask.id
                      )
                    }
                    className="cursor-pointer rounded-2xl border border-stone-800 bg-stone-900/60 px-4 py-3 hover:bg-stone-900/80 transition flex justify-between items-center"
                  >
                    <div>
                      <div className="text-sm text-stone-400">My Ask</div>
                      <div className="text-base text-white font-medium">
                        {ask.title}
                      </div>
                    </div>

                    <div className="text-sm text-stone-300">
                      {isFulfilled ? "fulfilled" : "open"}
                    </div>
                  </div>
                ) : (
                  <div className="rounded-3xl border border-stone-800 bg-stone-900/60 backdrop-blur p-6 shadow-lg">
                    <div className="mb-4 flex justify-end gap-2">
                      {editingAskId === ask.id ? (
                        <>
                          <button
                            onClick={() => handleSaveAskEdit(ask.id)}
                            className={`rounded-xl bg-gradient-to-r ${activeTheme.button} px-3 py-1 text-sm font-semibold text-stone-950 transition`}
                          >
                            Save
                          </button>

                          <button
                            onClick={() => {
                              setEditingAskId(null)
                              setEditAskForm({ title: "", body: "" })
                            }}
                            className="rounded-xl border border-stone-700 px-3 py-1 text-sm text-stone-300 hover:bg-stone-900/80 transition"
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
                          className="rounded-xl border border-stone-700 px-3 py-1 text-sm text-stone-300 hover:bg-stone-900/80 transition"
                        >
                          Edit
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleDeleteAsk(ask.id)}
                        className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-1 text-sm text-red-200 hover:bg-red-500/20 transition"
                      >
                        Delete
                      </button>

                      <button
                        onClick={() => setExpandedAskId(null)}
                        className="rounded-xl border border-stone-700 px-3 py-1 text-sm text-stone-300 hover:bg-stone-900/80 transition"
                      >
                        Collapse
                      </button>
                    </div>

                    <div className="grid gap-6 md:grid-cols-2">
                      <div className="space-y-4">
                        <div>
                          <div className="text-sm text-stone-400">Ask</div>

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
                              className="mt-1 w-full rounded-xl border border-stone-700 bg-stone-900/80 px-3 py-2 text-sm text-white outline-none"
                            />
                          ) : (
                            <div className="text-xl font-semibold text-white">
                              {ask.title}
                            </div>
                          )}
                        </div>

                        <div>
                          <div className="text-sm text-stone-400">Category</div>
                          <div className="text-base text-stone-200">{ask.category}</div>
                        </div>

                        <div>
                          <div className="text-sm text-stone-400">Asked on</div>
                          <div className="text-base text-stone-200">
                            {new Date(ask.created_at).toLocaleDateString()}
                          </div>
                        </div>

                        <div>
                          {isFulfilled ? (
                            <div className={`inline-block rounded-2xl border px-3 py-1 text-sm font-medium ${activeTheme.badge}`}>
                              Fulfilled
                            </div>
                          ) : (
                            <div className="inline-block rounded-2xl border border-stone-700 px-3 py-1 text-sm text-stone-300">
                              Open
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <div className="text-sm text-stone-400">Details</div>

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
                              className="mt-1 w-full rounded-xl border border-stone-700 bg-stone-900/80 px-3 py-2 text-sm text-stone-200 outline-none"
                            />
                          ) : (
                            <div className="text-base text-stone-200">{ask.body}</div>
                          )}
                        </div>
                      </div>
                    </div>

                    {relatedOffers.length > 0 && (
                      <div className="mt-6">
                        <div className="text-sm text-stone-400">Offers on this ask</div>

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
                      <div className="mt-6 rounded-2xl border border-stone-700 bg-stone-950/30 p-4">
                        <div className="mb-3 flex items-start justify-between gap-3">
                          <div>
                            <div className="text-sm text-stone-400">Gratitude</div>
                            <div className="text-base font-medium text-white">
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
                              className="rounded-xl border border-stone-700 px-3 py-1 text-sm text-stone-300 hover:bg-stone-900/80 transition"
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteStory(relatedStory.id)}
                              className="rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-1 text-sm text-red-200 hover:bg-red-500/20 transition"
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
                              className="rounded-xl border border-stone-700 bg-stone-900/80 px-3 py-2 text-sm text-white outline-none"
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
                              className="rounded-xl border border-stone-700 bg-stone-900/80 px-3 py-2 text-sm text-stone-200 outline-none"
                            />

                            <div className="flex gap-2">
                              <button
                                type="button"
                                onClick={() => handleSaveStoryEdit(relatedStory.id)}
                                className={`rounded-xl bg-gradient-to-r ${activeTheme.button} px-3 py-1 text-sm font-semibold text-stone-950 transition`}
                              >
                                Save
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setEditingStoryId(null)
                                  setEditStoryForm({ title: "", body: "" })
                                }}
                                className="rounded-xl border border-stone-700 px-3 py-1 text-sm text-stone-300 hover:bg-stone-900/80 transition"
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="text-sm text-stone-200">
                            {relatedStory.body}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
