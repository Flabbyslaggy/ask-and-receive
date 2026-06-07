import { useState } from "react"

export function useModalState() {
    const [isHelpOpen, setIsHelpOpen] = useState(false)
    const [selectedAsk, setSelectedAsk] = useState(null)

    const [isGratitudeOpen, setIsGratitudeOpen] = useState(false)
    const [gratitudeAskId, setGratitudeAskId] = useState(null)

    const [selectedProfile, setSelectedProfile] = useState(null)

    const [isReportOpen, setIsReportOpen] = useState(false)
    const [reportReason, setReportReason] = useState("")
    const [reportStatus, setReportStatus] = useState("")

    return {
        isHelpOpen,
        setIsHelpOpen,
        selectedAsk,
        setSelectedAsk,

        isGratitudeOpen,
        setIsGratitudeOpen,
        gratitudeAskId,
        setGratitudeAskId,

        selectedProfile,
        setSelectedProfile,

        isReportOpen,
        setIsReportOpen,
        reportReason,
        setReportReason,
        reportStatus,
        setReportStatus,
    }
}