export default function Header() {
  return (
    <header className="relative border-b border-stone-800/60 bg-stone-950/70 backdrop-blur">
      <div className="mx-auto max-w-6xl px-6 py-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="text-2xl md:text-3xl font-semibold tracking-tight">
            Ask and Receive
          </div>
          <p className="text-stone-400 mt-1 text-sm md:text-base">
            You have not, because you ask not.
          </p>
        </div>
        <nav className="flex items-center gap-3 text-sm flex-wrap">
          <a href="#stories" className="rounded-full border border-stone-700 px-4 py-2 hover:bg-stone-900/80 transition">
            Stories
          </a>
          <a href="#asks" className="rounded-full border border-stone-700 px-4 py-2 hover:bg-stone-900/80 transition">
            Asks
          </a>
          <a href="#post-ask" className="rounded-full border border-stone-700 px-4 py-2 hover:bg-stone-900/80 transition">
            Post an Ask
          </a>
          <a href="#help-form" className="rounded-full bg-emerald-300 text-stone-950 px-4 py-2 font-medium hover:bg-emerald-200 transition">
            I Can Help
          </a>
        </nav>
      </div>
    </header>
  )
}