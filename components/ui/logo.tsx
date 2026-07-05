import Link from "next/link";
import Image from "next/image";

interface LogoProps {
  lang?: string;
  logoUrl?: string | null;
  businessName?: string;
}

export default function Logo({
  lang,
  logoUrl,
  businessName = "Spa",
}: LogoProps) {
  // If we know the language, link to "/es", "/en".
  // If not, link to "/" and let proxy redirect.
  const href = lang ? `/${lang}` : "/";

  return (
    <Link
      href={href}
      className="inline-flex items-center justify-center"
      aria-label={businessName}
    >
      {logoUrl ? (
        <img
          src={logoUrl}
          alt={businessName}
          width={72}
          height={72}
          // Forces a strict 72x72 square, 'object-contain' keeps it from distorting
          className="w-[72px] h-[72px] object-contain drop-shadow-sm"
        />
      ) : (
        // Fallback if the new customer hasn't uploaded a logo yet!
        <span className="text-xl font-bold font-serif">{businessName}</span>
      )}
    </Link>
  );
}
