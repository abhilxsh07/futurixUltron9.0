export default function Chip({ label }: { label: string }) {
  return (
    <span className="px-3 py-1 text-xs rounded-full bg-white/10 text-white/70 border border-white/10">
      {label}
    </span>
  )
}
