"use client";

import { useState, useCallback } from "react";

interface UseClipboardReturn {
  copied: boolean;
  copy: (text: string) => Promise<void>;
}

export function useClipboard(): UseClipboardReturn {
  const [copied, setCopied] = useState(false);

  const copy = useCallback(async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    } catch {
      setCopied(false);
    }
  }, []);

  return { copied, copy };
}
