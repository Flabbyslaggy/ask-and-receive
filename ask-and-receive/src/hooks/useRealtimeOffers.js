import { useEffect } from "react"
import { supabase } from "../supabaseClient"

export function useRealtimeOffers({
    session,
    asks,
    setAllOffers,
    setMyHelpOffers,
    setOffersForMyAsks,
}) {
    useEffect(() => {
        if (!session) return

        const channel = supabase
            .channel("help-offers-realtime")
            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "help_offers",
                },
                async () => {
                    const { data, error } = await supabase
                        .from("help_offers")
                        .select("*")

                    if (error) {
                        console.error("Error refreshing help offers:", error)
                        return
                    }

                    setAllOffers(data)

                    setMyHelpOffers(
                        data.filter((offer) => offer.user_id === session.user.id)
                    )

                    const myAskIds = asks
                        .filter((ask) => ask.user_id === session.user.id)
                        .map((ask) => ask.id)

                    setOffersForMyAsks(
                        data.filter((offer) => myAskIds.includes(offer.ask_id))
                    )
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [session, asks, setAllOffers, setMyHelpOffers, setOffersForMyAsks])
}