export default function KudosLoading() {
  return (
    <div className="min-h-screen bg-page-bg">
      {/* Hero banner skeleton */}
      <div className="h-[300px] animate-pulse bg-container-dark lg:h-[512px]" />

      {/* Highlight section skeleton */}
      <div className="px-4 py-16 sm:px-12 lg:px-[var(--spacing-page-padding-x)]">
        <div className="mb-4 h-8 w-48 animate-pulse rounded bg-container-dark" />
        <div className="h-6 w-64 animate-pulse rounded bg-container-dark" />
        <div className="mt-8 flex gap-6 overflow-hidden">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-80 w-[528px] shrink-0 animate-pulse rounded-carousel-card bg-container-dark"
            />
          ))}
        </div>
      </div>

      {/* Spotlight skeleton */}
      <div className="px-4 pb-16 sm:px-12 lg:px-[var(--spacing-page-padding-x)]">
        <div className="mb-4 h-8 w-48 animate-pulse rounded bg-container-dark" />
        <div className="mx-auto h-[548px] max-w-[1157px] animate-pulse rounded-spotlight bg-container-dark" />
      </div>

      {/* Feed skeleton */}
      <div className="px-4 py-16 sm:px-12 lg:px-[var(--spacing-page-padding-x)]">
        <div className="mb-4 h-8 w-48 animate-pulse rounded bg-container-dark" />
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-20">
          <div className="flex w-full flex-col gap-4 lg:max-w-[680px]">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-64 animate-pulse rounded-kudos-card bg-container-dark"
              />
            ))}
          </div>
          <div className="flex w-full flex-col gap-6 lg:max-w-[422px]">
            <div className="h-80 animate-pulse rounded-sidebar-card bg-container-dark" />
            <div className="h-96 animate-pulse rounded-sidebar-card bg-container-dark" />
          </div>
        </div>
      </div>
    </div>
  );
}
