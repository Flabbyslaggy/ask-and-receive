import { useEffect, useState } from "react"
import { supabase } from "../supabaseClient"
import { useTheme } from "../ThemeContext"

export default function Auth({ forceRecoveryMode = false, onRecoveryComplete }) {
  const activeTheme = useTheme()
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
          onRecoveryComplete?.()
          window.history.replaceState({}, document.title, window.location.pathname)
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
          <div className={`mx-auto mb-3 flex h-32 w-32 items-center justify-center rounded-full bg-stone-950/70 ring-2 ${activeTheme.ring} ${activeTheme.accentText}`}
          >
            <div className="h-full w-full">
              <svg
                viewBox="55 73 57 54"
                className="w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
                color="currentColor"
              >
                <defs>
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="0.7" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                  <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={activeTheme.logoGradientFrom || "#67e8f9"} />
                    <stop offset="100%" stopColor={activeTheme.logoGradientTo || "#3b82f6"} />
                  </linearGradient>
                </defs>

                <g filter="url(#glow)">

                  {/*-- Question mark --*/}
                  <path
                    d="m 81.250882,86.346938 c -0.370541,-0.06504 -0.761567,-0.05716 -1.173227,0.0231 -0.548879,0.107027 -1.10494,0.325537 -1.667683,0.656084 -1.214345,0.713289 -2.261074,1.845287 -3.140648,3.395762 l 0.696574,2.433959 c 0.567207,-1.765447 1.476371,-3.015704 2.727736,-3.750739 0.348015,-0.204418 0.694728,-0.338176 1.040025,-0.400988 0.342657,-0.07204 0.665373,-0.06217 0.968288,0.02912 0.302913,0.0913 0.569866,0.268212 0.800781,0.531029 0.238321,0.258466 0.420707,0.609138 0.547368,1.051648 0.14777,0.516266 0.187494,1.047445 0.118999,1.593823 -0.06369,0.532813 -0.179577,1.08009 -0.347483,1.641777 -0.170545,0.552474 -0.36694,1.120046 -0.58932,1.702959 -0.225013,0.573704 -0.418977,1.150838 -0.581605,1.73097 -0.16263,0.580126 -0.271418,1.166415 -0.32672,1.758889 -0.05054,0.578896 0.0086,1.163127 0.177446,1.753139 0.108192,0.37798 0.243661,0.74534 0.406322,1.1021 0.160021,0.34752 0.307636,0.62144 0.442883,0.82199 l 1.788314,-1.0502 c -0.150058,-0.19187 -0.314772,-0.43435 -0.493854,-0.72761 -0.181725,-0.30248 -0.333282,-0.665939 -0.454667,-1.09002 -0.142491,-0.497822 -0.176918,-1.010682 -0.103145,-1.538622 0.07382,-0.527927 0.201176,-1.065674 0.381764,-1.613274 0.185353,-0.561172 0.392952,-1.13529 0.622732,-1.722558 0.22978,-0.587268 0.425468,-1.187021 0.587585,-1.799155 0.166881,-0.625706 0.270301,-1.262398 0.309774,-1.910184 0.03946,-0.647786 -0.03865,-1.312698 -0.233908,-1.994904 -0.205822,-0.719081 -0.493689,-1.287643 -0.864106,-1.70543 -0.370419,-0.417796 -0.795932,-0.695267 -1.276478,-0.832999 z"
                    fill="url(#logoGradient)"
                  />

                  {/*-- Exclamation --*/}
                  <path
                    d="m 93.96026,86.408314 c -0.107877,-0.01424 -0.219204,-0.01155 -0.333611,0.0082 -0.457619,0.07883 -0.854677,0.393961 -1.191665,0.945232 -0.295599,0.483573 -1.187889,2.241386 -2.676916,5.272625 -1.482721,3.039524 -2.944102,5.941591 -4.383863,8.706199 l 0.737952,0.96924 c 1.736187,-2.375065 3.553736,-4.808852 5.452704,-7.301387 1.898967,-2.492539 2.996254,-3.980422 3.291864,-4.463994 0.342893,-0.560942 0.51328,-1.174353 0.510892,-1.840224 0.0036,-0.675554 -0.171602,-1.245478 -0.524789,-1.709597 -0.264888,-0.348086 -0.558934,-0.543596 -0.882567,-0.586277 z"
                    fill="url(#logoGradient)"
                  />

                  {/*-- Dot --*/}
                  <circle cx="83.85" cy="104.7" r="1.85" fill="url(#logoGradient)" />

                  {/*-- Circle arcs --*/}
                  <path
                    d="M 82.1 108.9 A 13.7 13.7 0 1 1 92.2 85.1"
                    fill="none"
                    stroke="url(#logoGradient)"
                    stroke-width="1.0"
                    stroke-linecap="round"
                  />

                  <path
                    d="M 96.4 91.7 A 13.7 13.7 0 0 1 85.6 108.9"
                    fill="none"
                    stroke="url(#logoGradient)"
                    stroke-width="1.0"
                    stroke-linecap="round"
                  />
                </g>

                {/*-- Text --*/}
                <text
                  x="66.62"
                  y="115.5"
                  fill="url(#logoGradient)"
                  fontFamily="Franklin Gothic Medium, Arial, sans-serif"
                  fontSize="5.6"
                >
                  Ask &amp; Receive
                </text>

              </svg>
            </div>
          </div>

          <p
            className={`mt-2 text-sm font-medium bg-gradient-to-r ${activeTheme.button} bg-clip-text text-transparent`}
          >
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
            className={`rounded-2xl bg-gradient-to-r ${activeTheme.button} px-5 py-3 font-medium text-stone-950 transition`}
          >
            {loading ? "Please wait..." : isLogin ? "Log In" : "Sign Up"}
          </button>

          <button
            type="button"
            onClick={() => setShowReset(true)}
            className={`mt-3 text-sm underline underline-offset-4 transition active:scale-95 ${activeTheme.accentText} opacity-80 hover:opacity-100`}
          >
            Forgot password?
          </button>
        </form>

        {message ? (
          <div className={`mt-4 rounded-2xl border px-4 py-3 text-sm ${activeTheme.accentBorder} ${activeTheme.accentBg} ${activeTheme.accentText}`}>
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
                className={`rounded-2xl ${activeTheme.solidButton} px-4 py-2 font-medium text-stone-950`}
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
          className={`mt-4 text-sm underline underline-offset-4 transition active:scale-95 ${activeTheme.accentText} opacity-80 hover:opacity-100`}
        >
          {isLogin ? "Need an account? Sign up" : "Already have an account? Log in"}
        </button>
      </div>
    </section>
  )
}