import Image from "next/image";
import LoginHeader from "@/components/auth/LoginHeader";
import LoginHero from "@/components/auth/LoginHero";
import LoginButton from "@/components/auth/LoginButton";
import LoginFooter from "@/components/auth/LoginFooter";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; redirect?: string }>;
}) {
  const { error, redirect } = await searchParams;

  return (
    <div className="h-screen flex flex-col bg-page-bg relative">
      {/* Background image — covers entire viewport */}
      <Image
        src="/images/hero-banner.png"
        alt=""
        fill
        priority
        className="object-cover z-0"
        aria-hidden="true"
      />
      {/* Gradient overlay — 60% midpoint (not Tailwind via which defaults to 50%) */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(to right, rgba(0,16,26,0.85) 0%, rgba(0,16,26,0.1) 60%, transparent 100%)",
        }}
        aria-hidden="true"
      />

      <LoginHeader />
      <LoginHero>
        <LoginButton error={error} redirect={redirect} />
      </LoginHero>
      <LoginFooter />
    </div>
  );
}
