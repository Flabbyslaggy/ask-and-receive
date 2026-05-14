import { supabase } from "../supabaseClient"

export async function fetchStories() {
  const { data, error } = await supabase
    .from("stories")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching stories:", error)
    return []
  }

  return data
}

export async function createStory({
  askId,
  userId,
  title,
  body,
  helperName,
  helperUserId,
}) {
  const { data, error } = await supabase
    .from("stories")
    .insert([
      {
        ask_id: askId,
        user_id: userId,
        title,
        body,
        helper_name: helperName,
        helper_user_id: helperUserId,
      },
    ])
    .select("*")
    .single()

  return { data, error }
}

export async function updateStory({ storyId, userId, title, body }) {
  const { error } = await supabase
    .from("stories")
    .update({
      title,
      body,
    })
    .eq("id", storyId)
    .eq("user_id", userId)

  return { error }
}

export async function deleteStory({ storyId, userId }) {
  const { error } = await supabase
    .from("stories")
    .delete()
    .eq("id", storyId)
    .eq("user_id", userId)

  return { error }
}