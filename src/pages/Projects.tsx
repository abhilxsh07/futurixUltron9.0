import { useEffect, useMemo, useState } from "react"
import { Link } from "react-router-dom"
import ProjectCard, { ProjectSummary } from "../components/ProjectCard"
import ProjectFilters, { Filters } from "../components/ProjectFilters"
import { useAuth } from "../app/auth"

export default function Projects() {
  const [items, setItems] = useState<ProjectSummary[]>([])
  const [total, setTotal] = useState(0)
  const [search, setSearch] = useState("")
  const [filters, setFilters] = useState<Filters>({ track: "", tech: "", compatibility: "" })
  const [mineOnly, setMineOnly] = useState(false)
  const { user, signOut } = useAuth()

  const query = useMemo(() => {
    const params = new URLSearchParams()
    if (search) params.set("search", search)
    if (filters.track) params.set("track", filters.track)
    if (filters.tech) params.set("tech", filters.tech)
    if (filters.compatibility) params.set("compatibility", filters.compatibility)
    if (mineOnly) params.set("mine", "1")
    params.set("page", "1")
    params.set("pageSize", "24")
    params.set("sort", "newest")
    return params.toString()
  }, [search, filters, mineOnly])

  useEffect(() => {
    const load = async () => {
      const res = await fetch(`/api/projects/index.php?${query}`, { credentials: "include" })
      const data = await res.json()
      setItems(data.items || [])
      setTotal(data.total || 0)
    }
    load()
  }, [query])

  return (
      <div className="max-w-6xl mx-auto py-12">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <h1 className="text-3xl font-semibold">Projects ({total})</h1>
            <p className="text-white/60 mt-2">Discover what teams built during Ultron 9.0.</p>
          </div>

          <div className="flex flex-wrap gap-3 items-center">
            <div className="bg-base-800 border border-white/10 rounded-lg flex items-center px-3">
              <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search for projects by name"
                  className="bg-transparent py-2 text-sm outline-none w-64"
              />
            </div>

            <ProjectFilters value={filters} onChange={setFilters} />

            {user && (
                <button onClick={() => setMineOnly((v) => !v)} className="px-4 py-2 rounded-lg border border-white/10">
                  {mineOnly ? "Showing: My submissions" : "Showing: All"}
                </button>
            )}

            {user ? (
                <>
                  <Link to="/submit" className="px-4 py-2 rounded-lg bg-white text-base-900 font-semibold">
                    Submit project
                  </Link>
                  <button onClick={signOut} className="px-4 py-2 rounded-lg border border-white/10">
                    Sign out
                  </button>
                </>
            ) : (
                <Link to="/signin" className="px-4 py-2 rounded-lg border border-white/10">
                  Sign in to submit
                </Link>
            )}
          </div>
        </div>

        <div className="mt-10 grid md:grid-cols-2 gap-6">
          {items.map((project) => (
              <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
  )
}
