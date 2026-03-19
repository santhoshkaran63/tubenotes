import { SummaryMode } from '@/types/summary'

interface Props {
  mode: SummaryMode
  onChange: (mode: SummaryMode) => void
  disabled?: boolean
}

const MODES: { value: SummaryMode; label: string }[] = [
  { value: 'short',    label: 'Super Short' },
  { value: 'balanced', label: 'Balanced'    },
  { value: 'detailed', label: 'Detailed'    },
]

export function SummaryModeSwitcher({ mode, onChange, disabled }: Props) {
  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-[10px] font-medium tracking-widest uppercase text-ink-subtle shrink-0">
        Depth
      </span>
      <div className="flex gap-1 p-1 bg-cream-200 rounded-xl border border-cream-300">
        {MODES.map((m) => (
          <button
            key={m.value}
            onClick={() => !disabled && onChange(m.value)}
            disabled={disabled}
            aria-pressed={mode === m.value}
            className={`
              px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150
              ${mode === m.value
                ? 'bg-warm-50 text-sky-mid shadow-sm border border-cream-300'
                : 'text-ink-muted hover:text-ink disabled:cursor-not-allowed'}
            `}
          >
            {m.label}
          </button>
        ))}
      </div>
    </div>
  )
}
