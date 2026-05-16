import { useEffect, useState } from 'react'
import { Zap, Activity } from 'lucide-react'

interface Props {
  message: string
  toastKey: number
  duration?: number
}

export default function Toast({ message, toastKey, duration = 2000 }: Props) {
  const [visible, setVisible] = useState(false)
  const [text, setText] = useState('')

  useEffect(() => {
    if (!message) return
    setText(message)
    setVisible(true)
    const t = setTimeout(() => setVisible(false), duration)
    return () => clearTimeout(t)
  }, [toastKey])

  if (!visible) return null

  const isDev = text.includes('开发者') || text.includes('Dev')

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] animate-slide-up">
      <div
        className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium tracking-wide shadow-pop ${
          isDev
            ? 'bg-yellow-50 border border-yellow-200 text-yellow-700'
            : 'bg-ink text-white'
        }`}
      >
        {isDev ? <Zap size={14} /> : <Activity size={14} />}
        {text}
      </div>
    </div>
  )
}