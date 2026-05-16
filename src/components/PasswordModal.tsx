import { useState, useRef, useEffect } from 'react'
import { useI18n } from '@/i18n'
import { Lock, ShieldAlert } from 'lucide-react'

interface Props {
  visible: boolean
  onVerify: (password: string) => void
  onCancel: () => void
}

export default function PasswordModal({ visible, onVerify, onCancel }: Props) {
  const { t } = useI18n()
  const [value, setValue] = useState('')
  const [error, setError] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (visible) {
      setValue('')
      setError(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [visible])

  if (!visible) return null

  const handleSubmit = () => {
    if (value === '123456') {
      onVerify(value)
    } else {
      setError(true)
      setValue('')
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/25">
      <div className={`bg-white border rounded-xl p-6 shadow-pop w-[300px] animate-modal-in ${error ? 'border-red-300' : 'border-surface-border'}`}>
        <div className="flex items-center justify-center gap-2 mb-3">
          <Lock size={16} className="text-ink-muted" />
          <span className="text-base font-semibold text-ink tracking-wide">
            {t('devAccess')}
          </span>
        </div>

        <p className="text-center text-xs text-ink-subtle mb-4">
          {t('devHint')}
        </p>

        <div className="mb-1">
          <input
            ref={inputRef}
            type="password"
            value={value}
            onChange={(e) => { setValue(e.target.value); setError(false) }}
            onKeyDown={(e) => { if (e.key === 'Enter') handleSubmit(); if (e.key === 'Escape') onCancel() }}
            placeholder={t('password')}
            className={`w-full bg-surface-alt rounded-lg px-4 py-2.5 text-center text-ink text-sm tracking-wider outline-none border transition-colors ${error ? 'border-red-300 bg-red-50' : 'border-surface-border focus:border-ink-faint'}`}
          />
        </div>

        {error && (
          <div className="flex items-center justify-center gap-1.5 mb-3 text-red-500 text-xs font-medium animate-slide-up">
            <ShieldAlert size={12} />
            {t('passwordError')}
          </div>
        )}

        <div className="flex gap-2.5 mt-4">
          <button
            onClick={onCancel}
            className="flex-1 py-2 rounded-lg text-sm text-ink-muted border border-surface-border hover:bg-surface-alt transition-colors cursor-pointer"
          >
            {t('cancel')}
          </button>
          <button
            onClick={handleSubmit}
            className="flex-1 py-2 rounded-lg text-sm font-medium text-white bg-ink hover:bg-ink/85 active:bg-ink/70 transition-colors cursor-pointer"
          >
            {t('confirm')}
          </button>
        </div>
      </div>
    </div>
  )
}