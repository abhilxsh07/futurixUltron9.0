import { Link, NavLink } from "react-router-dom"
import { useAuth } from "../app/auth"

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm uppercase tracking-widest ${isActive ? "text-white" : "text-white/60 hover:text-white"}`

export default function Navbar() {
  const { user, signOut } = useAuth()
  return (
    <header className="sticky top-0 z-20 backdrop-blur bg-base-900/80 border-b border-white/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-10 py-4 flex items-center justify-between">
        <Link to="/" className="text-lg font-semibold">Ultron 9.0</Link>
        <nav className="flex items-center gap-6">
          <NavLink to="/projects" className={linkClass}>Projects</NavLink>
          <NavLink to="/prizes" className={linkClass}>Prizes</NavLink>
          <NavLink to="/schedule" className={linkClass}>Schedule</NavLink>
          {user?.role === "admin" && (
            <NavLink to="/admin" className={linkClass}>Admin</NavLink>
          )}
          {user ? (
            <button onClick={signOut} className="text-sm text-white/70 hover:text-white">Sign out</button>
          ) : (
            <NavLink to="/signin" className={linkClass}>Sign In</NavLink>
          )}
        </nav>
      </div>
    </header>
  )
}
