export function useLocalDataActions({
    setAsks,
    setStatus,
    askStorageKey,
}) {
    function handleClearSavedData() {
        setAsks([])
        localStorage.removeItem(askStorageKey)
        setStatus("Saved asks cleared.")
    }

    return {
        handleClearSavedData,
    }
}