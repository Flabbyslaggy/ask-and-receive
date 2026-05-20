import GratitudeModal from "./GratitudeModal"
import ProfileModal from "./ProfileModal"
import ReportModal from "./ReportModal"
import HelpModal from "../HelpModal"

export default function AppModals({
  isGratitudeOpen,
  gratitudeForm,
  setGratitudeForm,
  handleGratitudeSubmit,
  setIsGratitudeOpen,
  setGratitudeAskId,
  activeTheme,

  selectedProfile,
  selectedProfileOffers,
  asks,
  setSelectedProfile,
  setIsReportOpen,
  setReportReason,
  setReportStatus,

  isReportOpen,
  reportReason,
  setReportReasonState,
  reportStatus,
  handleReportSubmit,

  isHelpOpen,
  selectedAsk,
  helpForm,
  setHelpForm,
  handleHelpSubmit,
  helpStatus,
  setIsHelpOpen,
}) {
  return (
    <>
      {isGratitudeOpen && (
        <GratitudeModal
          gratitudeForm={gratitudeForm}
          setGratitudeForm={setGratitudeForm}
          onSubmit={handleGratitudeSubmit}
          onClose={() => {
            setIsGratitudeOpen(false)
            setGratitudeAskId(null)
          }}
          activeTheme={activeTheme}
        />
      )}

      {selectedProfile && (
        <ProfileModal
          selectedProfile={selectedProfile}
          selectedProfileOffers={selectedProfileOffers}
          asks={asks}
          onClose={() => setSelectedProfile(null)}
          onReportClick={() => {
            setIsReportOpen(true)
            setReportReason("")
            setReportStatus("")
          }}
        />
      )}

      {isReportOpen && (
        <ReportModal
          reportReason={reportReason}
          setReportReason={setReportReasonState}
          reportStatus={reportStatus}
          onSubmit={handleReportSubmit}
          onClose={() => setIsReportOpen(false)}
        />
      )}

      <HelpModal
        isOpen={isHelpOpen}
        selectedAsk={selectedAsk}
        helpForm={helpForm}
        setHelpForm={setHelpForm}
        handleHelpSubmit={handleHelpSubmit}
        helpStatus={helpStatus}
        onClose={() => setIsHelpOpen(false)}
      />
    </>
  )
}