"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import Image from "next/image";
import { useLocale } from "@/hooks/useLocale";
import Icon from "@/components/ui/Icon";
import Toast from "@/components/ui/Toast";

interface SecretBoxModalProps {
  isOpen: boolean;
  remainingBoxes: number;
  onClose: () => void;
}

export default function SecretBoxModal({
  isOpen,
  remainingBoxes,
  onClose,
}: SecretBoxModalProps) {
  const { t } = useLocale();
  const panelRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [localRemaining, setLocalRemaining] = useState(remainingBoxes);
  const [isOpening, setIsOpening] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync prop to local state when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalRemaining(remainingBoxes);
    }
  }, [isOpen, remainingBoxes]);

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

  const handleOpenBox = useCallback(async () => {
    if (isOpening || localRemaining <= 0) return;
    setIsOpening(true);

    try {
      const res = await fetch("/api/users/me/secret-box", { method: "POST" });
      if (!res.ok) {
        const json = (await res.json()) as { error?: string };
        setToastMessage(json.error ?? t.kudos.secretBoxFailed);
        return;
      }
      const json = (await res.json()) as {
        data: { opened_count: number; remaining: number; badge_type: string };
      };
      setLocalRemaining(json.data.remaining);
    } catch {
      setToastMessage(t.kudos.secretBoxFailed);
    } finally {
      setIsOpening(false);
    }
  }, [isOpening, localRemaining, t.kudos.secretBoxFailed]);

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

    const firstFocusable = panel.querySelector(focusableSelector) as HTMLElement;
    firstFocusable?.focus();

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, handleClose]);

  if (!isOpen) return null;

  const isDisabled = localRemaining <= 0;
  const formattedCount = String(localRemaining).padStart(2, "0");

  return (
    <>
      {/* Backdrop Overlay */}
      <div
        className={`fixed inset-0 z-40 cursor-pointer bg-[rgba(0,16,26,0.7)] transition-opacity duration-200 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label={t.kudos.secretBoxAriaLabel}
        className={`fixed top-1/2 left-1/2 z-50 flex w-[90vw] max-h-[90vh] -translate-x-1/2 -translate-y-1/2 flex-col items-center gap-[22px] overflow-y-auto rounded-xl bg-[#00101A] p-[24px_13px] transition-all duration-300 ease-out sm:w-[80vw] sm:max-w-[651px] lg:w-[652px] ${
          isVisible
            ? "scale-100 opacity-100"
            : "scale-95 opacity-0"
        }`}
      >
        {/* A: Title Bar */}
        <div className="relative w-full">
          <h2 className="text-center font-[family-name:var(--font-montserrat)] text-[20px] font-bold leading-[32px] text-[#FFEA9E] sm:text-[25px]">
            {t.kudos.secretBoxModalTitle}
          </h2>
          <button
            onClick={handleClose}
            aria-label={t.kudos.closeAriaLabel}
            className="absolute right-0 top-1/2 flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center transition-opacity hover:opacity-70 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FFEA9E] active:opacity-50"
          >
            <Icon name="close" size={19} className="text-white" />
          </button>
        </div>

        {/* Separator */}
        <div className="w-full h-px bg-[#2E3940]" />

        {/* B: Instruction Text */}
        {!isDisabled && (
          <p className="font-[family-name:var(--font-montserrat)] text-[13px] font-bold leading-[19px] tracking-[0.4px] text-white">
            {t.kudos.secretBoxInstruction}
          </p>
        )}

        {/* C: Box Image Area */}
        <div className="relative w-full max-w-[557px] aspect-square">
          <button
            onClick={handleOpenBox}
            disabled={isDisabled || isOpening}
            aria-label={t.kudos.openSecretBoxAriaLabel}
            className={`relative w-full h-full transition-transform duration-200 ease-out ${
              isDisabled
                ? "cursor-not-allowed opacity-50"
                : isOpening
                  ? "cursor-wait opacity-70"
                  : "cursor-pointer hover:scale-[1.03] active:scale-[0.98]"
            }`}
          >
            <Image
              src="/images/secret-box/gift-box-unopened.svg"
              alt={t.kudos.secretBoxAlt}
              fill
              className="object-contain"
            />
          </button>
          {/* Sparkle Effect Overlay */}
          <Image
            src="/images/secret-box/sparkle-effect.png"
            alt=""
            fill
            className="pointer-events-none object-contain"
          />
        </div>

        {/* Separator */}
        <div className="w-full h-px bg-[#2E3940]" />

        {/* D: Box Counter */}
        <div className="flex items-center gap-[6px]">
          <span className="font-[family-name:var(--font-montserrat)] text-[13px] font-bold leading-[19px] tracking-[0.4px] text-white">
            {t.kudos.secretBoxCounterLabel}
          </span>
          <span className="font-[family-name:var(--font-montserrat)] text-[29px] font-bold leading-[35px] text-[#FFEA9E]">
            {formattedCount}
          </span>
        </div>
      </div>

      {/* Toast for errors */}
      <Toast
        message={toastMessage ?? ""}
        isVisible={!!toastMessage}
        onClose={() => setToastMessage(null)}
      />
    </>
  );
}
