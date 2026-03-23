import type { Metadata } from "next";
import { CountdownPrelaunchPage } from "@/components/prelaunch/CountdownPrelaunchPage";

export const metadata: Metadata = {
  title: "Countdown | Sun* Annual Awards 2025",
};

export default function PrelaunchPage() {
  const targetDate = process.env.NEXT_PUBLIC_EVENT_DATETIME ?? "";

  return (
    <CountdownPrelaunchPage
      targetDate={targetDate}
      backgroundImageSrc="/images/prelaunch-bg.png"
    />
  );
}
