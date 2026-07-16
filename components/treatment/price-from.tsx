import { Option } from "@/types/definitions";

interface PriceFromProps {
  options: Option[];
  label: string; // e.g., "Desde"
}

export function PriceFrom({ options, label }: PriceFromProps) {
  if (!options || options.length === 0) return null;

  // Find the lowest price among all variants safely
  const lowestPriceString = options.reduce((minPriceStr, currentOption) => {
    // Helper to extract numeric value from strings like "65€" or "65,50"
    const extractNumber = (priceStr: string) =>
      parseFloat(priceStr.replace(/[^\d.,]/g, "").replace(",", "."));

    const currentPrice = extractNumber(currentOption.price);
    const minPrice = extractNumber(minPriceStr);

    return currentPrice < minPrice ? currentOption.price : minPriceStr;
  }, options[0].price);

  return (
    <div className="flex items-baseline gap-2">
      <span className="text-muted-foreground text-sm font-semibold uppercase tracking-wider">
        {label}
      </span>
      <span className="text-2xl font-bold text-foreground">
        {lowestPriceString}
      </span>
    </div>
  );
}
