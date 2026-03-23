"use client";

import { useState } from "react";
import { useLocale } from "@/hooks/useLocale";
import { createKudosSchema, type CreateKudosInput } from "@/types/kudos";

interface UseCreateKudosResult {
  submit: (data: CreateKudosInput) => Promise<boolean>;
  isSubmitting: boolean;
  error: string | null;
}

export function useCreateKudos(): UseCreateKudosResult {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLocale();

  const submit = async (data: CreateKudosInput): Promise<boolean> => {
    setError(null);

    // Client-side validation
    const parsed = createKudosSchema.safeParse(data);
    if (!parsed.success) {
      const firstError = Object.values(parsed.error.flatten().fieldErrors)[0]?.[0];
      setError(firstError ?? t.modal.invalidData);
      return false;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/kudos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: string };
        setError(body.error ?? t.modal.sendFailed);
        return false;
      }

      return true;
    } catch {
      setError(t.modal.sendFailed);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { submit, isSubmitting, error };
}
