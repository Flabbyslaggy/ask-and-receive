import { useEffect, useState } from "react"
import { supabase } from "./supabaseClient"
import Auth from "./components/Auth"
import Header from "./components/Header"
import HomePage from "./components/home/HomePage"
import DashboardPage from "./components/dashboard/DashboardPage"
import ProfilePage from "./components/profile/ProfilePage"
import HelpModal from "./components/HelpModal"
import AppModals from "./components/modals/AppModals"
import { ThemeProvider } from "./ThemeContext"
import { useActiveTheme } from "./hooks/useActiveTheme"
import {
  createAsk,
  updateAsk,
  deleteAskCascade,
  formatAsk,
} from "./services/askService"
import {
  fetchAllOffers,
  fetchOffersForAskIds,
  updateOfferMessage,
  withdrawOffer,
  acceptOffer,
  declineOffer,
  fulfillOffer,
  findExistingOffer,
  createHelpOffer,
} from "./services/offerService"
import {
  fetchStories,
  createStory,
  updateStory,
  deleteStory,
} from "./services/storyService"
import {
  fetchMessages,
  sendMessage,
  getMessagesForOffer,
} from "./services/messageService"
import { useProfile } from "./hooks/useProfile"
import { useSelectedProfileOffers } from "./hooks/useSelectedProfileOffers"
import { useMyAsks } from "./hooks/useMyAsks"
import { useMessages } from "./hooks/useMessages"
import { useStories } from "./hooks/useStories"
import { useAllOffers } from "./hooks/useAllOffers"
import { useMyHelpOffers } from "./hooks/useMyHelpOffers"
import { useOffersForMyAsks } from "./hooks/useOfferForMyAsks"
import { useRealtimeAsks } from "./hooks/useRealtimeAsks"
import { useRealtimeOffers } from "./hooks/useRealtimeOffers"
import { useAuthSession } from "./hooks/useAuthSession"
import { useRealtimeMessages } from "./hooks/useRealtimeMessages"
import { useActiveView } from "./hooks/useActiveView"
import { useAskActions } from "./hooks/useAskActions"
import { useOfferActions } from "./hooks/useOfferActions"
import { useStoryActions } from "./hooks/useStoryActions"
import { useAskLoader } from "./hooks/useAskLoader"
import { useProfileHelpers } from "./hooks/useProfileHelpers"
import { useProfileActions } from "./hooks/useProfileActions"

const ASK_STORAGE_KEY = "ask-and-receive-asks"

const sampleStories = [
  {
    id: 1,
    title: "A guitar for a kid who kept asking",
    body: "Someone finally said yes. A used guitar changed hands, and a shy kid started learning songs that same week.",
  },
  {
    id: 2,
    title: "A sunrise boat ride",
    body: "An ask that sounded small turned into a memory someone still talks about years later.",
  },
]

export default function App() {
  const [session, setSession] = useState(null)
  const [isAppLoading, setIsAppLoading] = useState(true)
  const [isPasswordRecovery, setIsPasswordRecovery] = useState(false)
  const [asks, setAsks] = useState([])
  const [status, setStatus] = useState("")
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
  const [editAskForm, setEditAskForm] = useState({
    title: "",
    body: ""
  })
  const [editingOfferId, setEditingOfferId] = useState(null)
  const [editOfferForm, setEditOfferForm] = useState({
    helper_message: "",
  })
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
  const [editStoryForm, setEditStoryForm] = useState({
    title: "",
    body: "",
  })
  const {
    messages,
    setMessages,
  } = useMessages(session)
  const [messageInputs, setMessageInputs] = useState({})
  const {
    activeView,
    setActiveView,
  } = useActiveView()
  const {
    stories,
    setStories,
  } = useStories()
  const [isGratitudeOpen, setIsGratitudeOpen] = useState(false)
  const [gratitudeAskId, setGratitudeAskId] = useState(null)
  const [selectedProfile, setSelectedProfile] = useState(null)
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
  const [isReportOpen, setIsReportOpen] = useState(false)
  const [reportReason, setReportReason] = useState("")
  const [reportStatus, setReportStatus] = useState("")
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
  const [askStatus, setAskStatus] = useState("")
  const [askForm, setAskForm] = useState({
    title: "",
    category: "Simple Joy",
    body: "",
  })
  const [gratitudeForm, setGratitudeForm] = useState({
    body: "",
  })

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

  const [helpForm, setHelpForm] = useState({
    helperMessage: "",
  })

  const [selectedAsk, setSelectedAsk] = useState(null)
  const [isHelpOpen, setIsHelpOpen] = useState(false)

  const categories = [
    "Simple Joy",
    "Encouragement",
    "Practical Need",
    "Skill or Time",
    "Experience",
  ]

  function handleHelpClick(ask) {
    setSelectedAsk(ask)
    setIsHelpOpen(true)
  }

  async function handleHelpSubmit(event) {
    event.preventDefault()

    const trimmedMessage = (helpForm.helperMessage || "").trim()

    if (!trimmedMessage) {
      setHelpStatus("Please say how you want to help.")
      return
    }

    if (trimmedMessage.length > 500) {
      setHelpStatus("Help message must be 500 characters or fewer.")
      return
    }

    const {
      data: existingOffer,
      error: existingOfferError,
    } = await findExistingOffer({
      askId: selectedAsk.id,
      userId: session.user.id,
    })

    if (existingOfferError) {
      setHelpStatus("Could not check your existing offers.")
      return
    }

    if (existingOffer) {
      setHelpStatus("You have already offered to help with this ask.")
      return
    }

    const { error } = await createHelpOffer({
      askId: selectedAsk.id,
      userId: session.user.id,
      helperName: profile?.nickname || "Anonymous",
      helperMessage: trimmedMessage,
    })

    if (error) {
      setHelpStatus("Could not send help offer.")
      return
    }

    setAsks((current) =>
      current.map((ask) =>
        ask.id === selectedAsk.id
          ? { ...ask, status: "pending" }
          : ask
      )
    )

    setHelpForm({ helperMessage: "" })
    setHelpStatus("Offer sent!")

    setIsHelpOpen(false)
    setSelectedAsk(null)
  }

  async function handleSendMessage(offerId) {
    const messageText = (messageInputs[offerId] || "").trim()

    if (!messageText) return

    if (messageText.length > 300) {
      alert("Message must be 300 characters or fewer.")
      return
    }

    const { error } = await sendMessage({
      offerId,
      senderUserId: session.user.id,
      messageText,
    })

    if (error) {
      console.error("Error sending message:", error)
      return
    }

    setMessageInputs((current) => ({
      ...current,
      [offerId]: "",
    }))
  }

  async function handleReportSubmit() {
    const trimmedReason = reportReason.trim()

    if (!trimmedReason) {
      setReportStatus("Please enter a reason.")
      return
    }

    const { error } = await supabase
      .from("user_reports")
      .insert([
        {
          reported_user_id: selectedProfile.id,
          reporter_user_id: session.user.id,
          reason: trimmedReason,
        },
      ])

    if (error) {
      console.error(error)
      setReportStatus("Could not submit report.")
      return
    }

    setReportStatus("Report submitted.")
    setReportReason("")
  }

  async function handleLogout() {
    await supabase.auth.signOut()
  }
  
  function handleClearSavedData() {
    setAsks([])
    localStorage.removeItem(ASK_STORAGE_KEY)
    setStatus("Saved asks cleared.")
  }
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
            expandedMessagesOfferId={expandedMessagesOfferId}
            setExpandedMessagesOfferId={setExpandedMessagesOfferId}
            currentUserId={session.user.id}
            messageInputs={messageInputs}
            setMessageInputs={setMessageInputs}
            handleSendMessage={handleSendMessage}
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
