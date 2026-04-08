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
      asker: ask.asker_name,
      title: ask.title,
      category: ask.category,
      body: ask.body,
    }))

    setAsks(formatted)
  }

  fetchAsks()
}, [])

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

  function handleHelpSubmit(event) {
    event.preventDefault()

    if (!helpForm.helperEmail.trim() || !helpForm.helperMessage.trim()) {
      setStatus("Please add your email and how you want to help.")
      return
    }

    console.log("Help interest submitted:", {
      ask: selectedAsk,
      helper: helpForm,
    })

    setHelpForm({
      helperName: "",
      helperEmail: "",
      helperMessage: "",
    })

    setIsHelpOpen(false)
    setSelectedAsk(null)
    setStatus("Your offer to help was submitted.")
  }

async function handleLogout() {
  await supabase.auth.signOut()
}

  function handleClearSavedData() {
    setAsks([])
    localStorage.removeItem(ASK_STORAGE_KEY)
    setStatus("Saved asks cleared.")
  }
if (!session) {
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