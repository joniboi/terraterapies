import { cn } from "@/app/lib/utils";

export function FormGrid({
  children,
  cols = 2,
}: {
  children: React.ReactNode;
  cols?: number;
}) {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-1 md:grid-cols-2",
    3: "grid-cols-1 md:grid-cols-3",
    4: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  }[cols as 1 | 2 | 3 | 4];

  return <div className={cn("grid gap-6", gridCols)}>{children}</div>;
}
