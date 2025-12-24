import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { submissionDeadlineIso } from "../content/event"
import { useAuth } from "../app/auth"

const parseList = (value: string) => value.split(",").map((item) => item.trim()).filter(Boolean)

export default function SubmitProject() {
  const navigate = useNavigate()
  const { user } = useAuth()

  const deadlineTs = useMemo(() => {
    if (!submissionDeadlineIso) return null
    const d = new Date(submissionDeadlineIso)
    return Number.isNaN(d.getTime()) ? null : d.getTime()
  }, [])

  const submissionsOpen = useMemo(() => {
    if (!deadlineTs) return true
    return Date.now() < deadlineTs
  }, [deadlineTs])

  const canSubmit = useMemo(() => {
    if (!user) return false
    if (user.role === "admin") return true
    return submissionsOpen
  }, [user, submissionsOpen])

  const deadlineLabel = submissionDeadlineIso ? `Deadline: ${new Date(submissionDeadlineIso).toLocaleString()}` : "Deadline: TBD"

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

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError("")
    if (!canSubmit) {
      setError("Submissions closed")
      return
    }
    const payload = {
      ...form,
      tech_stack: parseList(form.tech_stack),
      team_members: parseList(form.team_members),
      screenshots_urls: parseList(form.screenshots_urls)
    }
    const res = await fetch("/api/projects/create.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload)
    })
    const data = await res.json()
    if (data.ok) {
      navigate(`/projects/${data.slug}`)
    } else {
      setError(data.error || "Submission failed")
    }
  }

  return (
      <div className="max-w-3xl mx-auto py-12">
        <div className="bg-base-800/80 border border-white/10 rounded-xl p-8 shadow-soft">
          <h1 className="text-2xl font-semibold">Submit Project</h1>
          <p className="text-white/60 mt-2">{deadlineLabel}</p>
          {!canSubmit && <p className="text-sm text-red-400 mt-3">Submissions are closed.</p>}

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label className="text-sm text-white/70">Project Name</label>
              <input value={form.project_name} onChange={(e) => setForm({ ...form, project_name: e.target.value })} className="mt-2 w-full bg-base-900 border border-white/10 rounded-lg px-3 py-2" required disabled={!canSubmit} />
            </div>
            <div>
              <label className="text-sm text-white/70">Logo URL</label>
              <input value={form.logo_url} onChange={(e) => setForm({ ...form, logo_url: e.target.value })} className="mt-2 w-full bg-base-900 border border-white/10 rounded-lg px-3 py-2" required disabled={!canSubmit} />
            </div>
            <div>
              <label className="text-sm text-white/70">Short Description</label>
              <textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="mt-2 w-full bg-base-900 border border-white/10 rounded-lg px-3 py-2 min-h-[120px]" required disabled={!canSubmit} />
            </div>
            <div>
              <label className="text-sm text-white/70">Use Case</label>
              <textarea value={form.use_case} onChange={(e) => setForm({ ...form, use_case: e.target.value })} className="mt-2 w-full bg-base-900 border border-white/10 rounded-lg px-3 py-2 min-h-[120px]" required disabled={!canSubmit} />
            </div>
            <div>
              <label className="text-sm text-white/70">Challenges</label>
              <textarea value={form.challenges} onChange={(e) => setForm({ ...form, challenges: e.target.value })} className="mt-2 w-full bg-base-900 border border-white/10 rounded-lg px-3 py-2 min-h-[120px]" required disabled={!canSubmit} />
            </div>
            <div>
              <label className="text-sm text-white/70">Tech Stack (comma separated)</label>
              <input value={form.tech_stack} onChange={(e) => setForm({ ...form, tech_stack: e.target.value })} className="mt-2 w-full bg-base-900 border border-white/10 rounded-lg px-3 py-2" required disabled={!canSubmit} />
            </div>
            <div>
              <label className="text-sm text-white/70">Compatibility</label>
              <select value={form.compatibility} onChange={(e) => setForm({ ...form, compatibility: e.target.value })} className="mt-2 w-full bg-base-900 border border-white/10 rounded-lg px-3 py-2" disabled={!canSubmit}>
                <option value="web">Web</option>
                <option value="android">Android</option>
                <option value="ios">iOS</option>
                <option value="desktop">Desktop</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="text-sm text-white/70">Team Name</label>
              <input value={form.team_name} onChange={(e) => setForm({ ...form, team_name: e.target.value })} className="mt-2 w-full bg-base-900 border border-white/10 rounded-lg px-3 py-2" required disabled={!canSubmit} />
            </div>
            <div>
              <label className="text-sm text-white/70">Team Members (comma separated)</label>
              <input value={form.team_members} onChange={(e) => setForm({ ...form, team_members: e.target.value })} className="mt-2 w-full bg-base-900 border border-white/10 rounded-lg px-3 py-2" required disabled={!canSubmit} />
            </div>
            <div>
              <label className="text-sm text-white/70">GitHub URL</label>
              <input value={form.github_url} onChange={(e) => setForm({ ...form, github_url: e.target.value })} className="mt-2 w-full bg-base-900 border border-white/10 rounded-lg px-3 py-2" required disabled={!canSubmit} />
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="text-sm text-white/70">Demo URL</label>
                <input value={form.demo_url} onChange={(e) => setForm({ ...form, demo_url: e.target.value })} className="mt-2 w-full bg-base-900 border border-white/10 rounded-lg px-3 py-2" disabled={!canSubmit} />
              </div>
              <div>
                <label className="text-sm text-white/70">Docs URL</label>
                <input value={form.docs_url} onChange={(e) => setForm({ ...form, docs_url: e.target.value })} className="mt-2 w-full bg-base-900 border border-white/10 rounded-lg px-3 py-2" disabled={!canSubmit} />
              </div>
              <div>
                <label className="text-sm text-white/70">Video URL</label>
                <input value={form.video_url} onChange={(e) => setForm({ ...form, video_url: e.target.value })} className="mt-2 w-full bg-base-900 border border-white/10 rounded-lg px-3 py-2" disabled={!canSubmit} />
              </div>
            </div>
            <div>
              <label className="text-sm text-white/70">Screenshot URLs (comma separated)</label>
              <input value={form.screenshots_urls} onChange={(e) => setForm({ ...form, screenshots_urls: e.target.value })} className="mt-2 w-full bg-base-900 border border-white/10 rounded-lg px-3 py-2" disabled={!canSubmit} />
            </div>
            <div>
              <label className="text-sm text-white/70">Track</label>
              <input value={form.track} onChange={(e) => setForm({ ...form, track: e.target.value })} className="mt-2 w-full bg-base-900 border border-white/10 rounded-lg px-3 py-2" disabled={!canSubmit} />
            </div>
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button type="submit" className="w-full py-3 rounded-lg bg-white text-base-900 font-semibold" disabled={!canSubmit}>
              Submit
            </button>
          </form>
        </div>
      </div>
  )
}
