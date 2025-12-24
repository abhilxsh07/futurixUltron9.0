import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { useAuth } from "../app/auth"

const parseList = (value: string) => value.split(",").map((item) => item.trim()).filter(Boolean)

export default function EditProject() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [loading, setLoading] = useState(true)
  const [canEdit, setCanEdit] = useState(true)
  const [lockReason, setLockReason] = useState("")
  const [deadlineLabel, setDeadlineLabel] = useState("")
  const [projectStatus, setProjectStatus] = useState<"pending" | "approved" | "hidden" | "">("")
  const [form, setForm] = useState({
    project_name: "",
    logo_url: "",
    description: "",
    use_case: "",
    challenges: "",
    tech_stack: "",
    compatibility: "web",
    team_name: "",
    team_members: "",
    github_url: "",
    demo_url: "",
    docs_url: "",
    video_url: "",
    screenshots_urls: "",
    track: ""
  })
  const [error, setError] = useState("")

  useEffect(() => {
    const load = async () => {
      setLoading(true)
      setError("")
      setLockReason("")
      try {
        const res = await fetch(`/api/projects/get.php?slug=${slug}`, { credentials: "include" })
        const data = await res.json()

        if (!res.ok || !data.project) {
          setError(data?.error || "Failed to load project")
          setCanEdit(false)
          setLoading(false)
          return
        }

        const project = data.project
        setForm({
          project_name: project.project_name,
          logo_url: project.logo_url,
          description: project.description,
          use_case: project.use_case,
          challenges: project.challenges,
          tech_stack: (project.tech_stack || []).join(", "),
          compatibility: project.compatibility,
          team_name: project.team_name,
          team_members: (project.team_members || []).join(", "),
          github_url: project.links?.github_url || "",
          demo_url: project.links?.demo_url || "",
          docs_url: project.links?.docs_url || "",
          video_url: project.links?.video_url || "",
          screenshots_urls: (project.screenshots || []).join(", "),
          track: project.track || ""
        })

        setDeadlineLabel(project.deadline_label || "")
        const status = (project.status || "") as "pending" | "approved" | "hidden" | ""
        setProjectStatus(status)

        const isAdmin = user?.role === "admin"
        const editsOpen = !!project.edits_open
        const isPending = status === "" ? true : status === "pending"
        const allowed = !!isAdmin || (editsOpen && isPending)

        setCanEdit(allowed)

        if (!allowed && !isAdmin) {
          if (!editsOpen) setLockReason("Edits closed")
          else if (!isPending) setLockReason("Edits locked")
          else setLockReason("Forbidden")
        }
      } catch {
        setError("Failed to load project")
        setCanEdit(false)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [slug, user])

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError("")
    if (!canEdit) {
      setError(lockReason || "Edits not allowed")
      return
    }

    const payload = {
      slug,
      ...form,
      tech_stack: parseList(form.tech_stack),
      team_members: parseList(form.team_members),
      screenshots_urls: parseList(form.screenshots_urls)
    }

    const res = await fetch("/api/projects/update.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload)
    })

    const data = await res.json()
    if (data.ok) {
      navigate(`/projects/${slug}`)
    } else {
      setError(data.error || "Update failed")
    }
  }

  if (loading) {
    return <div className="py-20 text-center text-white/70">Loading...</div>
  }

  return (
      <div className="max-w-3xl mx-auto py-12">
        <div className="bg-base-800/80 border border-white/10 rounded-xl p-8 shadow-soft">
          <h1 className="text-2xl font-semibold">Edit Project</h1>
          <p className="text-white/60 mt-2">{deadlineLabel}</p>
          {projectStatus && <p className="text-white/60 mt-1">Status: {projectStatus}</p>}
          {!!lockReason && <p className="text-sm text-red-400 mt-3">{lockReason}</p>}
          {error && <p className="text-sm text-red-400 mt-3">{error}</p>}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-sm text-white/70">Project Name</label>
              <input value={form.project_name} onChange={(e) => setForm({ ...form, project_name: e.target.value })} className="mt-2 w-full bg-base-900 border border-white/10 rounded-lg px-3 py-2" required disabled={!canEdit} />
            </div>
            <div>
              <label className="text-sm text-white/70">Logo URL</label>
              <input value={form.logo_url} onChange={(e) => setForm({ ...form, logo_url: e.target.value })} className="mt-2 w-full bg-base-900 border border-white/10 rounded-lg px-3 py-2" required disabled={!canEdit} />
            </div>
            <div>
              <label className="text-sm text-white/70">Short Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-2 w-full bg-base-900 border border-white/10 rounded-lg px-3 py-2 min-h-[120px]" required disabled={!canEdit} />
            </div>
            <div>
              <label className="text-sm text-white/70">Use Case</label>
              <textarea value={form.use_case} onChange={(e) => setForm({ ...form, use_case: e.target.value })} className="mt-2 w-full bg-base-900 border border-white/10 rounded-lg px-3 py-2 min-h-[120px]" required disabled={!canEdit} />
            </div>
            <div>
              <label className="text-sm text-white/70">Challenges</label>
              <textarea value={form.challenges} onChange={(e) => setForm({ ...form, challenges: e.target.value })} className="mt-2 w-full bg-base-900 border border-white/10 rounded-lg px-3 py-2 min-h-[120px]" required disabled={!canEdit} />
            </div>
            <div>
              <label className="text-sm text-white/70">Tech Stack (comma separated)</label>
              <input value={form.tech_stack} onChange={(e) => setForm({ ...form, tech_stack: e.target.value })} className="mt-2 w-full bg-base-900 border border-white/10 rounded-lg px-3 py-2" required disabled={!canEdit} />
            </div>
            <div>
              <label className="text-sm text-white/70">Compatibility</label>
              <select value={form.compatibility} onChange={(e) => setForm({ ...form, compatibility: e.target.value })} className="mt-2 w-full bg-base-900 border border-white/10 rounded-lg px-3 py-2" disabled={!canEdit}>
                <option value="web">Web</option>
                <option value="android">Android</option>
                <option value="ios">iOS</option>
                <option value="desktop">Desktop</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-white/70">Team Name</label>
              <input value={form.team_name} onChange={(e) => setForm({ ...form, team_name: e.target.value })} className="mt-2 w-full bg-base-900 border border-white/10 rounded-lg px-3 py-2" required disabled={!canEdit} />
            </div>
            <div>
              <label className="text-sm text-white/70">Team Members (comma separated)</label>
              <input value={form.team_members} onChange={(e) => setForm({ ...form, team_members: e.target.value })} className="mt-2 w-full bg-base-900 border border-white/10 rounded-lg px-3 py-2" required disabled={!canEdit} />
            </div>
            <div>
              <label className="text-sm text-white/70">GitHub URL</label>
              <input value={form.github_url} onChange={(e) => setForm({ ...form, github_url: e.target.value })} className="mt-2 w-full bg-base-900 border border-white/10 rounded-lg px-3 py-2" required disabled={!canEdit} />
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-white/70">Demo URL</label>
                <input value={form.demo_url} onChange={(e) => setForm({ ...form, demo_url: e.target.value })} className="mt-2 w-full bg-base-900 border border-white/10 rounded-lg px-3 py-2" disabled={!canEdit} />
              </div>
              <div>
                <label className="text-sm text-white/70">Docs URL</label>
                <input value={form.docs_url} onChange={(e) => setForm({ ...form, docs_url: e.target.value })} className="mt-2 w-full bg-base-900 border border-white/10 rounded-lg px-3 py-2" disabled={!canEdit} />
              </div>
              <div>
                <label className="text-sm text-white/70">Video URL</label>
                <input value={form.video_url} onChange={(e) => setForm({ ...form, video_url: e.target.value })} className="mt-2 w-full bg-base-900 border border-white/10 rounded-lg px-3 py-2" disabled={!canEdit} />
              </div>
            </div>
            <div>
              <label className="text-sm text-white/70">Screenshot URLs (comma separated)</label>
              <input value={form.screenshots_urls} onChange={(e) => setForm({ ...form, screenshots_urls: e.target.value })} className="mt-2 w-full bg-base-900 border border-white/10 rounded-lg px-3 py-2" disabled={!canEdit} />
            </div>
            <div>
              <label className="text-sm text-white/70">Track</label>
              <input value={form.track} onChange={(e) => setForm({ ...form, track: e.target.value })} className="mt-2 w-full bg-base-900 border border-white/10 rounded-lg px-3 py-2" disabled={!canEdit} />
            </div>
            <button type="submit" className="w-full py-3 rounded-lg bg-white text-base-900 font-semibold" disabled={!canEdit}>
              Save Changes
            </button>
          </form>
        </div>
      </div>
  )
}
