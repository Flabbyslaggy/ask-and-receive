import { supabase } from "../supabaseClient"

export async function fetchAsks() {
  const { data, error } = await supabase
    .from("asks")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching asks:", error)
    return []
  }

  return data.map((ask) => ({
    id: ask.id,
    user_id: ask.user_id,
    asker: ask.asker_name,
    title: ask.title,
    category: ask.category,
    body: ask.body,
    created_at: ask.created_at,
  }))
}

export async function createAsk({ userId, title, body, category, askerName }) {
  const { error } = await supabase.from("asks").insert([
    {
      user_id: userId,
      title,
      body,
      category,
      asker_name: askerName,
    },
  ])

  return { error }
}

export async function updateAsk({ askId, userId, title, body }) {
  const { error } = await supabase
    .from("asks")
    .update({
      title,
      body,
    })
    .eq("id", askId)
    .eq("user_id", userId)

  return { error }
}

export async function deleteAskCascade(askId) {
  const { error } = await supabase.rpc("delete_my_ask_cascade", {
    ask_id_input: askId,
  })

  return { error }
}