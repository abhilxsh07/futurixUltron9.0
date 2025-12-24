import { useEffect, useMemo, useState } from "react"
import { Link, useNavigate, useParams } from "react-router-dom"
import Chip from "../components/Chip"
import ScreenshotCarousel from "../components/ScreenshotCarousel"
import { useAuth } from "../app/auth"

type ProjectDetailData = {
  id: number
  slug: string
  project_name: string
  logo_url: string
  description: string
  use_case: string
  challenges: string
  tech_stack: string[]
  compatibility: string
  team_name: string
  team_members: string[]
  links: Record<string, string>
  screenshots: string[]
  track: string | null
  likes_count: number
  viewer_liked: 0 | 1
  status: string
  created_by_user_id: number
  edits_open: boolean
  deadline_label: string
}

export default function ProjectDetail() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const [project, setProject] = useState<ProjectDetailData | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/projects/get.php?slug=${slug}`, { credentials: "include" })
      const data = await res.json()
      setProject(data.project || null)
    }
    load()
  }, [slug])

  const canEdit = useMemo(() => {
    if (!user || !project) return false
    if (user.role === "admin") return true
    if (user.id !== project.created_by_user_id) return false
    return project.edits_open
  }, [user, project])

  const toggleLike = async () => {
    if (!project) return
    if (!user) {
      navigate("/signin")
      return
    }
    const endpoint = project.viewer_liked ? "/api/projects/unlike.php" : "/api/projects/like.php"
    const res = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ slug: project.slug })
    })
    const data = await res.json()
    if (!data.ok) return
    setProject((prev) =>
        prev
            ? {
              ...prev,
              likes_count: data.likes_count,
              viewer_liked: data.viewer_liked ? 1 : 0
            }
            : prev
    )
  }

  const deleteProject = async () => {
    if (!project) return
    if (!user || user.role !== "admin") return
    const ok = window.confirm("Delete this project? This cannot be undone.")
    if (!ok) return

    const res = await fetch("/api/projects/delete.php", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ slug: project.slug })
    })
    const data = await res.json()
    if (data.ok) {
      navigate("/projects")
    }
  }

  if (!project) {
    return <div className="py-20 text-center text-white/70">Loading project...</div>
  }

  return (
      <div className="max-w-6xl mx-auto py-12 space-y-10">
        <div className="bg-base-800/80 border border-white/10 rounded-xl p-8 shadow-soft">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            <img src={project.logo_url} alt={project.project_name} className="w-20 h-20 rounded-xl object-cover" />
            <div>
              <h1 className="text-3xl font-semibold">{project.project_name}</h1>
              <p className="text-white/70 mt-2">{project.description}</p>
              <div className="mt-3 text-sm text-white/60">By {project.team_name}</div>
              <div className="mt-3 flex flex-wrap gap-2">
                <Chip label="Built at Ultron 9.0" />
                {project.track && <Chip label={project.track} />}
                <button onClick={toggleLike} className="px-3 py-1 rounded-full text-xs bg-white/10 border border-white/10">
                  {project.viewer_liked ? "Unlike" : "Like"} • {project.likes_count}
                </button>
              </div>
            </div>
            <div className="md:ml-auto text-sm text-white/60">{project.deadline_label}</div>
          </div>
        </div>

        <div className="bg-base-800/80 border border-white/10 rounded-xl p-6 shadow-soft">
          <h2 className="text-lg font-semibold mb-4">Screenshots</h2>
          <ScreenshotCarousel images={project.screenshots} />
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-base-800/80 border border-white/10 rounded-xl p-6 shadow-soft">
              <h3 className="text-lg font-semibold">Project Links</h3>
              <div className="mt-4 flex flex-col gap-3">
                {Object.entries(project.links).map(([label, url]) => (
                    <a key={label} href={url} className="px-4 py-3 rounded-lg bg-base-900 border border-white/10" target="_blank" rel="noreferrer">
                      {label}
                    </a>
                ))}
              </div>
            </div>
            <div className="bg-base-800/80 border border-white/10 rounded-xl p-6 shadow-soft">
              <h3 className="text-lg font-semibold">Team</h3>
              <p className="text-white/70 mt-2">{project.team_name}</p>
              <ul className="mt-4 space-y-2 text-white/60">
                {project.team_members.map((member) => (
                    <li key={member}>{member}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="space-y-6">
            <div className="bg-base-800/80 border border-white/10 rounded-xl p-6 shadow-soft">
              <h3 className="text-lg font-semibold">Use Case</h3>
              <p className="mt-3 text-white/70">{project.use_case}</p>
            </div>
            <div className="bg-base-800/80 border border-white/10 rounded-xl p-6 shadow-soft">
              <h3 className="text-lg font-semibold">Challenges</h3>
              <p className="mt-3 text-white/70">{project.challenges}</p>
            </div>
            <div className="bg-base-800/80 border border-white/10 rounded-xl p-6 shadow-soft">
              <h3 className="text-lg font-semibold">Tech Stack</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.tech_stack.map((tech) => (
                    <Chip key={tech} label={tech} />
                ))}
              </div>
            </div>
            <div className="bg-base-800/80 border border-white/10 rounded-xl p-6 shadow-soft">
              <h3 className="text-lg font-semibold">Compatibility</h3>
              <p className="mt-3 text-white/70">{project.compatibility}</p>
            </div>
            {project.track && (
                <div className="bg-base-800/80 border border-white/10 rounded-xl p-6 shadow-soft">
                  <h3 className="text-lg font-semibold">Track</h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Chip label={project.track} />
                  </div>
                </div>
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-4">
          {canEdit && <Link to={`/edit/${project.slug}`} className="px-5 py-2 rounded-lg bg-white text-base-900 font-semibold">Edit Project</Link>}
          {user?.role === "admin" && <Link to="/admin" className="px-5 py-2 rounded-lg border border-white/10">Moderate</Link>}
          {user?.role === "admin" && (
              <button onClick={deleteProject} className="px-5 py-2 rounded-lg border border-red-500/30 text-red-300">
                Delete
              </button>
          )}
        </div>
      </div>
  )
}
