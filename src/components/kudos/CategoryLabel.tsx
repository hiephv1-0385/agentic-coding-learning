interface CategoryLabelProps {
  category: string;
}

export default function CategoryLabel({ category }: CategoryLabelProps) {
  return (
    <span className="font-[family-name:var(--font-montserrat)] text-base font-bold leading-6 text-text-dark">
      {category}
    </span>
  );
}
