export type VisualType =
  | 'bar'
  | 'horizontal-bar'
  | 'timeline'
  | 'table'
  | 'stats'
  | 'checklist'
  | 'ranked-list'

export interface BarDataItem {
  label: string
  value: number
  unit?: string
}

export interface TimelineItem {
  time: string
  event: string
}

export interface TableData {
  headers: string[]
  rows: string[][]
}

export interface StatItem {
  label: string
  value: string
}

export interface ChecklistItem {
  item: string
  checked?: boolean
}

export interface RankedItem {
  rank: number
  item: string
  description?: string
}

export type VisualData =
  | BarDataItem[]
  | TimelineItem[]
  | TableData
  | StatItem[]
  | ChecklistItem[]
  | RankedItem[]

export interface Visual {
  type: VisualType
  title: string
  description: string
  data: VisualData
}

export interface VideoSection {
  title: string
  summary: string
}

export interface WatchOrSkip {
  summaryEnough: string
  watchFullIf: string
}

export type SummaryMode = 'short' | 'balanced' | 'detailed'

export interface SummaryData {
  quickTake: string
  keyPoints: string[]
  whyItMatters: string
  actionItems: string[]
  watchOrSkip: WatchOrSkip
  sections: VideoSection[]
  visuals: Visual[]
}
