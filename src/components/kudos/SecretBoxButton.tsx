"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Icon from "@/components/ui/Icon";
import { useLocale } from "@/hooks/useLocale";
import SecretBoxModal from "@/components/kudos/SecretBoxModal";

interface SecretBoxButtonProps {
  remainingBoxes: number;
}

export default function SecretBoxButton({
  remainingBoxes,
}: SecretBoxButtonProps) {
  const { t } = useLocale();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClose = useCallback(() => {
    setIsModalOpen(false);
    router.refresh();
  }, [router]);

  return (
    <>
      <button
        onClick={() => setIsModalOpen(true)}
        disabled={remainingBoxes <= 0}
        className={`flex w-full items-center justify-center gap-2 rounded-lg bg-gold-primary p-4 font-[family-name:var(--font-montserrat)] text-[22px] font-bold leading-7 text-text-dark transition-colors ${
          remainingBoxes <= 0
            ? "cursor-not-allowed opacity-50"
            : "hover:bg-card-bg active:bg-[#FFE082]"
        }`}
      >
        <Icon name="gift" size={24} className="text-text-dark" />
        {t.kudos.openSecretBox}
      </button>
      <SecretBoxModal
        isOpen={isModalOpen}
        remainingBoxes={remainingBoxes}
        onClose={handleClose}
      />
    </>
  );
}
