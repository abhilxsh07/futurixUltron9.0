import { useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useAuth } from "../app/auth"

export default function SignIn() {
  const { signIn } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()
  const location = useLocation() as { state?: { from?: string } }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError("")
    const ok = await signIn(email, password)
    if (ok) {
      navigate(location.state?.from || "/projects")
    } else {
      setError("Invalid credentials")
    }
  }

  return (
      <div className="max-w-md mx-auto py-16">
        <div className="bg-base-800/80 border border-white/10 rounded-xl p-8 shadow-soft">
          <h1 className="text-2xl font-semibold">Sign In</h1>
          <p className="text-white/60 mt-2">Invite-only access for Ultron 9.0 participants.</p>
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-sm text-white/70">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="mt-2 w-full bg-base-900 border border-white/10 rounded-lg px-3 py-2" required />
            </div>
            <div>
              <label className="text-sm text-white/70">Password</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="mt-2 w-full bg-base-900 border border-white/10 rounded-lg px-3 py-2" required />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button type="submit" className="w-full py-3 rounded-lg bg-white text-base-900 font-semibold">Sign In</button>
          </form>
        </div>
      </div>
  )
}
