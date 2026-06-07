import {
  uploadAvatar,
  updateProfile,
  syncProfileDisplayName,
} from "../../services/profileService"

export function useProfileActions({
    session,
    profile,
    setProfile,
    setProfileStatus,
}) {

    async function handleAvatarUpload(file) {
        const { publicUrl, error } = await uploadAvatar({
            file,
            userId: session.user.id,
        })

        if (error) {
            console.error("Avatar upload error:", error)
            setProfileStatus(`Could not upload avatar: ${error.message}`)
            return
        }

        if (!publicUrl) return

        setProfile((current) => ({
            ...current,
            avatar_url: publicUrl,
        }))

        setProfileStatus("Avatar uploaded. Click Save Profile to keep it.")
    }

    async function handleSaveProfile() {
        const trimmedNickname = (profile?.nickname || "").trim()
        const selectedTheme = profile?.theme || "emerald"
        const avatarUrl = (profile?.avatar_url || "").trim()

        if (!trimmedNickname) {
            setProfileStatus("Nickname cannot be empty.")
            return
        }

        const { error } = await updateProfile({
            userId: session.user.id,
            nickname: trimmedNickname,
            theme: selectedTheme,
            avatarUrl,
        })

        if (error) {
            setProfileStatus("Could not update profile.")
            return
        }

        const { error: syncError } = await syncProfileDisplayName({
            userId: session.user.id,
            nickname: trimmedNickname,
        })

        if (syncError) {
            setProfileStatus("Profile saved, but display name sync failed.")
            return
        }

        localStorage.setItem("ask-and-receive-theme", selectedTheme)
        setProfileStatus("Profile updated.")
    }
      return {
    handleAvatarUpload,
    handleSaveProfile,
  }
}