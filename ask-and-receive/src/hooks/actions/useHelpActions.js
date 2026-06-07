import { findExistingOffer, createHelpOffer } from "../../services/offerService"

export function useHelpActions({
    session,
    profile,
    helpForm,
    selectedAsk,
    setSelectedAsk,
    setIsHelpOpen,
    setHelpForm,
    setHelpStatus,
    setAsks,
}) {
    function handleHelpClick(ask) {
        setSelectedAsk(ask)
        setIsHelpOpen(true)
    }

    async function handleHelpSubmit(event) {
        event.preventDefault()

        const trimmedMessage = (helpForm.helperMessage || "").trim()

        if (!trimmedMessage) {
            setHelpStatus("Please say how you want to help.")
            return
        }

        if (trimmedMessage.length > 500) {
            setHelpStatus("Help message must be 500 characters or fewer.")
            return
        }

        const { data: existingOffer, error: existingOfferError } =
            await findExistingOffer({
                askId: selectedAsk.id,
                userId: session.user.id,
            })

        if (existingOfferError) {
            setHelpStatus("Could not check your existing offers.")
            return
        }

        if (existingOffer) {
            setHelpStatus("You have already offered to help with this ask.")
            return
        }

        const { error } = await createHelpOffer({
            askId: selectedAsk.id,
            userId: session.user.id,
            helperName: profile?.nickname || "Anonymous",
            helperMessage: trimmedMessage,
        })

        if (error) {
            setHelpStatus("Could not send help offer.")
            return
        }

        setAsks((current) =>
            current.map((ask) =>
                ask.id === selectedAsk.id ? { ...ask, status: "pending" } : ask
            )
        )

        setHelpForm({ helperMessage: "" })
        setHelpStatus("Offer sent!")
        setIsHelpOpen(false)
        setSelectedAsk(null)
    }

    return {
        handleHelpClick,
        handleHelpSubmit,
    }
}