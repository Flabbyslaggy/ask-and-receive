import { supabase } from "../../supabaseClient"

export function useReportActions({
    session,
    selectedProfile,
    reportReason,
    setReportReason,
    setReportStatus,
}) {

    async function handleReportSubmit() {
        const trimmedReason = reportReason.trim()

        if (!trimmedReason) {
            setReportStatus("Please enter a reason.")
            return
        }

        const { error } = await supabase
            .from("user_reports")
            .insert([
                {
                    reported_user_id: selectedProfile.id,
                    reporter_user_id: session.user.id,
                    reason: trimmedReason,
                },
            ])

        if (error) {
            console.error(error)
            setReportStatus("Could not submit report.")
            return
        }

        setReportStatus("Report submitted.")
        setReportReason("")
    }
    return {
        handleReportSubmit,
    }
}