import { useTheme } from "../ThemeContext"

export default function HelpModal({
  isOpen,
  selectedAsk,
  helpForm,
  setHelpForm,
  handleHelpSubmit,
  helpStatus,
  onClose,
}) {
  const activeTheme = useTheme()
  if (!isOpen || !selectedAsk) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className={`relative z-10 w-full max-w-2xl rounded-3xl border ${activeTheme.cardBorder} ${activeTheme.modalBg} backdrop-blur p-6 md:p-8 shadow-2xl`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className={`text-3xl font-semibold ${activeTheme.primaryText}`}>
              Help an Ask Happen
            </h2>
            <p className={`mt-3 ${activeTheme.mutedText} leading-7`}>
              You’re responding to{" "}
              <span className={`font-medium ${activeTheme.primaryText}`}>{selectedAsk.title}</span>
            </p>
          </div>

          {helpStatus ? (
            <div
              className={`rounded-xl px-3 py-2 text-xs ${helpStatus.includes("Could not") ||
                helpStatus.includes("must") ||
                helpStatus.includes("Please")
                ? `border ${activeTheme.dangerBorder} ${activeTheme.dangerBg} ${activeTheme.dangerText}`
                : `${activeTheme.accentBorder} ${activeTheme.accentBg} ${activeTheme.accentText}`
                }`}
            >
              {helpStatus}
            </div>
          ) : null}

          <button
            type="button"
            onClick={onClose}
            className={`rounded-full border ${activeTheme.mutedBorder} px-3 py-1 text-sm transition ${activeTheme.hoverSurface}`}
          >
            Close
          </button>
        </div>

        <form onSubmit={handleHelpSubmit} className="mt-8 grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
          </div>
          <label className="grid gap-2 text-sm">
            <span className={`${activeTheme.mutedText}`}>How do you want to help?</span>
            <textarea
              rows={5}
              value={helpForm.helperMessage}
              maxLength={500}
              onChange={(event) =>
                setHelpForm((current) => ({
                  ...current,
                  helperMessage: event.target.value,
                }))
              }
              placeholder="Tell us what you can offer."
              className={`rounded-3xl border ${activeTheme.inputBorder} ${activeTheme.inputBg} px-4 py-3 ${activeTheme.primaryText} outline-none placeholder:opacity-60 focus:ring-2 ${activeTheme.ring}`}
            />
            <div
              className={`text-right text-xs ${500 - helpForm.helperMessage.length <= 10 ? `${activeTheme.dangerText}` : `${activeTheme.secondaryText}`
                }`}
            >
              {500 - helpForm.helperMessage.length} characters left
            </div>
          </label>

          <div className="flex flex-wrap gap-3 pt-2">
            <button
              type="submit"
              className={`rounded-2xl bg-gradient-to-r ${activeTheme.button} ${activeTheme.buttonText} px-5 py-3 font-medium transition`}
            >
              Submit Help Interest
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