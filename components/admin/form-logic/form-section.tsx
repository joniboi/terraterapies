// components/admin/form-logic/form-section.tsx
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/app/lib/utils";

interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  // New: Allow an optional action (like a button) in the header
  action?: React.ReactNode;
}

export function FormSection({
  title,
  description,
  children,
  className,
  action,
}: FormSectionProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 py-4 bg-muted/20">
        <div>
          <CardTitle className="text-base font-bold tracking-tight">
            {title}
          </CardTitle>
          {description && (
            <p className="text-[10px] text-muted-foreground mt-1">
              {description}
            </p>
          )}
        </div>
        {action && <div>{action}</div>}
      </CardHeader>
      <CardContent className="p-6">{children}</CardContent>
    </Card>
  );
}
