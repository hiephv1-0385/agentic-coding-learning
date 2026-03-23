"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Icon from "@/components/ui/Icon";
import { useLocale } from "@/hooks/useLocale";
import type { Department } from "@/types/kudos";

interface DepartmentDropdownProps {
  departments: Department[];
  activeDepartment: string;
  onSelect: (department: string) => void;
  isLoading?: boolean;
  isPending?: boolean;
}

export default function DepartmentDropdown({
  departments,
  activeDepartment,
  onSelect,
  isLoading = false,
  isPending = false,
}: DepartmentDropdownProps) {
  const { t } = useLocale();
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState<"below" | "above">("below");
  const [typeAhead, setTypeAhead] = useState("");
  const typeAheadTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );

  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const isDisabled = isLoading || departments.length === 0;
  const displayLabel =
    isLoading && departments.length === 0
      ? ""
      : !isLoading && departments.length === 0
        ? "—"
        : activeDepartment || t.kudos.department;

  // "Clear filter" + departments = all options
  const allOptions = [
    { id: "__clear__", name: "" },
    ...departments,
  ];

  const selectedIndex = activeDepartment
    ? allOptions.findIndex((o) => o.name === activeDepartment)
    : -1; // no highlight when showing default "Phòng ban" label

  // T021: Auto-reset if active department not in list
  useEffect(() => {
    if (
      activeDepartment &&
      departments.length > 0 &&
      !departments.some((d) => d.name === activeDepartment)
    ) {
      onSelect("");
    }
  }, [departments, activeDepartment, onSelect]);

  // T011: Click-outside close
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

  // T013: Escape key handler
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

  // T017: Focus management on open
  useEffect(() => {
    if (isOpen) {
      const idx = selectedIndex >= 0 ? selectedIndex : 0;
      setTimeout(() => optionsRef.current[idx]?.focus(), 0);
    }
  }, [isOpen, selectedIndex]);

  // T022: Viewport flip
  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const maxDropdownHeight = 400;
    setPosition(
      rect.bottom + maxDropdownHeight > window.innerHeight ? "above" : "below"
    );
  }, []);

  const handleOpen = useCallback(() => {
    if (isDisabled) return;
    updatePosition();
    setIsOpen((prev) => !prev);
  }, [isDisabled, updatePosition]);

  const handleSelect = useCallback(
    (dept: string) => {
      onSelect(dept);
      triggerRef.current?.focus();
      setIsOpen(false);
    },
    [onSelect]
  );

  // T014-T016: Keyboard navigation on options
  const handleOptionKeyDown = useCallback(
    (e: React.KeyboardEvent, index: number) => {
      const total = allOptions.length;
      switch (e.key) {
        case "ArrowDown":
          e.preventDefault();
          optionsRef.current[(index + 1) % total]?.focus();
          break;
        case "ArrowUp":
          e.preventDefault();
          optionsRef.current[(index - 1 + total) % total]?.focus();
          break;
        case "Home":
          e.preventDefault();
          optionsRef.current[0]?.focus();
          break;
        case "End":
          e.preventDefault();
          optionsRef.current[total - 1]?.focus();
          break;
        case "Escape":
          e.preventDefault();
          triggerRef.current?.focus();
          setIsOpen(false);
          break;
        default:
          // T018: Type-ahead
          if (e.key.length === 1 && !e.ctrlKey && !e.metaKey) {
            const newTypeAhead = typeAhead + e.key;
            setTypeAhead(newTypeAhead);
            if (typeAheadTimeoutRef.current) {
              clearTimeout(typeAheadTimeoutRef.current);
            }
            typeAheadTimeoutRef.current = setTimeout(
              () => setTypeAhead(""),
              500
            );
            // Find first match (skip "Clear filter" at index 0)
            const matchIndex = allOptions.findIndex(
              (o, i) =>
                i > 0 &&
                o.name.toLowerCase().startsWith(newTypeAhead.toLowerCase())
            );
            if (matchIndex >= 0) {
              optionsRef.current[matchIndex]?.focus();
            }
          }
          break;
      }
    },
    [allOptions, typeAhead]
  );

  // Trigger keyboard handler
  const handleTriggerKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        e.preventDefault();
        if (!isOpen) {
          updatePosition();
          setIsOpen(true);
        }
      }
    },
    [isOpen, updatePosition]
  );

  const optionClasses = (isSelected: boolean) =>
    `w-full h-14 px-4 rounded flex items-center gap-1 cursor-pointer font-[family-name:var(--font-montserrat)] text-base font-bold leading-6 tracking-[0.5px] text-white transition-colors focus-visible:outline-2 focus-visible:outline-border focus-visible:outline-offset-[-2px] ${
      isSelected
        ? "bg-gold-10 [text-shadow:var(--text-shadow-glow)]"
        : "bg-transparent hover:bg-gold-10"
    }`;

  return (
    <div ref={containerRef} className="relative">
      {/* Trigger Button */}
      <button
        ref={triggerRef}
        type="button"
        onClick={handleOpen}
        onKeyDown={handleTriggerKeyDown}
        disabled={isDisabled}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls="dept-listbox"
        aria-label={t.kudos.department}
        className={`inline-flex items-center gap-2 rounded-lg border p-4 min-w-[102px] font-[family-name:var(--font-montserrat)] text-base font-bold leading-6 tracking-[0.5px] text-white cursor-pointer transition-colors focus-visible:outline-2 focus-visible:outline-border focus-visible:outline-offset-[-2px] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-border ${
          activeDepartment
            ? "border-gold-primary bg-gold-40"
            : "border-border bg-container-dark hover:border-gold-primary"
        } ${isPending ? "opacity-60" : ""}`}
      >
        {isLoading && departments.length === 0 ? (
          <span className="animate-pulse bg-gold-10 rounded h-4 w-16 inline-block" />
        ) : (
          <span>{displayLabel}</span>
        )}
        <Icon
          name="chevron-down"
          size={16}
          className={`text-white transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {/* Dropdown List — always rendered, visibility via CSS transition */}
      <div
        role="listbox"
        id="dept-listbox"
        aria-label={t.kudos.department}
        aria-hidden={!isOpen}
        className={`dropdown-scrollbar absolute left-0 z-20 bg-container-dark border border-border rounded-lg p-1.5 flex flex-col items-start max-h-[400px] overflow-y-auto min-w-[102px] w-auto whitespace-nowrap transition-all duration-150 ease-out ${
          position === "below" ? "top-full mt-1" : "bottom-full mb-1"
        } ${
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-1 pointer-events-none"
        }`}
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "#998C5F #00070C",
        }}
      >
        {/* "Clear filter" option — shown same as hashtag dropdown */}
        <button
          ref={(el) => {
            optionsRef.current[0] = el;
          }}
          type="button"
          role="option"
          aria-selected={activeDepartment === ""}
          tabIndex={isOpen ? 0 : -1}
          onClick={() => handleSelect("")}
          onKeyDown={(e) => handleOptionKeyDown(e, 0)}
          className="w-full h-14 px-4 rounded flex items-center gap-1 cursor-pointer font-[family-name:var(--font-montserrat)] text-base font-bold leading-6 tracking-[0.5px] text-text-gray transition-colors hover:bg-gold-10 focus-visible:outline-2 focus-visible:outline-border focus-visible:outline-offset-[-2px]"
        >
          {t.kudos.clearFilter}
        </button>

        {/* Department options */}
        {departments.map((dept, i) => {
          const isSelected = activeDepartment === dept.name;
          const optionIndex = i + 1; // offset by 1 for "Tất cả"
          return (
            <button
              key={dept.id}
              ref={(el) => {
                optionsRef.current[optionIndex] = el;
              }}
              type="button"
              role="option"
              aria-selected={isSelected}
              tabIndex={isOpen ? 0 : -1}
              onClick={() => handleSelect(dept.name)}
              onKeyDown={(e) => handleOptionKeyDown(e, optionIndex)}
              className={optionClasses(isSelected)}
            >
              {dept.name}
            </button>
          );
        })}
      </div>
    </div>
  );
}
