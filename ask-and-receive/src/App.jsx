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

async function handleAcceptOffer(offerId) {
  const { error } = await supabase
    .from("help_offers")
    .update({ status: "accepted" })
    .eq("id", offerId)

  if (error) {
    console.error("Error accepting offer:", error)
    return
  }

  setOffersForMyAsks((current) =>
    current.map((offer) =>
      offer.id === offerId
        ? { ...offer, status: "accepted" }
        : offer
    )
  )
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
        asks={asks}
        onHelpClick={handleHelpClick}
      />

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
                    <button
                      onClick={() => handleAcceptOffer(offer.id)}
                      className="mt-2 rounded-xl bg-green-500 px-3 py-1 text-sm font-semibold text-black hover:bg-green-400 transition"
                    >
                      Accept
                    </button>
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