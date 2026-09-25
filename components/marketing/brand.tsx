import Image from "next/image";
import Link from "next/link";

export function MarketingBrand() {
  return (
    <Link
      href="/"
      className="flex items-center gap-2.5 font-heading text-[15px] font-bold tracking-tight text-ink"
      aria-label="Yoga Write Code home"
    >
      <Image src="/icon.svg" alt="" width={28} height={28} unoptimized />
      <span>Yoga Write Code</span>
    </Link>
  );
}
