"use client";

import { useEffect, useState } from "react";

interface ToastProps {
  message: string;
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

export default function Toast({
  message,
  isVisible,
  onClose,
  duration = 3000,
}: ToastProps) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setShow(true);
      const timer = setTimeout(() => {
        setShow(false);
        setTimeout(onClose, 300);
      }, duration);
      return () => clearTimeout(timer);
    }
    setShow(false);
  }, [isVisible, duration, onClose]);

  if (!isVisible && !show) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-8 left-1/2 z-50 -translate-x-1/2 rounded-lg border border-border bg-container-dark px-6 py-3 font-[family-name:var(--font-montserrat)] text-sm font-bold text-text-white shadow-lg transition-opacity duration-300 ${
        show ? "opacity-100" : "opacity-0"
      }`}
    >
      {message}
    </div>
  );
}
