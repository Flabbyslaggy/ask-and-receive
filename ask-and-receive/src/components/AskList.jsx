export default function AskList({ asks, onHelpClick }) {
  return (
    <section id="asks" className="mx-auto max-w-6xl px-6 py-12">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-3xl font-semibold">Asks</h2>
          <p className="mt-3 text-stone-300 leading-7 max-w-2xl">
            The asks below are driven by the form. Add one, refresh the list,
            and start shaping the site with real voices.
          </p>
        </div>
        <div className="rounded-2xl border border-stone-800 bg-stone-900/50 px-4 py-3 text-sm text-stone-300">
          {asks.length} ask{asks.length === 1 ? "" : "s"} posted
        </div>
      </div>

      {asks.length === 0 ? (
        <div className="mt-6 rounded-3xl border border-dashed border-stone-700 bg-stone-900/50 backdrop-blur p-8 text-stone-300">
          No asks yet. Add the first one above, then share the page and invite
          people to contribute.
        </div>
      ) : (
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {asks.map((ask) => (
            <div
              key={ask.id}
              className="p-6 rounded-2xl bg-stone-900/60 backdrop-blur border border-stone-800"
            >
              <div className="flex items-center justify-between gap-3">
                <span className="rounded-full border border-stone-700 px-3 py-1 text-xs text-stone-300">
                  {ask.category}
                </span>
                <span className="text-xs text-stone-400">by {ask.asker}</span>
              </div>

              <h3 className="mt-4 text-xl font-medium">{ask.title}</h3>
              <p className="mt-3 text-stone-300 leading-7">{ask.body}</p>

              {ask.isFulfilled ? (
                <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-sm font-medium text-emerald-200">
                  Fulfilled
                </div>
              ) : (
                <button
                  onClick={() => onHelpClick(ask)}
                  className="rounded-2xl bg-emerald-300 px-4 py-2 font-medium text-stone-950 hover:bg-emerald-200 transition"
                >
                  I Can Help
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}