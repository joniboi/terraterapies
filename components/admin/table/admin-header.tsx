import Link from "next/link";
import { Button } from "@/components/ui/button"; // Assuming you use shadcn/ui or similar

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  actionHref?: string;
  actionDisabled?: boolean;
  children?: React.ReactNode;
}

export function AdminHeader({
  title,
  subtitle,
  actionLabel,
  actionHref,
  actionDisabled,
  children,
}: AdminHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {title}
          </h1>
          {subtitle && <p className="text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        {actionLabel && (
          <Button asChild disabled={actionDisabled}>
            <Link href={actionHref || "#"}>{actionLabel}</Link>
          </Button>
        )}
      </div>

      {/* 👈 Render filters/tabs here if provided */}
      {children && <div className="mt-6">{children}</div>}
    </div>
  );
}
