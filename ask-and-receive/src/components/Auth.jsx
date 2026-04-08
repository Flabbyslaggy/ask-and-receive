import { useState } from "react"
import { supabase } from "../supabaseClient"

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) throw error
        setMessage("Logged in.")
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        })

        if (error) throw error
        setMessage("Account created. Check your email if confirmation is enabled.")
      }
    } catch (error) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="mx-auto max-w-md px-6 py-12">
      <div className="rounded-3xl border border-stone-800 bg-stone-900/60 backdrop-blur p-6">
        <h2 className="text-3xl font-semibold">
          {isLogin ? "Log In" : "Create Account"}
        </h2>

        <form onSubmit={handleSubmit} className="mt-6 grid gap-4">
          <label className="grid gap-2 text-sm">
            <span className="text-stone-300">Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="rounded-2xl border border-stone-700 bg-stone-950/80 px-4 py-3 text-stone-100 outline-none"
              required
            />
          </label>

          <label className="grid gap-2 text-sm">
            <span className="text-stone-300">Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="rounded-2xl border border-stone-700 bg-stone-950/80 px-4 py-3 text-stone-100 outline-none"
              required
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="rounded-2xl bg-emerald-300 px-5 py-3 font-medium text-stone-950 hover:bg-emerald-200 transition disabled:opacity-60"
          >
            {loading ? "Please wait..." : isLogin ? "Log In" : "Sign Up"}
          </button>
        </form>

        {message ? (
          <div className="mt-4 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
            {message}
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => setIsLogin((current) => !current)}
          className="mt-4 text-sm text-stone-300 underline underline-offset-4"
        >
          {isLogin ? "Need an account? Sign up" : "Already have an account? Log in"}
        </button>
      </div>
    </section>
  )
}