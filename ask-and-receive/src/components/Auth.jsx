import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"
import logo from "../assets/logo.png"

export default function Auth({ forceRecoveryMode = false }) {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [message, setMessage] = useState("")
  const [isRecoveryMode, setIsRecoveryMode] = useState(false)
  const [newPassword, setNewPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [showReset, setShowReset] = useState(false)
  const [resetEmail, setResetEmail] = useState("")

  async function handleSubmit(event) {
    event.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      if (isRecoveryMode) {
        const { error } = await supabase.auth.updateUser({
          password: newPassword,
        })

        if (error) {
          setMessage(error.message)
        } else {
          setMessage("Password updated. You can log in now.")
          setIsRecoveryMode(false)
          setNewPassword("")
          setPassword("")
          setShowReset(false)
        }
        return
      }

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

  async function handleResetPassword() {
    if (!resetEmail.trim()) {
      setMessage("Please enter your email address.")
      return
    }

    setLoading(true)
    setMessage("")

    const { error } = await supabase.auth.resetPasswordForEmail(resetEmail.trim(), {
      redirectTo: "https://ask-and-receive.vercel.app",
    })

    if (error) {
      setMessage(error.message)
    } else {
      setMessage("Password reset email sent. Check your inbox.")
      setShowReset(false)
      setResetEmail("")
    }

    setLoading(false)
  }

  useEffect(() => {
    const hash = window.location.hash
    const search = window.location.search

    if (
      forceRecoveryMode ||
      hash.includes("type=recovery") ||
      search.includes("type=recovery")
    ) {
      setIsRecoveryMode(true)
      setMessage("Enter your new password below.")
    }
  }, [forceRecoveryMode])

  return (
    <section className="mx-auto max-w-md px-6 py-12">
      <div className="rounded-3xl border border-stone-900 bg-stone-900/80 backdrop-blur p-6">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-30 w-30 items-center justify-center rounded-full bg-stone-950/70 ring-2 ring-emerald-300/40 shadow-[0_0_25px_rgba(16,185,129,0.25)]">
            <img
              src={logo}
              alt="Ask & Receive logo"
              className="h-29 w-29 rounded-full object-cover"
            />
          </div>

          <p className="mt-2 text-sm font-medium bg-gradient-to-r from-emerald-300 to-emerald-500 opacity 80 bg-clip-text text-transparent">
            You have not, because you ask not.
          </p>
        </div>

        <div className="mb-4 text-lg font-medium text-white">
          {isRecoveryMode
            ? "Set New Password"
            : isLogin
              ? "Log In"
              : "Sign Up"}
        </div>

        <h2 className="sr-only">
          {isRecoveryMode
            ? "Set New Password"
            : isLogin
              ? "Log In"
              : "Create Account"}
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
            <span className="text-stone-300">
              {isRecoveryMode ? "New Password" : "Password"}
            </span>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={isRecoveryMode ? newPassword : password}
                onChange={(event) =>
                  isRecoveryMode
                    ? setNewPassword(event.target.value)
                    : setPassword(event.target.value)
                }
                className="w-full rounded-2xl border border-stone-700 bg-stone-950/80 px-4 py-3 pr-12 text-stone-100 outline-none"
                required
              />

              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white"
              >
                {showPassword ? "◉" : "○"}
              </button>
            </div>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="rounded-2xl bg-gradient-to-r from-emerald-400 to-lime-300 px-5 py-3 font-medium text-stone-950 hover:from-emerald-300 hover:to-lime-200 transition"
          >
            {loading ? "Please wait..." : isLogin ? "Log In" : "Sign Up"}
          </button>

          <button
            type="button"
            onClick={() => setShowReset(true)}
            className="mt-3 text-sm text-stone-300 underline underline-offset-4 transition hover:text-emerald-300 active:scale-95"
          >
            Forgot password?
          </button>
        </form>

        {message ? (
          <div className="mt-4 rounded-2xl border border-emerald-400/30 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
            {message}
          </div>
        ) : null}

        {showReset ? (
          <div className="mt-4 rounded-2xl border border-stone-700 bg-stone-950/70 p-4 transition-all duration-300 ease-out opacity-100 translate-y-0">
            <h3 className="text-lg font-medium text-stone-100">Reset password</h3>
            <p className="mt-1 text-sm text-stone-300">
              Enter your email and we’ll send you a reset link.
            </p>

            <input
              type="email"
              value={resetEmail}
              onChange={(event) => setResetEmail(event.target.value)}
              placeholder="you@example.com"
              className="mt-4 w-full rounded-2xl border border-stone-700 bg-stone-950/80 px-4 py-3 text-stone-100 outline-none"
            />

            <div className="mt-4 flex gap-3">
              <button
                type="button"
                onClick={handleResetPassword}
                className="rounded-2xl bg-emerald-300 px-4 py-2 font-medium text-stone-950 hover:bg-emerald-200"
              >
                Send reset link
              </button>

              <button
                type="button"
                onClick={() => setShowReset(false)}
                className="rounded-2xl border border-stone-700 px-4 py-2 text-stone-200 hover:bg-stone-900/80"
              >
                Cancel
              </button>
            </div>
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => setIsLogin((current) => !current)}
          className="mt-4 text-sm text-stone-300 underline underline-offset-4 transition hover:text-emerald-300 active:scale-95"
        >
          {isLogin ? "Need an account? Sign up" : "Already have an account? Log in"}
        </button>
      </div>
    </section>
  )
}