import { supabase } from "../supabaseClient"

export async function fetchProfile(userId) {
    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle()

    return { data, error }
}

export async function fetchProfileOffers(userId) {
    const { data, error } = await supabase
        .from("help_offers")
        .select("*")
        .eq("user_id", userId)

    return { data, error }
}

export async function fetchProfileById(userId) {
    const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .maybeSingle()

    return { data, error }
}

export async function updateProfile({
    userId,
    nickname,
    theme,
    avatarUrl,
}) {
    const { error } = await supabase
        .from("profiles")
        .update({
            nickname,
            theme,
            avatar_url: avatarUrl,
        })
        .eq("id", userId)

    return { error }
}

export async function uploadAvatar({
    file,
    userId,
}) {
    if (!file) {
        return {
            publicUrl: null,
            error: null,
        }
    }

    const fileExt = file.name?.split(".").pop()?.toLowerCase() || "jpg"
    const fileName = `${userId}-${Date.now()}.${fileExt}`
    const filePath = `${userId}/${fileName}`

    const { error } = await supabase.storage
        .from("avatars")
        .upload(filePath, file)

    if (error) {
        return {
            publicUrl: null,
            error,
        }
    }

    const { data } = supabase.storage
        .from("avatars")
        .getPublicUrl(filePath)

    return {
        publicUrl: data.publicUrl,
        error: null,
    }
}

export async function syncProfileDisplayName({ userId, nickname }) {
    const { error: askError } = await supabase
        .from("asks")
        .update({ asker_name: nickname })
        .eq("user_id", userId)

    if (askError) return { error: askError }

    const { error: offerError } = await supabase
        .from("help_offers")
        .update({ helper_name: nickname })
        .eq("user_id", userId)

    if (offerError) return { error: offerError }

    const { error: storyError } = await supabase
        .from("stories")
        .update({ helper_name: nickname })
        .eq("user_id", userId)

    if (storyError) return { error: storyError }

    return { error: null }
}
