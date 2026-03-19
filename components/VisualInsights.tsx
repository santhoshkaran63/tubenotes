'use client'

import {
  Visual,
  BarDataItem,
  TimelineItem,
  TableData,
  StatItem,
  ChecklistItem,
  RankedItem,
} from '@/types/summary'

interface Props {
  visuals: Visual[]
}

/* ── helpers ── */

function isBarData(d: unknown): d is BarDataItem[] {
  return Array.isArray(d) && d.length > 0 && typeof (d[0] as BarDataItem).value === 'number'
}
function isTimelineData(d: unknown): d is TimelineItem[] {
  return Array.isArray(d) && d.length > 0 && typeof (d[0] as TimelineItem).time === 'string'
}
function isTableData(d: unknown): d is TableData {
  return !Array.isArray(d) && typeof (d as TableData).headers !== 'undefined'
}
function isStatData(d: unknown): d is StatItem[] {
  return Array.isArray(d) && d.length > 0 && typeof (d[0] as StatItem).value === 'string' && typeof (d[0] as StatItem).label === 'string'
}
function isChecklistData(d: unknown): d is ChecklistItem[] {
  return Array.isArray(d) && d.length > 0 && typeof (d[0] as ChecklistItem).item === 'string'
}
function isRankedData(d: unknown): d is RankedItem[] {
  return Array.isArray(d) && d.length > 0 && typeof (d[0] as RankedItem).rank === 'number'
}

/* ── chart sub-components ── */

function BarChart({ data, horizontal }: { data: BarDataItem[]; horizontal?: boolean }) {
  const max = Math.max(...data.map((d) => d.value), 1)
  return (
    <div className="flex flex-col gap-2">
      {data.map((item, i) => (
        <div key={i} className={`flex ${horizontal ? 'items-center' : 'flex-col'} gap-2`}>
          <span className={`text-xs text-ink-muted shrink-0 ${horizontal ? 'w-28 text-right' : ''}`}>
            {item.label}
          </span>
          <div className="flex-1 h-4 bg-cream-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-sky-note rounded-full transition-all duration-700"
              style={{ width: `${(item.value / max) * 100}%` }}
            />
          </div>
          <span className="font-mono text-[11px] text-ink-subtle shrink-0">
            {item.value}{item.unit ?? ''}
          </span>
        </div>
      ))}
    </div>
  )
}

function Timeline({ data }: { data: TimelineItem[] }) {
  return (
    <div className="flex flex-col">
      {data.map((item, i) => (
        <div key={i} className="flex gap-3">
          <div className="flex flex-col items-center">
            <div className="w-2 h-2 rounded-full bg-sky-note mt-1 shrink-0" />
            {i < data.length - 1 && <div className="w-px flex-1 bg-cream-300 mt-1 mb-1" />}
          </div>
          <div className="pb-3">
            <span className="font-mono text-[10px] text-sky-mid">{item.time}</span>
            <p className="text-sm text-ink leading-relaxed">{item.event}</p>
          </div>
        </div>
      ))}
    </div>
  )
}

function DataTable({ data }: { data: TableData }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr>
            {data.headers.map((h, i) => (
              <th key={i} className="text-left font-mono text-[10px] tracking-widest uppercase text-ink-subtle pb-2 pr-4 border-b border-cream-300">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, i) => (
            <tr key={i} className={i % 2 === 0 ? '' : 'bg-cream-50'}>
              {row.map((cell, j) => (
                <td key={j} className="py-2 pr-4 text-ink leading-relaxed border-b border-cream-200 text-xs">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function StatCards({ data }: { data: StatItem[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
      {data.map((item, i) => (
        <div key={i} className="bg-cream-100 rounded-xl p-3 border border-cream-300">
          <p className="font-mono text-[10px] tracking-widest uppercase text-ink-subtle mb-1">{item.label}</p>
          <p className="text-base font-semibold text-sky-deep font-display">{item.value}</p>
        </div>
      ))}
    </div>
  )
}

function Checklist({ data }: { data: ChecklistItem[] }) {
  return (
    <ul className="flex flex-col gap-2">
      {data.map((item, i) => (
        <li key={i} className="flex items-start gap-3 text-sm text-ink leading-relaxed">
          <span className={`shrink-0 mt-0.5 w-4 h-4 rounded border flex items-center justify-center text-[10px] ${item.checked ? 'bg-sky-note border-sky-note text-white' : 'border-cream-400 bg-warm-50'}`}>
            {item.checked ? '✓' : ''}
          </span>
          {item.item}
        </li>
      ))}
    </ul>
  )
}

function RankedList({ data }: { data: RankedItem[] }) {
  return (
    <ol className="flex flex-col gap-3">
      {data.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className="shrink-0 font-mono text-[11px] text-sky-mid font-medium w-5">
            #{item.rank}
          </span>
          <div>
            <p className="text-sm font-medium text-ink">{item.item}</p>
            {item.description && (
              <p className="text-xs text-ink-muted leading-relaxed mt-0.5">{item.description}</p>
            )}
          </div>
        </li>
      ))}
    </ol>
  )
}

/* ── main component ── */

function VisualCard({ visual }: { visual: Visual }) {
  const { data } = visual

  const chart = (() => {
    if ((visual.type === 'bar' || visual.type === 'horizontal-bar') && isBarData(data))
      return <BarChart data={data} horizontal={visual.type === 'horizontal-bar'} />
    if (visual.type === 'timeline' && isTimelineData(data))
      return <Timeline data={data} />
    if (visual.type === 'table' && isTableData(data))
      return <DataTable data={data} />
    if (visual.type === 'stats' && isStatData(data))
      return <StatCards data={data} />
    if (visual.type === 'checklist' && isChecklistData(data))
      return <Checklist data={data} />
    if (visual.type === 'ranked-list' && isRankedData(data))
      return <RankedList data={data} />
    return null
  })()

  if (!chart) return null

  return (
    <div className="bg-warm-50 border border-cream-300 rounded-2xl p-5">
      <div className="flex items-center gap-3 mb-1">
        <p className="font-display text-sm font-semibold text-ink">{visual.title}</p>
      </div>
      {visual.description && (
        <p className="text-xs text-ink-subtle mb-4 leading-relaxed">{visual.description}</p>
      )}
      {chart}
    </div>
  )
}

export function VisualInsights({ visuals }: Props) {
  if (!visuals || visuals.length === 0) return null

  return (
    <div className="flex flex-col gap-4 animate-slide-in">
      <div className="flex items-center gap-3">
        <span className="font-mono text-[10px] font-medium tracking-widest uppercase text-sky-mid">
          Visual Insights
        </span>
        <div className="flex-1 h-px bg-cream-300" />
      </div>
      {visuals.map((v, i) => (
        <VisualCard key={i} visual={v} />
      ))}
    </div>
  )
}
