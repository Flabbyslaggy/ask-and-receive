import { useTheme } from "../../providers/ThemeContext"

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
                  className={`h-16 w-16 rounded-full border ${activeTheme.mutedBorder} object-cover`}
                />
              ) : (
                <div className={`flex h-16 w-16 items-center justify-center rounded-full border ${activeTheme.mutedBorder} ${activeTheme.sectionBg} text-xl ${activeTheme.subtleText}`}>
                  ?
                </div>
              )}

              <div>
                <div className={`text-2xl font-semibold ${activeTheme.primaryText}`}>
                  {selectedProfile.nickname || "Anonymous"}
                </div>
              </div>
            </div>

            <div className={`text-sm ${activeTheme.subtleText}`}>
              Community member
            </div>
          </div>

          <button
            onClick={onClose}
            className={`absolute right-4 top-4 rounded-full border ${activeTheme.mutedBorder} px-3 py-1 text-sm transition ${activeTheme.hoverSurface} ${activeTheme.secondaryText}`}
          >
            Close
          </button>
        </div>

        <div className={`mt-4 space-y-2 text-sm ${activeTheme.mutedText}`}>
          <div>
            <span className={`${activeTheme.subtleText}`}>Asks posted:</span>{" "}
            {postedAsks.length}
          </div>

          <div>
            <span className={`${activeTheme.subtleText}`}>Help offers made:</span>{" "}
            {selectedProfileOffers.length}
          </div>

          <div className="mt-4">
            <div className={`mb-2 text-sm ${activeTheme.subtleText}`}>Asks Posted</div>

            {postedAsks.slice(0, 3).map((ask) => (
              <div
                key={ask.id}
                className={`mb-2 rounded-xl border ${activeTheme.inputBorder} ${activeTheme.cardBg} px-3 py-2 text-sm ${activeTheme.secondaryText}`}
              >
                {ask.title}
              </div>
            ))}

            {postedAsks.length === 0 && (
              <div className={`text-sm ${activeTheme.secondaryText}`}>
                No asks yet
              </div>
            )}
          </div>
        </div>

        <div className="pt-4">
          <button
            onClick={onReportClick}
            className={`rounded-xl border ${activeTheme.dangerBorder} px-3 py-2 text-sm ${activeTheme.dangerText} hover:${activeTheme.dangerHover} transition`}
          >
            Report User
          </button>
        </div>
      </div>
    </div>
  )
}
