"use client";

import Link from "next/link";
import Image from "next/image";
import { useLocale } from "@/hooks/useLocale";

export default function Footer() {
  const { t } = useLocale();

  const footerLinks = [
    { label: t.footer.about, href: "/" },
    { label: t.footer.awards, href: "/awards" },
    { label: t.footer.kudos, href: "/kudos" },
    { label: t.footer.general, href: "#" },
  ];

  return (
    <footer className="w-full px-6 sm:px-12 lg:px-[90px] py-10 flex flex-col sm:flex-row items-center justify-between gap-6">
      {/* Logo */}
      <Link href="/" className="shrink-0">
        <Image
          src="/images/footer-logo.png"
          alt="Sun* Annual Awards 2025"
          width={69}
          height={64}
        />
      </Link>

      {/* Navigation */}
      <nav className="flex flex-wrap items-center justify-center gap-6">
        {footerLinks.map((link, i) => (
          <Link
            key={i}
            href={link.href}
            className="font-[family-name:var(--font-montserrat)] text-sm font-bold text-white hover:text-gold-primary transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Copyright */}
      <p className="font-[family-name:var(--font-montserrat-alt)] text-base font-bold text-white">
        {t.footer.copyright}
      </p>
    </footer>
  );
}
