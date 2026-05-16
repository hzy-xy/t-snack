import { useGameStore } from '@/store/gameStore'
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'

export default function TouchControls() {
  const setDirection = useGameStore((s) => s.setDirection)

  const btnClass =
    'w-16 h-16 sm:w-[4.5rem] sm:h-[4.5rem] flex items-center justify-center bg-white border-2 border-surface-border rounded-2xl text-ink-subtle hover:text-ink hover:border-ink-faint active:bg-surface-alt active:scale-95 transition-all duration-100 touch-manipulation cursor-pointer'

  return (
    <div className="flex flex-col items-center gap-1 sm:gap-1.5 md:hidden">
      <button onClick={() => setDirection('UP')} className={btnClass}>
        <ChevronUp size={32} />
      </button>
      <div className="flex gap-1 sm:gap-1.5">
        <button onClick={() => setDirection('LEFT')} className={btnClass}>
          <ChevronLeft size={32} />
        </button>
        <button onClick={() => setDirection('DOWN')} className={btnClass}>
          <ChevronDown size={32} />
        </button>
        <button onClick={() => setDirection('RIGHT')} className={btnClass}>
          <ChevronRight size={32} />
        </button>
      </div>
    </div>
  )
}