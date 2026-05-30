import { useEffect, useState } from "react"

const ACTIVE_VIEW_STORAGE_KEY = "ask-receive-active-view"

export function useActiveView() {
    const [activeView, setActiveView] = useState(() => {
        return localStorage.getItem(ACTIVE_VIEW_STORAGE_KEY) || "home"
    })

    useEffect(() => {
        localStorage.setItem(ACTIVE_VIEW_STORAGE_KEY, activeView)
    }, [activeView])

    return {
        activeView,
        setActiveView,
    }
}