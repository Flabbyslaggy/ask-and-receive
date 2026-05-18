import { useTheme } from "../../ThemeContext"

export default function ReportModal({
  reportReason,
  setReportReason,
  reportStatus,
  onSubmit,
  onClose,
}) {

  const activeTheme = useTheme()

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className={`relative z-10 w-full max-w-lg rounded-3xl border ${activeTheme.cardBorder} ${activeTheme.modalBg} p-6 shadow-2xl backdrop-blur`}>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className={`text-2xl font-semibold ${activeTheme.primaryText}`}>Report User</h2>

            <p className={`mt-2 text-sm ${activeTheme.mutedText}`}>
              Tell us why you are reporting this user.
            </p>
          </div>

          <button
            onClick={onClose}
            className={`rounded-full border ${activeTheme.mutedBorder} px-3 py-1 text-sm transition ${activeTheme.hoverSurface}`}
          >
            Close
          </button>
        </div>

        <div className="mt-6">
          <textarea
            rows={5}
            value={reportReason}
            maxLength={500}
            onChange={(e) => setReportReason(e.target.value)}
            placeholder="Describe the issue..."
            className={`w-full rounded-2xl border ${activeTheme.inputBorder} ${activeTheme.inputBg} px-4 py-3 ${activeTheme.primaryText} outline-none`}
          />

          <div
            className={`mt-1 text-right text-xs ${
              500 - reportReason.length <= 10
                ? `${activeTheme.dangerText}`
                : `${activeTheme.secondaryText}`
            }`}
          >
            {500 - reportReason.length} characters left
          </div>

          {reportStatus && (
            <div className={`mt-3 text-sm ${activeTheme.mutedText}`}>{reportStatus}</div>
          )}

          <div className="mt-6 flex gap-3">
            <button
              onClick={onSubmit}
              className={`rounded-2xl ${activeTheme.dangerBg} px-4 py-2 font-medium ${activeTheme.dangerText} hover:${activeTheme.dangerHover} transition`}
            >
              Submit Report
            </button>

            <button
              onClick={onClose}
              className={`rounded-2xl border ${activeTheme.mutedBorder} px-4 py-2 transition ${activeTheme.hoverSurface}`}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
