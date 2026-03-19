interface ErrorCardProps {
  message: string
  onRetry?: () => void
}

export function ErrorCard({ message, onRetry }: ErrorCardProps) {
  return (
    <div
      className="animate-slide-in flex items-start gap-3 px-5 py-4 rounded-2xl border border-cream-400 bg-warm-50"
      role="alert"
      aria-live="polite"
    >
      <div className="shrink-0 mt-0.5 w-5 h-5 rounded-full bg-cream-300 flex items-center justify-center text-ink-muted text-xs font-bold">
        !
      </div>
      <div className="flex-1">
        <p className="text-sm text-ink-muted leading-relaxed">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="mt-1.5 text-xs text-sky-mid underline underline-offset-2 hover:text-sky-deep transition-colors"
          >
            Try again
          </button>
        )}
      </div>
    </div>
  )
}
