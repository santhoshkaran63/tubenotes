export function BackgroundBlobs() {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {/* Top-left large blob */}
      <div
        className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full opacity-40 animate-blob-float"
        style={{
          background: 'radial-gradient(circle, #fbd0d0 0%, #fde8e8 60%, transparent 100%)',
          filter: 'blur(40px)',
        }}
      />
      {/* Top-right medium blob */}
      <div
        className="absolute -top-16 right-0 w-[380px] h-[380px] rounded-full opacity-30 animate-blob-float-slow"
        style={{
          background: 'radial-gradient(circle, #faf0e0 0%, #fdf8f0 70%, transparent 100%)',
          filter: 'blur(50px)',
          animationDelay: '-4s',
        }}
      />
      {/* Bottom-right blob */}
      <div
        className="absolute bottom-0 -right-24 w-[420px] h-[420px] rounded-full opacity-35 animate-blob-float"
        style={{
          background: 'radial-gradient(circle, #f8b4b4 0%, #fde8e8 70%, transparent 100%)',
          filter: 'blur(45px)',
          animationDelay: '-2s',
        }}
      />
      {/* Bottom-left small blob */}
      <div
        className="absolute -bottom-16 left-1/4 w-[300px] h-[300px] rounded-full opacity-25 animate-blob-float-slow"
        style={{
          background: 'radial-gradient(circle, #f5e4cc 0%, #faf0e0 70%, transparent 100%)',
          filter: 'blur(35px)',
          animationDelay: '-6s',
        }}
      />
    </div>
  )
}
