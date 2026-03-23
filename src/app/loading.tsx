export default function Loading() {
  return (
    <div className="min-h-screen bg-page-bg max-w-page mx-auto">
      {/* Header skeleton */}
      <div className="h-20 bg-header-bg backdrop-blur-sm px-4 sm:px-12 lg:px-36 flex items-center justify-between animate-pulse">
        <div className="w-16 h-15 bg-white/5 rounded" />
        <div className="hidden sm:flex gap-8">
          <div className="w-24 h-4 bg-white/5 rounded" />
          <div className="w-28 h-4 bg-white/5 rounded" />
          <div className="w-20 h-4 bg-white/5 rounded" />
        </div>
        <div className="flex gap-4">
          <div className="w-10 h-10 bg-white/5 rounded-full" />
          <div className="w-10 h-10 bg-white/5 rounded-full" />
        </div>
      </div>

      {/* Hero skeleton */}
      <div className="w-full h-[60vh] lg:h-[1392px] bg-white/5 animate-pulse" />

      {/* Content skeleton */}
      <div className="flex flex-col items-center gap-16 lg:gap-[--spacing-section-gap] px-4 sm:px-12 lg:px-36 py-12 lg:py-[--spacing-page-padding-y]">
        {/* Root Further skeleton */}
        <div className="w-full max-w-content-narrow h-80 bg-white/5 rounded-lg animate-pulse" />

        {/* Awards skeleton */}
        <div className="w-full max-w-content flex flex-col gap-20">
          <div className="flex flex-col gap-4 animate-pulse">
            <div className="h-8 w-48 bg-white/5 rounded" />
            <div className="h-14 w-96 bg-white/5 rounded" />
            <div className="h-6 w-80 bg-white/5 rounded" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex flex-col gap-3 animate-pulse">
                <div className="aspect-square bg-white/5 rounded-lg" />
                <div className="h-8 bg-white/5 rounded w-3/4" />
                <div className="h-12 bg-white/5 rounded" />
                <div className="h-6 bg-white/5 rounded w-1/3" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
