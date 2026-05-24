import { useEffect, useState } from "react"
import { fetchStories } from "../services/storyService"

export function useStories() {
  const [stories, setStories] = useState([])

  useEffect(() => {
    async function loadStories() {
      const data = await fetchStories()
      setStories(data)
    }

    loadStories()
  }, [])

  return {
    stories,
    setStories,
  }
}