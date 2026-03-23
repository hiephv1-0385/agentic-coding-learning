interface SectionHeaderProps {
  subtitle: string;
  title: string;
  children?: React.ReactNode;
}

export default function SectionHeader({
  subtitle,
  title,
  children,
}: SectionHeaderProps) {
  return (
    <div className="flex flex-col gap-4">
      <p className="font-[family-name:var(--font-montserrat)] text-base font-bold leading-6 text-text-white lg:text-2xl lg:leading-8">
        {subtitle}
      </p>
      <div className="h-px bg-divider" />
      <div className="flex flex-col items-start justify-between gap-4 lg:flex-row lg:items-center">
        <h2 className="font-[family-name:var(--font-montserrat)] text-[32px] font-bold leading-10 tracking-[-0.25px] text-gold-primary lg:text-[57px] lg:leading-[64px]">
          {title}
        </h2>
        {children && <div className="flex flex-row gap-2">{children}</div>}
      </div>
    </div>
  );
}
