import { NextRequest, NextResponse } from 'next/server'
import { generateSummary, SummaryError } from '@/lib/summary'
import { SummaryMode } from '@/types/summary'

export async function POST(req: NextRequest) {
  let body: { transcript?: string; mode?: SummaryMode }

  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid request.' }, { status: 400 })
  }

  const { transcript, mode = 'balanced' } = body

  if (!transcript || typeof transcript !== 'string') {
    return NextResponse.json({ success: false, error: 'Transcript is required.' }, { status: 400 })
  }

  try {
    const summary = await generateSummary(transcript, mode)
    return NextResponse.json({ success: true, summary })
  } catch (err) {
    if (err instanceof SummaryError) {
      return NextResponse.json({ success: false, error: err.message }, { status: 422 })
    }
    console.error('[summary] Unexpected error:', err)
    return NextResponse.json({ success: false, error: 'Summary generation failed.' }, { status: 500 })
  }
}
