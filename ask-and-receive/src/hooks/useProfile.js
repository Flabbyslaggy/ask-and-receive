import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"

export function useProfile(session) {
  const [profile, setProfile] = useState(null)
  const [isProfileLoading, setIsProfileLoading] = useState(true)

  useEffect(() => {
    async function fetchProfile() {
      if (!session) {
        setProfile(null)
        setIsProfileLoading(false)
        return
      }

      setIsProfileLoading(true)

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", session.user.id)
        .single()

      if (error) {
        console.error("Error fetching profile:", error)
        setIsProfileLoading(false)
        return
      }

      setProfile(data)

      if (data?.theme) {
        localStorage.setItem("ask-and-receive-theme", data.theme)
      }

      setIsProfileLoading(false)
    }

    fetchProfile()
  }, [session])

  return {
    profile,
    setProfile,
    isProfileLoading,
    setIsProfileLoading,
  }
}