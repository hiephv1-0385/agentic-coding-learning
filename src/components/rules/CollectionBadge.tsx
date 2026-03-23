"use client";

import Image from "next/image";

interface CollectionBadgeProps {
  name: string;
  imageSrc: string;
}

export default function CollectionBadge({
  name,
  imageSrc,
}: CollectionBadgeProps) {
  const isShortName = name === "REVIVAL" || name === "STAY GOLD";

  return (
    <div className="flex w-20 flex-col items-center gap-2">
      <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-white">
        <Image
          src={imageSrc}
          alt={`${name} collection badge`}
          width={64}
          height={64}
          className="h-full w-full object-cover"
        />
      </div>
      <span
        className={`text-center font-bold leading-4 tracking-[0.5px] text-white ${
          isShortName ? "text-xs" : "text-[11px]"
        }`}
      >
        {name}
      </span>
    </div>
  );
}
