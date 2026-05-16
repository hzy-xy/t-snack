import { useGameStore } from '@/store/gameStore'
import { useI18n } from '@/i18n'
import { Play, Pause, RotateCcw } from 'lucide-react'

interface Props {
  onStart: () => void
  onPause: () => void
  onRestart: () => void
}

export default function ControlButtons({ onStart, onPause, onRestart }: Props) {
  const { t } = useI18n()
  const status = useGameStore((s) => s.status)

  const btnBase =
    'flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-medium transition-colors duration-150 cursor-pointer'

  const primaryBtn = `${btnBase} bg-ink text-white hover:bg-ink/85 active:bg-ink/70`

  const secondaryBtn = `${btnBase} bg-surface-alt border border-surface-border text-ink-muted hover:bg-surface-hover hover:border-ink-faint`

  return (
    <div className="flex flex-col gap-2.5">
      <div className="flex gap-2.5">
        {status === 'idle' || status === 'gameover' ? (
          <button onClick={onStart} className={`${primaryBtn} flex-1`}>
            <Play size={18} />
            {t('start')}
          </button>
        ) : (
          <button onClick={onPause} className={`${primaryBtn} flex-1`}>
            {status === 'playing' ? <Pause size={18} /> : <Play size={18} />}
            {status === 'playing' ? t('pause') : t('resume')}
          </button>
        )}
        <button onClick={onRestart} className={secondaryBtn}>
          <RotateCcw size={18} />
        </button>
      </div>
    </div>
  )
}