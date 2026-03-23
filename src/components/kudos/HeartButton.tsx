"use client";

import { useState, useCallback } from "react";
import Icon from "@/components/ui/Icon";
import Toast from "@/components/ui/Toast";
import { useLocale } from "@/hooks/useLocale";
import { useLikeKudos } from "@/hooks/useLikeKudos";

interface HeartButtonProps {
  kudosId: string;
  senderId: string;
  currentUserId: string;
  initialCount: number;
  initialIsLiked: boolean;
}

export default function HeartButton({
  kudosId,
  senderId,
  currentUserId,
  initialCount,
  initialIsLiked,
}: HeartButtonProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const isOwnKudos = senderId === currentUserId;
  const { t } = useLocale();

  const onError = useCallback((message: string) => {
    setErrorMessage(message);
  }, []);

  const { heartCount, isLiked, isLiking, toggleLike } = useLikeKudos(
    kudosId,
    initialCount,
    initialIsLiked,
    onError
  );

  return (
    <>
      <button
        onClick={toggleLike}
        disabled={isOwnKudos || isLiking}
        aria-label={isLiked ? t.kudos.unlikeAriaLabel : t.kudos.likeAriaLabel}
        className={`flex items-center gap-1 rounded p-4 font-[family-name:var(--font-montserrat)] text-2xl font-bold leading-8 text-text-dark transition-transform ${
          isOwnKudos
            ? "cursor-not-allowed opacity-40"
            : "hover:scale-110"
        }`}
      >
        <Icon
          name={isLiked ? "heart-filled" : "heart"}
          size={32}
          className={isLiked ? "text-red" : "text-text-gray"}
        />
        <span aria-live="polite">{heartCount}</span>
      </button>
      <Toast
        message={errorMessage ?? ""}
        isVisible={!!errorMessage}
        onClose={() => setErrorMessage(null)}
      />
    </>
  );
}
