import {
    createStory,
    updateStory,
    deleteStory,
} from "../../services/storyService"

export function useStoryActions({
    session,
    asks,
    offersForMyAsks,
    gratitudeAskId,
    gratitudeForm,
    setGratitudeForm,
    setIsGratitudeOpen,
    setGratitudeAskId,
    setStories,
    editStoryForm,
    setEditingStoryId,
    setEditStoryForm,
    setStatus,
}) {
    async function handleGratitudeSubmit(event) {
        event.preventDefault()

        const trimmedBody = gratitudeForm.body.trim()

        if (!trimmedBody) {
            return
        }

        const gratitudeAsk = asks.find((ask) => ask.id === gratitudeAskId)

        const helper = offersForMyAsks.find(
            (offer) => offer.id === gratitudeAsk?.fulfilled_offer_id
        )

        const { data, error } = await createStory({
            askId: gratitudeAskId,
            userId: session.user.id,
            title: gratitudeAsk?.title || "Gratitude",
            body: trimmedBody,
            helperName: helper?.helper_name || "Someone",
            helperUserId: helper?.user_id || null,
        })

        if (error) {
            console.error("Error saving gratitude:", error)
            return
        }

        setStories((current) => [
            data,
            ...current,
        ])

        setGratitudeForm({
            body: "",
        })

        setIsGratitudeOpen(false)
        setGratitudeAskId(null)
    }

    async function handleSaveStoryEdit(storyId) {
        const trimmedTitle = editStoryForm.title.trim()
        const trimmedBody = editStoryForm.body.trim()

        if (!trimmedTitle || !trimmedBody) {
            setStatus("Please add a title and gratitude message.")
            return
        }

        const { error } = await updateStory({
            storyId,
            userId: session.user.id,
            title: trimmedTitle,
            body: trimmedBody,
        })

        if (error) {
            console.error("Error updating gratitude:", error)
            setStatus("Could not update gratitude.")
            return
        }

        setStories((current) =>
            current.map((story) =>
                story.id === storyId
                    ? {
                        ...story,
                        title: trimmedTitle,
                        body: trimmedBody,
                    }
                    : story
            )
        )

        setEditingStoryId(null)
        setEditStoryForm({
            title: "",
            body: "",
        })

        setStatus("Gratitude updated.")
    }

    async function handleDeleteStory(storyId) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this gratitude?"
        )

        if (!confirmed) return

        const { error } = await deleteStory({
            storyId,
            userId: session.user.id,
        })

        if (error) {
            console.error("Error deleting gratitude:", error)
            setStatus("Could not delete gratitude.")
            return
        }

        setStories((current) =>
            current.filter((story) => story.id !== storyId)
        )

        setEditingStoryId(null)
        setEditStoryForm({
            title: "",
            body: "",
        })

        setStatus("Gratitude deleted.")
    }

    return {
        handleGratitudeSubmit,
        handleSaveStoryEdit,
        handleDeleteStory,
    }
}