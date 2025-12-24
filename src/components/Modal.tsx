import React from "react"

export default function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
  if (!open) return null
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="bg-base-800 border border-white/10 rounded-xl shadow-soft p-6 w-full max-w-lg">
        <div className="flex justify-end">
          <button onClick={onClose} className="text-white/60 hover:text-white">Close</button>
        </div>
        {children}
      </div>
    </div>
  )
}
