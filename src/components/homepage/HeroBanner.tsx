import Image from "next/image";
import type { Event } from "@/types/event";
import CountdownTimer from "@/components/homepage/CountdownTimer";
import EventInfo from "@/components/homepage/EventInfo";
import CTAButtons from "@/components/homepage/CTAButtons";

interface HeroBannerProps {
  event: Event | null;
}

export default function HeroBanner({ event }: HeroBannerProps) {
  return (
    <section className="relative w-full">
      {/* Cover Image */}
      <Image
        src={event?.heroBannerUrl ?? "/images/hero-banner.png"}
        alt="Sun* Annual Awards 2025 - ROOT FURTHER"
        fill
        sizes="100vw"
        className="object-cover"
        priority
      />

      {/* Gradient Overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(12deg, #00101A 23.7%, rgba(0,18,29,0.46) 38.34%, rgba(0,19,32,0) 48.92%)",
        }}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col px-4 sm:px-12 lg:px-36 pt-[100px] lg:pt-[120px] pb-16 lg:pb-24 gap-10">
        {/* ROOT FURTHER Logo */}
        <Image
          src="/images/root-further-hero.png"
          alt="ROOT FURTHER"
          width={451}
          height={200}
          className="w-[280px] sm:w-[360px] lg:w-[451px] h-auto"
        />

        <CountdownTimer />

        {event && (
          <EventInfo
            date={event.dateTime}
            venue={event.venue}
            livestreamInfo={event.livestreamInfo}
          />
        )}

        <CTAButtons />
      </div>
    </section>
  );
}
