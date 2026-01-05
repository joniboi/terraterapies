import Link from "next/link";
import Image from "next/image";
import LogoIcon from "@/public/images/logos/1.svg?url";

export default function Logo({ lang }: { lang?: string }) {
  // If we know the language, link to "/es", "/en".
  // If not, link to "/" and let proxy redirect.
  const href = lang ? `/${lang}` : "/";

  return (
    <Link href={href} className="inline-flex" aria-label="Terraterapies">
      <Image
        src={LogoIcon}
        alt="Terraterapies Thai & Bali"
        width={72} // Tailwind w-6 = 24px
        height={72} // Tailwind h-6 = 24px
      />
    </Link>
  );
}
