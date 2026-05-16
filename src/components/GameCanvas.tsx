import { useEffect, useRef, useCallback, useState } from 'react'
import {
  useGameStore,
  GRID_SIZE,
  CANVAS_SIZE,
  CELL_SIZE,
  BLESSING_DURATION,
  GOD_MODE_AFTER_BLESSING,
  GHOST_DURATION,
} from '@/store/gameStore'
import { playEatSound, playLevelUpChime, speakPraise, playDamageSound, playBlessingBGM, stopBlessingBGM } from '@/utils/sound'
import { useI18n } from '@/i18n'
import { Heart } from 'lucide-react'

const COLORS = {
  bg: '#ffffff',
  gridLine: '#f0f1f3',
  food: '#ef4444',
  foodInner: '#fca5a5',
}

const LEVEL_THEME: Record<number, { head: string; body: [number, number, number]; tailDark: [number, number, number] }> = {
  1: { head: '#22c55e', body: [34, 180, 80], tailDark: [20, 120, 60] },
  2: { head: '#3b82f6', body: [50, 120, 246], tailDark: [30, 80, 180] },
  3: { head: '#f59e0b', body: [240, 150, 10], tailDark: [160, 100, 10] },
  4: { head: '#8b5cf6', body: [130, 80, 246], tailDark: [80, 40, 170] },
  5: { head: '#ec4899', body: [230, 60, 150], tailDark: [150, 30, 90] },
}

function getLevelTheme(level: number) {
  const capped = Math.min(level, 5)
  return LEVEL_THEME[capped] || LEVEL_THEME[1]
}

interface StarParticle {
  x: number
  y: number
  size: number
  speed: number
  opacity: number
  rotation: number
  rotationSpeed: number
  hue: number
}

export default function GameCanvas() {
  const { t } = useI18n()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const snake = useGameStore((s) => s.snake)
  const food = useGameStore((s) => s.food)
  const obstacles = useGameStore((s) => s.obstacles)
  const status = useGameStore((s) => s.status)
  const direction = useGameStore((s) => s.direction)
  const level = useGameStore((s) => s.level)
  const xp = useGameStore((s) => s.xp)
  const xpToNext = useGameStore((s) => s.xpToNext)
  const levelUpFlash = useGameStore((s) => s.levelUpFlash)
  const eatTrigger = useGameStore((s) => s.eatTrigger)
  const hp = useGameStore((s) => s.hp)
  const maxHp = useGameStore((s) => s.maxHp)
  const damageTrigger = useGameStore((s) => s.damageTrigger)
  const devGodMode = useGameStore((s) => s.devGodMode)
  const blessingActive = useGameStore((s) => s.blessingActive)
  const ghostActive = useGameStore((s) => s.ghostActive)
  const endBlessing = useGameStore((s) => s.endBlessing)

  const [showLevelUp, setShowLevelUp] = useState(false)
  const [flashLevel, setFlashLevel] = useState(0)
  const prevFlash = useRef(0)

  const starsRef = useRef<StarParticle[]>([])
  const blessingTimerRef = useRef<number | null>(null)
  const blessingStartRef = useRef(0)
  const blessingEnded = useRef(false)

  useEffect(() => {
    if (blessingActive > 0 && !blessingEnded.current) {
      blessingEnded.current = true
      blessingStartRef.current = blessingActive
      const count = 80
      starsRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * CANVAS_SIZE,
        y: Math.random() * CANVAS_SIZE * -0.5,
        size: 2 + Math.random() * 5,
        speed: 0.5 + Math.random() * 2,
        opacity: 0.3 + Math.random() * 0.7,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.05,
        hue: Math.random() * 360,
      }))
      playBlessingBGM()

      blessingTimerRef.current = window.setTimeout(() => {
        stopBlessingBGM()
        endBlessing()
        blessingEnded.current = false
        starsRef.current = []
      }, BLESSING_DURATION + GOD_MODE_AFTER_BLESSING)
    }

    return () => {
      if (blessingTimerRef.current !== null) {
        clearTimeout(blessingTimerRef.current)
        blessingTimerRef.current = null
      }
    }
  }, [blessingActive, endBlessing])

  useEffect(() => {
    if (levelUpFlash > 0 && levelUpFlash !== prevFlash.current) {
      prevFlash.current = levelUpFlash
      setFlashLevel(level)
      setShowLevelUp(true)
      playLevelUpChime()
      setTimeout(() => speakPraise(), 300)
      const t = setTimeout(() => setShowLevelUp(false), 1500)
      return () => clearTimeout(t)
    }
  }, [levelUpFlash, level])

  const prevEat = useRef(0)
  useEffect(() => {
    if (eatTrigger > prevEat.current) {
      prevEat.current = eatTrigger
      playEatSound()
    }
  }, [eatTrigger])

  const prevDamage = useRef(0)
  useEffect(() => {
    if (damageTrigger > prevDamage.current) {
      prevDamage.current = damageTrigger
      playDamageSound()
    }
  }, [damageTrigger])

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    const dpr = window.devicePixelRatio || 1
    canvas.width = CANVAS_SIZE * dpr
    canvas.height = CANVAS_SIZE * dpr
    canvas.style.width = `${CANVAS_SIZE}px`
    canvas.style.height = `${CANVAS_SIZE}px`
    ctx.scale(dpr, dpr)

    ctx.fillStyle = COLORS.bg
    ctx.fillRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)

    ctx.strokeStyle = COLORS.gridLine
    ctx.lineWidth = 0.5
    for (let x = 0; x <= GRID_SIZE; x++) {
      ctx.beginPath()
      ctx.moveTo(x * CELL_SIZE, 0)
      ctx.lineTo(x * CELL_SIZE, CANVAS_SIZE)
      ctx.stroke()
    }
    for (let y = 0; y <= GRID_SIZE; y++) {
      ctx.beginPath()
      ctx.moveTo(0, y * CELL_SIZE)
      ctx.lineTo(CANVAS_SIZE, y * CELL_SIZE)
      ctx.stroke()
    }

    const time = Date.now() / 1000

    obstacles.forEach((obs) => {
      const ox = obs.x * CELL_SIZE + CELL_SIZE / 2
      const oy = obs.y * CELL_SIZE + CELL_SIZE / 2
      const r = CELL_SIZE / 2 - 4

      ctx.save()
      ctx.beginPath()
      ctx.moveTo(ox - r * 0.85, oy - r * 0.7)
      ctx.lineTo(ox + r * 0.6, oy - r * 0.9)
      ctx.lineTo(ox + r * 0.9, oy - r * 0.2)
      ctx.lineTo(ox + r * 0.75, oy + r * 0.5)
      ctx.lineTo(ox + r * 0.3, oy + r * 0.85)
      ctx.lineTo(ox - r * 0.7, oy + r * 0.7)
      ctx.lineTo(ox - r * 0.9, oy + r * 0.15)
      ctx.lineTo(ox - r * 0.6, oy - r * 0.65)
      ctx.closePath()

      const rockGrad = ctx.createLinearGradient(ox - r, oy - r, ox + r, oy + r)
      rockGrad.addColorStop(0, '#c4b5a5')
      rockGrad.addColorStop(0.5, '#b0a090')
      rockGrad.addColorStop(1, '#9b8b7a')
      ctx.fillStyle = rockGrad
      ctx.fill()
      ctx.strokeStyle = '#8a7a6a'
      ctx.lineWidth = 0.8
      ctx.stroke()

      ctx.beginPath()
      ctx.moveTo(ox - r * 0.3, oy - r * 0.4)
      ctx.lineTo(ox + r * 0.15, oy - r * 0.15)
      ctx.strokeStyle = '#d4c9b8'
      ctx.lineWidth = 1
      ctx.stroke()
      ctx.restore()
    })

    const foodX = food.x * CELL_SIZE + CELL_SIZE / 2
    const foodY = food.y * CELL_SIZE + CELL_SIZE / 2
    const foodRadius = CELL_SIZE / 2 - 3
    const pulse = Math.sin(time * 3) * 0.2 + 1

    ctx.beginPath()
    ctx.arc(foodX, foodY, foodRadius * pulse, 0, Math.PI * 2)
    ctx.fillStyle = COLORS.food
    ctx.fill()
    ctx.beginPath()
    ctx.arc(foodX - 2, foodY - 2, foodRadius * 0.3, 0, Math.PI * 2)
    ctx.fillStyle = COLORS.foodInner
    ctx.fill()

    const isRainbow = level >= 6
    const theme = getLevelTheme(level)

    const now = Date.now()
    const isGhost = now - ghostActive < GHOST_DURATION
    const ghostAlpha = isGhost ? 0.3 + 0.1 * Math.sin(time * 12) : 1

    snake.forEach((seg, i) => {
      const px = seg.x * CELL_SIZE
      const py = seg.y * CELL_SIZE
      const pad = 2
      const r = 5

      if (i === 0) {
        ctx.save()
        if (isGhost) {
          ctx.globalAlpha = ghostAlpha
        }

        const headGrad = ctx.createLinearGradient(px, py, px + CELL_SIZE, py + CELL_SIZE)
        if (isRainbow) {
          const h = (time * 60) % 360
          headGrad.addColorStop(0, `hsl(${h}, 100%, 55%)`)
          headGrad.addColorStop(1, `hsl(${(h + 20) % 360}, 100%, 45%)`)
        } else {
          headGrad.addColorStop(0, theme.head)
          headGrad.addColorStop(1, `rgb(${Math.floor(theme.body[0] * 0.8)}, ${Math.floor(theme.body[1] * 0.8)}, ${Math.floor(theme.body[2] * 0.8)})`)
        }
        ctx.fillStyle = headGrad
        roundRect(ctx, px + pad, py + pad, CELL_SIZE - pad * 2, CELL_SIZE - pad * 2, r)
        ctx.fill()

        ctx.strokeStyle = 'rgba(255,255,255,0.25)'
        ctx.lineWidth = 1.2
        ctx.stroke()

        ctx.restore()

        if (!isGhost) {
          ctx.save()
          ctx.fillStyle = '#ffffff'
          const eyeSize = 5
          const cx = px + CELL_SIZE / 2
          const cy = py + CELL_SIZE / 2
          let ex1 = cx, ey1 = cy, ex2 = cx, ey2 = cy
          const offset = 6

          switch (direction) {
            case 'UP':
              ex1 = cx - offset; ey1 = cy - 3; ex2 = cx + offset; ey2 = cy - 3; break
            case 'DOWN':
              ex1 = cx - offset; ey1 = cy + 3; ex2 = cx + offset; ey2 = cy + 3; break
            case 'LEFT':
              ex1 = cx - 3; ey1 = cy - offset; ex2 = cx - 3; ey2 = cy + offset; break
            case 'RIGHT':
              ex1 = cx + 3; ey1 = cy - offset; ex2 = cx + 3; ey2 = cy + offset; break
          }

          ctx.shadowColor = 'rgba(0,0,0,0.15)'
          ctx.shadowBlur = 2
          ctx.beginPath()
          ctx.arc(ex1, ey1, eyeSize, 0, Math.PI * 2)
          ctx.fill()
          ctx.beginPath()
          ctx.arc(ex2, ey2, eyeSize, 0, Math.PI * 2)
          ctx.fill()
          ctx.shadowBlur = 0

          ctx.fillStyle = '#1a1a2e'
          const pupilSize = 2.5
          ctx.beginPath()
          ctx.arc(ex1, ey1, pupilSize, 0, Math.PI * 2)
          ctx.fill()
          ctx.beginPath()
          ctx.arc(ex2, ey2, pupilSize, 0, Math.PI * 2)
          ctx.fill()

          ctx.fillStyle = 'rgba(255,255,255,0.7)'
          ctx.beginPath()
          ctx.arc(ex1 - 1, ey1 - 1, 1.2, 0, Math.PI * 2)
          ctx.fill()
          ctx.beginPath()
          ctx.arc(ex2 - 1, ey2 - 1, 1.2, 0, Math.PI * 2)
          ctx.fill()

          ctx.restore()
        }
      } else {
        ctx.save()
        if (isGhost) {
          ctx.globalAlpha = ghostAlpha
        }

        let bodyColor: string
        let bodyDarkColor: string
        if (isRainbow) {
          const hueOffset = time * 40
          const hueStep = 360 / Math.max(snake.length - 1, 1)
          const hue = (i * hueStep + hueOffset) % 360
          bodyColor = `hsl(${hue}, 100%, 60%)`
          bodyDarkColor = `hsl(${hue}, 100%, 45%)`
        } else {
          const t2 = Math.min(i / snake.length, 1)
          const [rBase, gBase, bBase] = theme.body
          const [rDark, gDark, bDark] = theme.tailDark
          const rr = Math.floor(rBase + (rDark - rBase) * t2)
          const gg = Math.floor(gBase + (gDark - gBase) * t2)
          const bb = Math.floor(bBase + (bDark - bBase) * t2)
          bodyColor = `rgb(${rr}, ${gg}, ${bb})`
          bodyDarkColor = `rgb(${Math.floor(rr * 0.75)}, ${Math.floor(gg * 0.75)}, ${Math.floor(bb * 0.75)})`
        }

        const bodyGrad = ctx.createLinearGradient(px, py, px, py + CELL_SIZE)
        bodyGrad.addColorStop(0, bodyColor)
        bodyGrad.addColorStop(1, bodyDarkColor)
        ctx.fillStyle = bodyGrad
        roundRect(ctx, px + pad, py + pad, CELL_SIZE - pad * 2, CELL_SIZE - pad * 2, r)
        ctx.fill()

        ctx.strokeStyle = 'rgba(255,255,255,0.2)'
        ctx.lineWidth = 1
        ctx.stroke()

        if (!isGhost) {
          ctx.fillStyle = 'rgba(255,255,255,0.15)'
          const cx = px + CELL_SIZE / 2 - 5
          const cy = py + 7
          ctx.beginPath()
          ctx.arc(cx, cy, 1.8, 0, Math.PI * 2)
          ctx.fill()
        }

        ctx.restore()
      }
    })

    const stars = starsRef.current
    if (stars.length > 0) {
      const now = Date.now() / 1000
      for (const star of stars) {
        star.y += star.speed
        star.rotation += star.rotationSpeed
        if (star.y > CANVAS_SIZE + 10) {
          star.y = -10
          star.x = Math.random() * CANVAS_SIZE
          star.speed = 0.5 + Math.random() * 2
          star.hue = Math.random() * 360
        }
        const alpha = star.opacity
        const elapsed = now - blessingStartRef.current / 1000
        const totalDuration = (BLESSING_DURATION + GOD_MODE_AFTER_BLESSING) / 1000
        let fadeAlpha = alpha
        if (elapsed > totalDuration - 1) {
          fadeAlpha = alpha * Math.max(0, totalDuration - elapsed)
        }

        ctx.save()
        ctx.translate(star.x, star.y)
        ctx.rotate(star.rotation)
        ctx.globalAlpha = Math.max(0, fadeAlpha)
        ctx.fillStyle = `hsl(${star.hue}, 100%, 65%)`
        ctx.shadowColor = `hsl(${star.hue}, 100%, 65%)`
        ctx.shadowBlur = 4

        const s = star.size
        ctx.beginPath()
        ctx.moveTo(0, -s)
        for (let j = 0; j < 5; j++) {
          const angle = (j * Math.PI * 4) / 5 - Math.PI / 2
          const r = j % 2 === 0 ? s : s * 0.4
          ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r)
        }
        ctx.closePath()
        ctx.fill()
        ctx.restore()
      }
      ctx.globalAlpha = 1
    }
  }, [snake, food, obstacles, direction, level, ghostActive])

  useEffect(() => {
    let animId: number
    const loop = () => {
      draw()
      animId = requestAnimationFrame(loop)
    }
    animId = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(animId)
  }, [draw])

  const xpPercent = Math.min((xp / xpToNext) * 100, 100)
  const isMax = level >= 6
  const blessingElapsed = blessingActive > 0 ? Date.now() - blessingActive : 0
  const blessingVisible = blessingElapsed > 0 && blessingElapsed < BLESSING_DURATION + GOD_MODE_AFTER_BLESSING

  return (
    <div className="relative pt-6 md:pt-10">
      <div className="absolute top-0 left-0 right-0 flex items-center z-10 gap-2">
        <div className={`bg-white border border-surface-border rounded-md px-2.5 py-1 flex items-center gap-1 ${devGodMode ? 'border-yellow-400' : ''}`}>
          {Array.from({ length: maxHp }).map((_, i) => (
            <Heart
              key={i}
              size={14}
              className={i < hp ? 'text-red-500 fill-red-500' : 'text-surface-border'}
            />
          ))}
          {devGodMode && (
            <span className="text-[10px] text-yellow-600 ml-0.5 tracking-wide font-medium">{t('god')}</span>
          )}
        </div>
        <div className="md:hidden flex-1" />
        <div className="bg-white border border-surface-border rounded-md px-3 py-1 flex items-center gap-2.5 shrink-0 mr-28 md:mr-0">
          <span className={`text-xs font-bold tracking-wider ${isMax ? 'text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 animate-rainbow-text' : 'text-ink'}`}>
            {isMax ? 'Lv.MAX' : `Lv.${level}`}
          </span>
          {!isMax && (
            <>
              <div className="w-20 h-1.5 bg-surface-alt rounded-full overflow-hidden">
                <div
                  className="bg-accent h-full rounded-full transition-all duration-500"
                  style={{ width: `${xpPercent}%` }}
                />
              </div>
              <span className="text-[10px] text-ink-subtle tabular-nums font-medium">
                {xp}/{xpToNext}
              </span>
            </>
          )}
          {isMax && (
            <span className="text-[10px] text-yellow-600 tracking-wide font-medium">
              {t('rainbowSnake')}
            </span>
          )}
        </div>
      </div>

      {showLevelUp && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-20 pointer-events-none whitespace-nowrap">
          <div className="animate-modal-in text-center">
            <span className={`text-lg font-bold tracking-wider ${isMax ? 'text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 animate-rainbow-text' : 'text-ink'}`}>
              {isMax ? t('wudeShenshe') : `${t('levelUp')} Lv.${flashLevel}`}
            </span>
          </div>
        </div>
      )}

      {blessingVisible && (
        <div className="absolute -top-12 left-1/2 -translate-x-1/2 z-20 pointer-events-none whitespace-nowrap animate-modal-in">
          <div className="text-center">
            <span className="text-lg font-bold text-yellow-600 tracking-widest">
              {t('blessing')}
            </span>
          </div>
        </div>
      )}

      <canvas
        ref={canvasRef}
        className="rounded-lg border border-surface-border shadow-card"
        style={{ maxWidth: '100%', height: 'auto' }}
      />

      {status === 'idle' && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
          <span className="text-ink-muted text-base font-medium tracking-wide">
            {t('pressStart')}
          </span>
        </div>
      )}
      {status === 'paused' && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/80 rounded-lg">
          <span className="text-ink-muted text-base font-medium tracking-wide">
            {t('paused')}
          </span>
        </div>
      )}
    </div>
  )
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y)
  ctx.arcTo(x + w, y, x + w, y + r, r)
  ctx.lineTo(x + w, y + h - r)
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r)
  ctx.lineTo(x + r, y + h)
  ctx.arcTo(x, y + h, x, y + h - r, r)
  ctx.lineTo(x, y + r)
  ctx.arcTo(x, y, x + r, y, r)
  ctx.closePath()
}