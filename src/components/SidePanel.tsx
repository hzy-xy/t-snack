import ScorePanel from '@/components/ScorePanel'
import ControlButtons from '@/components/ControlButtons'
import DifficultySelector from '@/components/DifficultySelector'
import RulesInfo from '@/components/RulesInfo'
import ModeSwitch from '@/components/ModeSwitch'
import { useI18n } from '@/i18n'
import { Globe } from 'lucide-react'

interface Props {
  onStart: () => void
  onPause: () => void
  onRestart: () => void
  devMode: boolean
  onSwitchToNormal: () => void
  onRequestDevMode: () => void
  hideControlsOnMobile?: boolean
}

export default function SidePanel({ onStart, onPause, onRestart, devMode, onSwitchToNormal, onRequestDevMode, hideControlsOnMobile }: Props) {
  const { t, toggleLang } = useI18n()

  return (
    <div className="flex flex-col gap-4 md:gap-5 w-full md:w-[200px]">
      <div className="flex items-center justify-between">
        <div className="text-left">
          <h1 className="text-xl md:text-3xl font-bold text-ink tracking-tight">
            {t('title')}
          </h1>
          <p className="text-xs text-ink-subtle mt-0.5 tracking-wide">
            {t('subtitle')}
          </p>
        </div>
        <button
          onClick={toggleLang}
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-ink-subtle border border-surface-border hover:border-ink-faint hover:text-ink-muted transition-colors cursor-pointer"
          title="Switch Language"
        >
          <Globe size={14} />
          <span className="font-medium">中/EN</span>
        </button>
      </div>

      <ScorePanel />
      <DifficultySelector />
      <div className={hideControlsOnMobile ? 'hidden md:block' : ''}>
        <ControlButtons onStart={onStart} onPause={onPause} onRestart={onRestart} />
      </div>
      <ModeSwitch devMode={devMode} onSwitchToNormal={onSwitchToNormal} onRequestDevMode={onRequestDevMode} />
      <RulesInfo />
    </div>
  )
}