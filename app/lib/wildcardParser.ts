export function parseWildcards(text: string, settings: any): string {
  if (!text) return "";

  let parsedText = text;

  // Define the map of wildcards to their actual values from the database
  const replacements: Record<string, string> = {
    "{business_name}": settings?.businessName || "",
    "{contact_phone}": settings?.contactPhone || "",
    "{contact_email}": settings?.contactEmail || "",
  };

  // Replace all occurrences of each wildcard
  for (const [key, value] of Object.entries(replacements)) {
    // Regex with 'g' flag replaces EVERY instance in the text
    const regex = new RegExp(key, "g");
    parsedText = parsedText.replace(regex, value);
  }

  return parsedText;
}
