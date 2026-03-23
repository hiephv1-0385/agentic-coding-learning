"use client";

import { useRef } from "react";
import Image from "next/image";
import Icon from "@/components/ui/Icon";
import { useLocale } from "@/hooks/useLocale";

interface ImageUploaderProps {
  uploadedUrls: string[];
  onUrlsChange: (urls: string[]) => void;
  isUploading: boolean;
  onUploadingChange: (uploading: boolean) => void;
}

const MAX_IMAGES = 5;
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/gif", "image/webp"];

export default function ImageUploader({
  uploadedUrls,
  onUrlsChange,
  isUploading,
  onUploadingChange,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadingCountRef = useRef(0);
  const { t } = useLocale();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    // Reset input
    if (inputRef.current) inputRef.current.value = "";

    const remainingSlots = MAX_IMAGES - uploadedUrls.length;
    const filesToUpload = files.slice(0, remainingSlots);

    for (const file of filesToUpload) {
      if (!ACCEPTED_TYPES.includes(file.type)) {
        alert(t.modal.unsupportedFormat);
        continue;
      }
      if (file.size > MAX_FILE_SIZE) {
        alert(t.modal.fileTooLarge);
        continue;
      }

      uploadingCountRef.current++;
      onUploadingChange(true);

      try {
        // Compress if needed
        let uploadFile: File | Blob = file;
        if (file.size > 1920 * 1920) {
          const { compressImage } = await import("@/utils/compressImage");
          uploadFile = await compressImage(file, 1920, 0.8);
        }

        const formData = new FormData();
        formData.append("file", uploadFile);

        const res = await fetch("/api/upload/image", {
          method: "POST",
          body: formData,
        });

        if (res.ok) {
          const json = (await res.json()) as { url: string };
          onUrlsChange([...uploadedUrls, json.url]);
        } else {
          alert(t.modal.uploadFailed);
        }
      } catch {
        alert(t.modal.uploadFailed);
      } finally {
        uploadingCountRef.current--;
        if (uploadingCountRef.current === 0) {
          onUploadingChange(false);
        }
      }
    }
  };

  const handleRemove = (index: number) => {
    onUrlsChange(uploadedUrls.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-row items-center gap-4 w-full">
      <label className="shrink-0 text-[22px] font-bold leading-7 text-[var(--color-text-dark)]">
        {t.modal.imageLabel}
      </label>

      <div className="flex flex-row flex-wrap items-center gap-4">
        {/* Thumbnails */}
        {uploadedUrls.map((url, index) => (
          <div key={url} className="relative w-20 h-20 rounded-[18px] border border-[var(--color-border)] bg-white overflow-hidden">
            <Image
              src={url}
              alt={`Attachment ${index + 1}`}
              width={80}
              height={80}
              className="w-full h-full object-cover rounded"
            />
            <button
              type="button"
              onClick={() => handleRemove(index)}
              className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-[var(--color-delete-badge)] flex items-center justify-center hover:opacity-80 transition-opacity"
              aria-label={`${t.modal.removeImage} ${index + 1}`}
            >
              <Icon name="close-tiny" size={17} className="text-white" />
            </button>
          </div>
        ))}

        {/* Upload loading placeholder */}
        {isUploading && (
          <div className="w-20 h-20 rounded-[18px] border border-[var(--color-border)] bg-white flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-[var(--color-border)] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* Add button */}
        {uploadedUrls.length < MAX_IMAGES && !isUploading && (
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex items-center gap-2 h-12 px-2 py-1 rounded-lg border border-[var(--color-border)] bg-white hover:bg-[var(--color-card-bg)] transition-colors"
          >
            <Icon name="plus" size={24} className="text-[var(--color-text-gray)]" />
            <div className="flex flex-col items-start">
              <span className="text-[11px] font-bold leading-4 tracking-[0.5px] text-[var(--color-text-gray)]">
                {t.modal.imageLabel}
              </span>
              <span className="text-[11px] font-bold leading-4 tracking-[0.5px] text-[var(--color-text-gray)]">
                {t.modal.maxImages} {MAX_IMAGES}
              </span>
            </div>
          </button>
        )}

        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(",")}
          multiple
          onChange={handleFileSelect}
          className="hidden"
          tabIndex={-1}
        />
      </div>
    </div>
  );
}
