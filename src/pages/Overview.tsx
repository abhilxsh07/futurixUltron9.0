import { Link } from "react-router-dom"
import { prizeTiers, schedule, venue } from "../content/event"
import Iridescence from "../components/Iridescence"

export default function Overview() {
  return (
      <div className="relative w-full min-h-[100dvh] overflow-hidden">
        <div className="fixed inset-0 -z-10 pointer-events-none">
          <Iridescence className="w-screen h-screen" colors={[0, 0.1, 0.1]} speed={1.0} amplitude={0.1} mouseReact />
        </div>

        <div className="max-w-6xl mx-auto py-12 space-y-20">
          <section className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <p className="text-sm uppercase tracking-[0.3em] text-white/60">The next big Hackathon</p>
              <h1 className="text-4xl sm:text-5xl font-semibold">Ultron 9.0</h1>
              <p className="text-white/70 text-lg">

              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/projects" className="px-6 py-3 rounded-xl bg-white text-base-900 font-semibold">
                  View Projects
                </Link>
                <Link to="/signin" className="px-6 py-3 rounded-xl border border-white/20 text-white">
                  Sign In
                </Link>
              </div>
            </div>

            <div className="border-white/10 rounded-xl p-8 shadow-soft">
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
            <div className=" border-white/10 rounded-xl p-8 shadow-soft">
              <h2 className="text-2xl font-semibold">About</h2>
              <p className="mt-4 text-white/70">
                Ultron 9.0 brings your ideas off the page and into action—24 hours of high-energy building, rapid problem-solving, and bold creativity. Teams will brainstorm, prototype, and ship projects that push limits and make an impact.<br /><br />

                Beyond the hackathon, the Open Mic is your space to reset and express—music, poetry, comedy, storytelling, or anything you want to put on stage. No tech required—just talent.<br /><br />

                Whether you’re here to build, perform, or cheer on your friends, Ultron 9.0 is designed to be intense, inclusive, and unforgettable. Step in, stand out, and compete for the win.

              </p>
            </div>
            <div className="bg-base-800/80 border border-white/10 rounded-xl overflow-hidden shadow-soft relative h-64">
              <iframe
                  title="Venue map"
                  src={venue.googleMapsEmbedUrl}
                  className="absolute inset-0 w-full h-full border-0"
                  loading="lazy"
              />
            </div>

          </section>
        </div>
      </div>
  )
}
