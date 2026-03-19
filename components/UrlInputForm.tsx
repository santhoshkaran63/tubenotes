'use client'

import { FormEvent, useRef } from 'react'
import { Spinner } from './Spinner'

interface UrlInputFormProps {
  url: string
  loading: boolean
  onChange: (value: string) => void
  onSubmit: () => void
}

export function UrlInputForm({ url, loading, onChange, onSubmit }: UrlInputFormProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!loading && url.trim()) onSubmit()
  }

  async function handlePaste() {
    try {
      const text = await navigator.clipboard.readText()
      if (text) onChange(text)
    } catch { /* user denied clipboard */ }
    inputRef.current?.focus()
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <label className="block font-mono text-[10px] font-medium tracking-widest uppercase text-ink-subtle mb-2">
        YouTube URL
      </label>

      <div className="flex gap-2 mb-3">
        <input
          ref={inputRef}
          autoFocus
          type="url"
          value={url}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && !loading && url.trim() && onSubmit()}
          placeholder="Paste a YouTube link…"
          aria-label="YouTube URL"
          className="
            flex-1 px-4 py-3 rounded-xl text-sm
            border border-cream-400 bg-cream-50
            text-ink placeholder-ink-faint
            focus:outline-none focus:ring-2 focus:ring-sky-light focus:border-sky-light
            transition-all duration-150
          "
        />
        <button
          type="button"
          onClick={handlePaste}
          aria-label="Paste from clipboard"
          className="
            px-4 py-3 rounded-xl text-sm font-medium
            border border-cream-400 bg-warm-50 text-ink-muted
            hover:bg-cream-100 hover:border-cream-500
            transition-all duration-150 active:scale-95 whitespace-nowrap
          "
        >
          Paste
        </button>
      </div>

      <button
        type="submit"
        disabled={loading || !url.trim()}
        aria-label="Get transcript and summary"
        className="
          w-full flex items-center justify-center gap-2.5
          px-6 py-3.5 rounded-xl text-sm font-semibold
          bg-sky-note text-white
          hover:bg-sky-mid active:scale-[0.99]
          disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-sky-note
          transition-all duration-150 shadow-sm
        "
      >
        {loading ? (
          <>
            <Spinner />
            <span className="animate-pulse-soft">Fetching transcript…</span>
          </>
        ) : (
          'Get Transcript & Summary'
        )}
      </button>
    </form>
  )
}
