import { useEffect, useRef } from "react"

export default function ParallaxBackground() {
  const ref = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return
    const media = window.matchMedia("(prefers-reduced-motion: reduce)")
    const small = window.matchMedia("(max-width: 640px)")
    if (media.matches || small.matches) return
    let frame = 0
    let targetX = 0
    let targetY = 0
    const onMove = (event: MouseEvent) => {
      const x = (event.clientX / window.innerWidth - 0.5) * 20
      const y = (event.clientY / window.innerHeight - 0.5) * 20
      targetX = x
      targetY = y
    }
    const tick = () => {
      const blobNodes = element.querySelectorAll<HTMLDivElement>("[data-blob]")
      blobNodes.forEach((node, index) => {
        const factor = (index + 1) * 0.4
        node.style.transform = `translate3d(${targetX * factor}px, ${targetY * factor}px, 0)`
      })
      frame = requestAnimationFrame(tick)
    }
    window.addEventListener("mousemove", onMove)
    frame = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener("mousemove", onMove)
      cancelAnimationFrame(frame)
    }
  }, [])

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden">
      <div data-blob className="absolute -top-20 -left-20 w-80 h-80 bg-glow-purple/30 blur-3xl rounded-full" />
      <div data-blob className="absolute top-1/3 -right-16 w-96 h-96 bg-glow-blue/20 blur-3xl rounded-full" />
      <div data-blob className="absolute bottom-0 left-1/3 w-72 h-72 bg-glow-pink/20 blur-3xl rounded-full" />
    </div>
  )
}
