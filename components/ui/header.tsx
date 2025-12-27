import Link from "next/link";
import Logo from "./logo";
import servicesData from "@/data/services.json"
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";

export default function Header() {
  const categories = servicesData.categories;
  return (
    <header className="fixed top-2 z-30 w-full md:top-6">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="relative flex h-14 items-center justify-between gap-3 rounded-2xl bg-white/90 px-3 shadow-lg shadow-black/[0.03] backdrop-blur-xs">
          <div className="flex flex-1 items-center">
            <Logo />
          </div>

          <NavigationMenu viewport={false}>
            <NavigationMenuList>
              {categories.map((category) => (
                <NavigationMenuItem key={category.slug}>
                  <NavigationMenuTrigger>{category.title}</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid gap-2 p-3 w-[220px]">
                      <NavigationMenuLink asChild>
                        <Link href={`/${category.slug}`} className="font-semibold text-gray-800">
                          Ver todos →
                        </Link>
                      </NavigationMenuLink>

                      {category.subcategories.map((sub) => (
                        <NavigationMenuLink asChild key={sub.slug}>
                          <Link href={`/${category.slug}/${sub.slug}`}>
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

          <ul className="flex flex-1 items-center justify-end gap-3">
            <li>
              <Link href="/gallery" className="btn-sm bg-white text-gray-800 shadow-sm hover:bg-gray-50">
                Galeria
              </Link>
            </li>
            <li>
              <Link href="/giftcard" className="btn-sm bg-gray-800 text-gray-200 shadow-sm hover:bg-gray-900">
                Regalar
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </header>
  );
}
