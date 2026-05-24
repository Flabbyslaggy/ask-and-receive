import { useEffect, useState } from "react"
import { fetchOffersForAskIds } from "../services/offerService"

export function useOffersForMyAsks(session, asks) {
  const [offersForMyAsks, setOffersForMyAsks] = useState([])

  useEffect(() => {
    async function loadOffersForMyAsks() {
      if (!session) {
        setOffersForMyAsks([])
        return
      }

      const myAskIds = asks
        .filter((ask) => ask.user_id === session.user.id)
        .map((ask) => ask.id)

      if (myAskIds.length === 0) {
        setOffersForMyAsks([])
        return
      }

      const data = await fetchOffersForAskIds(myAskIds)
      setOffersForMyAsks(data)
    }

    loadOffersForMyAsks()
  }, [session, asks])

  return {
    offersForMyAsks,
    setOffersForMyAsks,
  }
}