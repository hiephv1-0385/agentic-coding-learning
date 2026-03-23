import Image from "next/image";

interface UserInfoProps {
  avatarUrl: string | null;
  name: string;
  department?: string | null;
  size?: "sm" | "md";
}

export default function UserInfo({
  avatarUrl,
  name,
  department,
  size = "md",
}: UserInfoProps) {
  const avatarSize = size === "sm" ? 40 : 64;

  return (
    <div className="flex flex-col items-center gap-[13px]">
      <div
        className="relative shrink-0 overflow-hidden rounded-full border-[1.87px] border-white"
        style={{ width: avatarSize, height: avatarSize }}
      >
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={`${name} profile photo`}
            fill
            className="object-cover"
            sizes={`${avatarSize}px`}
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-gold-10 text-gold-primary">
            <span className="font-[family-name:var(--font-montserrat)] text-sm font-bold">
              {name.charAt(0).toUpperCase()}
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-col items-center gap-0.5">
        <span className="font-[family-name:var(--font-montserrat)] text-base font-bold leading-6 text-text-dark">
          {name}
        </span>
        {department && (
          <span className="font-[family-name:var(--font-montserrat)] text-xs text-text-gray">
            {department}
          </span>
        )}
      </div>
    </div>
  );
}
