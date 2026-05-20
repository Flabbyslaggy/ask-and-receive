import { useEffect, useState } from "react"
import { supabase } from "./supabaseClient"
import Auth from "./components/Auth"
import HomePage from "./components/home/HomePage"
import Header from "./components/Header"
import { ThemeProvider } from "./ThemeContext"
import { themes } from "./theme/themes"
import {
  fetchStories,
  createStory,
  updateStory,
  deleteStory,
} from "./services/storyService"
import HelpModal from "./components/HelpModal"
import {
  fetchAsks,
  createAsk,
  updateAsk,
  deleteAskCascade,
} from "./services/askService"
import DashboardPage from "./components/dashboard/DashboardPage"
import {
  fetchMyHelpOffers,
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
  fetchMessages,
  sendMessage,
  getMessagesForOffer,
} from "./services/messageService"
import { uploadAvatar } from "./services/profileActions"
import ProfilePage from "./components/profile/ProfilePage"
import {
  fetchProfile,
  fetchProfileOffers,
  fetchProfileById,
  updateProfile,
  syncProfileDisplayName,
} from "./services/profileService"
import AppModals from "./components/modals/AppModals"

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
  const [myHelpOffers, setMyHelpOffers] = useState([])
  const [expandedHelpOfferId, setExpandedHelpOfferId] = useState(null)
  const [expandedAskId, setExpandedAskId] = useState(null)
  const [expandedMessagesOfferId, setExpandedMessagesOfferId] = useState(null)
  const [helpStatus, setHelpStatus] = useState("")
  const [offersForMyAsks, setOffersForMyAsks] = useState([])
  const [allOffers, setAllOffers] = useState([])
  const [myAsks, setMyAsks] = useState([])
  const [editingAskId, setEditingAskId] = useState(null)
  const [editAskForm, setEditAskForm] = useState({
    title: "",
    body: ""
  })
  const [editingOfferId, setEditingOfferId] = useState(null)
  const [editOfferForm, setEditOfferForm] = useState({
    helper_message: "",
  })
  const [editingStoryId, setEditingStoryId] = useState(null)
  const [editStoryForm, setEditStoryForm] = useState({
    title: "",
    body: "",
  })
  const [messages, setMessages] = useState([])
  const [messageInputs, setMessageInputs] = useState({})
  const [activeView, setActiveView] = useState(() => {
    return localStorage.getItem("ask-receive-active-view") || "home"
  })
  const [stories, setStories] = useState([])
  const [isGratitudeOpen, setIsGratitudeOpen] = useState(false)
  const [gratitudeAskId, setGratitudeAskId] = useState(null)
  const [profile, setProfile] = useState(null)
  const [selectedProfile, setSelectedProfile] = useState(null)
  const [isReportOpen, setIsReportOpen] = useState(false)
  const [reportReason, setReportReason] = useState("")
  const [reportStatus, setReportStatus] = useState("")
  const [profileStatus, setProfileStatus] = useState("")
  const [selectedProfileOffers, setSelectedProfileOffers] = useState([])
  const savedTheme = localStorage.getItem("ask-and-receive-theme")
  const activeTheme =
    themes[profile?.theme || savedTheme || "emerald"] || themes.emerald
  const [askStatus, setAskStatus] = useState("")
  const [askForm, setAskForm] = useState({
    title: "",
    category: "Simple Joy",
    body: "",
  })
  const [gratitudeForm, setGratitudeForm] = useState({
    body: "",
  })

  useEffect(() => {
    async function handleSession(session) {
      setSession(session)

      if (!session) {
        setIsAppLoading(false)
        return
      }

      const userId = session.user.id

      // check if profile exists
      const { data } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", userId)
        .single()

      if (!data) {
        // create profile if missing
        await supabase.from("profiles").insert([
          {
            id: userId,
            nickname: "Anonymous",
          },
        ])
      }
      setIsAppLoading(false)
    }

    supabase.auth.getSession().then(({ data }) => {
      handleSession(data.session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsPasswordRecovery(true)
      }

      handleSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    localStorage.setItem("ask-receive-active-view", activeView)
  }, [activeView])

  useEffect(() => {
    async function loadAsks() {
      const formatted = await fetchAsks()

      setAsks(formatted)
      setIsAppLoading(false)
    }

    loadAsks()
  }, [])

  useEffect(() => {
    async function loadMyHelpOffers() {
      if (!session) {
        setIsAppLoading(false)
        return
      }

      const data = await fetchMyHelpOffers(session.user.id)
      setMyHelpOffers(data)
    }

    loadMyHelpOffers()
  }, [session])

  useEffect(() => {
    async function loadOffersForMyAsks() {
      if (!session || asks.length === 0) return

      const myAskIds = asks
        .filter((ask) => ask.user_id === session.user.id)
        .map((ask) => ask.id)

      const data = await fetchOffersForAskIds(myAskIds)
      setOffersForMyAsks(data)
    }

    loadOffersForMyAsks()
  }, [session, asks])

  useEffect(() => {
    async function loadAllOffers() {
      const data = await fetchAllOffers()
      setAllOffers(data)
    }

    loadAllOffers()
  }, [])

  useEffect(() => {
    async function loadMessages() {
      if (!session) return

      const data = await fetchMessages()
      setMessages(data)
    }

    loadMessages()
  }, [session])

  useEffect(() => {
    const channel = supabase
      .channel("asks-realtime")

      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "asks",
        },
        async () => {
          const { data, error } = await supabase
            .from("asks")
            .select("*")
            .order("created_at", { ascending: false })

          if (!error && data) {
            const formatted = data.map((ask) => ({
              id: ask.id,
              user_id: ask.user_id,
              asker: ask.asker_name,
              title: ask.title,
              category: ask.category,
              body: ask.body,
              created_at: ask.created_at,
            }))

            setAsks(formatted)
          }
        }
      )

      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [])

  useEffect(() => {
    if (!session) return

    const channel = supabase
      .channel("help-offers-realtime")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "help_offers",
        },
        async () => {
          const { data, error } = await supabase
            .from("help_offers")
            .select("*")

          if (error) {
            console.error("Error refreshing help offers:", error)
            return
          }

          setAllOffers(data)

          setMyHelpOffers(
            data.filter((offer) => offer.user_id === session.user.id)
          )

          const myAskIds = asks
            .filter((ask) => ask.user_id === session.user.id)
            .map((ask) => ask.id)

          setOffersForMyAsks(
            data.filter((offer) => myAskIds.includes(offer.ask_id))
          )
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [session, asks])

  useEffect(() => {
    async function loadStories() {
      const data = await fetchStories()
      setStories(data)
    }

    loadStories()
  }, [])

  useEffect(() => {
    if (!session) return

    const channel = supabase
      .channel("messages-realtime")
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
        },
        (payload) => {
          setMessages((current) => {
            const alreadyExists = current.some((msg) => msg.id === payload.new.id)
            if (alreadyExists) return current
            return [...current, payload.new]
          })
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [session])

  async function getProfileById(userId) {
    const { data, error } = await fetchProfileById(userId)

    if (error) {
      console.error("Error fetching profile:", error)
      return null
    }

    return data
  }

  async function handleProfileClick(userId, fallbackName = "Anonymous") {
    if (!userId) return

    const clickedProfile = await getProfileById(userId)

    setSelectedProfile(
      clickedProfile || {
        id: userId,
        nickname: fallbackName,
      }
    )
  }

  useEffect(() => {
    async function fetchProfile() {
      if (!session) {
        setProfile(null)
        return
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single()

      if (error) {
        console.error("Error fetching profile:", error)
        return
      }

      setProfile(data)
    }

    fetchProfile()
  }, [session])

  useEffect(() => {
    async function fetchSelectedProfileOffers() {
      if (!selectedProfile) {
        setSelectedProfileOffers([])
        return
      }

      const { data, error } = await fetchProfileOffers(
        selectedProfile.id
      )

      if (error) {
        console.error("Error fetching profile offers:", error)
        return
      }

      setSelectedProfileOffers(data)
    }

    fetchSelectedProfileOffers()
  }, [selectedProfile])

  useEffect(() => {
    if (!session) {
      setMyAsks([])
      return
    }

    const mine = asks.filter((ask) => ask.user_id === session.user.id)
    setMyAsks(mine)
  }, [session, asks])

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

  async function handleAskSubmit(event) {
    event.preventDefault()
    console.log("SUBMIT CLICKED")

    const trimmedTitle = askForm.title.trim()
    const trimmedBody = askForm.body.trim()

    if (!trimmedTitle || !trimmedBody) {
      setAskStatus("Please add a title and tell people what you want.")
      return
    }

    if (trimmedTitle.length > 80) {
      setAskStatus("Ask title must be 80 characters or fewer.")
      return
    }

    if (trimmedBody.length > 500) {
      setAskStatus("Ask description must be 500 characters or fewer.")
      return
    }

    if (!session?.user?.id) {
      setAskStatus("You must be logged in to post an ask.")
      return
    }

    const { error } = await createAsk({
      userId: session.user.id,
      title: trimmedTitle,
      body: trimmedBody,
      category: askForm.category,
      askerName: profile?.nickname || "Anonymous",
    })

    if (error) {
      setAskStatus(`Could not save ask: ${error.message}`)
      return
    }

    setAskForm({
      title: "",
      category: "Simple Joy",
      body: "",
    })

    setAskStatus("Your ask was added.")
  }

  async function handleSaveAskEdit(askId) {
    if (!editAskForm.title.trim() || !editAskForm.body.trim()) {
      setStatus("Please add a title and details.")
      return
    }

    const { error } = await updateAsk({
      askId,
      userId: session.user.id,
      title: editAskForm.title.trim(),
      body: editAskForm.body.trim(),
    })

    if (error) {
      console.error(error)
      setStatus("Could not save your changes.")
      return
    }

    setAsks((current) =>
      current.map((ask) =>
        ask.id === askId
          ? {
            ...ask,
            title: editAskForm.title.trim(),
            body: editAskForm.body.trim(),
          }
          : ask
      )
    )

    setEditingAskId(null)
    setEditAskForm({
      title: "",
      body: "",
    })

    setStatus("Your ask was updated.")
  }

  async function handleDeleteAsk(askId) {
    const confirmed = window.confirm(
      "Are you sure you want to permanently delete this ask and all related offers, messages, and gratitude?"
    )

    if (!confirmed) return

    const { error } = await deleteAskCascade(askId)

    if (error) {
      console.error("Error deleting ask:", error)
      setStatus(`Could not delete ask: ${error.message}`)
      return
    }

    setAsks((current) =>
      current.filter((ask) => ask.id !== askId)
    )

    setMyAsks((current) =>
      current.filter((ask) => ask.id !== askId)
    )

    setOffersForMyAsks((current) =>
      current.filter((offer) => offer.ask_id !== askId)
    )

    setAllOffers((current) =>
      current.filter((offer) => offer.ask_id !== askId)
    )

    setStories((current) =>
      current.filter((story) => story.ask_id !== askId)
    )

    setExpandedAskId(null)

    setStatus("Ask deleted.")
  }

  async function handleSaveOfferEdit(offerId) {
    const trimmedMessage = editOfferForm.helper_message.trim()

    if (!trimmedMessage) {
      setStatus("Please add offer details.")
      return
    }

    const { error } = await updateOfferMessage({
      offerId,
      userId: session.user.id,
      helperMessage: trimmedMessage,
    })

    if (error) {
      console.error(error)
      setStatus("Could not save your changes.")
      return
    }

    setMyHelpOffers((current) =>
      current.map((offer) =>
        offer.id === offerId
          ? { ...offer, helper_message: trimmedMessage }
          : offer
      )
    )

    setEditingOfferId(null)
    setEditOfferForm({ helper_message: "" })
    setStatus("Your offer was updated.")
  }

  async function handleWithdrawOffer(offerId) {
    const { error } = await withdrawOffer({
      offerId,
      userId: session.user.id,
    })

    if (error) {
      console.error("Error withdrawing offer:", error)
      setStatus("Could not withdraw offer.")
      return
    }

    setMyHelpOffers((current) =>
      current.filter((offer) => offer.id !== offerId)
    )

    setOffersForMyAsks((current) =>
      current.filter((offer) => offer.id !== offerId)
    )

    setAllOffers((current) =>
      current.filter((offer) => offer.id !== offerId)
    )

    setStatus("Offer withdrawn.")
  }

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

    setHelpForm({ helperMessage: "" })
    setHelpStatus("Offer sent!")

    setIsHelpOpen(false)
    setSelectedAsk(null)
  }

  async function handleAcceptOffer(offerId, askId) {
    const { error } = await acceptOffer({
      offerId,
      askId,
    })

    if (error) {
      console.error("Error accepting offer:", error)
      return
    }

    setOffersForMyAsks((current) =>
      current.map((offer) => {
        if (offer.id === offerId) {
          return { ...offer, status: "accepted" }
        }

        if (offer.ask_id === askId && offer.status === "pending") {
          return { ...offer, status: "declined" }
        }

        return offer
      })
    )
  }

  async function handleDeclineOffer(offerId) {
    console.log("DECLINE CLICKED", offerId)

    const { error } = await declineOffer(offerId)

    if (error) {
      console.error("Error declining offer:", error)
      return
    }

    console.log("DECLINE SUCCESS", offerId)

    setOffersForMyAsks((current) =>
      current.map((offer) =>
        offer.id === offerId
          ? { ...offer, status: "declined" }
          : offer
      )
    )
  }

  async function handleFulfillOffer(offerId) {
    const askId = offersForMyAsks.find(
      (o) => o.id === offerId
    )?.ask_id

    const { error } = await fulfillOffer({
      offerId,
      askId,
    })

    if (error) {
      console.error("Error fulfilling offer:", error)
      return
    }

    setOffersForMyAsks((current) =>
      current.map((offer) =>
        offer.id === offerId
          ? { ...offer, status: "fulfilled" }
          : offer
      )
    )

    setAllOffers((current) =>
      current.map((offer) =>
        offer.id === offerId
          ? { ...offer, status: "fulfilled" }
          : offer
      )
    )
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

  async function handleGratitudeSubmit(event) {
    event.preventDefault()

    const trimmedBody = gratitudeForm.body.trim()

    if (!trimmedBody) {
      return
    }

    const helper = offersForMyAsks.find(
      (o) => o.ask_id === gratitudeAskId && o.status === "fulfilled"
    )

    const { data, error } = await createStory({
      askId: gratitudeAskId,
      userId: session.user.id,
      title:
        asks.find((ask) => ask.id === gratitudeAskId)?.title ||
        "Gratitude",
      body: trimmedBody,
      helperName: helper?.helper_name || "Someone",
      helperUserId: helper?.user_id || null,
    })

    if (error) {
      console.error("Error saving gratitude:", error)
      return
    }

    setStories((current) => [
      data,
      ...current,
    ])

    setGratitudeForm({
      body: "",
    })
    setIsGratitudeOpen(false)
    setGratitudeAskId(null)
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

  async function handleSaveStoryEdit(storyId) {
    const trimmedTitle = editStoryForm.title.trim()
    const trimmedBody = editStoryForm.body.trim()

    if (!trimmedTitle || !trimmedBody) {
      setStatus("Please add a title and gratitude message.")
      return
    }

    const { error } = await updateStory({
      storyId,
      userId: session.user.id,
      title: trimmedTitle,
      body: trimmedBody,
    })

    if (error) {
      console.error("Error updating gratitude:", error)
      setStatus("Could not update gratitude.")
      return
    }

    setStories((current) =>
      current.map((story) =>
        story.id === storyId
          ? {
            ...story,
            title: trimmedTitle,
            body: trimmedBody,
          }
          : story
      )
    )

    setEditingStoryId(null)
    setEditStoryForm({
      title: "",
      body: "",
    })

    setStatus("Gratitude updated.")
  }

  async function handleDeleteStory(storyId) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this gratitude?"
    )

    if (!confirmed) return

    const { error } = await deleteStory({
      storyId,
      userId: session.user.id,
    })

    if (error) {
      console.error("Error deleting gratitude:", error)
      setStatus("Could not delete gratitude.")
      return
    }

    setStories((current) =>
      current.filter((story) => story.id !== storyId)
    )

    setEditingStoryId(null)
    setEditStoryForm({
      title: "",
      body: "",
    })

    setStatus("Gratitude deleted.")
  }

  async function handleLogout() {
    await supabase.auth.signOut()
  }

  async function handleAvatarUpload(file) {
    const { publicUrl, error } = await uploadAvatar({
      file,
      userId: session.user.id,
      supabase,
    })

    if (error) {
      console.error("Avatar upload error:", error)
      setProfileStatus(`Could not upload avatar: ${error.message}`)
      return
    }

    if (!publicUrl) return

    setProfile((current) => ({
      ...current,
      avatar_url: publicUrl,
    }))

    setProfileStatus("Avatar uploaded. Click Save Profile to keep it.")
  }

  async function handleSaveProfile() {
    const trimmedNickname = (profile?.nickname || "").trim()
    const selectedTheme = profile?.theme || "emerald"
    const avatarUrl = (profile?.avatar_url || "").trim()

    if (!trimmedNickname) {
      setProfileStatus("Nickname cannot be empty.")
      return
    }

    const { error } = await updateProfile({
      userId: session.user.id,
      nickname: trimmedNickname,
      theme: selectedTheme,
      avatarUrl,
    })

    if (error) {
      setProfileStatus("Could not update profile.")
      return
    }

    const { error: syncError } = await syncProfileDisplayName({
      userId: session.user.id,
      nickname: trimmedNickname,
    })

    if (syncError) {
      setProfileStatus("Profile saved, but display name sync failed.")
      return
    }

    localStorage.setItem("ask-and-receive-theme", selectedTheme)
    setProfileStatus("Profile updated.")
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

  if (isAppLoading) {
    return (
      <div className={`min-h-screen flex items-center justify-center ${activeTheme.primaryText}`}>
        Loading Ask & Receive...
      </div>
    )
  }

  return (
    <ThemeProvider activeTheme={activeTheme}>
      <div
        className={`min-h-screen ${activeTheme.primaryText} bg-cover bg-center bg-fixed`}
        style={{
          backgroundImage: `
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
