"use client"

import { Plus } from "lucide-react"

interface FloatingActionButtonProps {
  onClick: () => void
}

export default function FloatingActionButton({
  onClick,
}: FloatingActionButtonProps) {
  return (
    <button
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
        onClick()
      }}
      className="fixed bottom-6 right-6 z-50 h-16 w-16 rounded-full bg-primary text-primary-foreground shadow-2xl hover:bg-primary/90 transition-all hover:scale-110 active:scale-95 flex items-center justify-center border-2 border-border cursor-pointer"
      aria-label="Aggiungi partita"
      type="button"
      style={{ 
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 50
      }}
    >
      <Plus className="h-7 w-7" strokeWidth={3} />
    </button>
  )
}

