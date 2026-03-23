"use client";

import { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import KudosInputPill from "@/components/kudos/KudosInputPill";

const KudoModal = dynamic(
  () => import("@/components/kudos/kudo-modal/KudoModal"),
  { ssr: false }
);

export default function KudoModalWrapper() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSuccess = useCallback(() => {
    window.dispatchEvent(new Event("kudos-created"));
    setIsModalOpen(false);
  }, []);

  return (
    <>
      <KudosInputPill onClick={() => setIsModalOpen(true)} />
      {isModalOpen && (
        <KudoModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSuccess={handleSuccess}
        />
      )}
    </>
  );
}
