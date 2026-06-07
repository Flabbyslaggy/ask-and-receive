import { useEffect } from "react"
import { supabase } from "../../supabaseClient"
import { formatAsk } from "../../services/askService"

export function useRealtimeAsks(setAsks) {
    useEffect(() => {
        const channel = supabase
            .channel("asks-realtime")

            .on(
                "postgres_changes",
                {
                    event: "*",
                    schema: "public",
                    table: "asks",
                },
                async () => {
                    const { data, error } = await supabase
                        .from("asks")
                        .select("*")
                        .order("created_at", { ascending: false })

                    if (!error && data) {
                        const formatted = data.map(formatAsk)
                        setAsks(formatted)
                    }
                }
            )

            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [setAsks])
}