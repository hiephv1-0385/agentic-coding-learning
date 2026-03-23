import Link from "next/link";
import Icon from "@/components/ui/Icon";

type ButtonVariant = "cta" | "outlined" | "link" | "warm";

interface ButtonProps {
  variant?: ButtonVariant;
  href?: string;
  children: React.ReactNode;
  className?: string;
  showArrow?: boolean;
  onClick?: () => void;
}

const variantStyles: Record<ButtonVariant, string> = {
  cta: [
    "inline-flex items-center gap-2 px-6 py-3",
    "font-[family-name:var(--font-montserrat)] text-[22px] font-bold leading-7",
    "border border-white text-white bg-transparent",
    "hover:bg-gold-primary hover:text-btn-about-bg hover:border-transparent",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-primary",
    "transition-all duration-150 ease-in-out",
  ].join(" "),
  outlined: [
    "inline-flex items-center gap-2 px-4 py-2",
    "font-[family-name:var(--font-montserrat)] text-base font-medium",
    "border border-white text-white bg-transparent",
    "hover:bg-gold-primary hover:text-btn-about-bg hover:border-transparent",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-primary",
    "transition-all duration-150 ease-in-out",
  ].join(" "),
  link: [
    "inline-flex items-center gap-1",
    "font-[family-name:var(--font-montserrat)] text-base font-medium text-white",
    "hover:text-gold-primary",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-primary",
    "transition-colors duration-150 ease-in-out",
  ].join(" "),
  warm: [
    "inline-flex items-center gap-2 px-4 py-4",
    "font-[family-name:var(--font-montserrat)] text-base font-bold leading-6",
    "bg-kudos-text text-text-dark",
    "hover:opacity-90",
    "active:scale-[0.98]",
    "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-primary",
    "transition-all duration-150 ease-in-out rounded",
  ].join(" "),
};

export default function Button({
  variant = "cta",
  href,
  children,
  className = "",
  showArrow = true,
  onClick,
}: ButtonProps) {
  const styles = `${variantStyles[variant]} ${className}`;

  const content = (
    <>
      {children}
      {showArrow && <Icon name="arrow-right" size={20} />}
    </>
  );

  if (href) {
    return (
      <Link href={href} className={styles}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" className={styles} onClick={onClick}>
      {content}
    </button>
  );
}
