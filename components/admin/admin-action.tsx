// components/admin/AdminAction.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button"; // Or standard HTML button if not using a UI lib
import { Pencil, Trash, Eye } from "lucide-react"; // Optional: icons make tables look super professional
import { cn } from "@/app/lib/utils";

interface AdminActionProps {
  href?: string;
  onClick?: () => void;
  type?: "edit" | "delete" | "view";
  label?: string; // Optional override
}

export function AdminAction({
  href,
  onClick,
  type = "edit",
  label,
}: AdminActionProps) {
  // Define standard designs based on action type
  const config = {
    edit: {
      icon: <Pencil className="w-4 h-4" />,
      text: label || "Edit",
      variant: "secondary" as const, // Uses your --color-secondary
      className: "text-primary", // Uses your --color-primary for the text
    },
    view: {
      icon: <Eye className="w-4 h-4 mr-2" />,
      text: label || "View",
      variant: "outline" as const,
      className: "text-primary",
    },
    delete: {
      icon: <Trash className="w-4 h-4" />,
      text: label || "Delete",
      variant: "destructive" as const, // We should define --color-destructive in theme.css
      className: "",
    },
  };

  const activeConfig = config[type];

  return (
    <Button
      variant={activeConfig.variant}
      size="sm"
      className={cn("gap-2", activeConfig.className)}
      asChild={!!href} // Automatically use asChild if there is an href
      onClick={onClick}
    >
      {href ? (
        <Link href={href}>
          {activeConfig.icon}
          {activeConfig.text}
        </Link>
      ) : (
        <>
          {activeConfig.icon}
          {activeConfig.text}
        </>
      )}
    </Button>
  );
}
