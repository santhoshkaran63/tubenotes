export function Spinner({ size = 'sm' }: { size?: 'sm' | 'md' }) {
  const cls = size === 'md' ? 'w-5 h-5' : 'w-4 h-4'
  return (
    <span
      className={`inline-block ${cls} rounded-full border-2 border-sky-pale border-t-sky-note animate-spin`}
      aria-label="Loading"
    />
  )
}
