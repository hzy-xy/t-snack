import { useGameStore } from '@/store/gameStore'
import { useI18n } from '@/i18n'

interface Props {
  onConfirm: () => void
}

export default function GameOverModal({ onConfirm }: Props) {
  const { t } = useI18n()
  const status = useGameStore((s) => s.status)
  const score = useGameStore((s) => s.score)
  const highScore = useGameStore((s) => s.highScore)
  const level = useGameStore((s) => s.level)

  if (status !== 'gameover') return null

  const isNewHigh = score >= highScore && score > 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
      <div className="animate-modal-in bg-white rounded-xl p-8 max-w-sm w-[90%] text-center shadow-pop">
        <div className="text-lg font-semibold text-ink mb-1">
          {t('gameOver')}
        </div>

        <div className="text-sm text-ink-subtle mb-5">
          {isNewHigh ? t('newRecord') : `${t('reachedLv')}${level}`}
        </div>

        <div className="bg-surface-alt rounded-lg p-4 mb-6">
          <div className="text-[11px] text-ink-subtle uppercase tracking-wider mb-1 font-medium">{t('score')}</div>
          <div className="text-4xl font-bold text-ink">
            {score}
          </div>
          {isNewHigh && (
            <div className="mt-2 text-sm text-ink-muted font-medium">
              {t('newHighScore')}
            </div>
          )}
        </div>

        <button
          onClick={onConfirm}
          className="w-full py-2.5 rounded-lg text-sm font-medium bg-ink text-white hover:bg-ink/85 active:bg-ink/70 transition-colors cursor-pointer"
        >
          {t('ok')}
        </button>
      </div>
    </div>
  )
}