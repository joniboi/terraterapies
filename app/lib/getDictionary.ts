import "server-only";
import { Dictionary } from "@/types/definitions";

const dictionaries = {
  es: () =>
    import("@/dictionaries/es.json").then(
      (module) => module.default as Dictionary,
    ),
  en: () =>
    import("@/dictionaries/en.json").then(
      (module) => module.default as Dictionary,
    ),
  ca: () =>
    import("@/dictionaries/ca.json").then(
      (module) => module.default as Dictionary,
    ),
};

export const getDictionary = async (locale: string): Promise<Dictionary> => {
  // Helper logic to find the key safely
  const lang =
    locale in dictionaries ? (locale as keyof typeof dictionaries) : "es";
  return dictionaries[lang]();
};
