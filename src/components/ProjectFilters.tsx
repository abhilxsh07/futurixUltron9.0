import { useState } from "react"
import Modal from "./Modal"

export type Filters = {
  track: string
  tech: string
  compatibility: string
}

export default function ProjectFilters({ value, onChange }: { value: Filters; onChange: (next: Filters) => void }) {
  const [open, setOpen] = useState(false)
  const [local, setLocal] = useState(value)

  const apply = () => {
    onChange(local)
    setOpen(false)
  }

  return (
    <>
      <button onClick={() => { setLocal(value); setOpen(true) }} className="px-4 py-2 rounded-lg bg-base-700 border border-white/10">Filters</button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <div className="space-y-4">
          <div>
            <label className="text-sm text-white/70">Track</label>
            <input value={local.track} onChange={(e) => setLocal({ ...local, track: e.target.value })} className="mt-2 w-full bg-base-900 border border-white/10 rounded-lg px-3 py-2" placeholder="AI, Health, Web3" />
          </div>
          <div>
            <label className="text-sm text-white/70">Tech</label>
            <input value={local.tech} onChange={(e) => setLocal({ ...local, tech: e.target.value })} className="mt-2 w-full bg-base-900 border border-white/10 rounded-lg px-3 py-2" placeholder="React, Python" />
          </div>
          <div>
            <label className="text-sm text-white/70">Compatibility</label>
            <select value={local.compatibility} onChange={(e) => setLocal({ ...local, compatibility: e.target.value })} className="mt-2 w-full bg-base-900 border border-white/10 rounded-lg px-3 py-2">
              <option value="">Any</option>
              <option value="web">Web</option>
              <option value="android">Android</option>
              <option value="ios">iOS</option>
              <option value="desktop">Desktop</option>
              <option value="other">Other</option>
            </select>
          </div>
          <button onClick={apply} className="w-full py-2 rounded-lg bg-white text-base-900 font-semibold">Apply</button>
        </div>
      </Modal>
    </>
  )
}
