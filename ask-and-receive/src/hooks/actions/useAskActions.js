import {
    createAsk,
    updateAsk,
    deleteAskCascade,
} from "../../services/askService"

const ASK_STORAGE_KEY = "ask-and-receive-asks"

export function useAskActions({
    session,
    profile,
    askForm,
    setAskForm,
    editAskForm,
    setEditAskForm,
    setEditingAskId,
    setAsks,
    setMyAsks,
    setOffersForMyAsks,
    setAllOffers,
    setStories,
    setExpandedAskId,
    setStatus,
    askStatus,
    setAskStatus,
}) {
    async function handleAskSubmit(event) {
        event.preventDefault()
        console.log("SUBMIT CLICKED")

        const trimmedTitle = askForm.title.trim()
        const trimmedBody = askForm.body.trim()

        if (!trimmedTitle || !trimmedBody) {
            setAskStatus("Please add a title and tell people what you want.")
            return
        }

        if (trimmedTitle.length > 80) {
            setAskStatus("Ask title must be 80 characters or fewer.")
            return
        }

        if (trimmedBody.length > 500) {
            setAskStatus("Ask description must be 500 characters or fewer.")
            return
        }

        if (!session?.user?.id) {
            setAskStatus("You must be logged in to post an ask.")
            return
        }

        const { data, error } = await createAsk({
            userId: session.user.id,
            title: trimmedTitle,
            body: trimmedBody,
            category: askForm.category,
            askerName: profile?.nickname || "Anonymous",
        })

        if (error) {
            setAskStatus(`Could not save ask: ${error.message}`)
            return
        }

        if (data) {
            const newAsk = {
                id: data.id,
                user_id: data.user_id,
                asker_name: data.asker_name,
                title: data.title,
                category: data.category,
                body: data.body,
                created_at: data.created_at,
                status: data.status || "open",
                accepted_offer_id: data.accepted_offer_id,
                fulfilled_offer_id: data.fulfilled_offer_id,
                fulfilled_at: data.fulfilled_at,
            }

            setAsks((current) => [newAsk, ...current])
            setMyAsks((current) => [newAsk, ...current])
        }

        setAskForm({
            title: "",
            category: "Simple Joy",
            body: "",
        })

        setAskStatus("Your ask was added.")
    }

    async function handleSaveAskEdit(askId) {
        if (!editAskForm.title.trim() || !editAskForm.body.trim()) {
            setStatus("Please add a title and details.")
            return
        }

        const { error } = await updateAsk({
            askId,
            userId: session.user.id,
            title: editAskForm.title.trim(),
            body: editAskForm.body.trim(),
        })

        if (error) {
            console.error(error)
            setStatus("Could not save your changes.")
            return
        }

        setAsks((current) =>
            current.map((ask) =>
                ask.id === askId
                    ? {
                        ...ask,
                        title: editAskForm.title.trim(),
                        body: editAskForm.body.trim(),
                    }
                    : ask
            )
        )

        setEditingAskId(null)

        setEditAskForm({
            title: "",
            body: "",
        })

        setStatus("Your ask was updated.")
    }

    async function handleDeleteAsk(askId) {
        const confirmed = window.confirm(
            "Are you sure you want to permanently delete this ask and all related offers, messages, and gratitude?"
        )

        if (!confirmed) return

        const { error } = await deleteAskCascade(askId)

        if (error) {
            console.error("Error deleting ask:", error)
            setStatus(`Could not delete ask: ${error.message}`)
            return
        }

        setAsks((current) => current.filter((ask) => ask.id !== askId))
        setMyAsks((current) => current.filter((ask) => ask.id !== askId))
        setOffersForMyAsks((current) => current.filter((offer) => offer.ask_id !== askId))
        setAllOffers((current) => current.filter((offer) => offer.ask_id !== askId))
        setStories((current) => current.filter((story) => story.ask_id !== askId))

        setExpandedAskId(null)
        setStatus("Ask deleted.")
    }

    return {
        handleAskSubmit,
        handleSaveAskEdit,
        handleDeleteAsk,
    }
}