import { Link } from "react-router-dom"
import { prizeTiers, schedule, venue } from "../content/event"

export default function Overview() {
  return (
    <div className="max-w-6xl mx-auto py-12 space-y-20">
      <section className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <p className="text-sm uppercase tracking-[0.3em] text-white/60">Futurix Hackathon</p>
          <h1 className="text-4xl sm:text-5xl font-semibold">Ultron 9.0</h1>
          <p className="text-white/70 text-lg">Build the next wave of intelligent experiences in a focused, high-energy hackathon. Ship fast, demo big, and connect with the Futurix community.</p>
          <div className="flex flex-wrap gap-4">
            <Link to="/projects" className="px-6 py-3 rounded-xl bg-white text-base-900 font-semibold">View Projects</Link>
            <Link to="/signin" className="px-6 py-3 rounded-xl border border-white/20 text-white">Sign In</Link>
          </div>
        </div>
        <div className="bg-base-800/80 border border-white/10 rounded-xl p-8 shadow-soft">
          <h2 className="text-xl font-semibold">Event Snapshot</h2>
          <div className="mt-6 space-y-4">
            <div>
              <p className="text-white/50 text-sm">Venue</p>
              <p className="text-white">{venue.name}</p>
              <p className="text-white/60 text-sm">{venue.address}</p>
            </div>
            <div>
              <p className="text-white/50 text-sm">Prizes</p>
              <p className="text-white/80">{prizeTiers.map((tier) => tier.title).join(" • ")}</p>
            </div>
            <div>
              <p className="text-white/50 text-sm">Schedule</p>
              <p className="text-white/80">{schedule.length} sessions across one epic day.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="grid lg:grid-cols-2 gap-10">
        <div className="bg-base-800/80 border border-white/10 rounded-xl p-8 shadow-soft">
          <h2 className="text-2xl font-semibold">About Ultron 9.0</h2>
          <p className="mt-4 text-white/70">Ultron 9.0 is Futurix's flagship hackathon for builders, designers, and visionaries. Collaborate, experiment, and launch futuristic products with the help of mentors and judges.</p>
        </div>
        <div className="bg-base-800/80 border border-white/10 rounded-xl overflow-hidden shadow-soft">
          <iframe title="Venue map" src={venue.googleMapsEmbedUrl} className="w-full h-64" loading="lazy" />
        </div>
      </section>
    </div>
  )
}
