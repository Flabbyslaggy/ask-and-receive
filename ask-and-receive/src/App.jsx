import { useEffect, useState } from "react"
import { supabase } from "./supabaseClient"
import Auth from "./components/Auth"
import oceanBg from "./assets/ocean-bg.jpg"
import Header from "./components/Header"
import Hero from "./components/Hero"
import StoriesSection from "./components/StoriesSection"
import AskForm from "./components/AskForm"
import AskList from "./components/AskList"
import HelpModal from "./components/HelpModal"

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
  const [asks, setAsks] = useState([])
  const [status, setStatus] = useState("")
  const [myHelpOffers, setMyHelpOffers] = useState([])
  const [expandedHelpOfferId, setExpandedHelpOfferId] = useState(null)
  const [expandedAskId, setExpandedAskId] = useState(null)
  const [expandedMessagesOfferId, setExpandedMessagesOfferId] = useState(null)
  const [helpStatus, setHelpStatus] = useState("")
  const [offersForMyAsks, setOffersForMyAsks] = useState([])
  const [myAsks, setMyAsks] = useState([])
  const [messages, setMessages] = useState([])
  const [messageInputs, setMessageInputs] = useState({})
  const [activeView, setActiveView] = useState("home")
  const [stories, setStories] = useState([])
  const [isGratitudeOpen, setIsGratitudeOpen] = useState(false)
  const [gratitudeAskId, setGratitudeAskId] = useState(null)
  const [profile, setProfile] = useState(null)
  const [profileStatus, setProfileStatus] = useState("")
  const [askStatus, setAskStatus] = useState("")
  const [askForm, setAskForm] = useState({
    title: "",
    category: "Simple Joy",
    body: "",
  })
  const [gratitudeForm, setGratitudeForm] = useState({
    title: "",
    body: "",
  })

  useEffect(() => {
    async function handleSession(session) {
      setSession(session)

      if (!session) return

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
    }

    supabase.auth.getSession().then(({ data }) => {
      handleSession(data.session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  useEffect(() => {
    async function fetchAsks() {
      const { data, error } = await supabase
        .from("asks")
        .select("id, user_id, asker_name, title, category, body, created_at").select("*")
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
    }

    fetchAsks()
  }, [])

  useEffect(() => {
    async function fetchMyHelpOffers() {
      if (!session) return

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

  useEffect(() => {
    try {
      const savedAsks = localStorage.getItem(ASK_STORAGE_KEY)
      if (savedAsks) {
        setAsks(JSON.parse(savedAsks))
      }
    } catch (error) {
      console.error("Could not load asks from localStorage:", error)
    }
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(ASK_STORAGE_KEY, JSON.stringify(asks))
    } catch (error) {
      console.error("Could not save asks to localStorage:", error)
    }
  }, [asks])

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

    const trimmedTitle = gratitudeForm.title.trim()
    const trimmedBody = gratitudeForm.body.trim()

    if (!trimmedTitle || !trimmedBody) {
      return
    }

    const helper = offersForMyAsks.find(
      (o) => o.ask_id === gratitudeAskId && o.status === "fulfilled"
    )

    const { error } = await supabase.from("stories").insert([
      {
        ask_id: gratitudeAskId,
        user_id: session.user.id,
        title: trimmedTitle,
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
        title: trimmedTitle,
        body: trimmedBody,
        created_at: new Date().toISOString(),
      },
      ...current,
    ])

    setGratitudeForm({
      title: "",
      body: "",
    })
    setIsGratitudeOpen(false)
    setGratitudeAskId(null)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
  }

  function handleClearSavedData() {
    setAsks([])
    localStorage.removeItem(ASK_STORAGE_KEY)
    setStatus("Saved asks cleared.")
  }
  const isRecoveryMode = window.location.hash.includes("type=recovery")

  if (!session || isRecoveryMode) {
    return <Auth />
  }

  return (
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

          <StoriesSection stories={stories} />

          <AskForm
            askForm={askForm}
            setAskForm={setAskForm}
            categories={categories}
            handleAskSubmit={handleAskSubmit}
            askStatus={askStatus}
          />

          <AskList
            asks={asks.map((ask) => ({
              ...ask,
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
          {myAsks.length > 0 ? (
            <section className="mx-auto mt-10 max-w-4xl px-6">
              <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-6 backdrop-blur">
                <h2 className="text-2xl font-semibold text-white">My Asks</h2>

                <div className="mt-4 grid gap-4">
                  {myAsks.map((ask) => {
                    const relatedOffers = offersForMyAsks.filter(
                      (offer) => offer.ask_id === ask.id
                    )
                    const isFulfilled = offersForMyAsks.some(
                      (offer) => offer.ask_id === ask.id && (offer.status === "fulfilled")
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
                            <div className="mb-4 flex justify-end">
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
                                  <div className="text-xl font-semibold text-white">
                                    {ask.title}
                                  </div>
                                </div>

                                <div>
                                  <div className="text-sm text-stone-400">Category</div>
                                  <div className="text-base text-stone-200">
                                    {ask.category}
                                  </div>
                                </div>

                                <div>
                                  <div className="text-sm text-stone-400">Asked on</div>
                                  <div className="text-base text-stone-200">
                                    {new Date(ask.created_at).toLocaleDateString()}
                                  </div>
                                </div>

                                <div>
                                  {isFulfilled ? (
                                    <div className="inline-block rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-200">
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
                                  <div className="text-sm text-stone-400">Request</div>
                                  <div className="text-base text-stone-200">
                                    {ask.body}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {relatedOffers.length > 0 && (
                              <div className="mt-6">
                                <div className="text-sm text-stone-400">Offers on this ask</div>

                                <div className="mt-3 space-y-3">
                                  {relatedOffers.map((offer) => (
                                    <div
                                      key={offer.id}
                                      className="rounded-2xl border border-stone-700 bg-stone-950/40 p-4"
                                    >
                                      <div className="grid gap-4 md:grid-cols-2">
                                        <div className="space-y-3">
                                          <div>
                                            <div className="text-sm text-stone-400">Helper</div>
                                            <div className="text-sm text-stone-300">
                                              {offer.helper_name || "Someone offered help"}
                                            </div>
                                          </div>

                                          <div>
                                            <div className="text-sm text-stone-400">Status</div>
                                            <div className="text-sm text-stone-200">
                                              {offer.status || "pending"}
                                            </div>
                                          </div>

                                          {offer.status === "fulfilled" &&
                                            !stories.some((s) => s.ask_id === offer.ask_id) && (
                                              <div className="flex gap-2">
                                                <button
                                                  onClick={() => {
                                                    setGratitudeAskId(offer.ask_id)
                                                    setIsGratitudeOpen(true)
                                                  }}
                                                  className="rounded-xl bg-emerald-300 px-3 py-1 text-sm font-semibold text-stone-950 hover:bg-emerald-200 transition"
                                                >
                                                  Share Gratitude
                                                </button>
                                              </div>
                                            )}

                                          {offer.status === "pending" && (
                                            <div className="flex gap-2">
                                              <button
                                                onClick={() => handleAcceptOffer(offer.id, offer.ask_id)}
                                                className="rounded-xl bg-green-500 px-3 py-1 text-sm font-semibold text-black hover:bg-green-400 transition"
                                              >
                                                Accept
                                              </button>

                                              <button
                                                onClick={() => handleDeclineOffer(offer.id)}
                                                className="rounded-xl bg-red-500 px-3 py-1 text-sm font-semibold text-black hover:bg-red-400 transition"
                                              >
                                                Decline
                                              </button>
                                            </div>
                                          )}

                                          {offer.status === "accepted" && (
                                            <div className="flex gap-2">
                                              <button
                                                onClick={() => handleFulfillOffer(offer.id)}
                                                className="rounded-xl bg-emerald-300 px-3 py-1 text-sm font-semibold text-stone-950 hover:bg-emerald-200 transition"
                                              >
                                                Fulfilled
                                              </button>
                                            </div>
                                          )}

                                        </div>

                                        <div className="space-y-4">
                                          <div>
                                            <div className="text-sm text-stone-400">Their Offer</div>
                                            <div className="mt-2 text-sm text-stone-200">
                                              {offer.helper_message}
                                            </div>
                                          </div>

                                          <div className="mt-6 rounded-2xl border border-stone-700 bg-stone-950/30 p-4">
                                            <div
                                              onClick={() =>
                                                setExpandedMessagesOfferId((current) =>
                                                  current === offer.id ? null : offer.id
                                                )
                                              }
                                              className="text-sm text-stone-400 cursor-pointer hover:text-white transition flex justify-between"
                                            >
                                              <span>
                                                Messages ({getMessagesForOffer(offer.id).length})
                                              </span>
                                              <span>
                                                {expandedMessagesOfferId === offer.id ? "−" : "+"}
                                              </span>
                                            </div>

                                            {expandedMessagesOfferId === offer.id && (
                                              <>
                                                <div className="mt-3 space-y-2 max-h-80 overflow-y-auto">
                                                  {getMessagesForOffer(offer.id).map((msg) => (
                                                    <div
                                                      key={msg.id}
                                                      className={`flex w-full ${msg.sender_user_id === session.user.id
                                                        ? "justify-end"
                                                        : "justify-start"
                                                        }`}
                                                    >
                                                      <div
                                                        className={`max-w-[75%] break-words rounded-2xl px-3 py-2 text-sm ${msg.sender_user_id === session.user.id
                                                          ? "bg-emerald-300 text-stone-950"
                                                          : "bg-stone-800/60 text-stone-200"
                                                          }`}
                                                      >
                                                        {msg.message_text}
                                                      </div>
                                                    </div>
                                                  ))}

                                                  {getMessagesForOffer(offer.id).length === 0 && (
                                                    <div className="text-sm text-stone-500">No messages yet</div>
                                                  )}
                                                </div>

                                                <div className="mt-4">
                                                  <input
                                                    type="text"
                                                    value={messageInputs[offer.id] || ""}
                                                    onChange={(e) =>
                                                      setMessageInputs((current) => ({
                                                        ...current,
                                                        [offer.id]: e.target.value,
                                                      }))
                                                    }
                                                    maxLength={300}
                                                    placeholder="Type a message..."
                                                    className="w-full rounded-xl border border-stone-700 bg-stone-900/80 px-3 py-2 text-sm text-stone-100 outline-none"
                                                  />

                                                  <button
                                                    onClick={() => handleSendMessage(offer.id)}
                                                    className="mt-2 rounded-xl bg-emerald-300 px-4 py-2 text-sm font-medium text-stone-950 hover:bg-emerald-200 transition"
                                                  >
                                                    Send
                                                  </button>
                                                </div>
                                              </>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
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
          ) : null}

          {myHelpOffers.length > 0 ? (
            <section className="mx-auto mt-10 max-w-4xl px-6">
              <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-6 backdrop-blur">
                <h2 className="text-2xl font-semibold text-white">My Help Offers</h2>

                <div className="mt-4 grid gap-4">
                  {myHelpOffers.map((offer) => (
                    <div key={offer.id}>
                      {expandedHelpOfferId !== offer.id ? (
                        <div
                          onClick={() =>
                            setExpandedHelpOfferId((current) =>
                              current === offer.id ? null : offer.id
                            )
                          }
                          className="cursor-pointer rounded-2xl border border-stone-800 bg-stone-900/60 px-4 py-3 hover:bg-stone-900/80 transition flex justify-between items-center"
                        >
                          <div>
                            <div className="text-sm text-stone-400">
                              {asks.find((a) => a.id === offer.ask_id)?.asker || "Unknown"}
                            </div>
                            <div className="text-base text-white font-medium">
                              {asks.find((a) => a.id === offer.ask_id)?.title || "Unknown ask"}
                            </div>
                          </div>

                          <div className="text-sm text-stone-300">
                            {offer.status || "pending"}
                          </div>
                        </div>
                      ) : (
                        <div className="rounded-3xl border border-stone-800 bg-stone-900/60 backdrop-blur p-6 shadow-lg">
                          <div className="mb-4 flex justify-end">
                            <button
                              onClick={() => setExpandedHelpOfferId(null)}
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
                                  {asks.find((a) => a.id === offer.ask_id)?.title || "Unknown ask"}
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
                                <div className="text-base text-stone-200">
                                  {asks.find((a) => a.id === offer.ask_id)?.asker || "Unknown person"}
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
                                  {asks.find((a) => a.id === offer.ask_id)?.body || "No ask text"}
                                </div>
                              </div>

                              <div>
                                <div className="text-sm text-stone-400">Your Offer</div>
                                <div className="text-base text-stone-200">
                                  {offer.helper_message}
                                </div>
                              </div>

                              <div className="mt-6 rounded-2xl border border-stone-700 bg-stone-950/30 p-4">
                                <div
                                  onClick={() =>
                                    setExpandedMessagesOfferId((current) =>
                                      current === offer.id ? null : offer.id
                                    )
                                  }
                                  className="text-sm text-stone-400 cursor-pointer hover:text-white transition flex justify-between"
                                >
                                  <span>
                                    Messages ({getMessagesForOffer(offer.id).length})
                                  </span>
                                  <span>
                                    {expandedMessagesOfferId === offer.id ? "−" : "+"}
                                  </span>
                                </div>

                                {expandedMessagesOfferId === offer.id && (
                                  <>
                                    <div className="mt-3 space-y-2 max-h-80 overflow-y-auto">
                                      {getMessagesForOffer(offer.id).map((msg) => (
                                        <div
                                          key={msg.id}
                                          className={`flex w-full ${msg.sender_user_id === session.user.id
                                            ? "justify-end"
                                            : "justify-start"
                                            }`}
                                        >
                                          <div
                                            className={`max-w-[75%] break-words rounded-2xl px-3 py-2 text-sm ${msg.sender_user_id === session.user.id
                                              ? "bg-emerald-300 text-stone-950"
                                              : "bg-stone-800/60 text-stone-200"
                                              }`}
                                          >
                                            {msg.message_text}
                                          </div>
                                        </div>
                                      ))}

                                      {getMessagesForOffer(offer.id).length === 0 && (
                                        <div className="text-sm text-stone-500">No messages yet</div>
                                      )}
                                    </div>

                                    <div className="mt-4">
                                      <input
                                        type="text"
                                        value={messageInputs[offer.id] || ""}
                                        onChange={(e) =>
                                          setMessageInputs((current) => ({
                                            ...current,
                                            [offer.id]: e.target.value,
                                          }))
                                        }
                                        maxLength={300}
                                        placeholder="Type a message..."
                                        className="w-full rounded-xl border border-stone-700 bg-stone-900/80 px-3 py-2 text-sm text-stone-100 outline-none"
                                      />

                                      <button
                                        onClick={() => handleSendMessage(offer.id)}
                                        className="mt-2 rounded-xl bg-emerald-300 px-4 py-2 text-sm font-medium text-stone-950 hover:bg-emerald-200 transition"
                                      >
                                        Send
                                      </button>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
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
                <div className="text-lg text-white mb-4">
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

                <button
                  onClick={async () => {
                    const trimmedNickname = (profile?.nickname || "").trim()

                    if (!trimmedNickname) {
                      setProfileStatus("Nickname cannot be empty.")
                      return
                    }

                    if (trimmedNickname.length > 30) {
                      setProfileStatus("Nickname must be 30 characters or fewer.")
                      return
                    }

                    const { error } = await supabase
                      .from("profiles")
                      .update({ nickname: trimmedNickname })
                      .eq("id", session.user.id)

                    if (error) {
                      setProfileStatus("Could not update nickname.")
                      return
                    }

                    setProfile((current) => ({
                      ...current,
                      nickname: trimmedNickname,
                    }))
                    setProfileStatus("Nickname updated.")
                  }}
                  className="mt-3 rounded-xl bg-emerald-300 px-4 py-2 text-stone-950 hover:bg-emerald-200 transition"
                >
                  Save
                </button>

                {profileStatus ? (
                  <div
                    className={`mt-3 rounded-2xl px-4 py-3 text-sm ${profileStatus.includes("Could not")
                      ? "border border-red-400/30 bg-red-400/10 text-red-200"
                      : "border border-emerald-400/30 bg-emerald-400/10 text-emerald-100"
                      }`}
                  >
                    {profileStatus}
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
                <span className="text-stone-300">Title</span>
                <input
                  type="text"
                  value={gratitudeForm.title}
                  onChange={(event) =>
                    setGratitudeForm((current) => ({
                      ...current,
                      title: event.target.value,
                    }))
                  }
                  className="rounded-2xl border border-stone-700 bg-stone-950/80 px-4 py-3 text-stone-100 outline-none"
                />
              </label>

              <label className="grid gap-2 text-sm">
                <span className="text-stone-300">Gratitude</span>
                <textarea
                  rows={5}
                  value={gratitudeForm.body}
                  onChange={(event) =>
                    setGratitudeForm((current) => ({
                      ...current,
                      body: event.target.value,
                    }))
                  }
                  className="rounded-3xl border border-stone-700 bg-stone-950/80 px-4 py-3 text-stone-100 outline-none"
                />
              </label>
              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  className="rounded-2xl bg-emerald-300 px-5 py-3 font-medium text-stone-950 hover:bg-emerald-200 transition"
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

      <HelpModal
        isOpen={isHelpOpen}
        selectedAsk={selectedAsk}
        helpForm={helpForm}
        setHelpForm={setHelpForm}
        handleHelpSubmit={handleHelpSubmit}
        helpStatus={helpStatus}
        onClose={() => {
          setIsHelpOpen(false)
          setSelectedAsk(null)
        }}
      />
    </div >
  )
}