import { supabase } from "../supabaseClient"

export async function fetchMyHelpOffers(userId) {
    const { data, error } = await supabase
        .from("help_offers")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })

    if (error) {
        console.error("Error fetching help offers:", error)
        return []
    }

    return data
}

export async function fetchAllOffers() {
    const { data, error } = await supabase
        .from("help_offers")
        .select("*")

    if (error) {
        console.error("Error fetching all offers:", error)
        return []
    }

    return data
}

export async function fetchOffersForAskIds(askIds) {
    if (!askIds || askIds.length === 0) {
        return []
    }

    const { data, error } = await supabase
        .from("help_offers")
        .select("*")
        .in("ask_id", askIds)
        .order("created_at", { ascending: false })

    if (error) {
        console.error("Error fetching offers for my asks:", error)
        return []
    }

    return data
}