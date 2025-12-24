import { useState } from "react"
import Lightbox from "./Lightbox"

export default function ScreenshotCarousel({ images }: { images: string[] }) {
  const [active, setActive] = useState<string | null>(null)
  if (images.length === 0) {
    return <div className="text-white/40 text-sm">No screenshots provided.</div>
  }
  return (
    <>
      <div className="flex gap-3 overflow-x-auto pb-3">
        {images.map((src) => (
          <button key={src} onClick={() => setActive(src)} className="shrink-0">
            <img src={src} alt="Project screenshot" className="w-56 h-32 rounded-lg object-cover border border-white/10" />
          </button>
        ))}
      </div>
      <Lightbox src={active} onClose={() => setActive(null)} />
    </>
  )
}
