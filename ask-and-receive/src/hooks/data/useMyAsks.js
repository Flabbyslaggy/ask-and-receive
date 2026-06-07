import { useEffect, useState } from "react"

export function useMyAsks(session, asks) {
  const [myAsks, setMyAsks] = useState([])

  useEffect(() => {
    if (!session) {
      setMyAsks([])
      return
    }

    const mine = asks.filter((ask) => ask.user_id === session.user.id)
    setMyAsks(mine)
  }, [session, asks])

  return {
    myAsks,
    setMyAsks,
  }
}