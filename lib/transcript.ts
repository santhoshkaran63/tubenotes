/**
 * Transcript provider — this is the SINGLE place to swap out the transcript
 * fetching library. If you want to replace `youtube-transcript` with another
 * provider (e.g. a paid API, Supadata, AssemblyAI, etc.), update only this file.
 *
 * Public contract:
 *   fetchTranscript(videoId: string): Promise<string>
 *   Throws a TranscriptError with a user-friendly message on failure.
 */

import { YoutubeTranscript } from 'youtube-transcript'

export class TranscriptError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'TranscriptError'
  }
}

/**
 * Fetches the full transcript for a YouTube video and returns it as a
 * single, clean string with normal sentence spacing.
 */
export async function fetchTranscript(videoId: string): Promise<string> {
  let segments: { text: string }[]

  try {
    segments = await YoutubeTranscript.fetchTranscript(videoId)
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message.toLowerCase() : ''

    if (msg.includes('disabled') || msg.includes('no transcript')) {
      throw new TranscriptError(
        'No transcript is available for this video. The creator may have disabled captions.'
      )
    }
    if (msg.includes('private') || msg.includes('unavailable')) {
      throw new TranscriptError(
        'This video is private or unavailable. Please try a different link.'
      )
    }

    throw new TranscriptError(
      'Could not fetch the transcript. The video may not have captions, or YouTube is temporarily blocking requests.'
    )
  }

  if (!segments || segments.length === 0) {
    throw new TranscriptError(
      'No transcript content was found for this video.'
    )
  }

  // Join segments into one clean readable block
  const text = segments
    .map((s) => s.text.trim())
    .filter(Boolean)
    .join(' ')
    // Clean up HTML entities that youtube-transcript sometimes returns
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()

  return text
}
