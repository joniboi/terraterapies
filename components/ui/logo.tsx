import Link from "next/link";
import Image from "next/image";
import LogoIcon from "@/public/images/logos/1.svg?url";

export default function Logo() {
  return (
    <Link href="/" className="inline-flex" aria-label="Cruip">
      <Image
        src={LogoIcon}
        alt="Cruip Logo"
        width={72} // Tailwind w-6 = 24px
        height={72} // Tailwind h-6 = 24px
      />
    </Link>
  );
}
