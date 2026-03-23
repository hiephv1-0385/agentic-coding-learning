"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Icon from "@/components/ui/Icon";
import { useLocale } from "@/hooks/useLocale";

interface AwardSidebarProps {
  categories: { id: string; name: string; slug: string }[];
}

export default function AwardSidebar({ categories }: AwardSidebarProps) {
  const [activeCategory, setActiveCategory] = useState(
    categories[0]?.slug ?? ""
  );
  const isScrollingRef = useRef(false);
  const { t } = useLocale();

  const handleClick = useCallback(
    (e: React.MouseEvent, slug: string) => {
      e.preventDefault();
      const target = document.getElementById(`award-${slug}`);
      if (!target) return;

      isScrollingRef.current = true;
      setActiveCategory(slug);
      target.scrollIntoView({ behavior: "smooth" });

      // Allow scroll spy to resume after smooth scroll completes
      setTimeout(() => {
        isScrollingRef.current = false;
        const heading = target.querySelector("h2");
        heading?.focus();
      }, 500);
    },
    []
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent, slug: string) => {
      if (e.key === " ") {
        e.preventDefault();
        handleClick(
          e as unknown as React.MouseEvent,
          slug
        );
      }
    },
    [handleClick]
  );

  // Handle initial hash scroll on page load
  useEffect(() => {
    const hash = window.location.hash.slice(1); // remove '#'
    if (!hash) return;

    // Wait for layout to settle before scrolling
    const timer = setTimeout(() => {
      const target = document.getElementById(hash);
      if (target) {
        isScrollingRef.current = true;
        const slug = hash.replace("award-", "");
        setActiveCategory(slug);
        target.scrollIntoView({ behavior: "smooth" });
        setTimeout(() => {
          isScrollingRef.current = false;
        }, 500);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  // Scroll spy via IntersectionObserver
  useEffect(() => {
    const slugs = categories.map((c) => c.slug);
    const elements = slugs
      .map((slug) => document.getElementById(`award-${slug}`))
      .filter(Boolean) as HTMLElement[];

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isScrollingRef.current) return;

        for (const entry of entries) {
          if (entry.isIntersecting) {
            const slug = entry.target.id.replace("award-", "");
            setActiveCategory(slug);
            break;
          }
        }
      },
      {
        rootMargin: "-96px 0px 0px 0px",
        threshold: 0.3,
      }
    );

    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [categories]);

  return (
    <nav
      aria-label={t.awards.sidebarAriaLabel}
      className="flex flex-row gap-0 overflow-x-auto lg:sticky lg:top-24 lg:flex-col lg:self-start lg:overflow-visible lg:min-w-[180px] lg:shrink-0"
    >
      {categories.map((cat) => {
        const isActive = activeCategory === cat.slug;
        return (
          <a
            key={cat.id}
            href={`#award-${cat.slug}`}
            onClick={(e) => handleClick(e, cat.slug)}
            onKeyDown={(e) => handleKeyDown(e, cat.slug)}
            aria-current={isActive ? "true" : undefined}
            className={[
              "flex items-center gap-2 whitespace-nowrap px-4 py-4",
              "font-[family-name:var(--font-montserrat)] text-sm font-bold tracking-[0.25px]",
              "transition-colors duration-150 ease-in-out",
              isActive
                ? "text-gold-primary border-b border-gold-primary [text-shadow:var(--shadow-nav-active)]"
                : "text-white hover:bg-gold-10",
            ].join(" ")}
          >
            <Icon name="award-prefix" size={32} className="shrink-0" />
            {cat.name}
          </a>
        );
      })}
    </nav>
  );
}
