import { useI18n } from '@/i18n'
import { Shield, User } from 'lucide-react'

interface Props {
  devMode: boolean
  onSwitchToNormal: () => void
  onRequestDevMode: () => void
}

export default function ModeSwitch({ devMode, onSwitchToNormal, onRequestDevMode }: Props) {
  const { t } = useI18n()

  return (
    <div className="bg-surface-alt border border-surface-border rounded-lg p-4">
      <div className="text-[11px] text-ink-subtle uppercase tracking-wider mb-3 text-center font-medium">
        {t('mode')}
      </div>

      <div className="flex rounded-lg bg-white p-1 gap-1 border border-surface-border">
        <button
          onClick={onSwitchToNormal}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-medium tracking-wide transition-colors cursor-pointer ${
            !devMode
              ? 'bg-ink text-white'
              : 'text-ink-subtle hover:text-ink-muted'
          }`}
        >
          <User size={12} />
          {t('normalMode')}
        </button>

        <button
          onClick={onRequestDevMode}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-md text-xs font-medium tracking-wide transition-colors cursor-pointer ${
            devMode
              ? 'bg-yellow-50 border border-yellow-200 text-yellow-700'
              : 'text-ink-subtle hover:text-ink-muted'
          }`}
        >
          <Shield size={12} />
          {t('devMode')}
        </button>
      </div>

      <div className="mt-3 flex items-center justify-center gap-1.5">
        <div className={`w-1.5 h-1.5 rounded-full ${devMode ? 'bg-yellow-400' : 'bg-green-500'}`} />
        <span className={`text-[10px] tracking-wide font-medium ${devMode ? 'text-yellow-600' : 'text-ink-subtle'}`}>
          {devMode ? t('devModeActive') : t('normalActive')}
        </span>
      </div>
    </div>
  )
}