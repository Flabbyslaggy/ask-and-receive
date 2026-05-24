import { useEffect, useState } from "react"
import { fetchMyHelpOffers } from "../services/offerService"

export function useMyHelpOffers(session) {
  const [myHelpOffers, setMyHelpOffers] = useState([])

  useEffect(() => {
    async function loadMyHelpOffers() {
      if (!session) {
        setMyHelpOffers([])
        return
      }

      const data = await fetchMyHelpOffers(session.user.id)
      setMyHelpOffers(data)
    }

    loadMyHelpOffers()
  }, [session])

  return {
    myHelpOffers,
    setMyHelpOffers,
  }
}