import { useEffect, useState } from "react"
import { supabase } from "./supabaseClient"
import Auth from "./components/Auth"
import oceanBg from "./assets/ocean-bg.jpg"
import Header from "./components/Header"
import Hero from "./components/Hero"
import { ThemeProvider } from "./ThemeContext"
import StoriesSection from "./components/StoriesSection"
import AskForm from "./components/AskForm"
import AskList from "./components/AskList"
import HelpModal from "./components/HelpModal"
import MyHelpOfferCard from "./components/dashboard/MyHelpOfferCard"
import MyAsksSection from "./components/dashboard/MyAsksSection"

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

const themes = {
  emerald: {
    button: "from-emerald-300 to-green-200 hover:from-emerald-200 hover:to-lime-100",
    solidButton: "bg-emerald-300 hover:bg-emerald-200",
    accentText: "text-emerald-300",
    accentBorder: "border-emerald-400/30",
    accentBg: "bg-emerald-400/10",
    badge: "border-emerald-500/30 bg-emerald-500/10 text-emerald-200",
    ring: "ring-emerald-300/40",
    logoGradientFrom: "#6ee7b7",
    logoGradientTo: "#22c55e",
  },
  ocean: {
    button: "from-cyan-400 to-blue-400 hover:from-cyan-300 hover:to-blue-300",
    solidButton: "bg-cyan-300 hover:bg-cyan-200",
    accentText: "text-cyan-300",
    accentBorder: "border-cyan-400/30",
    accentBg: "bg-cyan-400/10",
    badge: "border-cyan-500/30 bg-cyan-500/10 text-cyan-200",
    ring: "ring-cyan-300/40",
    logoGradientFrom: "#67e8f9",
    logoGradientTo: "#3b82f6",
  },
  purple: {
    button: "from-violet-400 to-fuchsia-400 hover:from-violet-300 hover:to-fuchsia-300",
    solidButton: "bg-violet-300 hover:bg-violet-200",
    accentText: "text-violet-300",
    accentBorder: "border-violet-400/30",
    accentBg: "bg-violet-400/10",
    badge: "border-violet-500/30 bg-violet-500/10 text-violet-200",
    ring: "ring-violet-300/40",
    logoGradientFrom: "#c4b5fd",
    logoGradientTo: "#d946ef",
  },
  rose: {
    button: "from-rose-400 to-pink-300 hover:from-rose-300 hover:to-pink-200",
    solidButton: "bg-rose-300 hover:bg-rose-200",
    accentText: "text-rose-300",
    accentBorder: "border-rose-400/30",
    accentBg: "bg-rose-400/10",
    badge: "border-rose-500/30 bg-rose-500/10 text-rose-200",
    ring: "ring-rose-300/40",
    logoGradientFrom: "#fda4af",
    logoGradientTo: "#ec4899",
  },
  amber: {
    button: "from-amber-300 to-orange-400 hover:from-amber-200 hover:to-orange-300",
    solidButton: "bg-amber-300 hover:bg-amber-200",
    accentText: "text-amber-300",
    accentBorder: "border-amber-400/30",
    accentBg: "bg-amber-400/10",
    badge: "border-amber-500/30 bg-amber-500/10 text-amber-200",
    ring: "ring-amber-300/40",
    logoGradientFrom: "#fde047",
    logoGradientTo: "#fb923c",
  },
}

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
    async function fetchAsks() {
      const { data, error } = await supabase
        .from("asks")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching asks:", error)
        return
      }

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
      setIsAppLoading(false)
    }

    fetchAsks()
  }, [])

  useEffect(() => {
    async function fetchMyHelpOffers() {
      if (!session) {
        setIsAppLoading(false)
        return
      }

      const { data, error } = await supabase
        .from("help_offers")
        .select("*")
        .eq("user_id", session.user.id)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching help offers:", error)
        return
      }

      setMyHelpOffers(data)
    }

    fetchMyHelpOffers()
  }, [session])

  useEffect(() => {
    async function fetchOffersForMyAsks() {
      if (!session || asks.length === 0) return

      const myAskIds = asks
        .filter((ask) => ask.user_id === session.user.id)
        .map((ask) => ask.id)

      if (myAskIds.length === 0) {
        setOffersForMyAsks([])
        return
      }

      const { data, error } = await supabase
        .from("help_offers")
        .select("*")
        .in("ask_id", myAskIds)
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching offers for my asks:", error)
        return
      }

      setOffersForMyAsks(data)
    }

    fetchOffersForMyAsks()
  }, [session, asks])

  useEffect(() => {
    async function fetchAllOffers() {
      const { data, error } = await supabase
        .from("help_offers")
        .select("*")

      if (error) {
        console.error("Error fetching all offers:", error)
        return
      }

      setAllOffers(data)
    }

    fetchAllOffers()
  }, [])

  useEffect(() => {
    async function fetchMessages() {
      if (!session) return

      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: true })

      if (error) {
        console.error("Error fetching messages:", error)
        return
      }

      setMessages(data)
      console.log("MESSAGES", data)
    }

    fetchMessages()
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
    async function fetchStories() {
      const { data, error } = await supabase
        .from("stories")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching stories:", error)
        return
      }

      setStories(data)
    }

    fetchStories()
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
    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .maybeSingle()

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

      const { data, error } = await supabase
        .from("help_offers")
        .select("*")
        .eq("user_id", selectedProfile.id)

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

    const { error } = await supabase.from("asks").insert([
      {
        user_id: session.user.id,
        title: trimmedTitle,
        body: trimmedBody,
        category: askForm.category,
        asker_name: profile?.nickname || "Anonymous",
      },
    ])

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

    const { error } = await supabase
      .from("asks")
      .update({
        title: editAskForm.title.trim(),
        body: editAskForm.body.trim(),
      })
      .eq("id", askId)
      .eq("user_id", session.user.id)

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

    const { error } = await supabase.rpc("delete_my_ask_cascade", {
      ask_id_input: askId,
    })

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

    const { error } = await supabase
      .from("help_offers")
      .update({
        helper_message: trimmedMessage,
      })
      .eq("id", offerId)
      .eq("user_id", session.user.id)

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
    const { error } = await supabase
      .from("help_offers")
      .delete()
      .eq("id", offerId)
      .eq("user_id", session.user.id)

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

    const { data: existingOffer, error: existingOfferError } = await supabase
      .from("help_offers")
      .select("id")
      .eq("ask_id", selectedAsk.id)
      .eq("user_id", session.user.id)
      .maybeSingle()

    if (existingOfferError) {
      setHelpStatus("Could not check your existing offers.")
      return
    }

    if (existingOffer) {
      setHelpStatus("You have already offered to help with this ask.")
      return
    }

    const { error } = await supabase.from("help_offers").insert([
      {
        ask_id: selectedAsk.id,
        user_id: session.user.id,
        helper_name: profile?.nickname || "Anonymous",
        helper_message: trimmedMessage,
      },
    ])

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
    const { error: acceptError } = await supabase
      .from("help_offers")
      .update({ status: "accepted" })
      .eq("id", offerId)

    if (acceptError) {
      console.error("Error accepting offer:", acceptError)
      return
    }

    const { error: declineError } = await supabase
      .from("help_offers")
      .update({ status: "declined" })
      .eq("ask_id", askId)
      .neq("id", offerId)
      .eq("status", "pending")

    if (declineError) {
      console.error("Error declining other offers:", declineError)
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

    const { error } = await supabase
      .from("help_offers")
      .update({ status: "declined" })
      .eq("id", offerId)

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
    const { error } = await supabase
      .from("help_offers")
      .update({ status: "fulfilled" })
      .eq("id", offerId)

    if (error) {
      console.error("Error fulfilling offer:", error)
      return
    }

    const { error: declineError } = await supabase
      .from("help_offers")
      .update({ status: "declined" })
      .eq("ask_id", (
        offersForMyAsks.find((o) => o.id === offerId)?.ask_id
      ))
      .neq("id", offerId)

    if (declineError) {
      console.error("Error declining other offers:", declineError)
    }

    setOffersForMyAsks((current) =>
      current.map((offer) =>
        offer.id === offerId
          ? { ...offer, status: "fulfilled" }
          : offer
      )
    )
  }

  function getMessagesForOffer(offerId) {
    return messages.filter((msg) => msg.offer_id === offerId)
  }

  async function handleSendMessage(offerId) {
    const messageText = (messageInputs[offerId] || "").trim()

    if (!messageText) return

    if (messageText.length > 300) {
      alert("Message must be 300 characters or fewer.")
      return
    }

    const { error } = await supabase.from("messages").insert([
      {
        offer_id: offerId,
        sender_user_id: session.user.id,
        message_text: messageText,
      },
    ])

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

    const { error } = await supabase.from("stories").insert([
      {
        ask_id: gratitudeAskId,
        user_id: session.user.id,
        title: asks.find((ask) => ask.id === gratitudeAskId)?.title || "Gratitude",
        body: trimmedBody,
        helper_name: helper?.helper_name || "Someone",
      },
    ])

    if (error) {
      console.error("Error saving gratitude:", error)
      return
    }

    setStories((current) => [
      {
        id: Date.now(),
        ask_id: gratitudeAskId,
        user_id: session.user.id,
        title: asks.find((ask) => ask.id === gratitudeAskId)?.title || "Gratitude",
        body: trimmedBody,
        created_at: new Date().toISOString(),
      },
      ...current,
    ])

    setGratitudeForm({
      body: "",
    })
    setIsGratitudeOpen(false)
    setGratitudeAskId(null)
  }

  async function handleSaveStoryEdit(storyId) {
    const trimmedTitle = editStoryForm.title.trim()
    const trimmedBody = editStoryForm.body.trim()

    if (!trimmedTitle || !trimmedBody) {
      setStatus("Please add a title and gratitude message.")
      return
    }

    const { error } = await supabase
      .from("stories")
      .update({
        title: trimmedTitle,
        body: trimmedBody,
      })
      .eq("id", storyId)
      .eq("user_id", session.user.id)

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

    const { error } = await supabase
      .from("stories")
      .delete()
      .eq("id", storyId)
      .eq("user_id", session.user.id)

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
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading Ask & Receive...
      </div>
    )
  }

  return (
    <ThemeProvider activeTheme={activeTheme}>
      <div
        className="min-h-screen text-white bg-cover bg-center bg-fixed"
        style={{
          backgroundImage: `
      linear-gradient(rgba(10,10,10,0.25), rgba(10,10,10,0.45)),
      url(${oceanBg})
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
              className="rounded-2xl border border-stone-700 px-4 py-2 hover:bg-stone-900/80 transition"
            >
              Log Out
            </button>
          </div>
        </div>
        {activeView === "home" && (
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
                hasAnyOffer: allOffers.some((offer) => offer.ask_id === ask.id),
                isFulfilled: offersForMyAsks.some(
                  (offer) => offer.ask_id === ask.id && (offer.status === "fulfilled")
                ),
              }))}
              onHelpClick={handleHelpClick}
            />
          </>
        )}
        {activeView === "dashboard" && (
          <>
            <MyAsksSection
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
              getMessagesForOffer={getMessagesForOffer}
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
            />

            {myHelpOffers.length > 0 ? (
              <section className="mx-auto mt-10 max-w-4xl px-6">
                <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-6 backdrop-blur">
                  <h2 className="text-2xl font-semibold text-white">My Help Offers</h2>

                  <div className="mt-4 grid gap-4">
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
                        onCollapse={() => setExpandedHelpOfferId(null)}
                        onProfileClick={handleProfileClick}
                        editingOfferId={editingOfferId}
                        setEditingOfferId={setEditingOfferId}
                        editOfferForm={editOfferForm}
                        setEditOfferForm={setEditOfferForm}
                        onSaveOfferEdit={handleSaveOfferEdit}
                        onWithdrawOffer={handleWithdrawOffer}
                        activeTheme={activeTheme}
                        messages={getMessagesForOffer(offer.id)}
                        isMessagesExpanded={expandedMessagesOfferId === offer.id}
                        onToggleMessages={() =>
                          setExpandedMessagesOfferId((current) =>
                            current === offer.id ? null : offer.id
                          )
                        }
                        currentUserId={session.user.id}
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
            ) : null}
          </>
        )
        }

        {
          activeView === "profile" && (
            <section className="mx-auto mt-10 max-w-3xl px-6">
              <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-6 backdrop-blur">
                <h2 className="text-2xl font-semibold text-white">Profile</h2>

                <div className="mt-4">
                  <div className="text-sm text-stone-400">Current nickname</div>
                  <div className="mb-4 text-lg text-white">
                    {profile?.nickname || "Anonymous"}
                  </div>

                  <input
                    type="text"
                    value={profile?.nickname || ""}
                    onChange={(e) =>
                      setProfile((current) => ({
                        ...current,
                        nickname: e.target.value,
                      }))
                    }
                    maxLength={30}
                    placeholder="Enter new nickname"
                    className="w-full rounded-xl border border-stone-700 bg-stone-900/80 px-4 py-2 text-stone-100 outline-none"
                  />

                  <div className="mt-4">
                    <div className="text-sm text-stone-400">Avatar image URL</div>

                    <input
                      type="text"
                      value={profile?.avatar_url || ""}
                      onChange={(e) =>
                        setProfile((current) => ({
                          ...current,
                          avatar_url: e.target.value,
                        }))
                      }
                      placeholder="Paste an image URL..."
                      className="mt-2 w-full rounded-xl border border-stone-700 bg-stone-900/80 px-4 py-2 text-stone-100 outline-none"
                    />

                    <label className={`mt-3 inline-flex cursor-pointer items-center rounded-xl bg-gradient-to-r ${activeTheme.button} px-4 py-2 text-sm font-medium text-stone-950 transition`}>
                      Upload avatar from device
                      <input
                        type="file"
                        accept="image/*"
                        onChange={async (e) => {
                          const file = e.target.files?.[0]
                          if (!file) return

                          const fileExt = file.name.split(".").pop()
                          const fileName = `${session.user.id}-${Date.now()}.${fileExt}`
                          const filePath = `${session.user.id}/${fileName}`

                          const { error: uploadError } = await supabase.storage
                            .from("avatars")
                            .upload(filePath, file)

                          if (uploadError) {
                            console.error("Avatar upload error:", uploadError)
                            setProfileStatus(`Could not upload avatar: ${uploadError.message}`)
                            return
                          }

                          const { data } = supabase.storage
                            .from("avatars")
                            .getPublicUrl(filePath)

                          setProfile((current) => ({
                            ...current,
                            avatar_url: data.publicUrl,
                          }))

                          setProfileStatus("Avatar uploaded. Click Save Profile to keep it.")
                        }}
                        className="hidden"
                      />
                    </label>

                    {profile?.avatar_url ? (
                      <img
                        src={profile.avatar_url}
                        alt="Profile avatar preview"
                        className="mt-4 h-20 w-20 rounded-full border border-stone-700 object-cover"
                      />
                    ) : null}
                  </div>

                  <div className="mt-6">
                    <div className="text-sm text-stone-400">Theme</div>

                    <select
                      value={profile?.theme || "emerald"}
                      onChange={(e) =>
                        setProfile((current) => ({
                          ...current,
                          theme: e.target.value,
                        }))
                      }
                      className="mt-2 w-full rounded-xl border border-stone-700 bg-stone-900/80 px-4 py-2 text-stone-100 outline-none"
                    >
                      <option value="emerald">Emerald</option>
                      <option value="ocean">Ocean</option>
                      <option value="purple">Purple</option>
                      <option value="rose">Rose</option>
                      <option value="amber">Amber</option>
                    </select>
                  </div>

                  <button
                    onClick={async () => {
                      const trimmedNickname = (profile?.nickname || "").trim()
                      const selectedTheme = profile?.theme || "emerald"
                      const avatarUrl = (profile?.avatar_url || "").trim()

                      if (!trimmedNickname) {
                        setProfileStatus("Nickname cannot be empty.")
                        return
                      }

                      const { error } = await supabase
                        .from("profiles")
                        .update({
                          nickname: trimmedNickname,
                          theme: selectedTheme,
                          avatar_url: avatarUrl,
                        })
                        .eq("id", session.user.id)

                      if (error) {
                        setProfileStatus("Could not update profile.")
                        return
                      }

                      await supabase
                        .from("asks")
                        .update({ asker_name: trimmedNickname })
                        .eq("user_id", session.user.id)

                      await supabase
                        .from("help_offers")
                        .update({ helper_name: trimmedNickname })
                        .eq("user_id", session.user.id)

                      await supabase
                        .from("stories")
                        .update({ helper_name: trimmedNickname })
                        .eq("user_id", session.user.id)

                      localStorage.setItem("ask-and-receive-theme", selectedTheme)
                      setProfileStatus("Profile updated.")
                    }}
                    className={`mt-6 rounded-xl bg-gradient-to-r ${activeTheme.button} px-4 py-2 text-stone-950 transition`}
                  >
                    Save Profile
                  </button>

                  {profileStatus ? (
                    <div className="mt-3">
                      <div
                        className={`inline-block rounded-lg border px-3 py-1 text-xs ${activeTheme.accentBorder} ${activeTheme.accentBg} ${activeTheme.accentText}`}
                      >
                        {profileStatus}
                      </div>
                    </div>
                  ) : null}
                </div>
              </div>
            </section>
          )
        }

        {isGratitudeOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => {
                setIsGratitudeOpen(false)
                setGratitudeAskId(null)
              }}
            />

            <div className="relative z-10 w-full max-w-2xl rounded-3xl border border-stone-800 bg-stone-900/90 p-6 shadow-2xl backdrop-blur md:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-3xl font-semibold">Share Gratitude</h2>
                  <p className="mt-3 text-stone-300 leading-7">
                    Share what happened and what it meant.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setIsGratitudeOpen(false)
                    setGratitudeAskId(null)
                  }}
                  className="rounded-full border border-stone-700 px-3 py-1 text-sm hover:bg-stone-800 transition"
                >
                  Close
                </button>
              </div>

              <form onSubmit={handleGratitudeSubmit} className="mt-8 grid gap-4">

                <label className="grid gap-2 text-sm">
                  <span className="text-stone-300">Gratitude</span>
                  <textarea
                    rows={5}
                    value={gratitudeForm.body}
                    maxLength={500}
                    onChange={(event) =>
                      setGratitudeForm((current) => ({
                        ...current,
                        body: event.target.value,
                      }))
                    }
                    className="rounded-3xl border border-stone-700 bg-stone-950/80 px-4 py-3 text-stone-100 outline-none"
                  />
                  <div
                    className={`text-right text-xs ${500 - gratitudeForm.body.length <= 10 ? "text-red-400" : "text-stone-500"
                      }`}
                  >
                    {500 - gratitudeForm.body.length} characters left
                  </div>
                </label>
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className={`rounded-2xl bg-gradient-to-r ${activeTheme.button} px-4 py-2 font-medium text-stone-950 transition`}
                  >
                    Share Gratitude
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setIsGratitudeOpen(false)
                      setGratitudeAskId(null)
                    }}
                    className="rounded-2xl border border-stone-700 px-5 py-3 hover:bg-stone-900/80 transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )
        }

        {selectedProfile && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setSelectedProfile(null)}
            />

            <div className="relative z-10 w-full max-w-md rounded-3xl border border-stone-800 bg-stone-900/90 p-6 shadow-2xl backdrop-blur">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-4">
                    {selectedProfile.avatar_url ? (
                      <img
                        src={selectedProfile.avatar_url}
                        alt="User avatar"
                        className="h-16 w-16 rounded-full border border-stone-700 object-cover"
                      />
                    ) : (
                      <div className="flex h-16 w-16 items-center justify-center rounded-full border border-stone-700 bg-stone-800 text-xl text-stone-400">
                        ?
                      </div>
                    )}

                    <div>
                      <div className="text-2xl font-semibold text-white">
                        {selectedProfile.nickname || "Anonymous"}
                      </div>

                      <div className="text-sm text-stone-400">
                        Community member
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-stone-400">
                    Community member
                  </div>
                </div>

                <button
                  onClick={() => setSelectedProfile(null)}
                  className="rounded-full border border-stone-700 px-3 py-1 text-sm hover:bg-stone-800 transition"
                >
                  Close
                </button>
              </div>

              <div className="mt-4 text-stone-300 text-sm space-y-2">
                <div>
                  <span className="text-stone-400">Asks posted:</span>{" "}
                  {asks.filter(a => a.user_id === selectedProfile.id).length}
                </div>

                <div>
                  <span className="text-stone-400">Help offers made:</span>{" "}
                  {selectedProfileOffers.length}
                </div>

                <div className="mt-4">
                  <div className="text-sm text-stone-400 mb-2">Asks Posted</div>

                  {asks
                    .filter(a => a.user_id === selectedProfile.id)
                    .slice(0, 3)
                    .map((ask) => (
                      <div
                        key={ask.id}
                        className="mb-2 rounded-xl border border-stone-700 px-3 py-2 text-sm text-stone-200"
                      >
                        {ask.title}
                      </div>
                    ))}

                  {asks.filter(a => a.user_id === selectedProfile.id).length === 0 && (
                    <div className="text-sm text-stone-500">
                      No asks yet
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={() => {
                    setIsReportOpen(true)
                    setReportReason("")
                    setReportStatus("")
                  }}
                  className="rounded-xl border border-red-400/30 px-3 py-2 text-sm text-red-300 hover:bg-red-400/10 transition"
                >
                  Report User
                </button>
              </div>
            </div>
          </div>
        )}

        {isReportOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setIsReportOpen(false)}
            />

            <div className="relative z-10 w-full max-w-lg rounded-3xl border border-stone-800 bg-stone-900/90 p-6 shadow-2xl backdrop-blur">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-semibold text-white">
                    Report User
                  </h2>

                  <p className="mt-2 text-sm text-stone-300">
                    Tell us why you are reporting this user.
                  </p>
                </div>

                <button
                  onClick={() => setIsReportOpen(false)}
                  className="rounded-full border border-stone-700 px-3 py-1 text-sm hover:bg-stone-800 transition"
                >
                  Close
                </button>
              </div>

              <div className="mt-6">
                <textarea
                  rows={5}
                  value={reportReason}
                  maxLength={500}
                  onChange={(e) => setReportReason(e.target.value)}
                  placeholder="Describe the issue..."
                  className="w-full rounded-2xl border border-stone-700 bg-stone-950/80 px-4 py-3 text-stone-100 outline-none"
                />

                <div
                  className={`mt-1 text-right text-xs ${500 - reportReason.length <= 10
                    ? "text-red-400"
                    : "text-stone-500"
                    }`}
                >
                  {500 - reportReason.length} characters left
                </div>

                {reportStatus && (
                  <div className="mt-3 text-sm text-stone-300">
                    {reportStatus}
                  </div>
                )}

                <div className="mt-6 flex gap-3">
                  <button
                    onClick={async () => {
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
                    }}
                    className="rounded-2xl bg-red-500 px-4 py-2 font-medium text-black hover:bg-red-400 transition"
                  >
                    Submit Report
                  </button>

                  <button
                    onClick={() => setIsReportOpen(false)}
                    className="rounded-2xl border border-stone-700 px-4 py-2 hover:bg-stone-900/80 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <HelpModal
          isOpen={isHelpOpen}
          selectedAsk={selectedAsk}
          helpForm={helpForm}
          setHelpForm={setHelpForm}
          handleHelpSubmit={handleHelpSubmit}
          helpStatus={helpStatus}
          onClose={() => setIsHelpOpen(false)}
        />
      </div>
    </ThemeProvider>
  )
}
