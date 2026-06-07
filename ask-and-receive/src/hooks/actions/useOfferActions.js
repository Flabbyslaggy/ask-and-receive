import {
    updateOfferMessage,
    withdrawOffer,
    acceptOffer,
    declineOffer,
    fulfillOffer,
} from "../../services/offerService"

export function useOfferActions({
    session,
    editOfferForm,
    setEditingOfferId,
    setEditOfferForm,
    setMyHelpOffers,
    setOffersForMyAsks,
    setAllOffers,
    setMyAsks,
    setAsks,
    setStatus,
    offersForMyAsks,
}) {

    async function handleSaveOfferEdit(offerId) {
        const trimmedMessage = editOfferForm.helper_message.trim()

        if (!trimmedMessage) {
            setStatus("Please add offer details.")
            return
        }

        const { error } = await updateOfferMessage({
            offerId,
            userId: session.user.id,
            helperMessage: trimmedMessage,
        })

        if (error) {
            console.error(error)
            setStatus("Could not save your changes.")
            return
        }

        setMyHelpOffers((current) =>
            current.map((offer) =>
                offer.id === offerId
                    ? { ...offer, helper_message: trimmedMessage }
                    : offer
            )
        )

        setEditingOfferId(null)

        setEditOfferForm({
            helper_message: "",
        })

        setStatus("Your offer was updated.")
    }

    async function handleWithdrawOffer(offerId) {
        const { error } = await withdrawOffer({
            offerId,
            userId: session.user.id,
        })

        if (error) {
            console.error("Error withdrawing offer:", error)
            setStatus("Could not withdraw offer.")
            return
        }

        setMyHelpOffers((current) =>
            current.filter((offer) => offer.id !== offerId)
        )

        setOffersForMyAsks((current) =>
            current.filter((offer) => offer.id !== offerId)
        )

        setAllOffers((current) =>
            current.filter((offer) => offer.id !== offerId)
        )

        setStatus("Offer withdrawn.")
    }

    async function handleAcceptOffer(offerId, askId) {
        const { error } = await acceptOffer({
            offerId,
            askId,
        })

        if (error) {
            console.error("Error accepting offer:", error)
            return
        }

        setMyAsks((current) =>
            current.map((ask) =>
                ask.id === askId
                    ? {
                        ...ask,
                        status: "accepted",
                        accepted_offer_id: offerId,
                    }
                    : ask
            )
        )

        setAsks((current) =>
            current.map((ask) =>
                ask.id === askId
                    ? {
                        ...ask,
                        status: "accepted",
                        accepted_offer_id: offerId,
                    }
                    : ask
            )
        )

        setAllOffers((current) =>
            current.map((offer) =>
                offer.id === offerId
                    ? { ...offer, status: "accepted" }
                    : offer
            )
        )

        setOffersForMyAsks((current) =>
            current.map((offer) => {
                if (offer.id === offerId) {
                    return { ...offer, status: "accepted" }
                }

                if (offer.ask_id === askId && offer.status === "pending") {
                    return { ...offer, status: "declined" }
                }

                return offer
            })
        )
    }

    async function handleDeclineOffer(offerId) {
        console.log("DECLINE CLICKED", offerId)

        const { error } = await declineOffer(offerId)

        if (error) {
            console.error("Error declining offer:", error)
            return
        }

        console.log("DECLINE SUCCESS", offerId)

        setOffersForMyAsks((current) =>
            current.map((offer) =>
                offer.id === offerId
                    ? { ...offer, status: "declined" }
                    : offer
            )
        )
    }

    async function handleFulfillOffer(offerId) {
        const askId = offersForMyAsks.find(
            (o) => o.id === offerId
        )?.ask_id

        const { error } = await fulfillOffer({
            offerId,
            askId,
        })

        if (error) {
            console.error("Error fulfilling offer:", error)
            return
        }

        setOffersForMyAsks((current) =>
            current.map((offer) =>
                offer.id === offerId
                    ? { ...offer, status: "fulfilled" }
                    : offer
            )
        )

        setAllOffers((current) =>
            current.map((offer) =>
                offer.id === offerId
                    ? { ...offer, status: "fulfilled" }
                    : offer
            )
        )
    }

    return {
        handleSaveOfferEdit,
        handleWithdrawOffer,
        handleAcceptOffer,
        handleFulfillOffer,
        handleDeclineOffer,
    }
}