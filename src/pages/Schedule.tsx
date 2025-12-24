import { schedule } from "../content/event"

export default function Schedule() {
  return (
    <div className="max-w-5xl mx-auto py-12">
      <h1 className="text-3xl font-semibold">Schedule</h1>
      <div className="mt-10 space-y-6">
        {schedule.map((item) => (
          <div key={item.time} className="flex gap-6 items-start">
            <div className="text-white/50 text-sm w-20">{item.time}</div>
            <div className="flex-1 bg-base-800/80 border border-white/10 rounded-xl p-6 shadow-soft">
              <h2 className="text-lg font-semibold">{item.title}</h2>
              <p className="mt-2 text-white/70">{item.detail}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
