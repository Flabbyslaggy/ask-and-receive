import { useState } from "react"
import Auth from "./components/Auth"
import Header from "./components/Header"
import HomePage from "./components/home/HomePage"
import DashboardPage from "./components/dashboard/DashboardPage"
import ProfilePage from "./components/profile/ProfilePage"
import AppModals from "./components/modals/AppModals"
import { ThemeProvider } from "./providers/ThemeContext"
import { categories } from "./constants/categories"
import {
  getMessagesForOffer,
  getUnreadMessagesForOffer,
} from "./services/messageService"
import { useActiveTheme } from "./hooks/helpers/useActiveTheme"
import { useProfile } from "./hooks/data/useProfile"
import { useSelectedProfileOffers } from "./hooks/data/useSelectedProfileOffers"
import { useMyAsks } from "./hooks/data/useMyAsks"
import { useMessages } from "./hooks/data/useMessages"
import { useStories } from "./hooks/data/useStories"
import { useAllOffers } from "./hooks/data/useAllOffers"
import { useMyHelpOffers } from "./hooks/data/useMyHelpOffers"
import { useOffersForMyAsks } from "./hooks/data/useOfferForMyAsks"
import { useRealtimeAsks } from "./hooks/realtime/useRealtimeAsks"
import { useRealtimeOffers } from "./hooks/realtime/useRealtimeOffers"
import { useAuthSession } from "./hooks/helpers/useAuthSession"
import { useRealtimeMessages } from "./hooks/realtime/useRealtimeMessages"
import { useActiveView } from "./hooks/helpers/useActiveView"
import { useAskActions } from "./hooks/actions/useAskActions"
import { useOfferActions } from "./hooks/actions/useOfferActions"
import { useStoryActions } from "./hooks/actions/useStoryActions"
import { useAskLoader } from "./hooks/data/useAskLoader"
import { useProfileHelpers } from "./hooks/helpers/useProfileHelpers"
import { useProfileActions } from "./hooks/actions/useProfileActions"
import { useHelpActions } from "./hooks/actions/useHelpActions"
import { useMessageActions } from "./hooks/actions/useMessageActions"
import { useReportActions } from "./hooks/actions/useReportActions"
import { useAuthActions } from "./hooks/actions/useAuthActions"
import { useLocalDataActions } from "./hooks/actions/useLocalDataActions"
import { useModalState } from "./hooks/state/useModalState"
import { useFormState } from "./hooks/state/useFormState"

const ASK_STORAGE_KEY = "ask-and-receive-asks"

export default function App() {
  const [session, setSession] = useState(null)
  const [isAppLoading, setIsAppLoading] = useState(true)
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false)
  const [asks, setAsks] = useState([])
  const [status, setStatus] = useState("")
  const {
    isHelpOpen,
    setIsHelpOpen,
    selectedAsk,
    setSelectedAsk,

    isGratitudeOpen,
    setIsGratitudeOpen,
    gratitudeAskId,
    setGratitudeAskId,

    selectedProfile,
    setSelectedProfile,

    isReportOpen,
    setIsReportOpen,
    reportReason,
    setReportReason,
    reportStatus,
    setReportStatus,
  } = useModalState()
  const {
    askForm,
    setAskForm,
    editAskForm,
    setEditAskForm,
    helpForm,
    setHelpForm,
    gratitudeForm,
    setGratitudeForm,
    editStoryForm,
    setEditStoryForm,
    editOfferForm,
    setEditOfferForm,
    messageInputs,
    setMessageInputs,
  } = useFormState()
  const {
    myHelpOffers,
    setMyHelpOffers,
  } = useMyHelpOffers(session)
  const [expandedHelpOfferId, setExpandedHelpOfferId] = useState(null)
  const [expandedAskId, setExpandedAskId] = useState(null)
  const [expandedMessagesOfferId, setExpandedMessagesOfferId] = useState(null)
  const [helpStatus, setHelpStatus] = useState("")
  const {
    offersForMyAsks,
    setOffersForMyAsks
  } = useOffersForMyAsks(session, asks)

  const {
    allOffers,
    setAllOffers,
  } = useAllOffers()
  const {
    myAsks,
    setMyAsks,
  } = useMyAsks(session, asks)
  const [editingAskId, setEditingAskId] = useState(null)

  const [editingOfferId, setEditingOfferId] = useState(null)

  const {
    handleSaveOfferEdit,
    handleWithdrawOffer,
    handleAcceptOffer,
    handleFulfillOffer,
    handleDeclineOffer,
  } = useOfferActions({
    session,
    editOfferForm,
    setEditingOfferId,
    setEditOfferForm,
    setMyHelpOffers,
    setOffersForMyAsks,
    setAllOffers,
    setMyAsks,
    setAsks,
    setStatus,
    offersForMyAsks,
  })
  const [editingStoryId, setEditingStoryId] = useState(null)

  const {
    messages,
    setMessages,
  } = useMessages(session)

  const {
    handleSendMessage,
    handleMarkMessagesAsRead,
  } = useMessageActions({
    session,
    messageInputs,
    setMessageInputs,
    setMessages,
  })
  const {
    activeView,
    setActiveView,
  } = useActiveView()
  const {
    stories,
    setStories,
  } = useStories()
  const {
    handleProfileClick,
  } = useProfileHelpers({
    setSelectedProfile,
  })
  const {
    profile,
    setProfile,
    isProfileLoading,
    setIsProfileLoading,
  } = useProfile(session)
  const {
    handleReportSubmit,
  } = useReportActions({
    session,
    selectedProfile,
    reportReason,
    setReportReason,
    setReportStatus,
  })
  const [profileStatus, setProfileStatus] = useState("")
  const {
    handleAvatarUpload,
    handleSaveProfile,
  } = useProfileActions({
    session,
    profile,
    setProfile,
    setProfileStatus,
  })
  const {
    selectedProfileOffers,
    setSelectedProfileOffers,
  } = useSelectedProfileOffers(selectedProfile)
  const activeTheme = useActiveTheme(profile)
  const {
    handleLogout,
  } = useAuthActions()
  const {
    handleClearSavedData,
  } = useLocalDataActions({
    setAsks,
    setStatus,
    askStorageKey: ASK_STORAGE_KEY,
  })
  const [askStatus, setAskStatus] = useState("")

  const {
    handleGratitudeSubmit,
    handleSaveStoryEdit,
    handleDeleteStory,
  } = useStoryActions({
    session,
    asks,
    offersForMyAsks,
    gratitudeAskId,
    gratitudeForm,
    setGratitudeForm,
    setIsGratitudeOpen,
    setGratitudeAskId,
    setStories,
    editStoryForm,
    setEditingStoryId,
    setEditStoryForm,
    setStatus,
  })

  const {
    handleAskSubmit,
    handleSaveAskEdit,
    handleDeleteAsk,
  } = useAskActions({
    session,
    profile,
    askForm,
    setAskForm,
    editAskForm,
    setEditAskForm,
    setEditingAskId,
    setAsks,
    setMyAsks,
    setOffersForMyAsks,
    setAllOffers,
    setStories,
    setExpandedAskId,
    setStatus,
    askStatus,
    setAskStatus,
  })

  useRealtimeAsks(setAsks)

  useRealtimeOffers({
    session,
    asks,
    setAllOffers,
    setMyHelpOffers,
    setOffersForMyAsks
  })

  useRealtimeMessages({
    session,
    setMessages,
  })

  useAuthSession({
    setSession,
    setIsAppLoading,
    setIsPasswordRecovery,
  })

  useAskLoader({
    session,
    setAsks,
    setIsAppLoading,
  })

  const {
    handleHelpClick,
    handleHelpSubmit,
  } = useHelpActions({
    session,
    profile,
    helpForm,
    selectedAsk,
    setSelectedAsk,
    setIsHelpOpen,
    setHelpForm,
    setHelpStatus,
    setAsks,
  })

  const isRecoveryMode =
    window.location.hash.includes("type=recovery") ||
    window.location.search.includes("type=recovery")

  if (!session || isRecoveryMode || isPasswordRecovery) {
    return (
      <ThemeProvider activeTheme={activeTheme}>
        <Auth
          forceRecoveryMode={isPasswordRecovery || isRecoveryMode}
          onRecoveryComplete={() => setIsPasswordRecovery(false)}
        />
      </ThemeProvider>
    )
  }

  if (isAppLoading || isProfileLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${activeTheme.primaryText}`}>
        Loading Ask & Receive...
      </div>
    )
  }

  return (
    <ThemeProvider activeTheme={activeTheme}>
      <div
        className={`min-h-screen ${activeTheme.primaryText} bg-no-repeat bg-top bg-[length:100%_auto] md:bg-cover md:bg-center md:bg-fixed`}
        style={{
          backgroundColor: "#2b2a28",
          backgroundImage:
            window.innerWidth < 768
              ? activeTheme.mobileGradient || activeTheme.backgroundGradient
              : `
          ${activeTheme.backgroundGradient},
          url(${activeTheme.backgroundImage})
        `,
        }}
      >
        <Header
          activeView={activeView}
          setActiveView={setActiveView}
          profile={profile}
        />
        <div className="mx-auto max-w-6xl px-6 pt-4">
          <div className="flex justify-end">
            <button
              onClick={handleLogout}
              className={`rounded-2xl border ${activeTheme.mutedBorder} px-4 py-2 transition ${activeTheme.hoverSurface}`}
            >
              Log Out
            </button>
          </div>
        </div>

        {activeView === "home" && (
          <HomePage
            status={status}
            handleClearSavedData={handleClearSavedData}
            stories={stories}
            handleProfileClick={handleProfileClick}
            askForm={askForm}
            setAskForm={setAskForm}
            categories={categories}
            handleAskSubmit={handleAskSubmit}
            askStatus={askStatus}
            isAppLoading={isAppLoading}
            asks={asks}
            session={session}
            myHelpOffers={myHelpOffers}
            allOffers={allOffers}
            handleHelpClick={handleHelpClick}
          />
        )}

        {activeView === "dashboard" && (
          <DashboardPage
            myAsks={myAsks}
            offersForMyAsks={offersForMyAsks}
            stories={stories}
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
            getMessagesForOffer={(offerId) =>
              getMessagesForOffer(messages, offerId)
            }
            getUnreadMessagesForOffer={(offerId) =>
              getUnreadMessagesForOffer(
                messages,
                offerId,
                session.user.id
              )
            }
            expandedMessagesOfferId={expandedMessagesOfferId}
            setExpandedMessagesOfferId={setExpandedMessagesOfferId}
            currentUserId={session.user.id}
            messageInputs={messageInputs}
            setMessageInputs={setMessageInputs}
            handleSendMessage={handleSendMessage}
            handleMarkMessagesAsRead={handleMarkMessagesAsRead}
            editingStoryId={editingStoryId}
            setEditingStoryId={setEditingStoryId}
            editStoryForm={editStoryForm}
            setEditStoryForm={setEditStoryForm}
            handleDeleteStory={handleDeleteStory}
            handleSaveStoryEdit={handleSaveStoryEdit}

            myHelpOffers={myHelpOffers}
            asks={asks}
            expandedHelpOfferId={expandedHelpOfferId}
            setExpandedHelpOfferId={setExpandedHelpOfferId}
            editingOfferId={editingOfferId}
            setEditingOfferId={setEditingOfferId}
            editOfferForm={editOfferForm}
            setEditOfferForm={setEditOfferForm}
            handleSaveOfferEdit={handleSaveOfferEdit}
            handleWithdrawOffer={handleWithdrawOffer}
          />
        )}

        {activeView === "profile" && (
          <ProfilePage
            profile={profile}
            setProfile={setProfile}
            profileStatus={profileStatus}
            setProfileStatus={setProfileStatus}
            activeTheme={activeTheme}
            handleAvatarUpload={handleAvatarUpload}
            handleSaveProfile={handleSaveProfile}
          />
        )}

        <AppModals
          isGratitudeOpen={isGratitudeOpen}
          gratitudeForm={gratitudeForm}
          setGratitudeForm={setGratitudeForm}
          handleGratitudeSubmit={handleGratitudeSubmit}
          setIsGratitudeOpen={setIsGratitudeOpen}
          setGratitudeAskId={setGratitudeAskId}
          activeTheme={activeTheme}

          selectedProfile={selectedProfile}
          selectedProfileOffers={selectedProfileOffers}
          asks={asks}
          setSelectedProfile={setSelectedProfile}
          setIsReportOpen={setIsReportOpen}
          setReportReason={setReportReason}
          setReportStatus={setReportStatus}

          isReportOpen={isReportOpen}
          reportReason={reportReason}
          setReportReasonState={setReportReason}
          reportStatus={reportStatus}
          handleReportSubmit={handleReportSubmit}

          isHelpOpen={isHelpOpen}
          selectedAsk={selectedAsk}
          helpForm={helpForm}
          setHelpForm={setHelpForm}
          handleHelpSubmit={handleHelpSubmit}
          helpStatus={helpStatus}
          setIsHelpOpen={setIsHelpOpen}
        />
      </div>
    </ThemeProvider>
  )
}
