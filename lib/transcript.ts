/**
 * Transcript provider — swap provider here if needed.
 * Currently uses Supadata API (works from server/Vercel).
 * Requires: SUPADATA_API_KEY in .env.local
 */

export class TranscriptError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'TranscriptError'
  }
}

export async function fetchTranscript(videoId: string): Promise<string> {
  const apiKey = process.env.SUPADATA_API_KEY

  if (!apiKey) {
    throw new TranscriptError('SUPADATA_API_KEY is not set. Add it to your .env.local file.')
  }

  let response: Response
  try {
    response = await fetch(
      `https://api.supadata.ai/v1/youtube/transcript?videoId=${videoId}&text=true`,
      {
        headers: {
          'x-api-key': apiKey,
        },
      }
    )
  } catch {
    throw new TranscriptError('Could not reach transcript service. Check your internet connection.')
  }

  if (!response.ok) {
    if (response.status === 404) {
      throw new TranscriptError('No transcript is available for this video. The creator may have disabled captions.')
    }
    if (response.status === 401 || response.status === 403) {
      throw new TranscriptError('Invalid Supadata API key. Check SUPADATA_API_KEY in your environment variables.')
    }
    throw new TranscriptError('Could not fetch the transcript. The video may be private or unavailable.')
  }

  const data = await response.json()

  // Supadata returns { content: string } when text=true
  const text: string = typeof data.content === 'string'
    ? data.content
    : Array.isArray(data.content)
      ? data.content.map((s: { text: string }) => s.text).join(' ')
      : ''

  if (!text.trim()) {
    throw new TranscriptError('No transcript content was found for this video.')
  }

  return text
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}
