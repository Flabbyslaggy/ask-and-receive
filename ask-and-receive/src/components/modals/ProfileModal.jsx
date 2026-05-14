import { useTheme } from "../../ThemeContext"

export default function ProfileModal({
  selectedProfile,
  selectedProfileOffers,
  asks,
  onClose,
  onReportClick,
}) {
  const postedAsks = asks.filter((ask) => ask.user_id === selectedProfile.id)
  const activeTheme = useTheme()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className={`relative z-10 w-full max-w-md rounded-3xl border ${activeTheme.cardBorder} ${activeTheme.modalBg} p-6 shadow-2xl backdrop-blur`}>
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-4">
              {selectedProfile.avatar_url ? (
                <img
                  src={selectedProfile.avatar_url}
                  alt="User avatar"
                  className="h-16 w-16 rounded-full border border-stone-700 object-cover"
                />
              ) : (
                <div className="flex h-16 w-16 items-center justify-center rounded-full border border-stone-700 bg-stone-800 text-xl text-stone-400">
                  ?
                </div>
              )}

              <div>
                <div className="text-2xl font-semibold text-white">
                  {selectedProfile.nickname || "Anonymous"}
                </div>
              </div>
            </div>
            <div className="text-sm text-stone-400">
              Community member
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-full border border-stone-700 px-3 py-1 text-sm hover:bg-stone-800 transition"
          >
            Close
          </button>
        </div>

        <div className="mt-4 space-y-2 text-sm text-stone-300">
          <div>
            <span className="text-stone-400">Asks posted:</span>{" "}
            {postedAsks.length}
          </div>

          <div>
            <span className="text-stone-400">Help offers made:</span>{" "}
            {selectedProfileOffers.length}
          </div>

          <div className="mt-4">
            <div className="mb-2 text-sm text-stone-400">Asks Posted</div>

            {postedAsks.slice(0, 3).map((ask) => (
              <div
                key={ask.id}
                className={`mb-2 rounded-xl border ${activeTheme.inputBorder} ${activeTheme.cardBg} px-3 py-2 text-sm text-stone-200`}
              >
                {ask.title}
              </div>
            ))}

            {postedAsks.length === 0 && (
              <div className="text-sm text-stone-500">
                No asks yet
              </div>
            )}
          </div>
        </div>

        <div className="pt-4">
          <button
            onClick={onReportClick}
            className="rounded-xl border border-red-400/30 px-3 py-2 text-sm text-red-300 hover:bg-red-400/10 transition"
          >
            Report User
          </button>
        </div>
      </div>
    </div>
  )
}
