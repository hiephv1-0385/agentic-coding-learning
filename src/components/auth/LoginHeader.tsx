import Image from "next/image";
import Link from "next/link";
import LanguageSelector from "@/components/shared/LanguageSelector";

export default function LoginHeader() {
  return (
    <header className="relative z-10 w-full h-20 bg-header-bg backdrop-blur-md flex items-center justify-between px-4 sm:px-12 lg:px-[72px]">
      <Link href="/">
        <Image
          src="/images/logo-saa.png"
          alt="SAA 2025"
          width={64}
          height={60}
          priority
        />
      </Link>
      <LanguageSelector />
    </header>
  );
}
