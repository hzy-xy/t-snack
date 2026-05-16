import { useI18n } from '@/i18n'

export default function RulesInfo() {
  const { t } = useI18n()

  return (
    <div className="bg-surface-alt rounded-lg border border-surface-border p-4">
      <div className="text-[11px] text-ink-subtle uppercase tracking-wider mb-3 font-medium">{t('controls')}</div>
      <div className="space-y-1.5 text-sm text-ink-muted">
        <div className="flex items-center gap-2">
          <kbd className="px-1.5 py-0.5 text-[10px] bg-white border border-surface-border rounded text-ink font-mono">{t('arrow')}</kbd>
          <span>{t('or')}</span>
          <kbd className="px-1.5 py-0.5 text-[10px] bg-white border border-surface-border rounded text-ink font-mono">WASD</kbd>
          <span>{t('move')}</span>
        </div>
        <div className="flex items-center gap-2">
          <kbd className="px-1.5 py-0.5 text-[10px] bg-white border border-surface-border rounded text-ink font-mono">{t('space')}</kbd>
          <span>{t('startPause')}</span>
        </div>
        <div className="mt-2 pt-2 border-t border-surface-border">
          <p className="text-xs leading-relaxed">
            {t('eatHint')} <span className="text-red-500 font-medium">&bull;</span> {t('foodHint')}<br />
            {t('wallHint')}
          </p>
        </div>
      </div>
    </div>
  )
}