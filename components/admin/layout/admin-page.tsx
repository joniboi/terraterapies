import { ReactNode } from "react";
import { AdminHeader } from "../table/admin-header";

interface AdminPageProps {
  title?: string;
  subtitle?: string;
  children: ReactNode;
  className?: string;
}

export function AdminPage({
  title,
  subtitle,
  children,
  className = "",
}: AdminPageProps) {
  return (
    <div className={`max-w-7xl mx-auto space-y-8 ${className}`}>
      {(title || subtitle) && (
        <AdminHeader title={title ?? ""} subtitle={subtitle} />
      )}

      {children}
    </div>
  );
}
