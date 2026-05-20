import Hero from "../Hero"
import StoriesSection from "../StoriesSection"
import AskForm from "../AskForm"
import AskList from "../AskList"

export default function HomePage({
  status,
  handleClearSavedData,
  stories,
  handleProfileClick,
  askForm,
  setAskForm,
  categories,
  handleAskSubmit,
  askStatus,
  isAppLoading,
  asks,
  session,
  myHelpOffers,
  allOffers,
  handleHelpClick,
}) {
  return (
    <>
      <Hero
        status={status}
        onClearSavedData={handleClearSavedData}
      />

      <StoriesSection
        stories={stories}
        handleProfileClick={handleProfileClick}
      />

      <AskForm
        askForm={askForm}
        setAskForm={setAskForm}
        categories={categories}
        handleAskSubmit={handleAskSubmit}
        askStatus={askStatus}
      />

      <AskList
        isLoading={isAppLoading}
        asks={asks.map((ask) => ({
          ...ask,
          isOwnAsk: ask.user_id === session.user.id,
          hasMyOffer: myHelpOffers.some(
            (offer) => offer.ask_id === ask.id
          ),
          hasAnyOffer: allOffers.some(
            (offer) => offer.ask_id === ask.id
          ),
          isFulfilled: allOffers.some(
            (offer) =>
              offer.ask_id === ask.id &&
              offer.status === "fulfilled"
          ),
        }))}
        onHelpClick={handleHelpClick}
      />
    </>
  )
}