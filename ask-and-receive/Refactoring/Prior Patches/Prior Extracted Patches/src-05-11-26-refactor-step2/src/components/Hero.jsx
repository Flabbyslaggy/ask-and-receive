import { useTheme } from "../ThemeContext"

export default function Hero({ status, onClearSavedData }) {
  const activeTheme = useTheme()

  return (
    <section className="mx-auto max-w-6xl px-6 pt-16 pb-12">
      <div className="max-w-4xl">
        <h1 className="text-4xl md:text-6xl font-semibold tracking-tight leading-tight">
          A place where people say what they’ve always wanted… and sometimes
          someone says yes.
        </h1>

        <p className="mt-4 text-stone-300 max-w-2xl leading-7">
          Honest asks. Real generosity. No drama. Just moments.
        </p>

        <div className="mt-6 flex flex-wrap gap-3">
          <a
            href="#post-ask"
            className={`rounded-2xl bg-gradient-to-r ${activeTheme.solidButton} text-stone-950 px-5 py-3 font-medium transition`}
          >
            Add an Ask
          </a>

          <a
            href="#asks"
            className="rounded-2xl border border-stone-700 px-5 py-3 hover:bg-stone-900/80 transition"
          >
            Browse Asks
          </a>

        </div>

        {status ? (
          <div className="mt-6 rounded-2xl border ${activeTheme.accentBorder} ${activeTheme.accentBg} ${activeTheme.accentText}">
            {status}
          </div>
        ) : null}
      </div>
    </section>
  )
}