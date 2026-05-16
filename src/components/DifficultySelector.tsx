import { useGameStore } from '@/store/gameStore'
import { useI18n } from '@/i18n'
import type { Difficulty } from '@/store/gameStore'

const DIFFICULTIES: { key: Difficulty; labelKey: string; descKey: string }[] = [
  { key: 'easy', labelKey: 'easy', descKey: '240ms' },
  { key: 'normal', labelKey: 'normal', descKey: '160ms' },
  { key: 'hard', labelKey: 'hard', descKey: '100ms' },
]

export default function DifficultySelector() {
  const { t } = useI18n()
  const difficulty = useGameStore((s) => s.difficulty)
  const status = useGameStore((s) => s.status)
  const setDifficulty = useGameStore((s) => s.setDifficulty)
  const disabled = status === 'playing'

  return (
    <div className="w-full">
      <div className="flex rounded-lg overflow-hidden border border-surface-border bg-surface-alt">
        {DIFFICULTIES.map((d) => {
          const active = difficulty === d.key
          return (
            <button
              key={d.key}
              disabled={disabled}
              onClick={() => setDifficulty(d.key)}
              className={`flex-1 py-2 text-xs font-medium tracking-wide transition-colors duration-150 ${
                active
                  ? 'bg-white text-ink shadow-sm border-x border-surface-border'
                  : 'text-ink-subtle hover:text-ink-muted'
              } ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}`}
            >
              <div>{t(d.labelKey)}</div>
              <div className={`text-[10px] ${active ? 'text-ink-subtle' : 'text-ink-faint'}`}>
                {d.descKey}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}