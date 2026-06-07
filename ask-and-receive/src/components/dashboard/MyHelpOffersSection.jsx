import MyHelpOfferCard from "./MyHelpOfferCard"

export default function MyHelpOffersSection({
  myHelpOffers,
  asks,
  expandedHelpOfferId,
  setExpandedHelpOfferId,
  handleProfileClick,
  editingOfferId,
  setEditingOfferId,
  editOfferForm,
  setEditOfferForm,
  handleSaveOfferEdit,
  handleWithdrawOffer,
  activeTheme,
  getMessagesForOffer,
  getUnreadMessagesForOffer,
  expandedMessagesOfferId,
  setExpandedMessagesOfferId,
  currentUserId,
  messageInputs,
  setMessageInputs,
  handleSendMessage,
  handleMarkMessagesAsRead,
}) {
  if (myHelpOffers.length === 0) return null

  return (
    <section className="mx-auto mt-10 w-full max-w-4xl px-3 sm:px-6">
      <div className={`w-full min-w-0 rounded-3xl border ${activeTheme.cardBorder} ${activeTheme.cardBg} p-4 sm:p-6 backdrop-blur`}>
        <h2 className={`text-2xl font-semibold ${activeTheme.primaryText}`}>
          My Help Offers
        </h2>
        <div className="mt-4 grid w-full min-w-0 gap-4">
          {myHelpOffers.map((offer) => (
            <MyHelpOfferCard
              key={offer.id}
              offer={offer}
              ask={asks.find((a) => a.id === offer.ask_id)}
              isExpanded={expandedHelpOfferId === offer.id}
              onToggle={() =>
                setExpandedHelpOfferId((current) =>
                  current === offer.id ? null : offer.id
                )
              }
              onCollapse={() => {
                setExpandedHelpOfferId(null)
                setExpandedMessagesOfferId(null)
              }}
              onProfileClick={handleProfileClick}
              editingOfferId={editingOfferId}
              setEditingOfferId={setEditingOfferId}
              editOfferForm={editOfferForm}
              setEditOfferForm={setEditOfferForm}
              onSaveOfferEdit={handleSaveOfferEdit}
              onWithdrawOffer={handleWithdrawOffer}
              activeTheme={activeTheme}
              messages={getMessagesForOffer(offer.id)}
              unreadCount={getUnreadMessagesForOffer(offer.id).length}
              handleMarkMessagesAsRead={handleMarkMessagesAsRead}
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
    </section>
  )
}
