import { supabase } from "../supabaseClient"

export async function fetchMessages() {
    const { data, error } = await supabase
        .from("messages")
        .select("*")
        .order("created_at", { ascending: true })

    if (error) {
        console.error("Error fetching messages:", error)
        return []
    }

    return data
}