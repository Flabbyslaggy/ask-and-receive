import { themes } from "../../theme/themes"

export function useActiveTheme(profile) {
    const savedTheme = localStorage.getItem("ask-and-receive-theme")

    return (
        themes[profile?.theme || savedTheme || "emerald"] ||
        themes.emerald
    )
}