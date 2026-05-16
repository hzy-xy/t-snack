import { create } from 'zustand'

export type Direction = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT'
export type Difficulty = 'easy' | 'normal' | 'hard'
export type GameStatus = 'idle' | 'playing' | 'paused' | 'gameover'

export interface Position {
  x: number
  y: number
}

export const DIFFICULTY_SPEED: Record<Difficulty, number> = {
  easy: 480,
  normal: 320,
  hard: 200,
}

export const LEVEL_SPEED_BONUS = 6
export const MAX_HP = 3
export const MAX_LEVEL = 6
export const BLESSING_DURATION = 6000
export const GOD_MODE_AFTER_BLESSING = 4000
export const GHOST_DURATION = 500

export function getXpToNext(level: number): number {
  return 30 + level * 20 + level * level * 5
}

export const GRID_SIZE = 20
export const CANVAS_SIZE = 540
export const CELL_SIZE = CANVAS_SIZE / GRID_SIZE

function generateObstacles(): Position[] {
  const templates: Position[][] = [
    [
      { x: 3, y: 3 }, { x: 4, y: 3 },
      { x: 16, y: 3 }, { x: 15, y: 3 },
      { x: 3, y: 16 }, { x: 4, y: 16 },
      { x: 16, y: 16 }, { x: 15, y: 16 },
    ],
    [
      { x: 5, y: 5 }, { x: 14, y: 5 },
      { x: 5, y: 14 }, { x: 14, y: 14 },
      { x: 9, y: 7 }, { x: 10, y: 12 },
      { x: 7, y: 10 }, { x: 12, y: 9 },
    ],
    [
      { x: 3, y: 6 }, { x: 16, y: 6 },
      { x: 3, y: 13 }, { x: 16, y: 13 },
      { x: 6, y: 3 }, { x: 13, y: 3 },
      { x: 6, y: 16 }, { x: 13, y: 16 },
    ],
  ]
  const pick = templates[Math.floor(Math.random() * templates.length)]
  return pick.map(p => ({ ...p }))
}

interface GameState {
  snake: Position[]
  food: Position
  obstacles: Position[]
  direction: Direction
  nextDirection: Direction
  status: GameStatus
  score: number
  highScore: number
  difficulty: Difficulty
  level: number
  xp: number
  xpToNext: number
  levelUpFlash: number
  eatTrigger: number
  hp: number
  maxHp: number
  damageTrigger: number

  devMode: boolean
  devGodMode: boolean
  blessingActive: number
  achievementUnlocked: boolean
  ghostActive: number

  setDirection: (dir: Direction) => void
  setStatus: (status: GameStatus) => void
  tick: () => boolean
  resetGame: () => void
  setDifficulty: (d: Difficulty) => void
  loadHighScore: () => void

  toggleDevMode: () => void
  setDevMode: (on: boolean) => void
  toggleDevGodMode: () => void
  activateDevMax: () => void
  loadAchievement: () => void
  loadDevMode: () => void
  endBlessing: () => void
}

function generateFood(snake: Position[], obstacles: Position[]): Position {
  let food: Position
  do {
    food = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    }
  } while (
    snake.some((s) => s.x === food.x && s.y === food.y) ||
    obstacles.some((o) => o.x === food.x && o.y === food.y)
  )
  return food
}

function getInitialSnake(): Position[] {
  const mid = Math.floor(GRID_SIZE / 2)
  return [
    { x: mid, y: mid },
    { x: mid - 1, y: mid },
    { x: mid - 2, y: mid },
  ]
}

function wrap(v: number): number {
  return ((v % GRID_SIZE) + GRID_SIZE) % GRID_SIZE
}

const initialObstacles = generateObstacles()
const initialSnake = getInitialSnake()

export const useGameStore = create<GameState>((set, get) => ({
  snake: initialSnake,
  food: generateFood(initialSnake, initialObstacles),
  obstacles: initialObstacles,
  direction: 'RIGHT',
  nextDirection: 'RIGHT',
  status: 'idle',
  score: 0,
  highScore: 0,
  difficulty: 'normal',
  level: 1,
  xp: 0,
  xpToNext: getXpToNext(1),
  levelUpFlash: 0,
  eatTrigger: 0,
  hp: 1,
  maxHp: MAX_HP,
  damageTrigger: 0,

  devMode: false,
  devGodMode: false,
  blessingActive: 0,
  achievementUnlocked: false,
  ghostActive: 0,

  setDirection: (dir) => {
    const { direction, status } = get()
    if (status !== 'playing') return
    const opposites: Record<Direction, Direction> = {
      UP: 'DOWN',
      DOWN: 'UP',
      LEFT: 'RIGHT',
      RIGHT: 'LEFT',
    }
    if (opposites[dir] === direction) return
    set({ nextDirection: dir })
  },

  setStatus: (status) => set({ status }),

  tick: () => {
    const state = get()
    const { snake, food, obstacles, nextDirection, score, highScore, level, xp, xpToNext, eatTrigger, hp, damageTrigger, devGodMode, blessingActive } = state
    const direction = nextDirection
    const isInvincible = devGodMode || blessingActive > 0

    const head = snake[0]
    const newHead: Position = { ...head }

    switch (direction) {
      case 'UP': newHead.y -= 1; break
      case 'DOWN': newHead.y += 1; break
      case 'LEFT': newHead.x -= 1; break
      case 'RIGHT': newHead.x += 1; break
    }

    let didWrap = false
    if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE) {
      newHead.x = wrap(newHead.x)
      newHead.y = wrap(newHead.y)
      didWrap = true
    }

    const isSelfCollision = snake.some((s) => s.x === newHead.x && s.y === newHead.y)
    const isObstacleCollision = obstacles.some((o) => o.x === newHead.x && o.y === newHead.y)
    const hasGhostCollision = didWrap || isSelfCollision || isObstacleCollision

    if (hasGhostCollision) {
      if (!isInvincible) {
        const newHp = hp - 1
        if (newHp <= 0) {
          const newHighScore = Math.max(score, highScore)
          if (newHighScore > highScore) {
            localStorage.setItem('snake_highscore', String(newHighScore))
          }
          set({ status: 'gameover', highScore: newHighScore, hp: 0, ghostActive: Date.now(), damageTrigger: damageTrigger + 1 })
          return false
        }
        const ghostSnake = [newHead, ...snake]
        ghostSnake.pop()
        set({
          snake: ghostSnake,
          direction,
          hp: newHp,
          ghostActive: Date.now(),
          damageTrigger: damageTrigger + 1,
        })
      } else {
        const ghostSnake = [newHead, ...snake]
        ghostSnake.pop()
        set({
          snake: ghostSnake,
          direction,
          ghostActive: Date.now(),
          damageTrigger: damageTrigger + 1,
        })
      }
      return true
    }

    const newSnake = [newHead, ...snake]

    if (newHead.x === food.x && newHead.y === food.y) {
      const newScore = score + 10
      const newHighScore = Math.max(newScore, highScore)
      const newFood = generateFood(newSnake, obstacles)

      let newXp = xp + 10
      let newLevel = level
      let newXpToNext = xpToNext
      let newLevelUpFlash = 0
      let newHp = hp
      const { devMode } = get()
      let newBlessingActive = blessingActive

      while (newXp >= newXpToNext) {
        newXp -= newXpToNext
        newLevel += 1
        newXpToNext = getXpToNext(newLevel)
        newLevelUpFlash = Date.now()
        if (!devMode) {
          newHp = Math.min(newHp + 1, MAX_HP)
        } else {
          newHp = MAX_HP
        }
        if (newLevel >= 6 && !devMode && blessingActive === 0) {
          newBlessingActive = Date.now()
          localStorage.setItem('snake_achievement_lv6', '1')
          const { achievementUnlocked } = get()
          if (!achievementUnlocked) {
            set({ achievementUnlocked: true })
          }
        }
      }

      set({
        snake: newSnake,
        food: newFood,
        score: newScore,
        highScore: newHighScore,
        direction,
        level: newLevel,
        xp: newXp,
        xpToNext: newXpToNext,
        levelUpFlash: newLevelUpFlash,
        eatTrigger: eatTrigger + 1,
        hp: newHp,
        blessingActive: newBlessingActive,
      })
    } else {
      newSnake.pop()
      set({ snake: newSnake, direction })
    }

    return true
  },

  resetGame: () => {
    const { highScore, difficulty, achievementUnlocked } = get()
    const newSnake = getInitialSnake()
    const newObstacles = generateObstacles()
    set({
      snake: newSnake,
      food: generateFood(newSnake, newObstacles),
      obstacles: newObstacles,
      direction: 'RIGHT',
      nextDirection: 'RIGHT',
      status: 'idle',
      score: 0,
      highScore,
      difficulty,
      level: 1,
      xp: 0,
      xpToNext: getXpToNext(1),
      levelUpFlash: 0,
      eatTrigger: 0,
      hp: 1,
      maxHp: MAX_HP,
      damageTrigger: 0,
      ghostActive: 0,
      blessingActive: 0,
      achievementUnlocked,
    })
  },

  setDifficulty: (d) => {
    const { status } = get()
    if (status === 'playing') return
    set({ difficulty: d })
  },

  loadHighScore: () => {
    const saved = localStorage.getItem('snake_highscore')
    if (saved) {
      set({ highScore: parseInt(saved, 10) || 0 })
    }
  },

  toggleDevMode: () => {
    const { devMode } = get()
    const next = !devMode
    localStorage.setItem('snake_devmode', next ? '1' : '0')
    set({ devMode: next, devGodMode: next ? true : false })
  },

  setDevMode: (on: boolean) => {
    localStorage.setItem('snake_devmode', on ? '1' : '0')
    set({ devMode: on, devGodMode: on ? true : false })
  },

  toggleDevGodMode: () => {
    const { devGodMode } = get()
    set({ devGodMode: !devGodMode })
  },

  activateDevMax: () => {
    const mid = Math.floor(GRID_SIZE / 2)
    const maxSnake: Position[] = []
    for (let i = 0; i < 10; i++) {
      maxSnake.push({ x: mid - i, y: mid })
    }
    set({
      level: MAX_LEVEL,
      xp: getXpToNext(MAX_LEVEL) - 1,
      xpToNext: getXpToNext(MAX_LEVEL),
      hp: MAX_HP,
      maxHp: MAX_HP,
      devGodMode: true,
      snake: maxSnake,
      food: generateFood(maxSnake, get().obstacles),
    })
  },

  loadAchievement: () => {
    const saved = localStorage.getItem('snake_achievement_lv6')
    if (saved === '1') {
      set({ achievementUnlocked: true })
    }
  },

  loadDevMode: () => {
    const saved = localStorage.getItem('snake_devmode')
    if (saved === '1') {
      set({ devMode: true, devGodMode: true })
    }
  },

  endBlessing: () => {
    set({ blessingActive: 0 })
  },
}))