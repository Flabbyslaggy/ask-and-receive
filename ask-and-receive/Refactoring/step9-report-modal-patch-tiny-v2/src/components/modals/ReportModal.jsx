export default function ReportModal({
  reportReason,
  setReportReason,
  reportStatus,
  onSubmit,
  onClose,
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-lg rounded-3xl border border-stone-800 bg-stone-900/90 p-6 shadow-2xl backdrop-blur">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-white">Report User</h2>

            <p className="mt-2 text-sm text-stone-300">
              Tell us why you are reporting this user.
            </p>
          </div>

          <button
            onClick={onClose}
            className="rounded-full border border-stone-700 px-3 py-1 text-sm hover:bg-stone-800 transition"
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
            className="w-full rounded-2xl border border-stone-700 bg-stone-950/80 px-4 py-3 text-stone-100 outline-none"
          />

          <div
            className={`mt-1 text-right text-xs ${
              500 - reportReason.length <= 10
                ? "text-red-400"
                : "text-stone-500"
            }`}
          >
            {500 - reportReason.length} characters left
          </div>

          {reportStatus && (
            <div className="mt-3 text-sm text-stone-300">{reportStatus}</div>
          )}

          <div className="mt-6 flex gap-3">
            <button
              onClick={onSubmit}
              className="rounded-2xl bg-red-500 px-4 py-2 font-medium text-black hover:bg-red-400 transition"
            >
              Submit Report
            </button>

            <button
              onClick={onClose}
              className="rounded-2xl border border-stone-700 px-4 py-2 hover:bg-stone-900/80 transition"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
