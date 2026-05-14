import { useTheme } from "../ThemeContext"

export default function AskForm({
  askForm,
  setAskForm,
  categories,
  handleAskSubmit,
  askStatus,
}) {
  const activeTheme = useTheme()
  
  return (
    <section id="post-ask" className="mx-auto max-w-4xl px-6 py-12">
      <div className={`rounded-3xl border ${activeTheme.cardBorder} ${activeTheme.cardBg} backdrop-blur p-6 md:p-8`}>
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
              <span className="text-stone-300">Category</span>
              <select
                value={askForm.category}
                onChange={(event) =>
                  setAskForm((current) => ({
                    ...current,
                    category: event.target.value,
                  }))
                }
                className={`rounded-2xl border ${activeTheme.inputBorder} ${activeTheme.inputBg} px-4 py-3 text-stone-100 outline-none focus:ring-2 ${activeTheme.ring}`}
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
              maxLength={80}
              onChange={(event) =>
                setAskForm((current) => ({
                  ...current,
                  title: event.target.value,
                }))
              }
              placeholder="Example: Ride on a Boat at Sunrise"
              className={`rounded-2xl border ${activeTheme.inputBorder} ${activeTheme.inputBg} px-4 py-3 text-stone-100 outline-none focus:ring-2 ${activeTheme.ring}`}
            />
            <div
              className={`text-right text-xs ${80 - askForm.title.length <= 10
                ? "text-red-400"
                : "text-stone-400"
                }`}
            >
              {80 - askForm.title.length} characters left
            </div>
          </label>

          <label className="grid gap-2 text-sm">
            <span className="text-stone-300">What do you want, and why?</span>
            <textarea
              rows={5}
              value={askForm.body}
              maxLength={500}
              onChange={(event) =>
                setAskForm((current) => ({
                  ...current,
                  body: event.target.value,
                }))
              }
              placeholder="Say it plainly. No sob story needed."
              className={`rounded-2xl border ${activeTheme.inputBorder} ${activeTheme.inputBg} px-4 py-3 text-stone-100 outline-none focus:ring-2 ${activeTheme.ring}`}
            />
            <div
              className={`text-right text-xs ${500 - askForm.body.length <= 10 ? "text-red-400" : "text-stone-400"
                }`}
            >
              {500 - askForm.body.length} characters left
            </div>
          </label>

          <div className="flex flex-wrap gap-3 pt-2">

            {askStatus ? (
              <div
                className={`mb-3 rounded-2xl px-4 py-3 text-sm ${askStatus.includes("Could not") ||
                    askStatus.includes("must") ||
                    askStatus.includes("Please")
                    ? "border border-red-400/30 bg-red-400/10 text-red-200"
                    : `${activeTheme.accentBorder} ${activeTheme.accentBg} ${activeTheme.accentText}`
                  }`}
              >
                {askStatus}
              </div>
            ) : null}

            <button
              type="submit"
              className={`rounded-2xl ${activeTheme.solidButton} text-stone-950 px-5 py-3 font-medium transition`}
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