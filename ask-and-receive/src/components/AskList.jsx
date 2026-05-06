import { useTheme } from "../ThemeContext"

function AskCard({ ask, onHelpClick, activeTheme }) {
  return (
    <div className="p-6 rounded-2xl bg-stone-900/60 backdrop-blur border border-stone-800">
      <div className="flex items-center justify-between gap-3">
        <span
          className={`rounded-full border px-3 py-1 text-xs ${activeTheme.accentBorder} ${activeTheme.accentText}`}
        >
          {ask.category}
        </span>

        <span className="text-xs text-stone-400">by {ask.asker}</span>
      </div>

      <h3 className="mt-4 text-xl font-medium">{ask.title}</h3>

      <p className="mt-3 text-stone-300 leading-7">{ask.body}</p>

      <div className="mt-4">
        {ask.isFulfilled ? (
          <div
            className={`inline-block rounded-xl border px-4 py-2 text-sm font-medium ${activeTheme.badge}`}
          >
            Fulfilled
          </div>
        ) : ask.isOwnAsk ? (
          <div className="inline-block rounded-xl border border-stone-700 px-4 py-2 text-sm text-stone-400">
            Your Ask
          </div>
        ) : ask.hasMyOffer ? (
          <div className="inline-block rounded-xl border border-stone-700 px-4 py-2 text-sm text-stone-400">
            Offer Sent
          </div>
        ) : (
          <button
            onClick={() => onHelpClick(ask)}
            className={`rounded-2xl bg-gradient-to-r ${activeTheme.button} px-4 py-2 font-medium text-stone-950 transition`}
          >
            I Can Help
          </button>
        )}
      </div>
    </div>
  )
}

function AskSection({ title, asks, onHelpClick, activeTheme }) {
  if (asks.length === 0) return null

  return (
    <div>
      <div className="mb-3 text-lg font-semibold text-white">{title}</div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {asks.map((ask) => (
          <AskCard
            key={ask.id}
            ask={ask}
            onHelpClick={onHelpClick}
            activeTheme={activeTheme}
          />
        ))}
      </div>
    </div>
  )
}

export default function AskList({ asks, onHelpClick, isLoading }) {
  const activeTheme = useTheme()

  const openAsks = asks.filter(
    (ask) => !ask.isFulfilled && !ask.hasAnyOffer
  )

  const pendingAsks = asks.filter(
    (ask) => !ask.isFulfilled && ask.hasAnyOffer
  )

  const fulfilledAsks = asks.filter(
    (ask) => ask.isFulfilled
  )

  return (
    <section id="asks" className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-3xl font-semibold">Asks</h2>
          <p className="mt-3 text-stone-300 leading-7 max-w-2xl">
            Browse open asks, asks that already have offers, and fulfilled asks.
          </p>
        </div>

        <div className="rounded-2xl border border-stone-800 bg-stone-900/50 px-4 py-3 text-sm text-stone-300">
          {asks.length} ask{asks.length === 1 ? "" : "s"} posted
        </div>
      </div>

      {isLoading ? (
        <div className="mt-6 text-stone-400">Loading asks...</div>
      ) : asks.length === 0 ? (
        <div className="mt-6 rounded-3xl border border-dashed border-stone-700 bg-stone-900/50 backdrop-blur p-8 text-stone-300">
          No asks yet. Add the first one above, then share the page and invite
          people to contribute.
        </div>
      ) : (
        <div className="mt-6 space-y-10">
          <AskSection
            title="Open Asks"
            asks={openAsks}
            onHelpClick={onHelpClick}
            activeTheme={activeTheme}
          />

          <AskSection
            title="Asks With Offers"
            asks={pendingAsks}
            onHelpClick={onHelpClick}
            activeTheme={activeTheme}
          />

          <AskSection
            title="Fulfilled Asks"
            asks={fulfilledAsks}
            onHelpClick={onHelpClick}
            activeTheme={activeTheme}
          />
        </div>
      )}
    </section>
  )
}