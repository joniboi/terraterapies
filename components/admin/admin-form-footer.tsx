"use client";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogClose,
} from "@/components/ui/alert-dialog";
import { Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

interface AdminFormFooterProps {
  isLoading: boolean;
  onSave: () => void;
  onDelete?: () => void;
  isEdit?: boolean;
}

export default function AdminFormFooter({
  isLoading,
  onSave,
  onDelete,
  isEdit,
}: AdminFormFooterProps) {
  const router = useRouter();

  return (
    <div className="fixed bottom-0 left-0 right-0 md:left-64 bg-white/80 backdrop-blur-md border-t border-gray-200 p-4 z-40 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        {/* Delete Action (Only if editing) */}
        <div>
          {isEdit && onDelete && (
            <AlertDialog>
              {/* BASE UI uses 'render' instead of 'asChild' */}
              <AlertDialogTrigger
                render={
                  <Button variant="destructive" size="sm" className="gap-2">
                    <Trash2 className="size-4" />
                    Delete
                  </Button>
                }
              />
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete
                    this item from the database.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  {/* Use render prop here too */}
                  <AlertDialogClose
                    render={<Button variant="ghost">Cancel</Button>}
                  />

                  <Button variant="destructive" onClick={onDelete}>
                    Delete Permanently
                  </Button>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>

        {/* Save/Cancel Actions */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            type="button"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            onClick={onSave}
            disabled={isLoading}
            className="min-w-[120px]"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Changes"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
