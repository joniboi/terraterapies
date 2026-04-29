// components/admin/AdminAction.tsx
import Link from "next/link";
import { Button } from "@/components/ui/button"; // Or standard HTML button if not using a UI lib
import { Pencil, Trash, Eye } from "lucide-react"; // Optional: icons make tables look super professional

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
      icon: <Pencil className="w-4 h-4 mr-2" />,
      text: label || "Edit",
      variant: "secondary" as const,
      className: "text-blue-600 bg-blue-50 hover:bg-blue-600 hover:text-white",
    },
    view: {
      icon: <Eye className="w-4 h-4 mr-2" />,
      text: label || "View",
      variant: "outline" as const,
      className: "text-gray-700",
    },
    delete: {
      icon: <Trash className="w-4 h-4 mr-2" />,
      text: label || "Delete",
      variant: "destructive" as const,
      className: "text-red-600 bg-red-50 hover:bg-red-600 hover:text-white",
    },
  };

  const activeConfig = config[type];

  // If it's a link
  if (href) {
    return (
      <Button
        variant={activeConfig.variant}
        size="sm"
        className={activeConfig.className}
        asChild
      >
        <Link href={href}>
          {activeConfig.icon}
          {activeConfig.text}
        </Link>
      </Button>
    );
  }

  // If it's an onClick action (like a delete modal)
  return (
    <Button
      variant={activeConfig.variant}
      size="sm"
      className={activeConfig.className}
      onClick={onClick}
    >
      {activeConfig.icon}
      {activeConfig.text}
    </Button>
  );
}
