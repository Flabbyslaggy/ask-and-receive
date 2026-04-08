export default function Hero({ status, onClearSavedData }) {
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
            className="rounded-2xl bg-emerald-300 text-stone-950 px-5 py-3 font-medium hover:bg-emerald-200 transition"
          >
            Add an Ask
          </a>

          <a
            href="#asks"
            className="rounded-2xl border border-stone-700 px-5 py-3 hover:bg-stone-900/80 transition"
          >
            Browse Asks
          </a>

          <button
            type="button"
            onClick={onClearSavedData}
            className="rounded-2xl border border-stone-700 px-5 py-3 hover:bg-stone-900/80 transition"
          >
            Clear Saved Data
          </button>
        </div>

        {status ? (
          <div className="mt-6 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
            {status}
          </div>
        ) : null}
      </div>
    </section>
  )
}