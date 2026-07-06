import { ReactNode } from "react";
import { Card } from "../display/card";

// The magic interface that allows different types of data
export interface ColumnDef<T> {
  header: string;
  className?: string; // For text-right, specific widths, etc.
  render: (row: T) => ReactNode; // Function that returns JSX for the cell
}

interface AdminTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
}

export function AdminTable<T extends { id: string | number }>({
  data,
  columns,
}: AdminTableProps<T>) {
  return (
    <Card className="overflow-hidden">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-muted/50 border-b border-border text-[10px] font-bold text-muted-foreground uppercase tracking-widest">
            {columns.map((col, idx) => (
              <th
                key={idx}
                className={`p-4 font-semibold ${col.className || ""}`}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border/50">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="p-8 text-center text-muted-foreground"
              >
                No records found.
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={row.id} className="hover:bg-accent/50 transition-colors">
                {columns.map((col, idx) => (
                  <td key={idx} className={`p-4 ${col.className || ""}`}>
                    {col.render(row)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </Card>
  );
}
