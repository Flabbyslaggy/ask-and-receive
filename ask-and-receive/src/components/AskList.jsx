import { useState } from "react"
import { useTheme } from "../ThemeContext"

function AskCard({
  ask,
  onHelpClick,
  activeTheme,
  isExpanded,
  onToggleExpanded,
}) {
  return (
    <div className={`p-6 rounded-2xl ${activeTheme.cardBg} backdrop-blur border ${activeTheme.cardBorder}`}>
      <div className="flex items-center justify-between gap-3">
        <span
          className={`rounded-full border px-3 py-1 text-xs ${activeTheme.accentBorder} ${activeTheme.accentText}`}
        >
          {ask.category}
        </span>

        <span className={`text-xs ${activeTheme.subtleText}`}>by {ask.asker}</span>
      </div>

      <h3 className={`mt-4 text-xl font-medium ${activeTheme.primaryText}`}>
        {ask.title}
      </h3>

      <button
        type="button"
        onClick={onToggleExpanded}
        className={`mt-4 text-sm transition ${activeTheme.subtleText} hover:opacity-80`}
      >
        {isExpanded ? "Hide details" : "View details"}
      </button>

      {isExpanded && (
        <div className={`mt-4 border-t ${activeTheme.mutedBorder} pt-4`}>
          <p className={`mt-3 leading-7 ${activeTheme.secondaryText}`}>{ask.body}</p>
          <div className="mt-4">
            {ask.isFulfilled ? (
              <div
                className={`inline-block rounded-xl border px-4 py-2 text-sm font-medium ${activeTheme.badge}`}
              >
                Fulfilled
              </div>
            ) : ask.isOwnAsk ? (
              <div className={`inline-block rounded-xl border ${activeTheme.mutedBorder} px-4 py-2 text-sm ${activeTheme.subtleText}`}>
                Your Ask
              </div>
            ) : ask.hasMyOffer ? (
              <div className={`inline-block rounded-xl border ${activeTheme.mutedBorder} px-4 py-2 text-sm ${activeTheme.subtleText}`}>
                Offer Sent
              </div>
            ) : (
              <button
                type="button"
                onClick={() => onHelpClick(ask)}
                className={`rounded-2xl bg-gradient-to-r ${activeTheme.button} px-4 py-2 font-medium ${activeTheme.buttonText} transition`}
              >
                I Can Help
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function AskSection({ title, asks, onHelpClick, activeTheme }) {
  const [expandedAskId, setExpandedAskId] = useState(null)

  const toggleAskExpanded = (askId) => {
    setExpandedAskId((currentId) => (currentId === askId ? null : askId))
  }

  if (asks.length === 0) return null

  return (
    <div>
      <div className={`mb-3 text-lg font-semibold ${activeTheme.primaryText}`}>
        {title}
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {asks.map((ask) => {
          const isExpanded = expandedAskId === ask.id

          return (
            <AskCard
              key={ask.id}
              ask={ask}
              onHelpClick={onHelpClick}
              activeTheme={activeTheme}
              isExpanded={isExpanded}
              onToggleExpanded={() => toggleAskExpanded(ask.id)}
            />
          )
        })}
      </div>
    </div>
  )
}

export default function AskList({ asks, onHelpClick, isLoading }) {
  const activeTheme = useTheme()

  const openAsks = asks.filter((ask) => ask.status === "open")
  const pendingAsks = asks.filter(
    (ask) => ask.status === "accepted" || ask.status === "pending"
  )
  const fulfilledAsks = asks.filter((ask) => ask.status === "fulfilled")
  return (
    
    <section id="asks" className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h2 className={`text-3xl font-semibold ${activeTheme.primaryText}`}>
            Asks
          </h2>

          <p className={`mt-3 leading-7 max-w-2xl ${activeTheme.secondaryText}`}>
            Browse open asks, asks that already have offers, and fulfilled asks.
          </p>
        </div>

        <div className={`rounded-2xl border ${activeTheme.cardBorder} ${activeTheme.sectionBg} px-4 py-3 text-sm ${activeTheme.mutedText}`}>
          {asks.length} ask{asks.length === 1 ? "" : "s"} posted
        </div>
      </div>

      {isLoading ? (
        <div className={`mt-6 ${activeTheme.subtleText}`}>Loading asks...</div>
      ) : asks.length === 0 ? (
        <div className={`mt-6 rounded-3xl border border-dashed ${activeTheme.inputBorder} ${activeTheme.sectionBg} backdrop-blur p-8 ${activeTheme.secondaryText}`}>
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