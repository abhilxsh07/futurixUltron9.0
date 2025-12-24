import { Link } from "react-router-dom"
import Chip from "./Chip"

export type ProjectSummary = {
  id: number
  slug: string
  project_name: string
  logo_url: string
  description: string
  team_name: string
  track: string | null
  likes_count: number
  status: "pending" | "approved" | "hidden"
  viewer_liked?: 0 | 1
}

export default function ProjectCard({ project }: { project: ProjectSummary }) {
  return (
      <Link to={`/projects/${project.slug}`} className="group">
        <div className="bg-base-800/80 border border-white/10 rounded-xl p-5 shadow-soft transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-glow">
          <div className="flex items-center gap-4">
            <img src={project.logo_url} alt={project.project_name} className="w-12 h-12 rounded-lg object-cover" />
            <div>
              <h3 className="text-lg font-semibold">{project.project_name}</h3>
              <p className="text-sm text-white/60">By {project.team_name}</p>
            </div>
          </div>

          <p className="mt-4 text-sm text-white/70 line-clamp-3">{project.description}</p>

          <div className="mt-4 flex flex-wrap gap-2">
            <Chip label="Built at Ultron 9.0" />
            {project.track && <Chip label={project.track} />}
            {project.status !== "approved" && <Chip label={project.status} />}
          </div>

          <div className="mt-4 text-xs text-white/50">{project.likes_count} likes</div>
        </div>
      </Link>
  )
}
