'use client'

import { useState } from 'react'

interface TranscriptCardProps {
  transcript: string
  videoId: string
  onClear: () => void
}

export function TranscriptCard({ transcript, videoId, onClear }: TranscriptCardProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(transcript)
    } catch {
      const el = document.createElement('textarea')
      el.value = transcript
      el.style.cssText = 'position:fixed;opacity:0'
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    }
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const wordCount = transcript.split(/\s+/).filter(Boolean).length

  return (
    <div className="animate-slide-in">
      {/* Header row */}
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] font-medium tracking-widest uppercase text-ink-subtle">
            Full Transcript
          </span>
          <span className="text-[10px] text-ink-faint font-mono">
            {wordCount.toLocaleString()} words · {videoId}
          </span>
        </div>
        <span className="text-[10px] text-ink-faint">scroll to read</span>
      </div>

      {/* Card */}
      <div className="rounded-2xl border border-cream-400 bg-warm-50 overflow-hidden shadow-sm">
        <div className="h-0.5 w-full bg-gradient-to-r from-sky-pale via-sky-light to-sky-pale" />
        <div className="transcript-scroll overflow-y-auto p-5 sm:p-6 max-h-80">
          <p className="text-sm leading-7 text-ink/80 whitespace-pre-wrap font-body">
            {transcript}
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 mt-3">
        <button
          onClick={handleCopy}
          aria-label="Copy transcript to clipboard"
          className={`
            flex-1 flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium
            transition-all duration-150 active:scale-95
            ${copied
              ? 'bg-green-50 border border-green-200 text-green-700'
              : 'bg-sky-note text-white hover:bg-sky-mid shadow-sm'}
          `}
        >
          {copied ? '✓ Copied!' : 'Copy Transcript'}
        </button>

        <button
          onClick={onClear}
          aria-label="Clear and start over"
          className="px-5 py-2.5 rounded-xl text-sm font-medium border border-cream-400 text-ink-muted bg-warm-50 hover:bg-cream-100 hover:border-cream-500 transition-all duration-150 active:scale-95"
        >
          Clear
        </button>
      </div>
    </div>
  )
}
