"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { usePathname } from "next/navigation";
import dynamic from "next/dynamic";
import Icon from "@/components/ui/Icon";
import { useLocale } from "@/hooks/useLocale";

const KudoModal = dynamic(
  () => import("@/components/kudos/kudo-modal/KudoModal"),
  { ssr: false }
);

const RulesPanel = dynamic(
  () => import("@/components/rules/RulesPanel"),
  { ssr: false }
);

const HIDDEN_ROUTES = ["/login", "/prelaunch"];

interface FloatingActionButtonProps {
  isAuthenticated: boolean;
}

export default function FloatingActionButton({
  isAuthenticated,
}: FloatingActionButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const fabRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const { t } = useLocale();

  // Auto-collapse on route change (FR-010)
  useEffect(() => {
    setIsExpanded(false);
  }, [pathname]);

  // Click outside to collapse
  useEffect(() => {
    if (!isExpanded) return;

    function handleClickOutside(e: MouseEvent) {
      if (fabRef.current && !fabRef.current.contains(e.target as Node)) {
        setIsExpanded(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isExpanded]);

  // Escape key to collapse
  useEffect(() => {
    if (!isExpanded) return;

    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setIsExpanded(false);
      }
    }

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isExpanded]);

  const handleWriteKudos = useCallback(() => {
    if (isModalOpen) return;
    setIsExpanded(false);
    setIsModalOpen(true);
  }, [isModalOpen]);

  const handleModalClose = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleModalSuccess = useCallback(() => {
    window.dispatchEvent(new Event("kudos-created"));
    setIsModalOpen(false);
  }, []);

  const handleOpenRules = useCallback(() => {
    setIsExpanded(false);
    setIsRulesOpen(true);
  }, []);

  const handleCloseRules = useCallback(() => {
    setIsRulesOpen(false);
  }, []);

  const handleRulesWriteKudos = useCallback(() => {
    setIsRulesOpen(false);
    setIsModalOpen(true);
  }, []);

  // Hide on public routes or unauthenticated
  const isHidden =
    !isAuthenticated || HIDDEN_ROUTES.includes(pathname);

  if (isHidden) {
    return null;
  }

  return (
    <>
      <div
        ref={fabRef}
        className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 lg:bottom-[120px] lg:right-[143px] z-50"
      >
        {isExpanded ? (
          /* Expanded State */
          <div
            className="flex flex-col items-end gap-5 w-[214px] animate-fade-in"
            role="menu"
            aria-label={t.common.quickActions}
          >
            {/* Thể lệ button */}
            <button
              type="button"
              className="flex items-center gap-2 w-[149px] h-16 p-4 bg-gold-primary rounded text-page-bg font-[family-name:var(--font-montserrat)] text-2xl font-bold leading-8 cursor-pointer transition-colors duration-150 ease-in-out hover:bg-[#F5E08E] focus-visible:outline-2 focus-visible:outline-[#FAE287] focus-visible:outline-offset-2"
              role="menuitem"
              onClick={handleOpenRules}
            >
              <Icon name="rules" size={24} />
              <span>{t.rules.title}</span>
            </button>

            {/* Viết KUDOS button */}
            <button
              type="button"
              className="flex items-center gap-2 w-[214px] h-16 p-4 bg-gold-primary rounded text-page-bg font-[family-name:var(--font-montserrat)] text-2xl font-bold leading-8 cursor-pointer transition-colors duration-150 ease-in-out hover:bg-[#F5E08E] focus-visible:outline-2 focus-visible:outline-[#FAE287] focus-visible:outline-offset-2"
              role="menuitem"
              onClick={handleWriteKudos}
            >
              <Icon name="pencil" size={24} className="text-white" />
              <span>{t.rules.writeKudosButton}</span>
            </button>

            {/* Close button */}
            <button
              type="button"
              className="w-14 h-14 rounded-full bg-fab-close-bg hover:bg-fab-close-hover flex items-center justify-center cursor-pointer p-4 transition-colors duration-150 ease-in-out focus-visible:outline-2 focus-visible:outline-[#D4271D] focus-visible:outline-offset-2"
              role="menuitem"
              aria-label={t.common.closeQuickActions}
              onClick={() => setIsExpanded(false)}
            >
              <Icon name="close" size={24} className="text-white" />
            </button>
          </div>
        ) : (
          /* Collapsed State */
          <button
            type="button"
            className="flex items-center gap-2 w-[106px] h-16 p-4 bg-gold-primary rounded-full shadow-gold-glow cursor-pointer animate-fade-in transition-all duration-200 ease-out hover:shadow-[0_4px_8px_0_rgba(0,0,0,0.35),0_0_12px_2px_#FAE287] hover:scale-[1.03] focus-visible:outline-2 focus-visible:outline-[#FAE287] focus-visible:outline-offset-2"
            aria-label={t.common.quickActionsDescription}
            aria-expanded={isExpanded}
            onClick={() => setIsExpanded(true)}
          >
            <Icon name="pencil" size={24} className="text-white" />
            <span className="font-[family-name:var(--font-montserrat)] text-2xl font-bold leading-8 text-page-bg">
              /
            </span>
            <Icon name="rules" size={24} />
          </button>
        )}
      </div>

      {/* Kudo Modal */}
      {isModalOpen && (
        <KudoModal
          isOpen={isModalOpen}
          onClose={handleModalClose}
          onSuccess={handleModalSuccess}
        />
      )}

      {/* Rules Panel Sidebar */}
      <RulesPanel
        isOpen={isRulesOpen}
        onClose={handleCloseRules}
        onWriteKudos={handleRulesWriteKudos}
      />
    </>
  );
}
