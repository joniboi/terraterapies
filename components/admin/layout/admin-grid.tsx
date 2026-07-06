import { cn } from "@/app/lib/utils";
import { ReactNode } from "react";

interface AdminGridProps {
  children: ReactNode;
  columns?: 1 | 2 | 3 | 4;
  className?: string;
}

const layouts = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
  4: "grid-cols-1 md:grid-cols-2 xl:grid-cols-4",
};

export function AdminGrid({
  children,
  columns = 3,
  className,
}: AdminGridProps) {
  return (
    <div className={cn("grid gap-6", layouts[columns], className)}>
      {children}
    </div>
  );
}
