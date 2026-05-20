export default function GratitudeModal({
  gratitudeForm,
  setGratitudeForm,
  onSubmit,
  onClose,
  activeTheme,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className={`relative z-10 w-full max-w-2xl rounded-3xl border ${activeTheme.cardBorder} ${activeTheme.modalBg} p-6 shadow-2xl backdrop-blur md:p-8`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className={`text-3xl font-semibold ${activeTheme.primaryText}`}>
              Share Gratitude
            </h2>
            <p className={`mt-3 ${activeTheme.secondaryText} leading-7`}>
              Share what happened and what it meant.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className={`rounded-full border ${activeTheme.mutedBorder} px-3 py-1 text-sm transition ${activeTheme.hoverSurface}`}
          >
            Close
          </button>
        </div>

        <form onSubmit={onSubmit} className="mt-8 grid gap-4">
          <label className="grid gap-2 text-sm">
            <span className={`${activeTheme.subtleText}`}>Gratitude</span>
            <textarea
              rows={5}
              value={gratitudeForm.body}
              maxLength={500}
              onChange={(event) =>
                setGratitudeForm((current) => ({
                  ...current,
                  body: event.target.value,
                }))
              }
              className={`rounded-3xl border ${activeTheme.inputBorder} ${activeTheme.inputBg} px-4 py-3 ${activeTheme.primaryText} outline-none`}
            />
            <div
              className={`text-right text-xs ${
                500 - gratitudeForm.body.length <= 10
                  ? "text-red-400"
                  : `${activeTheme.secondaryText}`
              }`}
            >
              {500 - gratitudeForm.body.length} characters left
            </div>
          </label>

          <div className="flex gap-3 pt-2">
            <button
              type="submit"
              className={`rounded-2xl bg-gradient-to-r ${activeTheme.button} px-4 py-2 font-medium ${activeTheme.buttonText} transition`}
            >
              Share Gratitude
            </button>

            <button
              type="button"
              onClick={onClose}
              className={`rounded-2xl border ${activeTheme.mutedBorder} px-5 py-3 transition ${activeTheme.hoverSurface}`}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
