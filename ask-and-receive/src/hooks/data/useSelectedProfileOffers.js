import { useEffect, useState } from "react"
import { fetchProfileOffers } from "../../services/profileService"

export function useSelectedProfileOffers(selectedProfile) {
  const [selectedProfileOffers, setSelectedProfileOffers] = useState([])

  useEffect(() => {
    async function loadSelectedProfileOffers() {
      if (!selectedProfile) {
        setSelectedProfileOffers([])
        return
      }

      const { data, error } = await fetchProfileOffers(selectedProfile.id)

      if (error) {
        console.error("Error fetching profile offers:", error)
        return
      }

      setSelectedProfileOffers(data)
    }

    loadSelectedProfileOffers()
  }, [selectedProfile])

  return {
    selectedProfileOffers,
    setSelectedProfileOffers,
  }
}