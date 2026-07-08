import Link from "next/link";
import { Option } from "@/types/definitions";

interface PricingPillsProps {
  options: Option[];
  baseLink: string;
}

export function PricingPills({ options, baseLink }: PricingPillsProps) {
  if (!options || options.length === 0) return null;

  return (
    <div className="flex flex-wrap gap-3 mb-8 justify-center md:justify-start">
      {options.map((opt, i) => {
        const targetUrl = `${baseLink}?duration=${encodeURIComponent(opt.duration)}`;

        return (
          <Link
            key={i}
            href={targetUrl}
            className="group relative flex flex-col items-center justify-center px-4 py-2.5 min-w-[110px] border border-border rounded-xl hover:border-primary hover:bg-muted/50 transition-all bg-background shadow-sm hover:shadow"
          >
            <span className="text-xs font-medium text-muted-foreground mb-0.5 group-hover:text-foreground transition-colors">
              {opt.duration}
            </span>

            {opt.isPromo ? (
              <div className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground line-through">
                  {opt.originalPrice}
                </span>
                <span className="text-base font-bold text-highlight">
                  {opt.price}
                </span>
              </div>
            ) : (
              <span className="text-base font-bold text-foreground">
                {opt.price}
              </span>
            )}
          </Link>
        );
      })}
    </div>
  );
}
