import { useEffect, useState } from "react"
import { fetchAllOffers } from "../services/offerService"

export function useAllOffers() {
  const [allOffers, setAllOffers] = useState([])

  useEffect(() => {
    async function loadAllOffers() {
      const data = await fetchAllOffers()
      setAllOffers(data)
    }

    loadAllOffers()
  }, [])

  return {
    allOffers,
    setAllOffers,
  }
}