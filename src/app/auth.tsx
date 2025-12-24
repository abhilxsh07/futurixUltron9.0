import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react"

export type User = { id: number; email: string; role: "participant" | "admin" }

type AuthContextValue = {
  user: User | null
  loading: boolean
  refresh: () => Promise<void>
  signIn: (email: string, password: string) => Promise<boolean>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/auth/me.php", { credentials: "include" })
      const data = await res.json()
      if (data.authenticated) {
        setUser(data.user)
      } else {
        setUser(null)
      }
    } catch {
      setUser(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  const signIn = useCallback(async (email: string, password: string) => {
    const res = await fetch("/api/auth/login.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ email, password })
    })
    const data = await res.json()
    if (data.ok) {
      setUser(data.user)
      return true
    }
    return false
  }, [])

  const signOut = useCallback(async () => {
    await fetch("/api/auth/logout.php", { method: "POST", credentials: "include" })
    setUser(null)
  }, [])

  const value = useMemo(() => ({ user, loading, refresh, signIn, signOut }), [user, loading, refresh, signIn, signOut])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error("AuthContext")
  }
  return ctx
}
