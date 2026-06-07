import { useState } from "react"

export function useFormState() {
    const [askForm, setAskForm] = useState({
        title: "",
        category: "Simple Joy",
        body: "",
    })

    const [editAskForm, setEditAskForm] = useState({
        title: "",
        body: "",
    })

    const [helpForm, setHelpForm] = useState({
        helperMessage: "",
    })

    const [gratitudeForm, setGratitudeForm] = useState({
        body: "",
    })

    const [editStoryForm, setEditStoryForm] = useState({
        title: "",
        body: "",
    })

    const [editOfferForm, setEditOfferForm] = useState({
        helper_message: "",
    })

    const [messageInputs, setMessageInputs] = useState({})

    return {
        askForm,
        setAskForm,
        editAskForm,
        setEditAskForm,
        helpForm,
        setHelpForm,
        gratitudeForm,
        setGratitudeForm,
        editStoryForm,
        setEditStoryForm,
        editOfferForm,
        setEditOfferForm,
        messageInputs,
        setMessageInputs,
    }
}