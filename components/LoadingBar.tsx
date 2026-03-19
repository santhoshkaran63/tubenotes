'use client'

import { useEffect, useState } from 'react'

const MESSAGES = [
  'Fetching transcript…',
  'Reading the video…',
  'Grabbing captions…',
  'Almost there…',
  'Generating your summary…',
  'Distilling the key points…',
  'Organizing insights…',
  'Nearly done…',
]

export function LoadingBar({ active }: { active: boolean }) {
  const [msgIndex, setMsgIndex] = useState(0)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!active) {
      setProgress(0)
      setMsgIndex(0)
      return
    }

    // Progress bar: ramps up to ~85% then stalls waiting for response
    const prog = setInterval(() => {
      setProgress((p) => {
        if (p < 40) return p + 4
        if (p < 70) return p + 1.5
        if (p < 85) return p + 0.4
        return p
      })
    }, 120)

    // Cycle messages every 2.8s
    const msg = setInterval(() => {
      setMsgIndex((i) => (i + 1) % MESSAGES.length)
    }, 2800)

    return () => {
      clearInterval(prog)
      clearInterval(msg)
    }
  }, [active])

  if (!active) return null

  return (
    <div className="animate-fade-up">
      {/* Progress bar */}
      <div className="h-0.5 w-full bg-cream-300 rounded-full overflow-hidden mb-6">
        <div
          className="h-full bg-sky-note rounded-full transition-all duration-300 ease-out"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Animated dots + message */}
      <div className="flex items-center gap-3 px-1 mb-6">
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-sky-note animate-bounce"
              style={{ animationDelay: `${i * 0.15}s`, animationDuration: '0.8s' }}
            />
          ))}
        </div>
        <span className="text-sm text-ink-muted transition-all duration-500">
          {MESSAGES[msgIndex]}
        </span>
      </div>

      {/* Skeleton cards */}
      <div className="flex flex-col gap-4">
        {[2, 5, 2, 3].map((lines, cardIdx) => (
          <div
            key={cardIdx}
            className="bg-warm-50 border border-cream-300 rounded-2xl p-5"
            style={{ animationDelay: `${cardIdx * 0.1}s` }}
          >
            <div className="shimmer h-2.5 w-16 rounded-full mb-4" />
            {Array.from({ length: lines }).map((_, i) => (
              <div
                key={i}
                className="shimmer h-2.5 rounded-full mb-2.5"
                style={{ width: `${95 - i * (10 + cardIdx * 2)}%` }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
