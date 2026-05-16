import { createContext, useContext, useState, useCallback, type ReactNode } from 'react'

export type Lang = 'zh' | 'en'

interface I18n {
  lang: Lang
  toggleLang: () => void
  t: (key: string) => string
}

const LangContext = createContext<I18n | null>(null)

const zh: Record<string, string> = {
  title: '贪吃蛇',
  subtitle: '经典游戏',
  score: '得分',
  best: '最高分',
  start: '开始',
  pause: '暂停',
  resume: '继续',
  easy: '简单',
  normal: '普通',
  hard: '困难',
  controls: '操作说明',
  arrow: '方向键',
  or: '或',
  move: '移动',
  space: '空格',
  startPause: '开始 / 暂停',
  eatHint: '吃到',
  foodHint: '食物得10分',
  wallHint: '撞墙或撞到自己游戏结束',
  gameOver: '游戏结束',
  newRecord: '新纪录！',
  reachedLv: '已达 Lv.',
  newHighScore: '新最高记录',
  ok: '确定',
  god: 'GOD',
  rainbowSnake: '七彩神蛇',
  pressStart: '按空格键开始',
  paused: '已暂停',
  levelUp: '升级！',
  wudeShenshe: 'WUDE SHENSHÉ',
  blessing: '中级祝福',
  invincible: '无敌护体',
  mode: '模式',
  normalMode: '正常模式',
  devMode: '开发者模式',
  devModeActive: '开发者模式已激活',
  normalActive: '正常运行中',
  devPanel: '开发者模式',
  maxLevel: '一键满级',
  godOn: '无敌模式 开',
  godOff: '无敌模式 关',
  invincibleStatus: '永久无敌已激活',
  devAccess: '开发者验证',
  devHint: '请输入开发者密码以进入开发者模式',
  password: '请输入密码',
  passwordError: '密码错误，请重试',
  cancel: '取消',
  confirm: '确认',
  toastDevOn: '已切换至开发者模式',
  toastNormal: '已切换至正常模式',
  ms: '毫秒',
  seconds: '秒',
}

const en: Record<string, string> = {
  title: 'Snake',
  subtitle: 'Classic Game',
  score: 'Score',
  best: 'Best',
  start: 'Start',
  pause: 'Pause',
  resume: 'Resume',
  easy: 'Easy',
  normal: 'Normal',
  hard: 'Hard',
  controls: 'Controls',
  arrow: 'Arrows',
  or: 'or',
  move: 'Move',
  space: 'Space',
  startPause: 'Start / Pause',
  eatHint: 'Eat',
  foodHint: 'food for 10 pts',
  wallHint: 'Wall or self collision ends game',
  gameOver: 'Game Over',
  newRecord: 'New Record!',
  reachedLv: 'Reached Lv.',
  newHighScore: 'New High Score',
  ok: 'OK',
  god: 'GOD',
  rainbowSnake: 'Rainbow Snake',
  pressStart: 'Press Space to Start',
  paused: 'Paused',
  levelUp: 'LEVEL UP!',
  wudeShenshe: 'WUDE SHENSHÉ',
  blessing: 'Blessing',
  invincible: 'Invincible',
  mode: 'Mode',
  normalMode: 'Normal',
  devMode: 'Dev',
  devModeActive: 'Dev mode active',
  normalActive: 'Normal mode',
  devPanel: 'Dev Mode',
  maxLevel: 'Max Lv.6',
  godOn: 'God Mode ON',
  godOff: 'God Mode OFF',
  invincibleStatus: 'Invincible',
  devAccess: 'Developer Access',
  devHint: 'Enter password to enable dev mode',
  password: 'Password',
  passwordError: 'Incorrect password',
  cancel: 'Cancel',
  confirm: 'Confirm',
  toastDevOn: 'Switched to Dev Mode',
  toastNormal: 'Switched to Normal Mode',
  ms: 'ms',
  seconds: 's',
}

function loadLang(): Lang {
  const saved = localStorage.getItem('snake_lang')
  if (saved === 'en' || saved === 'zh') return saved
  return 'zh'
}

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(loadLang)

  const toggleLang = useCallback(() => {
    setLang((prev) => {
      const next = prev === 'zh' ? 'en' : 'zh'
      localStorage.setItem('snake_lang', next)
      return next
    })
  }, [])

  const t = useCallback(
    (key: string) => {
      const dict = lang === 'zh' ? zh : en
      return dict[key] ?? key
    },
    [lang],
  )

  return (
    <LangContext.Provider value={{ lang, toggleLang, t }}>
      {children}
    </LangContext.Provider>
  )
}

export function useI18n(): I18n {
  const ctx = useContext(LangContext)
  if (!ctx) throw new Error('useI18n must be used within LangProvider')
  return ctx
}