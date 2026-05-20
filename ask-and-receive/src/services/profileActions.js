export async function uploadAvatar({
  file,
  userId,
  supabase,
}) {
  if (!file) {
    return {
      publicUrl: null,
      error: null,
    }
  }

  const fileExt = file.name.split(".").pop()
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