import { NextRequest, NextResponse } from 'next/server'
import { extractVideoId } from '@/utils/youtube'
import { fetchTranscript, TranscriptError } from '@/lib/transcript'

export async function POST(req: NextRequest) {
  let body: { url?: string }

  try {
    body = await req.json()
  } catch {
    return NextResponse.json(
      { success: false, error: 'Invalid request body.' },
      { status: 400 }
    )
  }

  const { url } = body

  if (!url || typeof url !== 'string' || url.trim() === '') {
    return NextResponse.json(
      { success: false, error: 'Please provide a YouTube URL.' },
      { status: 400 }
    )
  }

  const videoId = extractVideoId(url)

  if (!videoId) {
    return NextResponse.json(
      {
        success: false,
        error:
          "That doesn't look like a valid YouTube link. Try a URL like youtube.com/watch?v=... or youtu.be/...",
      },
      { status: 422 }
    )
  }

  try {
    const transcript = await fetchTranscript(videoId)
    return NextResponse.json({ success: true, videoId, transcript })
  } catch (err) {
    if (err instanceof TranscriptError) {
      return NextResponse.json(
        { success: false, error: err.message },
        { status: 422 }
      )
    }

    console.error('[transcript] Unexpected error:', err)
    return NextResponse.json(
      { success: false, error: 'Something went wrong. Please try again.' },
      { status: 500 }
    )
  }
}
