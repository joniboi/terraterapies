import Link from "next/link";
import { Button } from "@/components/ui/button"; // Assuming you use shadcn/ui or similar

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  actionLabel?: string;
  actionHref?: string;
  actionDisabled?: boolean;
}

export function AdminHeader({
  title,
  subtitle,
  actionLabel,
  actionHref,
  actionDisabled,
}: AdminHeaderProps) {
  return (
    <div className="flex justify-between items-center mb-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
        {subtitle && <p className="text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {actionLabel &&
        (actionDisabled ? (
          <Button disabled className="opacity-50 cursor-not-allowed">
            {actionLabel}
          </Button>
        ) : (
          <Button asChild>
            <Link href={actionHref || "#"}>{actionLabel}</Link>
          </Button>
        ))}
    </div>
  );
}
