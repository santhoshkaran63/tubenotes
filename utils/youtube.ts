/**
 * Parses a YouTube URL and extracts the video ID.
 * Supports:
 *   - https://www.youtube.com/watch?v=VIDEO_ID
 *   - https://youtu.be/VIDEO_ID
 *   - https://www.youtube.com/shorts/VIDEO_ID
 *   - https://www.youtube.com/embed/VIDEO_ID
 */
export function extractVideoId(url: string): string | null {
  const trimmed = url.trim()

  try {
    const parsed = new URL(trimmed)
    const hostname = parsed.hostname.replace('www.', '')

    if (hostname === 'youtube.com') {
      // /watch?v=
      if (parsed.pathname === '/watch') {
        return parsed.searchParams.get('v')
      }
      // /shorts/ or /embed/
      const match = parsed.pathname.match(/^\/(shorts|embed)\/([a-zA-Z0-9_-]{11})/)
      if (match) return match[2]
    }

    if (hostname === 'youtu.be') {
      // pathname is /VIDEO_ID
      const id = parsed.pathname.slice(1).split('?')[0]
      if (id.length === 11) return id
    }
  } catch {
    // Not a valid URL
  }

  // Fallback: regex match for 11-char video ID
  const fallback = trimmed.match(/[?&]v=([a-zA-Z0-9_-]{11})/)
  return fallback ? fallback[1] : null
}
