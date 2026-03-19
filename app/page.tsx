'use client'

import { useState } from 'react'
import { UrlInputForm } from '@/components/UrlInputForm'
import { TranscriptCard } from '@/components/TranscriptCard'
import { ErrorCard } from '@/components/ErrorCard'
import { SummaryCards } from '@/components/SummaryCards'
import { SummaryModeSwitcher } from '@/components/SummaryModeSwitcher'
import { VisualInsights } from '@/components/VisualInsights'
import { LoadingBar } from '@/components/LoadingBar'
import { SummaryData, SummaryMode } from '@/types/summary'

type TranscriptState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; transcript: string; videoId: string }
  | { status: 'error'; message: string }

type SummaryState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: SummaryData }
  | { status: 'error'; message: string }

export default function Home() {
  const [url, setUrl] = useState('')
  const [transcriptState, setTranscriptState] = useState<TranscriptState>({ status: 'idle' })
  const [summaryState, setSummaryState] = useState<SummaryState>({ status: 'idle' })
  const [summaryMode, setSummaryMode] = useState<SummaryMode>('balanced')

  async function fetchSummary(mode: SummaryMode) {
    if (transcriptState.status !== 'success') return
    setSummaryState({ status: 'loading' })
    try {
      const res = await fetch('/api/summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transcript: transcriptState.transcript, mode }),
      })
      const data = await res.json()
      if (data.success) {
        setSummaryState({ status: 'success', data: data.summary })
      } else {
        setSummaryState({ status: 'error', message: data.error ?? 'Summary generation failed.' })
      }
    } catch {
      setSummaryState({ status: 'error', message: 'Could not generate summary.' })
    }
  }

  async function handleSubmit() {
    setTranscriptState({ status: 'loading' })
    setSummaryState({ status: 'idle' })

    try {
      const res = await fetch('/api/transcript', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })
      const data = await res.json()

      if (data.success) {
        setTranscriptState({ status: 'success', transcript: data.transcript, videoId: data.videoId })
        // ✅ Summary is NOT auto-generated — user chooses when
      } else {
        setTranscriptState({ status: 'error', message: data.error ?? 'Something went wrong.' })
      }
    } catch {
      setTranscriptState({ status: 'error', message: 'Network error — check your connection.' })
    }
  }

  function handleModeChange(mode: SummaryMode) {
    setSummaryMode(mode)
  }

  function handleGenerateSummary() {
    fetchSummary(summaryMode)
  }

  function handleClear() {
    setTranscriptState({ status: 'idle' })
    setSummaryState({ status: 'idle' })
    setUrl('')
  }

  const hasTranscript = transcriptState.status === 'success'
  const hasSummary = summaryState.status === 'success'

  return (
    <main className="relative min-h-screen flex flex-col items-center px-4 py-10 sm:py-20 safe-bottom">
      {/* Background blobs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
        <div className="absolute -top-20 right-0 w-[400px] h-[400px] rounded-full opacity-25"
          style={{ background: 'radial-gradient(circle, #B8D8EC 0%, transparent 70%)', filter: 'blur(80px)' }} />
        <div className="absolute bottom-0 -left-10 w-[300px] h-[300px] rounded-full opacity-20"
          style={{ background: 'radial-gradient(circle, #7BB5D0 0%, transparent 70%)', filter: 'blur(70px)' }} />
      </div>

      <div className="relative z-10 w-full max-w-2xl flex flex-col gap-6">

        {/* Hero */}
        <header className="animate-fade-up">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md border border-sky-light/60 bg-sky-pale/50 mb-6">
            <span className="font-mono text-[10px] font-medium tracking-widest uppercase text-sky-mid">TubeNotes</span>
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-ink leading-tight mb-3 tracking-tight" style={{ fontFamily: 'var(--font-display)' }}>
            YouTube, distilled.
          </h1>
          <p className="text-ink-muted text-base max-w-md leading-relaxed">
            Paste a link. Get the full transcript — then summarize when you're ready.
          </p>
        </header>

        {/* Input card */}
        <section className="bg-warm-50 border border-cream-300 rounded-2xl p-5 sm:p-6 shadow-sm animate-fade-up"
          style={{ animationDelay: '0.08s', opacity: 0, animationFillMode: 'forwards' }}>
          <UrlInputForm
            url={url}
            loading={transcriptState.status === 'loading'}
            onChange={setUrl}
            onSubmit={handleSubmit}
          />
        </section>

        {/* Transcript error */}
        {transcriptState.status === 'error' && (
          <ErrorCard
            message={transcriptState.message}
            onRetry={() => setTranscriptState({ status: 'idle' })}
          />
        )}

        {/* Transcript loading */}
        {transcriptState.status === 'loading' && <LoadingBar active={true} />}

        {/* Transcript success */}
        {hasTranscript && (
          <div className="flex flex-col gap-5">

            {/* ── Transcript first ── */}
            <TranscriptCard
              transcript={transcriptState.transcript}
              videoId={transcriptState.videoId}
              onClear={handleClear}
            />

            {/* ── Summary generator ── */}
            {summaryState.status === 'idle' && (
              <div className="animate-fade-up bg-warm-50 border border-cream-300 rounded-2xl p-5 sm:p-6 shadow-sm">
                <p className="font-mono text-[10px] font-medium tracking-widest uppercase text-ink-subtle mb-4">
                  AI Summary
                </p>
                <p className="text-sm text-ink-muted mb-5 leading-relaxed">
                  Want an ADHD-friendly breakdown of this video? Choose a depth and generate.
                </p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <SummaryModeSwitcher
                    mode={summaryMode}
                    onChange={handleModeChange}
                    disabled={false}
                  />
                  <button
                    onClick={handleGenerateSummary}
                    className="sm:ml-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold bg-sky-note text-white hover:bg-sky-mid transition-all duration-150 shadow-sm active:scale-95 whitespace-nowrap"
                  >
                    Generate Summary
                  </button>
                </div>
              </div>
            )}

            {/* Summary loading */}
            {summaryState.status === 'loading' && <LoadingBar active={true} />}

            {/* Summary error */}
            {summaryState.status === 'error' && (
              <ErrorCard
                message={summaryState.message}
                onRetry={handleGenerateSummary}
              />
            )}

            {/* Summary results */}
            {hasSummary && (
              <div className="flex flex-col gap-5 animate-fade-up">
                {/* Re-generate controls */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <SummaryModeSwitcher
                    mode={summaryMode}
                    onChange={handleModeChange}
                    disabled={summaryState.status === 'loading'}
                  />
                  <button
                    onClick={handleGenerateSummary}
                    className="sm:ml-auto text-xs text-sky-mid underline underline-offset-2 hover:text-sky-deep transition-colors"
                  >
                    Regenerate
                  </button>
                </div>

                <SummaryCards summaryState={summaryState} />

                {summaryState.status === 'success' && summaryState.data.visuals.length > 0 && (
                  <VisualInsights visuals={summaryState.data.visuals} />
                )}
              </div>
            )}
          </div>
        )}

        {/* Footer */}
        <footer className="text-center mt-4 pb-4">
          <p className="font-mono text-[10px] tracking-widest uppercase text-ink-faint">
            Works with YouTube videos that have captions enabled
          </p>
        </footer>
      </div>
    </main>
  )
}
