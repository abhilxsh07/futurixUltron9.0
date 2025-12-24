export default function Lightbox({ src, onClose }: { src: string | null; onClose: () => void }) {
  if (!src) return null
  return (
    <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center" onClick={onClose}>
      <img src={src} alt="Screenshot" className="max-w-4xl w-full max-h-[80vh] object-contain" />
    </div>
  )
}
