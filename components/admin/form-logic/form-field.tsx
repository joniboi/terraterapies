export function FormField({
  label,
  description,
  children,
  required,
}: {
  label: string;
  description?: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  return (
    <div className="space-y-1.5 w-full">
      <div className="flex justify-between items-center">
        <label className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
          {label} {required && <span className="text-destructive">*</span>}
        </label>
      </div>
      {children}
      {description && (
        <p className="text-[10px] text-muted-foreground leading-tight">
          {description}
        </p>
      )}
    </div>
  );
}
