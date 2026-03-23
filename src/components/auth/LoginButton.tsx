"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/libs/supabase/client";
import GoogleIcon from "@/components/auth/GoogleIcon";
import { useLocale } from "@/hooks/useLocale";

interface LoginButtonProps {
  error?: string;
  redirect?: string;
}

export default function LoginButton({ error: errorParam, redirect }: LoginButtonProps) {
  const { t } = useLocale();
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isUrlError, setIsUrlError] = useState(false);

  // Read error from URL param on mount
  useEffect(() => {
    if (errorParam) {
      const message = errorParam === "auth_failed" ? t.login.loginFailed : t.login.networkError;
      setErrorMessage(message);
      setIsUrlError(true);

      // Clean error param from URL
      const url = new URL(window.location.href);
      url.searchParams.delete("error");
      window.history.replaceState({}, "", url.toString());
    }
  }, [errorParam]);

  // Auto-dismiss URL-based errors after 5s
  useEffect(() => {
    if (!errorMessage || !isUrlError) return;

    const timer = setTimeout(() => {
      setErrorMessage(null);
      setIsUrlError(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, [errorMessage, isUrlError]);

  const handleLogin = useCallback(async () => {
    setIsLoading(true);
    setErrorMessage(null);
    setIsUrlError(false);

    try {
      const supabase = createClient();
      const callbackUrl = new URL("/auth/callback", window.location.origin);
      if (redirect) {
        callbackUrl.searchParams.set("redirect", redirect);
      }

      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: callbackUrl.toString(),
        },
      });

      if (error) {
        setErrorMessage(t.login.networkError);
        setIsLoading(false);
      }
    } catch {
      setErrorMessage(t.login.networkError);
      setIsLoading(false);
    }
  }, [redirect, t.login.networkError]);

  return (
    <div>
      <button
        type="button"
        onClick={handleLogin}
        disabled={isLoading}
        aria-label={t.login.loginAriaLabel}
        className="w-full max-w-[305px] h-[60px] bg-gold-primary rounded-lg flex items-center justify-center gap-3 font-[family-name:var(--font-montserrat)] font-bold text-base text-page-bg tracking-[0.5px] cursor-pointer transition-all hover:bg-[#FFE07A] hover:shadow-[0_4px_16px_rgba(255,234,158,0.3)] active:bg-[#FFD754] focus-visible:outline-2 focus-visible:outline-gold-primary focus-visible:outline-offset-2 disabled:bg-gray-400 disabled:cursor-not-allowed disabled:opacity-70 disabled:pointer-events-none"
      >
        {t.login.loginWithGoogle}
        <span aria-live="polite">
          {isLoading ? (
            <svg
              className="w-6 h-6 animate-spin text-page-bg"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            <GoogleIcon />
          )}
        </span>
      </button>
      {errorMessage && (
        <p
          role="alert"
          className="text-sm font-medium text-error-text mt-3 max-w-[305px] text-center sm:text-left animate-fade-in"
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
}
