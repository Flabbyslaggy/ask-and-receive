import MyAskCard from "./MyAskCard"

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
    <section className="mx-auto mt-10 w-full max-w-4xl px-3 sm:px-6">
      <div className="w-full min-w-0 rounded-3xl border border-stone-800 bg-stone-900/60 p-4 sm:p-6 backdrop-blur">
        <h2 className="text-2xl font-semibold text-white">My Asks</h2>

        <div className="mt-4 grid w-full min-w-0 gap-4">
          {myAsks.map((ask) => {
            const relatedOffers = offersForMyAsks.filter(
              (offer) => offer.ask_id === ask.id
            )
            const relatedStory = stories.find((story) => story.ask_id === ask.id)
            const isFulfilled = offersForMyAsks.some(
              (offer) => offer.ask_id === ask.id && offer.status === "fulfilled"
            )

            return (
              <MyAskCard
                key={ask.id}
                ask={ask}
                relatedOffers={relatedOffers}
                relatedStory={relatedStory}
                isFulfilled={isFulfilled}
                expandedAskId={expandedAskId}
                setExpandedAskId={setExpandedAskId}
                editingAskId={editingAskId}
                setEditingAskId={setEditingAskId}
                editAskForm={editAskForm}
                setEditAskForm={setEditAskForm}
                handleSaveAskEdit={handleSaveAskEdit}
                handleDeleteAsk={handleDeleteAsk}
                activeTheme={activeTheme}
                handleProfileClick={handleProfileClick}
                setGratitudeAskId={setGratitudeAskId}
                setIsGratitudeOpen={setIsGratitudeOpen}
                handleAcceptOffer={handleAcceptOffer}
                handleDeclineOffer={handleDeclineOffer}
                handleFulfillOffer={handleFulfillOffer}
                getMessagesForOffer={getMessagesForOffer}
                expandedMessagesOfferId={expandedMessagesOfferId}
                setExpandedMessagesOfferId={setExpandedMessagesOfferId}
                currentUserId={currentUserId}
                messageInputs={messageInputs}
                setMessageInputs={setMessageInputs}
                handleSendMessage={handleSendMessage}
                editingStoryId={editingStoryId}
                setEditingStoryId={setEditingStoryId}
                editStoryForm={editStoryForm}
                setEditStoryForm={setEditStoryForm}
                handleDeleteStory={handleDeleteStory}
                handleSaveStoryEdit={handleSaveStoryEdit}
                stories={stories}
              />
            )
          })}
        </div>
      </div>
    </section>
  )
}
