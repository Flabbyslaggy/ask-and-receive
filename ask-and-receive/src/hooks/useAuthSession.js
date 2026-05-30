import { useEffect } from "react"
import { supabase } from "../supabaseClient"

export function useAuthSession({
  setSession,
  setIsAppLoading,
  setIsPasswordRecovery,
}) {
  useEffect(() => {
    async function handleSession(session) {
      setSession(session)

      if (!session) {
        setIsAppLoading(false)
        return
      }

      const userId = session.user.id

      const { data } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", userId)
        .single()

      if (!data) {
        await supabase.from("profiles").insert([
          {
            id: userId,
            nickname: "Anonymous",
          },
        ])
      }

      setIsAppLoading(false)
    }

    supabase.auth.getSession().then(({ data }) => {
      handleSession(data.session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "PASSWORD_RECOVERY") {
        setIsPasswordRecovery(true)
      }

      handleSession(session)
    })

    return () => subscription.unsubscribe()
  }, [setSession, setIsAppLoading, setIsPasswordRecovery])
}