"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useLocale } from "@/hooks/useLocale";
import Icon from "@/components/ui/Icon";
import HeroBadge from "@/components/rules/HeroBadge";
import CollectionBadgeGrid from "@/components/rules/CollectionBadgeGrid";

interface RulesPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onWriteKudos: () => void;
}

export default function RulesPanel({
  isOpen,
  onClose,
  onWriteKudos,
}: RulesPanelProps) {
  const { t } = useLocale();
  const panelRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);

  // Animate in when isOpen becomes true
  useEffect(() => {
    if (isOpen) {
      previousFocusRef.current = document.activeElement as HTMLElement;
      document.body.style.overflow = "hidden";
      requestAnimationFrame(() => setIsVisible(true));
    } else {
      setIsVisible(false);
      document.body.style.overflow = "";
      if (previousFocusRef.current) {
        previousFocusRef.current.focus();
      }
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleClose = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
    }, 200);
  }, [onClose]);

  const handleWriteKudos = useCallback(() => {
    setIsVisible(false);
    setTimeout(() => {
      onClose();
      onWriteKudos();
    }, 200);
  }, [onClose, onWriteKudos]);

  // Focus trap & Escape key
  useEffect(() => {
    if (!isOpen) return;

    const panel = panelRef.current;
    if (!panel) return;

    const focusableSelector =
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        handleClose();
        return;
      }

      if (e.key === "Tab" && panel) {
        const focusableElements = panel.querySelectorAll(focusableSelector);
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[
          focusableElements.length - 1
        ] as HTMLElement;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    // Focus first focusable element in panel
    const firstFocusable = panel.querySelector(focusableSelector) as HTMLElement;
    firstFocusable?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className={`fixed inset-0 z-40 cursor-pointer bg-[rgba(0,16,26,0.7)] transition-opacity duration-200 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={t.rules.ariaLabel}
        className={`fixed right-0 top-0 bottom-0 z-50 flex w-full flex-col justify-between overflow-hidden bg-[#00070C] pt-6 pr-10 pb-10 pl-10 transition-transform duration-300 ease-out sm:w-[80%] lg:w-[553px] ${
          isVisible ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Scrollable Content Area */}
        <div className="flex min-h-0 flex-1 flex-col gap-6 overflow-y-auto">
          {/* Title */}
          <h2 className="text-[32px] font-bold leading-[52px] text-[#FFEA9E] lg:text-[45px]">
            {t.rules.title}
          </h2>

          {/* Section 1: Người nhận Kudos */}
          <section className="flex flex-col gap-4">
            <h3 className="text-[18px] font-bold leading-7 text-[#FFEA9E] lg:text-[22px]">
              {t.rules.receiverHeading}
            </h3>
            <p className="text-base font-bold leading-6 tracking-[0.5px] text-white text-justify">
              {t.rules.receiverDescription}
            </p>
            <div className="flex flex-col gap-4">
              <HeroBadge tier="new" />
              <HeroBadge tier="rising" />
              <HeroBadge tier="super" />
              <HeroBadge tier="legend" />
            </div>
          </section>

          {/* Section 2: Người gửi Kudos */}
          <section className="flex flex-col gap-4">
            <h3 className="text-[18px] font-bold leading-7 text-[#FFEA9E] lg:text-[22px]">
              {t.rules.senderHeading}
            </h3>
            <p className="text-base font-bold leading-6 tracking-[0.5px] text-white text-justify">
              {t.rules.senderDescription}
            </p>
            <CollectionBadgeGrid />
            <p className="text-base font-bold leading-6 tracking-[0.5px] text-white text-justify">
              {t.rules.completionText}
            </p>
          </section>

          {/* Section 3: Kudos Quốc Dân */}
          <section className="flex flex-col gap-4">
            <h3 className="text-[18px] font-bold leading-7 text-[#FFEA9E] lg:text-[24px]">
              {t.rules.nationalHeading}
            </h3>
            <p className="text-base font-bold leading-6 tracking-[0.5px] text-white text-justify">
              {t.rules.nationalDescription}
            </p>
          </section>
        </div>

        {/* Fixed Button Footer */}
        <div className="flex shrink-0 flex-col gap-4 pt-6 sm:flex-row">
          {/* Close Button (Secondary) */}
          <button
            onClick={handleClose}
            className="flex h-14 items-center justify-center gap-2 rounded border border-[#998C5F] bg-[rgba(255,234,158,0.1)] px-4 py-4 text-base font-bold tracking-[0.5px] text-white transition-all duration-150 hover:border-[#FFEA9E] hover:bg-[rgba(255,234,158,0.2)] active:bg-[rgba(255,234,158,0.3)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFEA9E]"
          >
            <Icon name="close" size={24} className="text-white" />
            {t.rules.closeButton}
          </button>

          {/* Write Kudos Button (Primary) */}
          <button
            onClick={handleWriteKudos}
            className="flex h-14 flex-1 items-center justify-center gap-2 rounded bg-[#FFEA9E] px-4 py-4 text-base font-bold tracking-[0.5px] text-[#00101A] transition-all duration-150 hover:bg-[#FFE077] hover:shadow-[0_2px_8px_rgba(255,234,158,0.4)] active:bg-[#FFD54F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFEA9E]"
          >
            <Icon name="pencil" size={24} className="text-[#00101A]" />
            {t.rules.writeKudosButton}
          </button>
        </div>
      </div>
    </>
  );
}
