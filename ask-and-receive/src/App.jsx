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
  const [offersForMyAsks, setOffersForMyAsks] = useState([])
  const [myAsks, setMyAsks] = useState([])
  const [messages, setMessages] = useState([])
  const [messageInputs, setMessageInputs] = useState({})
  const [askForm, setAskForm] = useState({
    askerName: "",
    title: "",
    category: "Simple Joy",
    body: "",
  })

useEffect(() => {
  supabase.auth.getSession().then(({ data }) => {
    setSession(data.session)
  })

  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    setSession(session)
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
  if (!session) {
    setMyAsks([])
    return
  }

  const mine = asks.filter((ask) => ask.user_id === session.user.id)
  setMyAsks(mine)
}, [session, asks])

  const [helpForm, setHelpForm] = useState({
    helperName: "",
    helperEmail: "",
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

  if (!askForm.title.trim() || !askForm.body.trim()) {
    setStatus("Please add a title and tell people what you want.")
    return
  }

  const { error } = await supabase.from("asks").insert([
    {
      user_id: session.user.id,
      title: askForm.title.trim(),
      body: askForm.body.trim(),
      category: askForm.category,
      asker_name: askForm.askerName.trim() || "Anonymous",
    },
  ])

  if (error) {
    setStatus(`Could not save ask: ${error.message}`)
    return
  }

  setAskForm({
    askerName: "",
    title: "",
    category: "Simple Joy",
    body: "",
  })

  setStatus("Your ask was added.")
}

  function handleHelpClick(ask) {
    setSelectedAsk(ask)
    setIsHelpOpen(true)
  }

async function handleHelpSubmit(event) {
  event.preventDefault()

  if (!helpForm.helperEmail.trim() || !helpForm.helperMessage.trim()) {
    setStatus("Please add your email and how you want to help.")
    return
  }

  const { error } = await supabase.from("help_offers").insert([
    {
      ask_id: selectedAsk.id,
      user_id: session.user.id,
      helper_name: helpForm.helperName.trim() || "Anonymous",
      helper_email: helpForm.helperEmail.trim(),
      helper_message: helpForm.helperMessage.trim(),
    },
  ])

  if (error) {
    setStatus(`Could not send help offer: ${error.message}`)
    return
  }

  setHelpForm({
    helperName: "",
    helperEmail: "",
    helperMessage: "",
  })

  setIsHelpOpen(false)
  setSelectedAsk(null)
  setStatus("Your offer to help was submitted.")
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

function getMessagesForOffer(offerId) {
  return messages.filter((msg) => msg.offer_id === offerId)
}

async function handleDeclineOffer(offerId) {
  const { error } = await supabase
    .from("help_offers")
    .update({ status: "declined" })
    .eq("id", offerId)

  if (error) {
    console.error("Error declining offer:", error)
    return
  }

  setOffersForMyAsks((current) =>
    current.map((offer) =>
      offer.id === offerId
        ? { ...offer, status: "declined" }
        : offer
    )
  )
}

async function handleSendMessage(offerId) {
  const messageText = messageInputs[offerId]?.trim() || ""
  if (!messageText) return

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

  setMessages((current) => [
    ...current,
    {
      id: Date.now(),
      offer_id: offerId,
      sender_user_id: session.user.id,
      message_text: messageText,
      created_at: new Date().toISOString(),
    },
  ])

  setMessageInputs((current) => ({
  ...current,
  [offerId]: "",
}))
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
      <Header />
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
      <Hero
        status={status}
        onClearSavedData={handleClearSavedData}
      />

      <StoriesSection stories={sampleStories} />

      <AskForm
        askForm={askForm}
        setAskForm={setAskForm}
        categories={categories}
        handleAskSubmit={handleAskSubmit}
      />

      <AskList
        asks={asks.map((ask) => ({
          ...ask,
          isFulfilled: offersForMyAsks.some(
            (offer) => offer.ask_id === ask.id && offer.status === "accepted"
          ),
        }))}
        onHelpClick={handleHelpClick}
      />

{myAsks.length > 0 ? (
  <section className="mx-auto mt-10 max-w-4xl px-6">
    <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-6 backdrop-blur">
      <h2 className="text-2xl font-semibold text-white">My Asks</h2>

      <div className="mt-4 grid gap-4">
        {myAsks.map((ask) => {
           const isFulfilled = offersForMyAsks.some(
            (offer) => offer.ask_id === ask.id && offer.status === "accepted"
           )

          return (
            <div
            key={ask.id}
            className="rounded-3xl border border-stone-800 bg-stone-900/60 backdrop-blur p-6 shadow-lg"
          >
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
          <div
            key={offer.id}
            className="rounded-3xl border border-stone-800 bg-stone-900/60 backdrop-blur p-6 shadow-lg"
          >
            <div className="grid gap-6 md:grid-cols-2">

              {/* LEFT SIDE (2x2 GRID) */}
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
                <div>
                  <div className="text-sm text-stone-400 mt-4">Messages</div>

                  <div className="mt-2 space-y-2">
                    {getMessagesForOffer(offer.id).map((msg) => (
                      <div
                        key={msg.id}
                        className={`flex ${
                          msg.sender_user_id === session.user.id
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${
                            msg.sender_user_id === session.user.id
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
                </div>
                <input
                  type="text"
                  value={messageInputs[offer.id] || ""}
                  onChange={(e) =>
                    setMessageInputs((current) => ({
                      ...current,
                      [offer.id]: e.target.value,
                    }))
                  }
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
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
) : null}

{offersForMyAsks.length > 0 ? (
  <section className="mx-auto mt-10 max-w-4xl px-6">
    <div className="rounded-3xl border border-stone-800 bg-stone-900/60 p-6 backdrop-blur">
      <h2 className="text-2xl font-semibold text-white">Offers for My Asks</h2>

      <div className="mt-4 grid gap-4">
        {offersForMyAsks.map((offer) => (
          <div
            key={offer.id}
            className="rounded-3xl border border-stone-800 bg-stone-900/60 backdrop-blur p-6 shadow-lg"
          >
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
                  <div className="text-sm text-stone-400">Helper</div>
                  <div className="text-base text-stone-200">
                    {offer.helper_name}
                  </div>
                </div>

                <div>
                  <div className="text-sm text-stone-400">Status</div>
                  <div className="text-base text-stone-200">
                    {offer.status || "pending"}
                  </div>

                  {offer.status === "pending" && (
                    <div className="mt-2 flex gap-2">
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
                  <div className="text-sm text-stone-400">Their Offer</div>
                  <div className="text-base text-stone-200">
                    {offer.helper_message}
                  </div>
                </div>
              <div>
                <div className="text-sm text-stone-400 mt-4">Messages</div>

                <div className="mt-2 space-y-2">
                 {getMessagesForOffer(offer.id).map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender_user_id === session.user.id
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[75%] rounded-2xl px-3 py-2 text-sm ${
                        msg.sender_user_id === session.user.id
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
                <input
                  type="text"
                  value={messageInputs[offer.id] || ""}
                  onChange={(e) =>
                    setMessageInputs((current) => ({
                      ...current,
                      [offer.id]: e.target.value,
                    }))
                  }
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
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
) : null}

      <HelpModal
        isOpen={isHelpOpen}
        selectedAsk={selectedAsk}
        helpForm={helpForm}
        setHelpForm={setHelpForm}
        handleHelpSubmit={handleHelpSubmit}
        onClose={() => {
          setIsHelpOpen(false)
          setSelectedAsk(null)
        }}
      />
    </div>
  )
}