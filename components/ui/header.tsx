"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import Logo from "./logo";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";

// 1. Define the shapes of the data we expect
interface Subcategory {
  slug: string;
  title: string;
}

interface Category {
  slug: string;
  title: string;
  subcategories: Subcategory[];
}

interface HeaderDict {
  seeAll: string; // <--- The new literal
  languages: {
    es: string;
    ca: string;
    en: string;
  };
}

interface HeaderProps {
  lang: string;
  dict: HeaderDict;
  categories: Category[]; // <--- We receive data from parent
}

export default function Header({ lang, dict, categories }: HeaderProps) {
  const pathname = usePathname();
  const router = useRouter();

  // 2. Logic to switch language while keeping the same page
  const switchLang = (newLang: string) => {
    if (!pathname) return "/";
    const segments = pathname.split("/"); // ["", "es", "services", "thai"]
    segments[1] = newLang; // Replace current lang with new one
    const newUrl = segments.join("/");
    router.push(newUrl);
  };

  return (
    <header className="fixed top-2 z-30 w-full md:top-6">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative flex h-14 items-center justify-between gap-3 rounded-2xl bg-white/90 px-3 shadow-lg shadow-black/[0.03] backdrop-blur-xs">
          {/* Logo Wrapper - You might want to pass lang to Logo too if it has a home link */}
          <div className="flex flex-1 items-center">
            <Logo lang={lang} />
          </div>

          <NavigationMenu viewport={false}>
            <NavigationMenuList>
              {categories.map((category) => (
                <NavigationMenuItem key={category.slug}>
                  <NavigationMenuTrigger>
                    {category.title}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-2 p-3 w-[220px]">
                      <NavigationMenuLink asChild>
                        {/* 3. Updated Links to use dynamic Lang */}
                        <Link
                          href={`/${lang}/${category.slug}`}
                          className="font-semibold text-gray-800"
                        >
                          {dict.seeAll}
                        </Link>
                      </NavigationMenuLink>

                      {category.subcategories.map((sub) => (
                        <NavigationMenuLink asChild key={sub.slug}>
                          <Link href={`/${lang}/${category.slug}/${sub.slug}`}>
                            {sub.title}
                          </Link>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>

          {/* 4. Language Switcher (Flags) */}
          <ul className="flex flex-1 items-center justify-end gap-3">
            <li>
              <button
                onClick={() => switchLang("es")}
                className={`transition hover:scale-110 ${
                  lang === "es"
                    ? "opacity-100 grayscale-0"
                    : "opacity-50 grayscale"
                }`}
                title={dict.languages.es}
              >
                <Image
                  src="/images/flags/es.svg"
                  alt="Español"
                  width={24}
                  height={24}
                  className="rounded-full shadow-sm"
                />
              </button>
            </li>
            <li>
              <button
                onClick={() => switchLang("ca")}
                className={`transition hover:scale-110 ${
                  lang === "ca"
                    ? "opacity-100 grayscale-0"
                    : "opacity-50 grayscale"
                }`}
                title={dict.languages.ca}
              >
                <Image
                  src="/images/flags/es-ct.svg"
                  alt="Català"
                  width={24}
                  height={24}
                  className="rounded-full shadow-sm"
                />
              </button>
            </li>
            <li>
              <button
                onClick={() => switchLang("en")}
                className={`transition hover:scale-110 ${
                  lang === "en"
                    ? "opacity-100 grayscale-0"
                    : "opacity-50 grayscale"
                }`}
                title={dict.languages.en}
              >
                <Image
                  src="/images/flags/gb.svg"
                  alt="English"
                  width={24}
                  height={24}
                  className="rounded-full shadow-sm"
                />
              </button>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
