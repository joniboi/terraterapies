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
