export default function HelpModal({
  isOpen,
  selectedAsk,
  helpForm,
  setHelpForm,
  handleHelpSubmit,
  onClose,
}) {
  if (!isOpen || !selectedAsk) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative z-10 w-full max-w-2xl rounded-3xl border border-stone-800 bg-stone-900/90 backdrop-blur p-6 md:p-8 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-3xl font-semibold">Help an Ask Happen</h2>
            <p className="mt-3 text-stone-300 leading-7">
              You’re responding to{" "}
              <span className="font-medium text-white">{selectedAsk.title}</span>
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-stone-700 px-3 py-1 text-sm hover:bg-stone-800 transition"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleHelpSubmit} className="mt-8 grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-2 text-sm">
              <span className="text-stone-300">Your name or username</span>
              <input
                type="text"
                value={helpForm.helperName}
                onChange={(event) =>
                  setHelpForm((current) => ({
                    ...current,
                    helperName: event.target.value,
                  }))
                }
                placeholder="Optional"
                className="rounded-2xl border border-stone-700 bg-stone-950/80 px-4 py-3 text-stone-100 outline-none placeholder:text-stone-500 focus:border-emerald-300/60"
              />
            </label>

            <label className="grid gap-2 text-sm">
              <span className="text-stone-300">Email</span>
              <input
                type="email"
                value={helpForm.helperEmail}
                onChange={(event) =>
                  setHelpForm((current) => ({
                    ...current,
                    helperEmail: event.target.value,
                  }))
                }
                placeholder="you@example.com"
                className="rounded-2xl border border-stone-700 bg-stone-950/80 px-4 py-3 text-stone-100 outline-none placeholder:text-stone-500 focus:border-emerald-300/60"
              />
            </label>
          </div>

          <label className="grid gap-2 text-sm">
            <span className="text-stone-300">How do you want to help?</span>
            <textarea
              rows={5}
              value={helpForm.helperMessage}
              onChange={(event) =>
                setHelpForm((current) => ({
                  ...current,
                  helperMessage: event.target.value,
                }))
              }
              placeholder="Tell us what you can offer."
              className="rounded-3xl border border-stone-700 bg-stone-950/80 px-4 py-3 text-stone-100 outline-none placeholder:text-stone-500 focus:border-emerald-300/60"
            />
          </label>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              className="rounded-2xl bg-emerald-300 text-stone-950 px-5 py-3 font-medium hover:bg-emerald-200 transition"
            >
              Submit Help Interest
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-2xl border border-stone-700 px-5 py-3 hover:bg-stone-900/80 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}