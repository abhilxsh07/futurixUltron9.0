import { prizeTiers } from "../content/event"

export default function Prizes() {
  return (
    <div className="max-w-5xl mx-auto py-12">
      <h1 className="text-3xl font-semibold">Prizes</h1>
      <div className="mt-8 grid md:grid-cols-3 gap-6">
        {prizeTiers.map((tier) => (
          <div key={tier.title} className="bg-base-800/80 border border-white/10 rounded-xl p-6 shadow-soft">
            <h2 className="text-xl font-semibold">{tier.title}</h2>
            <p className="mt-3 text-white/70">{tier.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
