import { useRef, useEffect, useState } from 'react'
import { useGameStore } from '@/store/gameStore'
import { useI18n } from '@/i18n'

export default function ScorePanel() {
  const { t } = useI18n()
  const score = useGameStore((s) => s.score)
  const highScore = useGameStore((s) => s.highScore)
  const [pop, setPop] = useState(false)
  const prevScore = useRef(0)

  useEffect(() => {
    if (score > prevScore.current && prevScore.current > 0) {
      setPop(true)
      const t = setTimeout(() => setPop(false), 300)
      return () => clearTimeout(t)
    }
    prevScore.current = score
  }, [score])

  return (
    <div className="space-y-3">
      <div className="bg-surface-alt rounded-lg border border-surface-border p-4">
        <div className="text-[11px] text-ink-subtle uppercase tracking-wider mb-1 font-medium">{t('score')}</div>
        <div className={`text-3xl font-semibold text-ink tabular-nums ${pop ? 'animate-score-pop' : ''}`}>
          {score}
        </div>
      </div>

      <div className="bg-surface-alt rounded-lg border border-surface-border p-4">
        <div className="text-[11px] text-ink-subtle uppercase tracking-wider mb-1 font-medium">{t('best')}</div>
        <div className="text-xl font-semibold text-ink-muted tabular-nums">
          {highScore}
        </div>
      </div>
    </div>
  )
}