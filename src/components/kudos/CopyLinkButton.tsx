"use client";

import { useState, useCallback } from "react";
import Icon from "@/components/ui/Icon";
import Toast from "@/components/ui/Toast";
import { useLocale } from "@/hooks/useLocale";
import { useClipboard } from "@/hooks/useClipboard";

interface CopyLinkButtonProps {
  kudosId: string;
}

export default function CopyLinkButton({ kudosId }: CopyLinkButtonProps) {
  const { copy } = useClipboard();
  const [showToast, setShowToast] = useState(false);
  const { t } = useLocale();

  const handleCopy = useCallback(async () => {
    const url = `${window.location.origin}/kudos/${kudosId}`;
    await copy(url);
    setShowToast(true);
  }, [kudosId, copy]);

  return (
    <>
      <button
        onClick={handleCopy}
        aria-label={t.kudos.copyLinkAriaLabel}
        className="flex items-center gap-1 rounded p-4 font-[family-name:var(--font-montserrat)] text-base font-bold leading-6 text-text-dark transition-opacity hover:opacity-70"
      >
        <Icon name="copy-link" size={24} className="text-text-dark" />
        {t.kudos.copyLink}
      </button>
      <Toast
        message={t.kudos.linkCopied}
        isVisible={showToast}
        onClose={() => setShowToast(false)}
      />
    </>
  );
}
