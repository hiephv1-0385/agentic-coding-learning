import Image from "next/image";

export default function AwardsHeroSection() {
  return (
    <section className="relative h-auto min-h-[300px] w-full lg:h-[547px]">
      <Image
        src="/images/hero-banner.png"
        alt="Keyvisual Sun* Annual Award 2025"
        fill
        priority
        className="object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-page-bg to-transparent" />
      <div className="absolute inset-0 flex items-start px-4 pt-[88px] sm:px-10 lg:px-36 lg:pt-[100px]">
        <Image
          src="/images/root-further-hero.png"
          alt="ROOT FURTHER"
          width={451}
          height={200}
          aria-hidden="true"
          className="h-auto w-[200px] sm:w-[280px] lg:w-[451px]"
        />
      </div>
    </section>
  );
}
