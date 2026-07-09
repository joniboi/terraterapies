/**
 * Takes a date and returns a translated relative string
 * (e.g., "hace 2 meses", "fa 3 setmanes", "2 days ago")
 */
export function getRelativeTimeString(
  date: Date | string,
  lang: string,
): string {
  const time = new Date(date).getTime();
  const now = new Date().getTime();

  // Calculate difference in days (negative because it's in the past)
  const diffInDays = Math.round((time - now) / (1000 * 60 * 60 * 24));

  // Native JS Translator!
  const rtf = new Intl.RelativeTimeFormat(lang, { numeric: "auto" });

  if (Math.abs(diffInDays) < 30) {
    return rtf.format(diffInDays, "day");
  }

  const diffInMonths = Math.round(diffInDays / 30);
  if (Math.abs(diffInMonths) < 12) {
    return rtf.format(diffInMonths, "month");
  }

  const diffInYears = Math.round(diffInDays / 365);
  return rtf.format(diffInYears, "year");
}

/**
 * Takes start/end day integers (1 = Monday, 7 = Sunday) and returns
 * a translated string range (e.g., "Lunes - Viernes", "Monday - Friday")
 */
export function formatScheduleDays(
  startDay: number,
  endDay: number | null,
  lang: string,
): string {
  // 8 is our custom code for "Holidays"
  const getDayName = (dayInt: number) => {
    if (dayInt === 8) {
      return lang === "es"
        ? "Festivos"
        : lang === "ca"
          ? "Festius"
          : "Holidays";
    }
    // Magic trick: Jan 1, 2024 was a Monday.
    // We use this reference date to let JS auto-translate the weekday!
    const date = new Date(2024, 0, dayInt);
    const name = date.toLocaleDateString(lang, { weekday: "long" });
    // Capitalize first letter (e.g., "lunes" -> "Lunes")
    return name.charAt(0).toUpperCase() + name.slice(1);
  };

  const start = getDayName(startDay);

  if (!endDay || endDay === 0 || startDay === endDay) {
    return start; // e.g. "Sábado"
  }

  const end = getDayName(endDay);

  // Using a universal hyphen is the cleanest way to display ranges in all languages
  return `${start} - ${end}`; // e.g. "Lunes - Viernes"
}
