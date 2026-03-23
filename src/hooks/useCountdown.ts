"use client";

import { useState, useEffect, useRef } from "react";

interface CountdownResult {
  days: string;
  hours: string;
  minutes: string;
  isExpired: boolean;
  isValid: boolean;
}

interface CountdownOptions {
  targetDate?: Date | string;
  intervalMs?: number;
  onComplete?: () => void;
}

function zeroPad(n: number): string {
  return String(Math.max(0, n)).padStart(2, "0");
}

function calcRemaining(targetDate: Date) {
  const now = Date.now();
  const diff = targetDate.getTime() - now;

  if (diff <= 0) {
    return { days: "00", hours: "00", minutes: "00", isExpired: true };
  }

  const totalMinutes = Math.floor(diff / 60_000);
  const totalHours = Math.floor(totalMinutes / 60);
  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;
  const minutes = totalMinutes % 60;

  return {
    days: zeroPad(days),
    hours: zeroPad(hours),
    minutes: zeroPad(minutes),
    isExpired: false,
  };
}

export function useCountdown(options?: CountdownOptions): CountdownResult {
  const { targetDate: targetDateParam, intervalMs, onComplete } = options ?? {};

  const resolvedDateStr =
    targetDateParam != null
      ? targetDateParam instanceof Date
        ? targetDateParam.toISOString()
        : targetDateParam
      : (process.env.NEXT_PUBLIC_EVENT_DATETIME ?? "");

  const targetMs = new Date(resolvedDateStr).getTime();
  const isValid = resolvedDateStr !== "" && !isNaN(targetMs);

  if (!isValid && resolvedDateStr !== "" && process.env.NODE_ENV === "development") {
    console.warn(`useCountdown: invalid targetDate "${resolvedDateStr}"`);
  }

  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  const hasFiredRef = useRef(false);

  const resolvedInterval = intervalMs ?? 60_000;

  // Use static initial state to avoid hydration mismatch (Date.now() differs server vs client)
  const [state, setState] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    isExpired: !isValid,
  });

  useEffect(() => {
    hasFiredRef.current = false;
  }, [targetMs]);

  useEffect(() => {
    if (!isValid) return;

    const target = new Date(targetMs);

    const update = () => {
      const result = calcRemaining(target);
      setState(result);

      if (result.isExpired && !hasFiredRef.current) {
        hasFiredRef.current = true;
        onCompleteRef.current?.();
      }
    };

    update();

    const interval = setInterval(update, resolvedInterval);
    return () => clearInterval(interval);
  }, [isValid, targetMs, resolvedInterval]);

  if (!isValid) {
    return { days: "00", hours: "00", minutes: "00", isExpired: true, isValid: false };
  }

  return { ...state, isValid: true };
}
