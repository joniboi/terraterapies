import Link from "next/link";
import LogoIcon from "@/public/images/logos/1.svg";

export default function Logo() {
  return (
    <Link href="/" className="inline-flex" aria-label="Cruip">
      <LogoIcon className="w-26 h-26" />
    </Link> 
  );
}
