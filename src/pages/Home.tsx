import GameCanvas from '@/components/GameCanvas'
import SidePanel from '@/components/SidePanel'
import GameOverModal from '@/components/GameOverModal'
import TouchControls from '@/components/TouchControls'
import DevPanel from '@/components/DevPanel'
import Toast from '@/components/Toast'
import PasswordModal from '@/components/PasswordModal'
import { useSnakeGame } from '@/hooks/useSnakeGame'
import { useGameStore } from '@/store/gameStore'
import { useI18n } from '@/i18n'
import { Play, Pause, RotateCcw } from 'lucide-react'

export default function Home() {
  const {
    startGame,
    togglePause,
    restartGame,
    confirmDeath,
    showDevPanel,
    setShowDevPanel,
    handleSwitchToNormal,
    handleRequestDevMode,
    devMode,
    toastMessage,
    toastKey,
    passwordModalOpen,
    handlePasswordVerify,
    handlePasswordCancel,
  } = useSnakeGame()

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-2 gap-3 pt-2 pb-4 md:pt-20 md:pb-6">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-4 md:gap-8 w-full max-w-[780px]">
        <div className="flex flex-col items-center gap-3 md:gap-4">
          <div className="relative">
            <GameCanvas />
            <MobileActionBar
              onStart={startGame}
              onPause={togglePause}
              onRestart={restartGame}
            />
          </div>
          <TouchControls />
        </div>
        <SidePanel
          onStart={startGame}
          onPause={togglePause}
          onRestart={restartGame}
          devMode={devMode}
          onSwitchToNormal={handleSwitchToNormal}
          onRequestDevMode={handleRequestDevMode}
          hideControlsOnMobile
        />
      </div>

      <GameOverModal onConfirm={confirmDeath} />
      <DevPanel visible={showDevPanel} onClose={() => setShowDevPanel(false)} />
      <Toast message={toastMessage} toastKey={toastKey} />
      <PasswordModal
        visible={passwordModalOpen}
        onVerify={handlePasswordVerify}
        onCancel={handlePasswordCancel}
      />
    </div>
  )
}

function MobileActionBar({ onStart, onPause, onRestart }: {
  onStart: () => void
  onPause: () => void
  onRestart: () => void
}) {
  const { t } = useI18n()
  const status = useGameStore((s) => s.status)

  const btnCls = 'flex items-center justify-center gap-1 px-3 py-1.5 rounded-md text-xs font-medium transition-colors duration-150 cursor-pointer shadow-sm'

  return (
    <div className="md:hidden absolute top-0.5 right-0.5 z-20 flex gap-1.5">
      {status === 'idle' || status === 'gameover' ? (
        <button onClick={onStart} className={`${btnCls} bg-ink text-white hover:bg-ink/85 active:bg-ink/70`}>
          <Play size={13} />
          {t('start')}
        </button>
      ) : (
        <button onClick={onPause} className={`${btnCls} bg-ink text-white hover:bg-ink/85 active:bg-ink/70`}>
          {status === 'playing' ? <Pause size={13} /> : <Play size={13} />}
          {status === 'playing' ? t('pause') : t('resume')}
        </button>
      )}
      <button onClick={onRestart} className={`${btnCls} bg-white border border-surface-border text-ink-muted hover:bg-surface-hover active:bg-surface-alt`}>
        <RotateCcw size={13} />
      </button>
    </div>
  )
}