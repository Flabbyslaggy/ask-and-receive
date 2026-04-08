export default function AskForm({
  askForm,
  setAskForm,
  categories,
  handleAskSubmit,
}) {
  return (
    <section id="post-ask" className="mx-auto max-w-4xl px-6 py-12">
      <div className="rounded-3xl border border-stone-800 bg-stone-900/60 backdrop-blur p-6 md:p-8">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-3xl font-semibold">Post an Ask</h2>
            <p className="mt-3 text-stone-300 leading-7 max-w-2xl">
              This is the part you can share with friends. Have them add real
              asks so you can start shaping the site with live content.
            </p>
          </div>
          <a
            href="#asks"
            className="rounded-2xl border border-stone-700 px-4 py-2 text-sm hover:bg-stone-900/80 transition"
          >
            Jump to Asks
          </a>
        </div>

        <form onSubmit={handleAskSubmit} className="mt-8 grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm">
              <span className="text-stone-300">Your name or username</span>
              <input
                type="text"
                value={askForm.askerName}
                onChange={(event) =>
                  setAskForm((current) => ({
                    ...current,
                    askerName: event.target.value,
                  }))
                }
                placeholder="Optional"
                className="rounded-2xl border border-stone-700 bg-stone-950/80 px-4 py-3 text-stone-100 outline-none placeholder:text-stone-500 focus:border-emerald-300/60"
              />
            </label>

            <label className="grid gap-2 text-sm">
              <span className="text-stone-300">Category</span>
              <select
                value={askForm.category}
                onChange={(event) =>
                  setAskForm((current) => ({
                    ...current,
                    category: event.target.value,
                  }))
                }
                className="rounded-2xl border border-stone-700 bg-stone-950/80 px-4 py-3 text-stone-100 outline-none focus:border-emerald-300/60"
              >
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <label className="grid gap-2 text-sm">
            <span className="text-stone-300">Ask title</span>
            <input
              type="text"
              value={askForm.title}
              onChange={(event) =>
                setAskForm((current) => ({
                  ...current,
                  title: event.target.value,
                }))
              }
              placeholder="Example: Ride on a Boat at Sunrise"
              className="rounded-2xl border border-stone-700 bg-stone-950/80 px-4 py-3 text-stone-100 outline-none placeholder:text-stone-500 focus:border-emerald-300/60"
            />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="text-stone-300">What do you want, and why?</span>
            <textarea
              rows={5}
              value={askForm.body}
              onChange={(event) =>
                setAskForm((current) => ({
                  ...current,
                  body: event.target.value,
                }))
              }
              placeholder="Say it plainly. No sob story needed."
              className="rounded-3xl border border-stone-700 bg-stone-950/80 px-4 py-3 text-stone-100 outline-none placeholder:text-stone-500 focus:border-emerald-300/60"
            />
          </label>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              className="rounded-2xl bg-emerald-300 text-stone-950 px-5 py-3 font-medium hover:bg-emerald-200 transition"
            >
              Add This Ask
            </button>
            <button
              type="button"
              onClick={() =>
                setAskForm({
                  askerName: "",
                  title: "",
                  category: "Simple Joy",
                  body: "",
                })
              }
              className="rounded-2xl border border-stone-700 px-5 py-3 hover:bg-stone-900/80 transition"
            >
              Clear
            </button>
          </div>
        </form>
      </div>
    </section>
  )
}