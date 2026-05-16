import { useGameStore, MAX_LEVEL } from '@/store/gameStore'
import { useI18n } from '@/i18n'
import { Shield, Zap, X } from 'lucide-react'

interface Props {
  visible: boolean
  onClose: () => void
}

export default function DevPanel({ visible, onClose }: Props) {
  const { t } = useI18n()
  const devMode = useGameStore((s) => s.devMode)
  const devGodMode = useGameStore((s) => s.devGodMode)
  const toggleDevGodMode = useGameStore((s) => s.toggleDevGodMode)
  const activateDevMax = useGameStore((s) => s.activateDevMax)

  if (!visible) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
      <div className="bg-white border border-yellow-300 rounded-xl p-4 shadow-pop min-w-[220px]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-yellow-400" />
            <span className="text-sm font-semibold text-ink tracking-wide">
              {t('devPanel')}
            </span>
          </div>
          <button
            onClick={onClose}
            className="text-ink-subtle hover:text-ink transition-colors cursor-pointer"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-2.5">
          <button
            onClick={activateDevMax}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium tracking-wide bg-yellow-50 border border-yellow-200 text-yellow-700 hover:bg-yellow-100 active:bg-yellow-200 transition-colors cursor-pointer"
          >
            <Zap size={14} />
            {t('maxLevel')}
          </button>

          <button
            onClick={toggleDevGodMode}
            className={`w-full flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium tracking-wide transition-colors cursor-pointer ${
              devGodMode
                ? 'bg-green-50 border border-green-200 text-green-700'
                : 'bg-surface-alt border border-surface-border text-ink-muted hover:bg-surface-hover'
            }`}
          >
            <Shield size={14} />
            {devGodMode ? t('godOn') : t('godOff')}
          </button>
        </div>

        {devGodMode && (
          <div className="mt-3 pt-3 border-t border-surface-border">
            <div className="flex items-center gap-2 text-xs text-green-600 font-medium">
              <Shield size={12} />
              {t('invincibleStatus')}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}