import { useEffect } from "react"
import { fetchAsks } from "../../services/askService"

export function useAskLoader({
    session,
    setAsks,
    setIsAppLoading,
}) {
    useEffect(() => {
        async function loadAsks() {
            if (!session) return

            const formatted = await fetchAsks()

            setAsks(formatted)
            setIsAppLoading(false)
        }

        loadAsks()
    }, [session, setAsks, setIsAppLoading])
}