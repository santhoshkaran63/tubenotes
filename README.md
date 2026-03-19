# 🎀 Transcribbly

A soft, bubbly YouTube transcript extractor built with Next.js 14, TypeScript, and Tailwind CSS.

---

## Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start the dev server
npm run dev

# 3. Open your browser
http://localhost:3000
```

---

## Project Structure

```
transcribbly/
├── app/
│   ├── layout.tsx              # Root layout + metadata
│   ├── page.tsx                # Main page (client component)
│   ├── globals.css             # Tailwind + custom styles + fonts
│   └── api/
│       └── transcript/
│           └── route.ts        # POST /api/transcript — server-side handler
├── components/
│   ├── BackgroundBlobs.tsx     # Decorative animated blobs
│   ├── ErrorCard.tsx           # Friendly inline error display
│   ├── Spinner.tsx             # Loading spinner
│   ├── TranscriptCard.tsx      # Transcript display + copy/clear buttons
│   └── UrlInputForm.tsx        # URL input + paste + submit
├── lib/
│   └── transcript.ts           # ← SWAP TRANSCRIPT PROVIDER HERE
└── utils/
    └── youtube.ts              # YouTube URL parsing / video ID extraction
```

---

## How Transcript Fetching Works

1. User pastes a YouTube URL into the input.
2. The frontend calls `POST /api/transcript` with `{ url }`.
3. `utils/youtube.ts` parses the URL and extracts the 11-character video ID.
4. `lib/transcript.ts` calls `YoutubeTranscript.fetchTranscript(videoId)` from the `youtube-transcript` package.
5. Transcript segments are joined into one clean text block.
6. The API returns `{ success: true, videoId, transcript }`.

---

## 🔄 Swapping the Transcript Provider

**Everything is isolated in `lib/transcript.ts`.**

To replace `youtube-transcript` with a different provider:

1. Open `lib/transcript.ts`
2. Replace the import and the `fetchTranscript` implementation
3. Make sure your new implementation:
   - Returns a `Promise<string>` (the full transcript text)
   - Throws a `TranscriptError` with a user-friendly message on failure

Example alternative providers:
- [Supadata](https://supadata.ai) — paid API, higher reliability
- [AssemblyAI](https://www.assemblyai.com) — AI-powered transcription
- A custom scraper or YouTube Data API v3 captions endpoint

---

## Supported YouTube URL Formats

| Format | Example |
|--------|---------|
| Standard watch | `https://www.youtube.com/watch?v=dQw4w9WgXcQ` |
| Short link | `https://youtu.be/dQw4w9WgXcQ` |
| Shorts | `https://www.youtube.com/shorts/dQw4w9WgXcQ` |
| Embed | `https://www.youtube.com/embed/dQw4w9WgXcQ` |

---

## Deploy to Vercel

```bash
npx vercel
```

No environment variables needed. No database. No auth.
