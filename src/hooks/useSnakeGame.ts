import { useEffect, useRef, useCallback, useState } from 'react'
import {
  useGameStore,
  Direction,
  DIFFICULTY_SPEED,
  LEVEL_SPEED_BONUS,
} from '@/store/gameStore'
import { initAudio } from '@/utils/sound'
import { useI18n } from '@/i18n'

export function useSnakeGame() {
  const { t } = useI18n()
  const status = useGameStore((s) => s.status)
  const difficulty = useGameStore((s) => s.difficulty)
  const level = useGameStore((s) => s.level)
  const devMode = useGameStore((s) => s.devMode)
  const tick = useGameStore((s) => s.tick)
  const setDirection = useGameStore((s) => s.setDirection)
  const setStatus = useGameStore((s) => s.setStatus)
  const loadHighScore = useGameStore((s) => s.loadHighScore)
  const loadDevMode = useGameStore((s) => s.loadDevMode)
  const resetGame = useGameStore((s) => s.resetGame)
  const setDevMode = useGameStore((s) => s.setDevMode)
  const loadAchievement = useGameStore((s) => s.loadAchievement)

  const [showDevPanel, setShowDevPanel] = useState(false)
  const [toastMessage, setToastMessage] = useState('')
  const [toastKey, setToastKey] = useState(0)
  const [passwordModalOpen, setPasswordModalOpen] = useState(false)

  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    loadHighScore()
    loadAchievement()
    loadDevMode()
  }, [loadHighScore, loadAchievement, loadDevMode])

  useEffect(() => {
    setShowDevPanel(devMode)
  }, [devMode])

  const showToast = useCallback((msg: string) => {
    setToastMessage(msg)
    setToastKey((k) => k + 1)
  }, [])

  const handleSwitchToNormal = useCallback(() => {
    setDevMode(false)
    showToast(t('toastNormal'))
  }, [setDevMode, showToast, t])

  const handleRequestDevMode = useCallback(() => {
    if (devMode) return
    setPasswordModalOpen(true)
  }, [devMode])

  const handlePasswordVerify = useCallback((password: string) => {
    if (password === '123456') {
      setPasswordModalOpen(false)
      setDevMode(true)
      showToast(t('toastDevOn'))
    }
  }, [setDevMode, showToast, t])

  const handlePasswordCancel = useCallback(() => {
    setPasswordModalOpen(false)
  }, [])

  const keyMap: Record<string, Direction> = {
    ArrowUp: 'UP',
    ArrowDown: 'DOWN',
    ArrowLeft: 'LEFT',
    ArrowRight: 'RIGHT',
    w: 'UP',
    W: 'UP',
    s: 'DOWN',
    S: 'DOWN',
    a: 'LEFT',
    A: 'LEFT',
    d: 'RIGHT',
    D: 'RIGHT',
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      initAudio()
      if (e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault()
        if (passwordModalOpen) return
        if (status === 'idle' || status === 'gameover') {
          setStatus('playing')
        } else if (status === 'playing') {
          setStatus('paused')
        } else if (status === 'paused') {
          setStatus('playing')
        }
        return
      }

      const dir = keyMap[e.key]
      if (dir) {
        e.preventDefault()
        setDirection(dir)
        return
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [status, setDirection, setStatus, passwordModalOpen])

  useEffect(() => {
    if (timerRef.current !== null) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }

    if (status === 'playing') {
      const baseSpeed = DIFFICULTY_SPEED[difficulty]
      const speed = Math.max(baseSpeed - LEVEL_SPEED_BONUS * (level - 1), 50)
      timerRef.current = window.setInterval(() => {
        tick()
      }, speed)
    }

    return () => {
      if (timerRef.current !== null) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }, [status, difficulty, level, tick])

  const startGame = useCallback(() => {
    initAudio()
    if (status === 'gameover') {
      resetGame()
      setTimeout(() => setStatus('playing'), 50)
    } else {
      setStatus('playing')
    }
  }, [status, resetGame, setStatus])

  const togglePause = useCallback(() => {
    if (status === 'playing') {
      setStatus('paused')
    } else if (status === 'paused') {
      setStatus('playing')
    }
  }, [status, setStatus])

  const restartGame = useCallback(() => {
    resetGame()
    setTimeout(() => setStatus('playing'), 50)
  }, [resetGame, setStatus])

  const confirmDeath = useCallback(() => {
    resetGame()
  }, [resetGame])

  return {
    startGame,
    togglePause,
    restartGame,
    confirmDeath,
    setDirection,
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
  }
}