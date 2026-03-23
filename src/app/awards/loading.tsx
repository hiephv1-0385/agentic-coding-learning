export default function AwardsLoading() {
  return (
    <div className="min-h-screen bg-page-bg">
      {/* Hero banner skeleton */}
      <div className="h-[300px] animate-pulse bg-container-dark lg:h-[547px]" />

      {/* Content area */}
      <div className="mx-auto max-w-[1440px] px-4 py-16 sm:px-10 lg:px-36">
        {/* Section title skeleton */}
        <div className="mb-4 flex flex-col items-center gap-4">
          <div className="h-6 w-64 animate-pulse rounded bg-container-dark" />
          <div className="h-px w-full bg-container-dark" />
          <div className="h-10 w-96 animate-pulse rounded bg-container-dark" />
        </div>

        {/* Award cards section */}
        <div className="mt-12 flex flex-col gap-awards-gap lg:flex-row">
          {/* Sidebar skeleton */}
          <div className="flex flex-row gap-0 overflow-hidden lg:flex-col lg:min-w-[180px] lg:shrink-0">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-12 w-32 animate-pulse rounded bg-container-dark lg:w-full"
              />
            ))}
          </div>

          {/* Cards skeleton */}
          <div className="flex flex-col gap-section-gap">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className={`flex flex-col gap-award-card-gap sm:flex-row ${i % 2 === 0 ? "sm:flex-row-reverse" : ""}`}
              >
                <div className="mx-auto h-[280px] w-[280px] shrink-0 animate-pulse rounded-carousel-card bg-container-dark sm:h-[336px] sm:w-[336px]" />
                <div className="flex flex-1 flex-col gap-4">
                  <div className="h-8 w-48 animate-pulse rounded bg-container-dark" />
                  <div className="h-24 w-full animate-pulse rounded bg-container-dark" />
                  <div className="h-px w-full bg-container-dark" />
                  <div className="h-16 w-full animate-pulse rounded bg-container-dark" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Kudos section skeleton */}
        <div className="mt-section-gap h-48 animate-pulse rounded-kudos-card bg-container-dark lg:h-[500px]" />
      </div>
    </div>
  );
}
