/**
 * Summary provider — this is the SINGLE place to swap summarization logic.
 * Currently uses Anthropic Claude via direct fetch.
 * To replace: update generateSummary() below.
 *
 * Requires: ANTHROPIC_API_KEY in .env.local
 */

import { SummaryData, SummaryMode } from '@/types/summary'

export class SummaryError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'SummaryError'
  }
}

const SYSTEM_PROMPT = `You are an expert at creating ADHD-friendly video summaries. Given a YouTube transcript, return a structured JSON summary.

STRICT RULES:
- Return ONLY valid JSON. No markdown, no code fences, no preamble, no explanation.
- Keep everything scannable and short. Main idea first.
- Plain language. Short sentences. No jargon unless explained.
- Only include visuals if they GENUINELY help (real comparisons, rankings, steps).
- NEVER fabricate numbers, statistics, or data not in the transcript.
- If no good visual exists, return empty visuals array [].

Visual data formats (use exact structure):
- bar / horizontal-bar: [{"label":"string","value":number,"unit":"optional"}]
- timeline: [{"time":"string","event":"string"}]
- table: {"headers":["string"],"rows":[["string"]]}
- stats: [{"label":"string","value":"string"}]
- checklist: [{"item":"string","checked":false}]
- ranked-list: [{"rank":1,"item":"string","description":"optional"}]`

function buildPrompt(transcript: string, mode: SummaryMode): string {
  const modeGuide = {
    short: 'Ultra concise. quickTake: 1-2 sentences. keyPoints: max 5 (very short). sections: max 3. Omit whyItMatters/actionItems if not critical.',
    balanced: 'Balanced. quickTake: 2-3 sentences. keyPoints: 5-7. All sections included.',
    detailed: 'Thorough but structured. quickTake: 3-4 sentences. keyPoints: 8-10. All sections with more depth.',
  }

  return `Density mode: ${modeGuide[mode]}

Return this EXACT JSON structure (no deviations):
{
  "quickTake": "string",
  "keyPoints": ["string"],
  "whyItMatters": "string",
  "actionItems": ["string"],
  "watchOrSkip": {
    "summaryEnough": "string",
    "watchFullIf": "string"
  },
  "sections": [{"title":"string","summary":"string"}],
  "visuals": [{"type":"bar|horizontal-bar|timeline|table|stats|checklist|ranked-list","title":"string","description":"string","data":[]}]
}

TRANSCRIPT:
${transcript}`
}

export async function generateSummary(
  transcript: string,
  mode: SummaryMode = 'balanced'
): Promise<SummaryData> {
  const apiKey = process.env.ANTHROPIC_API_KEY

  if (!apiKey) {
    throw new SummaryError(
      'ANTHROPIC_API_KEY is not set. Add it to your .env.local file to enable summaries.'
    )
  }

  // Truncate very long transcripts
  const text =
    transcript.length > 14000
      ? transcript.slice(0, 14000) + '\n[transcript truncated for length]'
      : transcript

  let response: Response
  try {
    response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 2048,
        system: SYSTEM_PROMPT,
        messages: [{ role: 'user', content: buildPrompt(text, mode) }],
      }),
    })
  } catch {
    throw new SummaryError('Could not reach summary service. Check your internet connection.')
  }

  if (!response.ok) {
    const err = await response.json().catch(() => ({}))
    if (response.status === 401) throw new SummaryError('Invalid API key. Check ANTHROPIC_API_KEY in .env.local.')
    if (response.status === 429) throw new SummaryError('Rate limit reached. Try again in a moment.')
    throw new SummaryError(`Summary service error: ${(err as { error?: { message?: string } })?.error?.message ?? response.statusText}`)
  }

  const data = await response.json()
  const raw: string = data.content?.[0]?.text ?? ''

  try {
    const clean = raw.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim()
    return JSON.parse(clean) as SummaryData
  } catch {
    throw new SummaryError('Could not parse summary. Please try again.')
  }
}
