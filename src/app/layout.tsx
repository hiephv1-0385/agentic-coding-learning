import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import localFont from "next/font/local";
import { cookies } from "next/headers";
import { LocaleProvider } from "@/hooks/useLocale";
import { createClient } from "@/libs/supabase/server";
import FloatingActionButton from "@/components/shared/FloatingActionButton";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "700"],
  variable: "--font-montserrat",
  display: "swap",
});

const digitalNumbers = localFont({
  src: "../../public/fonts/DigitalNumbers-Regular.woff2",
  variable: "--font-digital",
  display: "swap",
  weight: "400",
});

const svnGotham = localFont({
  src: "../../public/fonts/SVN-Gotham.woff2",
  variable: "--font-gotham",
  display: "swap",
  weight: "400",
});

const montserratAlternates = localFont({
  src: "../../public/fonts/MontserratAlternates-Bold.woff2",
  variable: "--font-montserrat-alt",
  display: "swap",
  weight: "700",
});

export const metadata: Metadata = {
  title: "Sun* Annual Awards 2025",
  description:
    "ROOT FURTHER — Sun* Annual Awards 2025. Discover award categories, countdown to the ceremony, and explore the Sun* Kudos recognition program.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const locale = cookieStore.get("locale")?.value || "vi";

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <html lang={locale}>
      <body
        className={`${montserrat.variable} ${digitalNumbers.variable} ${svnGotham.variable} ${montserratAlternates.variable} antialiased`}
      >
        <LocaleProvider initialLocale={locale as "vi" | "en"}>
          {children}
          <FloatingActionButton isAuthenticated={!!user} />
        </LocaleProvider>
      </body>
    </html>
  );
}
