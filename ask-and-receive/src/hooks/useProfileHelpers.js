import { fetchProfileById } from "../services/profileService"

export function useProfileHelpers({
    setSelectedProfile,
}) {

    async function getProfileById(userId) {
        const { data, error } = await fetchProfileById(userId)

        if (error) {
            console.error("Error fetching profile:", error)
            return null
        }

        return data
    }

    async function handleProfileClick(
        userId,
        fallbackName = "Anonymous"
    ) {
        if (!userId) return

        const clickedProfile = await getProfileById(userId)

        setSelectedProfile(
            clickedProfile || {
                id: userId,
                nickname: fallbackName,
            }
        )
    }

    return {
        handleProfileClick,
    }
}