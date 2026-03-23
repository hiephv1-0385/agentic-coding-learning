"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import Icon from "@/components/ui/Icon";
import LanguageSelector from "@/components/shared/LanguageSelector";
import ProfileDropdown from "@/components/shared/ProfileDropdown";
import { useLocale } from "@/hooks/useLocale";

type ActiveLink = "about" | "awards" | "kudos";

interface HeaderProps {
  activeLink?: ActiveLink;
  hasNotifications?: boolean;
}

export default function Header({
  activeLink = "about",
  hasNotifications = true,
}: HeaderProps) {
  const pathname = usePathname();
  const { t } = useLocale();

  const navItems: { label: string; href: string; key: ActiveLink }[] = [
    { label: t.header.about, href: "/", key: "about" },
    { label: t.header.awards, href: "/awards", key: "awards" },
    { label: t.header.kudos, href: "/kudos", key: "kudos" },
  ];

  function handleLogoClick(e: React.MouseEvent) {
    if (pathname === "/") {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }

  return (
    <header className="sticky top-0 z-50 h-20 bg-header-bg backdrop-blur-sm px-4 sm:px-12 lg:px-36 flex items-center justify-between">
      {/* Logo */}
      <Link href="/" onClick={handleLogoClick} className="shrink-0">
        <Image
          src="/images/logo-saa.png"
          alt="Sun* Annual Awards 2025"
          width={64}
          height={60}
          priority
        />
      </Link>

      {/* Navigation */}
      <nav className="hidden sm:flex items-center gap-8">
        {navItems.map((item) => {
          const isActive = activeLink === item.key;
          return (
            <Link
              key={item.key}
              href={item.href}
              className={`font-[family-name:var(--font-montserrat)] text-sm font-bold leading-5 tracking-[0.1px] transition-colors ${
                isActive
                  ? "text-gold-primary"
                  : "text-white hover:text-gold-primary"
              }`}
              style={
                isActive
                  ? {
                      textShadow:
                        "0 4px 4px rgba(0,0,0,0.25), 0 0 6px #FAE287",
                    }
                  : undefined
              }
            >
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Controls */}
      <div className="flex items-center gap-4">
        {/* Notification Bell */}
        <button
          type="button"
          className="relative w-10 h-10 flex items-center justify-center text-white hover:text-gold-primary transition-colors"
          aria-label={t.header.notifications}
        >
          <Icon name="bell" size={24} />
          {hasNotifications && (
            <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-notification-badge rounded-full" />
          )}
        </button>

        {/* Language Selector */}
        <LanguageSelector />

        {/* Profile Dropdown */}
        <ProfileDropdown />
      </div>
    </header>
  );
}
