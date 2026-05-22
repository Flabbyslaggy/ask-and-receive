import { useTheme } from "../ThemeContext"

export default function Header({ activeView, setActiveView, profile }) {
  const activeTheme = useTheme()

  return (
    <header className={`relative border-b ${activeTheme.headerBorder} ${activeTheme.headerBg} backdrop-blur`}>
      <div className="mx-auto max-w-6xl px-6 py-5 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className={`text-2xl md:text-3xl font-semibold tracking-tight ${activeTheme.primaryText}`}>
            Ask and Receive
          </div>

          <p className={`mt-1 text-sm md:text-base ${activeTheme.mutedText}`}>
            You have not, because you ask not.
          </p>

          {profile?.nickname ? (
            <p className={`mt-1 text-xs md:text-sm ${activeTheme.subtleText}`}>
              Signed in as {profile.nickname}
            </p>
          ) : null}
        </div>

        <nav className="flex items-center gap-3 text-sm flex-wrap">
          <button
            onClick={() => setActiveView("home")}
            className={`rounded-full border px-4 py-2 transition ${activeView === "home"
                ? `${activeTheme.accentBorder} ${activeTheme.accentBg} ${activeTheme.primaryText}`
                : `${activeTheme.mutedBorder} ${activeTheme.secondaryText} ${activeTheme.hoverSurface}`
              }`}
          >
            Home
          </button>

          <button
            onClick={() => setActiveView("dashboard")}
            className={`rounded-full border px-4 py-2 transition ${activeView === "dashboard"
                ? `${activeTheme.accentBorder} ${activeTheme.accentBg} ${activeTheme.primaryText}`
                : `${activeTheme.mutedBorder} ${activeTheme.secondaryText} ${activeTheme.hoverSurface}`
              }`}
          >
            Dashboard
          </button>

          <button
            onClick={() => setActiveView("profile")}
            className={`rounded-full border px-4 py-2 transition ${activeView === "profile"
                ? `${activeTheme.accentBorder} ${activeTheme.accentBg} ${activeTheme.primaryText}`
                : `${activeTheme.mutedBorder} ${activeTheme.secondaryText} ${activeTheme.hoverSurface}`
              }`}
          >
            My Profile
          </button>
        </nav>
      </div>
    </header>
  )
}