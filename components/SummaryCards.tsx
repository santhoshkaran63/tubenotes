'use client'

import { SummaryData } from '@/types/summary'

type SummaryState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: SummaryData }
  | { status: 'error'; message: string }

interface Props {
  summaryState: SummaryState
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3 mb-4">
      <span className="font-mono text-[10px] font-medium tracking-widest uppercase text-sky-mid">
        {children}
      </span>
      <div className="flex-1 h-px bg-cream-300" />
    </div>
  )
}

function SkeletonCard({ lines = 3 }: { lines?: number }) {
  return (
    <div className="bg-warm-50 border border-cream-300 rounded-2xl p-5">
      <div className="shimmer h-3 w-20 rounded-full mb-5" />
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className="shimmer h-3 rounded-full mb-2.5"
          style={{ width: `${90 - i * 12}%` }}
        />
      ))}
    </div>
  )
}

export function SummaryCards({ summaryState }: Props) {
  if (summaryState.status === 'idle') return null

  if (summaryState.status === 'loading') {
    return (
      <div className="flex flex-col gap-4 animate-fade-up">
        <SkeletonCard lines={2} />
        <SkeletonCard lines={6} />
        <SkeletonCard lines={2} />
        <SkeletonCard lines={4} />
      </div>
    )
  }

  if (summaryState.status === 'error') {
    return (
      <div className="px-5 py-4 rounded-2xl border border-cream-400 bg-warm-50 animate-slide-in">
        <p className="font-mono text-[10px] tracking-widest uppercase text-ink-subtle mb-1">Summary</p>
        <p className="text-sm text-ink-muted leading-relaxed">{summaryState.message}</p>
      </div>
    )
  }

  const { data } = summaryState

  return (
    <div className="flex flex-col gap-4 animate-slide-in">

      {/* Quick Take — highlighted */}
      <div className="bg-sky-pale/50 border border-sky-light/60 rounded-2xl p-5">
        <SectionLabel>Quick Take</SectionLabel>
        <p className="text-sm text-ink leading-relaxed font-medium">{data.quickTake}</p>
      </div>

      {/* Key Points */}
      {data.keyPoints.length > 0 && (
        <div className="bg-warm-50 border border-cream-300 rounded-2xl p-5">
          <SectionLabel>Key Points</SectionLabel>
          <ul className="flex flex-col gap-2.5">
            {data.keyPoints.map((point, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-ink leading-relaxed">
                <span className="shrink-0 mt-2 w-1.5 h-1.5 rounded-full bg-sky-note" />
                {point}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Why It Matters */}
      {data.whyItMatters && (
        <div className="bg-warm-50 border border-cream-300 rounded-2xl p-5">
          <SectionLabel>Why It Matters</SectionLabel>
          <p className="text-sm text-ink leading-relaxed">{data.whyItMatters}</p>
        </div>
      )}

      {/* Action Items */}
      {data.actionItems.length > 0 && (
        <div className="bg-warm-50 border border-cream-300 rounded-2xl p-5">
          <SectionLabel>Action Items</SectionLabel>
          <ul className="flex flex-col gap-2.5">
            {data.actionItems.map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-ink leading-relaxed">
                <span className="shrink-0 font-mono text-sky-note text-xs mt-0.5">→</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Chapter Breakdown */}
      {data.sections.length > 0 && (
        <div className="bg-warm-50 border border-cream-300 rounded-2xl p-5">
          <SectionLabel>Chapter Breakdown</SectionLabel>
          <div className="flex flex-col">
            {data.sections.map((section, i) => (
              <div key={i} className="flex gap-4">
                {/* Timeline spine */}
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 rounded-full bg-sky-note mt-1 shrink-0" />
                  {i < data.sections.length - 1 && (
                    <div className="w-px flex-1 bg-cream-400 mt-1 mb-1" />
                  )}
                </div>
                {/* Content */}
                <div className={`pb-4 ${i === data.sections.length - 1 ? 'pb-0' : ''}`}>
                  <p className="font-mono text-[10px] font-medium tracking-widest uppercase text-sky-mid mb-1">
                    {section.title}
                  </p>
                  <p className="text-sm text-ink leading-relaxed">{section.summary}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Watch or Skip */}
      <div className="bg-warm-50 border border-cream-300 rounded-2xl p-5">
        <SectionLabel>Watch or Skip?</SectionLabel>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <p className="font-mono text-[10px] font-medium tracking-widest uppercase text-ink-subtle mb-2">
              Summary enough?
            </p>
            <p className="text-sm text-ink leading-relaxed">{data.watchOrSkip.summaryEnough}</p>
          </div>
          <div>
            <p className="font-mono text-[10px] font-medium tracking-widest uppercase text-ink-subtle mb-2">
              Watch the full video if…
            </p>
            <p className="text-sm text-ink leading-relaxed">{data.watchOrSkip.watchFullIf}</p>
          </div>
        </div>
      </div>
    </div>
  )
}
