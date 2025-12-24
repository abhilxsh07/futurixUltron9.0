import { useEffect, useState } from "react"
import { Link, Navigate } from "react-router-dom"
import { useAuth } from "../app/auth"

type ProjectAdmin = {
  id: number
  slug: string
  project_name: string
  team_name: string
  status: "pending" | "approved" | "hidden"
}

type UserAdminCreate = {
  email: string
  password: string
  role: "participant" | "admin"
}

type UserRow = {
  id: number
  email: string
  role: "participant" | "admin"
  created_at: string
}

export default function AdminDashboard() {
  const { user } = useAuth()
  const [projects, setProjects] = useState<ProjectAdmin[]>([])
  const [users, setUsers] = useState<UserRow[]>([])
  const [loadingProjects, setLoadingProjects] = useState(true)
  const [loadingUsers, setLoadingUsers] = useState(true)
  const [createUser, setCreateUser] = useState<UserAdminCreate>({ email: "", password: "", role: "participant" })
  const [resetUser, setResetUser] = useState({ userId: "", password: "" })
  const [message, setMessage] = useState("")

  if (user?.role !== "admin") {
    return <Navigate to="/projects" replace />
  }

  const loadProjects = async () => {
    setLoadingProjects(true)
    const res = await fetch("/api/projects/index.php?page=1&pageSize=200", { credentials: "include" })
    const data = await res.json()
    setProjects(data.items || [])
    setLoadingProjects(false)
  }

  const loadUsers = async () => {
    setLoadingUsers(true)
    const res = await fetch("/api/admin/users/index.php", { credentials: "include" })
    const data = await res.json()
    setUsers(data.items || [])
    setLoadingUsers(false)
  }

  useEffect(() => {
    loadProjects()
    loadUsers()
  }, [])

  const updateStatus = async (projectId: number, status: string) => {
    await fetch("/api/admin/projects/update-status.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ projectId, status })
    })
    loadProjects()
  }

  const deleteProject = async (slug: string) => {
    const ok = window.confirm(`Delete project "${slug}"? This cannot be undone.`)
    if (!ok) return
    setMessage("")
    const res = await fetch("/api/projects/delete.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ slug })
    })
    const data = await res.json()
    if (data.ok) {
      setMessage("Project deleted")
      loadProjects()
    } else {
      setMessage(data.error || "Failed")
    }
  }

  const handleCreateUser = async (event: React.FormEvent) => {
    event.preventDefault()
    setMessage("")
    const res = await fetch("/api/admin/users/create.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(createUser)
    })
    const data = await res.json()
    if (data.ok) {
      setMessage("User created")
      setCreateUser({ email: "", password: "", role: "participant" })
      loadUsers()
    } else {
      setMessage(data.error || "Failed")
    }
  }

  const handleReset = async (event: React.FormEvent) => {
    event.preventDefault()
    setMessage("")
    const res = await fetch("/api/admin/users/reset-password.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ userId: Number(resetUser.userId), password: resetUser.password })
    })
    const data = await res.json()
    if (data.ok) {
      setMessage("Password reset")
      setResetUser({ userId: "", password: "" })
    } else {
      setMessage(data.error || "Failed")
    }
  }

  return (
      <div className="max-w-6xl mx-auto py-12 space-y-10">
        <section className="bg-base-800/80 border border-white/10 rounded-xl p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
            <a href="/api/admin/export-projects.php" className="px-4 py-2 rounded-lg bg-white text-base-900 font-semibold">
              Export CSV
            </a>
          </div>
          {loadingProjects ? (
              <div className="py-6 text-white/60">Loading projects...</div>
          ) : (
              <div className="mt-6 space-y-4">
                {projects.map((project) => (
                    <div key={project.id} className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-base-900/60 border border-white/10 rounded-lg p-4">
                      <div>
                        <div className="font-semibold">{project.project_name}</div>
                        <div className="text-sm text-white/60">
                          {project.team_name} • {project.status}
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <button onClick={() => updateStatus(project.id, "approved")} className="px-3 py-1 rounded-lg bg-white/10">
                          Approve
                        </button>
                        <button onClick={() => updateStatus(project.id, "hidden")} className="px-3 py-1 rounded-lg bg-white/10">
                          Hide
                        </button>
                        <button onClick={() => updateStatus(project.id, "pending")} className="px-3 py-1 rounded-lg bg-white/10">
                          Unhide
                        </button>
                        <Link to={`/edit/${project.slug}`} className="px-3 py-1 rounded-lg border border-white/10">
                          Edit
                        </Link>
                        <button onClick={() => deleteProject(project.slug)} className="px-3 py-1 rounded-lg bg-white/10">
                          Delete
                        </button>
                      </div>
                    </div>
                ))}
              </div>
          )}
        </section>

        <section className="grid lg:grid-cols-2 gap-6">
          <div className="bg-base-800/80 border border-white/10 rounded-xl p-6 shadow-soft">
            <h2 className="text-lg font-semibold">Create User</h2>
            <form onSubmit={handleCreateUser} className="mt-4 space-y-3">
              <input
                  value={createUser.email}
                  onChange={(e) => setCreateUser({ ...createUser, email: e.target.value })}
                  placeholder="Email"
                  className="w-full bg-base-900 border border-white/10 rounded-lg px-3 py-2"
                  required
              />
              <input
                  type="password"
                  value={createUser.password}
                  onChange={(e) => setCreateUser({ ...createUser, password: e.target.value })}
                  placeholder="Temp Password"
                  className="w-full bg-base-900 border border-white/10 rounded-lg px-3 py-2"
                  required
              />
              <select
                  value={createUser.role}
                  onChange={(e) => setCreateUser({ ...createUser, role: e.target.value as "participant" | "admin" })}
                  className="w-full bg-base-900 border border-white/10 rounded-lg px-3 py-2"
              >
                <option value="participant">Participant</option>
                <option value="admin">Admin</option>
              </select>
              <button type="submit" className="w-full py-2 rounded-lg bg-white text-base-900 font-semibold">
                Create
              </button>
            </form>
          </div>

          <div className="bg-base-800/80 border border-white/10 rounded-xl p-6 shadow-soft">
            <h2 className="text-lg font-semibold">Reset Password</h2>
            <form onSubmit={handleReset} className="mt-4 space-y-3">
              <input
                  value={resetUser.userId}
                  onChange={(e) => setResetUser({ ...resetUser, userId: e.target.value })}
                  placeholder="User ID"
                  className="w-full bg-base-900 border border-white/10 rounded-lg px-3 py-2"
                  required
              />
              <input
                  type="password"
                  value={resetUser.password}
                  onChange={(e) => setResetUser({ ...resetUser, password: e.target.value })}
                  placeholder="New Temp Password"
                  className="w-full bg-base-900 border border-white/10 rounded-lg px-3 py-2"
                  required
              />
              <button type="submit" className="w-full py-2 rounded-lg bg-white text-base-900 font-semibold">
                Reset
              </button>
            </form>
          </div>
        </section>

        <section className="bg-base-800/80 border border-white/10 rounded-xl p-6 shadow-soft">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Users</h2>
            <button onClick={loadUsers} className="px-3 py-1 rounded-lg bg-white/10">
              Refresh
            </button>
          </div>
          {loadingUsers ? (
              <div className="py-6 text-white/60">Loading users...</div>
          ) : (
              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                  <tr className="text-left text-white/60">
                    <th className="py-2 pr-4">ID</th>
                    <th className="py-2 pr-4">Email</th>
                    <th className="py-2 pr-4">Role</th>
                    <th className="py-2 pr-4">Created</th>
                  </tr>
                  </thead>
                  <tbody>
                  {users.map((u) => (
                      <tr key={u.id} className="border-t border-white/10">
                        <td className="py-2 pr-4">{u.id}</td>
                        <td className="py-2 pr-4">{u.email}</td>
                        <td className="py-2 pr-4">{u.role}</td>
                        <td className="py-2 pr-4">{u.created_at}</td>
                      </tr>
                  ))}
                  </tbody>
                </table>
              </div>
          )}
        </section>

        {message && <div className="text-sm text-white/70">{message}</div>}
      </div>
  )
}
