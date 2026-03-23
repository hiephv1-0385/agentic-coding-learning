"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useLocale } from "@/hooks/useLocale";
import { createClient } from "@/libs/supabase/client";
import Icon from "@/components/ui/Icon";
import Toast from "@/components/ui/Toast";

export default function ProfileDropdown() {
  const { t } = useLocale();
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const itemsRef = useRef<(HTMLElement | null)[]>([]);

  // Auth check
  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getUser();
      setIsAuthenticated(!!data.user);
    };
    checkAuth();
  }, []);

  // Focus first menuitem on open
  useEffect(() => {
    if (isOpen) setTimeout(() => itemsRef.current[0]?.focus(), 0);
  }, [isOpen]);

  // Close on outside click
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        triggerRef.current?.focus();
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        triggerRef.current?.focus();
        setIsOpen(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      setIsOpen(true);
    }
  };

  const handleItemKeyDown = (e: React.KeyboardEvent, index: number) => {
    const itemCount = itemsRef.current.length;
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        itemsRef.current[(index + 1) % itemCount]?.focus();
        break;
      case "ArrowUp":
        e.preventDefault();
        itemsRef.current[(index - 1 + itemCount) % itemCount]?.focus();
        break;
      case "Escape":
        e.preventDefault();
        triggerRef.current?.focus();
        setIsOpen(false);
        break;
      case " ":
        e.preventDefault();
        (e.target as HTMLElement).click();
        break;
      case "Tab":
        // Focus trap: wrap within dropdown
        e.preventDefault();
        if (e.shiftKey) {
          itemsRef.current[(index - 1 + itemCount) % itemCount]?.focus();
        } else {
          itemsRef.current[(index + 1) % itemCount]?.focus();
        }
        break;
    }
  };

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);
    setErrorMessage(null);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      router.push("/login");
    } catch {
      setErrorMessage(t.header.logoutError);
      setIsLoggingOut(false);
    }
  };

  if (!isAuthenticated) return null;

  const disabledClass = "opacity-50 pointer-events-none cursor-default";

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={handleTriggerKeyDown}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label={t.header.profile}
        className="w-10 h-10 flex items-center justify-center text-white hover:text-gold-primary transition-colors rounded-full"
      >
        <Icon name="user" size={24} />
      </button>

      {/* Dropdown Menu */}
      <div
        role="menu"
        aria-label={t.header.profile}
        aria-hidden={!isOpen}
        className={`absolute right-0 top-full mt-1 z-50 bg-container-dark border border-border rounded-lg p-1.5 flex flex-col items-start shadow-dropdown transition-all duration-150 ease-out ${
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-1 pointer-events-none"
        }`}
      >
        {/* Profile Item */}
        <Link
          href="/profile"
          role="menuitem"
          ref={(el) => {
            itemsRef.current[0] = el;
          }}
          tabIndex={isOpen ? 0 : -1}
          onClick={() => setIsOpen(false)}
          onKeyDown={(e) => handleItemKeyDown(e, 0)}
          className={`group w-full min-h-14 flex items-center gap-1 p-4 rounded cursor-pointer transition-colors duration-150 ease-in-out focus-visible:outline-2 focus-visible:outline-gold-primary focus-visible:outline-offset-2 ${
            isLoggingOut
              ? `bg-gold-05 ${disabledClass}`
              : "bg-gold-10 hover:bg-gold-20 active:bg-gold-25"
          }`}
        >
          <span
            className="font-[family-name:var(--font-montserrat)] text-base font-bold leading-6 tracking-[0.15px] text-white [text-shadow:var(--text-shadow-glow)] group-hover:[text-shadow:var(--text-shadow-glow-hover)]"
            style={{ transition: "text-shadow 150ms ease-in-out" }}
          >
            {t.header.profile}
          </span>
          <Icon name="user" size={24} className="text-text-glow" />
        </Link>

        {/* Logout Item */}
        <button
          type="button"
          role="menuitem"
          ref={(el) => {
            itemsRef.current[1] = el;
          }}
          tabIndex={isOpen ? 0 : -1}
          onClick={handleLogout}
          onKeyDown={(e) => handleItemKeyDown(e, 1)}
          className={`w-full min-h-14 flex items-center gap-1 p-4 rounded cursor-pointer transition-colors duration-150 ease-in-out focus-visible:outline-2 focus-visible:outline-gold-primary focus-visible:outline-offset-2 ${
            isLoggingOut
              ? disabledClass
              : "hover:bg-gold-10 active:bg-gold-15"
          }`}
        >
          <span className="font-[family-name:var(--font-montserrat)] text-base font-bold leading-6 tracking-[0.15px] text-white">
            {t.header.logout}
          </span>
          {isLoggingOut ? (
            <span className="w-6 h-6 animate-spin rounded-full border-2 border-text-glow border-t-transparent" />
          ) : (
            <Icon name="chevron-right" size={24} className="text-text-glow" />
          )}
        </button>
      </div>

      {/* Error Toast */}
      <Toast
        message={errorMessage ?? ""}
        isVisible={!!errorMessage}
        onClose={() => setErrorMessage(null)}
      />
    </div>
  );
}
