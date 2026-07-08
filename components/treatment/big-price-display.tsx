import { Option } from "@/types/definitions";

interface BigPriceDisplayProps {
  option: Option | null;
}

export function BigPriceDisplay({ option }: BigPriceDisplayProps) {
  if (!option) return null;

  return (
    <div className="text-center py-2 animate-in fade-in zoom-in duration-300">
      {option.isPromo ? (
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center justify-center gap-3">
            <span className="text-xl text-gray-400 line-through decoration-red-400">
              {option.originalPrice}
            </span>
            <span className="text-4xl text-highlight font-bold drop-shadow-md">
              {option.price}
            </span>
          </div>
          {option.promoEnds && (
            <span className="inline-block mt-2 text-xs text-white uppercase tracking-widest font-semibold bg-highlight/20 border border-highlight/40 px-3 py-1 rounded-full">
              Offer ends {option.promoEnds}
            </span>
          )}
        </div>
      ) : (
        <p className="text-4xl text-white font-bold drop-shadow-md">
          {option.price}
        </p>
      )}
    </div>
  );
}
