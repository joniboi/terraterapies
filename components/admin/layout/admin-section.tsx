import { ReactNode } from "react";
import { cn } from "@/app/lib/utils";

interface AdminSectionProps {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}

export function AdminSection({
  title,
  description,
  children,
  className,
}: AdminSectionProps) {
  return (
    <section className={cn("space-y-5", className)}>
      {(title || description) && (
        <div>
          {title && (
            <h2 className="text-xl font-semibold text-foreground">{title}</h2>
          )}

          {description && (
            <p className="mt-1 text-muted-foreground">{description}</p>
          )}
        </div>
      )}

      {children}
    </section>
  );
}
