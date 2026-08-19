import { ReactNode } from "react";
import Link from "next/link";

export interface ColumnDef<T> {
  header: string;
  className?: string; // For text-right, responsive styling, specific widths, etc.
  render: (row: T) => ReactNode; // Function that returns JSX for the cell
}

interface AdminTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  rowHref?: (row: T) => string;
}

export function AdminTable<T extends { id: string | number }>({
  data,
  columns,
  rowHref,
}: AdminTableProps<T>) {
  return (
    <div className="flex flex-col gap-3">
      {/* Optional Header Row for column labels on larger screens */}
      <div className="hidden md:flex items-center px-4 py-2 text-[10px] font-bold text-muted-foreground uppercase tracking-widest select-none">
        {columns.map((col, idx) => {
          const isFirst = idx === 0;
          const hasSizing =
            col.className?.includes("flex-") || col.className?.includes("w-");
          const fallbackClass = isFirst && !hasSizing ? "flex-1" : "";

          return (
            <div
              key={idx}
              className={`
                min-w-0
                ${fallbackClass}
                ${col.className || ""}
              `}
            >
              {col.header}
            </div>
          );
        })}
      </div>

      {/* Card-Style List Container */}
      <div className="flex flex-col gap-3">
        {data.length === 0 ? (
          <div className="text-center p-12 bg-muted/20 border border-dashed border-border rounded-xl">
            <p className="text-muted-foreground">No records found.</p>
          </div>
        ) : (
          data.map((row) => {
            const isClickable = !!rowHref;
            const CardWrapper = isClickable ? Link : "div";

            return (
              <CardWrapper
                key={row.id}
                href={isClickable ? rowHref(row) : (undefined as any)}
                className={`
                  flex items-center p-4 bg-card border border-border rounded-xl transition-all group relative
                  ${isClickable ? "cursor-pointer hover:border-primary/50 hover:shadow-sm" : ""}
                `}
              >
                {/* Columns mapped layout inside the card */}
                <div className="flex-1 flex flex-col md:flex-row md:items-center gap-4 min-w-0">
                  {columns.map((col, idx) => {
                    const isFirst = idx === 0;
                    const hasSizing =
                      col.className?.includes("flex-") ||
                      col.className?.includes("w-");
                    const fallbackClass = isFirst && !hasSizing ? "flex-1" : "";

                    return (
                      <div
                        key={idx}
                        className={`
                          min-w-0
                          ${fallbackClass}
                          ${col.className || ""}
                        `}
                      >
                        {col.render(row)}
                      </div>
                    );
                  })}
                </div>
              </CardWrapper>
            );
          })
        )}
      </div>
    </div>
  );
}
