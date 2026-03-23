"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Icon from "@/components/ui/Icon";
import Toast from "@/components/ui/Toast";
import RecipientSearch from "@/components/kudos/kudo-modal/RecipientSearch";
import DanhHieuInput from "@/components/kudos/kudo-modal/DanhHieuInput";
import RichTextEditor from "@/components/kudos/kudo-modal/RichTextEditor";
import HashtagSelector from "@/components/kudos/kudo-modal/HashtagSelector";
import ImageUploader from "@/components/kudos/kudo-modal/ImageUploader";
import AnonymousSection from "@/components/kudos/kudo-modal/AnonymousSection";
import { useCreateKudos } from "@/hooks/useCreateKudos";
import { useLocale } from "@/hooks/useLocale";
import type { ProfilePreview } from "@/types/kudos";

interface KudoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function KudoModal({ isOpen, onClose, onSuccess }: KudoModalProps) {
  const { t } = useLocale();
  const modalRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  // Form state
  const [recipient, setRecipient] = useState<ProfilePreview | null>(null);
  const [danhHieu, setDanhHieu] = useState("");
  const [editorHtml, setEditorHtml] = useState("");
  const [selectedHashtags, setSelectedHashtags] = useState<string[]>([]);
  const [uploadedImageUrls, setUploadedImageUrls] = useState<string[]>([]);
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [anonymousName, setAnonymousName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Toast state
  const [toast, setToast] = useState<{ message: string; visible: boolean }>({
    message: "",
    visible: false,
  });

  const { submit, isSubmitting, error: submitError } = useCreateKudos();

  // Track if form has been modified (dirty check)
  const isDirty =
    !!recipient ||
    danhHieu.length > 0 ||
    editorHtml.length > 0 ||
    selectedHashtags.length > 0 ||
    uploadedImageUrls.length > 0 ||
    isAnonymous;

  const isSubmitDisabled =
    !recipient ||
    !danhHieu.trim() ||
    !editorHtml.trim() ||
    selectedHashtags.length === 0 ||
    isUploading ||
    isSubmitting;

  const isDirtyRef = useRef(isDirty);
  isDirtyRef.current = isDirty;

  const handleClose = useCallback(() => {
    if (isDirtyRef.current) {
      const confirmed = window.confirm(t.modal.confirmCancel);
      if (!confirmed) return;
    }
    onClose();
  }, [onClose]);

  const handleSubmit = async () => {
    if (!recipient || isSubmitDisabled) return;

    setErrors({});

    const success = await submit({
      receiver_id: recipient.id,
      danh_hieu: danhHieu.trim(),
      content: editorHtml,
      hashtags: selectedHashtags,
      images: uploadedImageUrls,
      is_anonymous: isAnonymous,
      anonymous_name: isAnonymous ? anonymousName.trim() || null : null,
    });

    if (success) {
      setToast({ message: t.modal.sendSuccess, visible: true });
      setTimeout(() => {
        onSuccess();
      }, 500);
    } else {
      setToast({
        message: submitError ?? t.modal.sendFailed,
        visible: true,
      });
    }
  };

  // Focus trap
  useEffect(() => {
    if (!isOpen) return;

    previousFocusRef.current = document.activeElement as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
        return;
      }

      if (e.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input:not([type="file"]), select, textarea, [tabindex]:not([tabindex="-1"]), [contenteditable="true"]'
        );
        if (focusable.length === 0) return;

        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    requestAnimationFrame(() => {
      const first = modalRef.current?.querySelector<HTMLElement>(
        'button, [href], input:not([type="file"]), select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      first?.focus();
    });

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      previousFocusRef.current?.focus();
    };
  }, [isOpen, handleClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  void setErrors;

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(0,16,26,0.8)] animate-fade-in"
        onClick={handleOverlayClick}
        role="presentation"
      >
        <div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-label={t.modal.title}
          className="w-full max-w-[752px] max-h-[calc(100vh-80px)] overflow-y-auto rounded-[24px] bg-[var(--color-card-bg)] p-10 flex flex-col gap-8 animate-fade-in"
        >
          {/* Title */}
          <h2 className="w-full text-[32px] font-bold leading-10 text-center text-[var(--color-text-dark)]">
            {t.modal.title}
          </h2>

          {/* Recipient Search (US1) */}
          <RecipientSearch
            value={recipient}
            onChange={setRecipient}
            error={errors.recipient}
          />

          {/* Danh Hiệu Input (US7) */}
          <DanhHieuInput
            value={danhHieu}
            onChange={setDanhHieu}
            error={errors.danhHieu}
          />

          {/* Rich Text Editor (US2) */}
          <RichTextEditor
            onChange={setEditorHtml}
            disabled={isSubmitting}
            error={errors.content}
          />

          {/* Hashtag Selector (US3) */}
          <HashtagSelector
            value={selectedHashtags}
            onChange={setSelectedHashtags}
            error={errors.hashtags}
          />

          {/* Image Uploader (US4) */}
          <ImageUploader
            uploadedUrls={uploadedImageUrls}
            onUrlsChange={setUploadedImageUrls}
            isUploading={isUploading}
            onUploadingChange={setIsUploading}
          />

          {/* Anonymous Section (US5) */}
          <AnonymousSection
            isAnonymous={isAnonymous}
            onAnonymousChange={setIsAnonymous}
            anonymousName={anonymousName}
            onAnonymousNameChange={setAnonymousName}
          />

          {/* Actions */}
          <div className="flex flex-row gap-6 w-full">
            {/* Cancel */}
            <button
              type="button"
              onClick={handleClose}
              disabled={isSubmitting}
              className="flex items-center gap-2 px-10 py-4 rounded border border-[var(--color-border)] bg-[rgba(255,234,158,0.1)] text-base font-bold text-[var(--color-text-dark)] transition-colors duration-150 hover:bg-[rgba(255,234,158,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Icon name="close" size={24} />
              <span>{t.modal.cancel}</span>
            </button>

            {/* Submit */}
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitDisabled}
              className="flex-1 flex items-center justify-center gap-1 h-[60px] rounded-lg bg-[var(--color-gold-primary)] text-[22px] font-bold text-[var(--color-text-dark)] transition-colors duration-150 hover:bg-[#FFE082] disabled:bg-[#E0D6B8] disabled:text-[var(--color-text-gray)] disabled:cursor-not-allowed"
            >
              <span>{isSubmitting ? t.modal.sending : t.modal.send}</span>
              {!isSubmitting && <Icon name="send" size={24} />}
            </button>
          </div>
        </div>
      </div>

      <Toast
        message={toast.message}
        isVisible={toast.visible}
        onClose={() => setToast((prev) => ({ ...prev, visible: false }))}
      />
    </>
  );
}
