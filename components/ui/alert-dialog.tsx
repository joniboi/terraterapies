"use client";

import { cn } from "@/app/lib/utils";
import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog";
import type React from "react";

export const AlertDialogCreateHandle: typeof AlertDialogPrimitive.createHandle =
  AlertDialogPrimitive.createHandle;

export const AlertDialog: typeof AlertDialogPrimitive.Root =
  AlertDialogPrimitive.Root;

export const AlertDialogPortal: typeof AlertDialogPrimitive.Portal =
  AlertDialogPrimitive.Portal;

export function AlertDialogTrigger(
  props: AlertDialogPrimitive.Trigger.Props,
): React.ReactElement {
  return (
    <AlertDialogPrimitive.Trigger data-slot="alert-dialog-trigger" {...props} />
  );
}

export function AlertDialogBackdrop({
  className,
  ...props
}: AlertDialogPrimitive.Backdrop.Props): React.ReactElement {
  return (
    <AlertDialogPrimitive.Backdrop
      className={cn(
        "fixed inset-0 z-50 bg-black/32 backdrop-blur-sm transition-all duration-200 data-ending-style:opacity-0 data-starting-style:opacity-0",
        className,
      )}
      data-slot="alert-dialog-backdrop"
      {...props}
    />
  );
}

export function AlertDialogViewport({
  className,
  ...props
}: AlertDialogPrimitive.Viewport.Props): React.ReactElement {
  return (
    <AlertDialogPrimitive.Viewport
      className={cn(
        "fixed inset-0 z-50 grid grid-rows-[1fr_auto_3fr] justify-items-center p-4",
        className,
      )}
      data-slot="alert-dialog-viewport"
      {...props}
    />
  );
}

export function AlertDialogPopup({
  className,
  bottomStickOnMobile = true,
  ...props
}: AlertDialogPrimitive.Popup.Props & {
  bottomStickOnMobile?: boolean;
}): React.ReactElement {
  return (
    <AlertDialogPortal>
      <AlertDialogBackdrop />
      <AlertDialogViewport
        className={cn(
          bottomStickOnMobile &&
            "max-sm:grid-rows-[1fr_auto] max-sm:p-0 max-sm:pt-12",
        )}
      >
        <AlertDialogPrimitive.Popup
          className={cn(
            // HOMOGENIZED: Uses border-border and rounded-2xl variable
            "relative row-start-2 flex max-h-full min-h-0 w-full min-w-0 max-w-lg origin-center flex-col rounded-2xl border border-border bg-popover text-popover-foreground shadow-lg transition-[scale,opacity,translate] duration-200 ease-in-out",
            // Ensuring the 'before' shadow matches the theme logic
            "before:pointer-events-none before:absolute before:inset-0 before:rounded-[calc(var(--radius-2xl)-1px)] before:shadow-[0_1px_rgba(0,0,0,0.04)]",
            bottomStickOnMobile &&
              "max-sm:max-w-none max-sm:origin-bottom max-sm:rounded-none max-sm:border-x-0 max-sm:border-t max-sm:border-b-0",
            className,
          )}
          data-slot="alert-dialog-popup"
          {...props}
        />
      </AlertDialogViewport>
    </AlertDialogPortal>
  );
}

export function AlertDialogHeader({
  className,
  ...props
}: React.ComponentProps<"div">): React.ReactElement {
  return (
    <div
      className={cn(
        "flex flex-col gap-2 p-6 text-center max-sm:pb-4 sm:text-left",
        className,
      )}
      data-slot="alert-dialog-header"
      {...props}
    />
  );
}

export function AlertDialogFooter({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"div"> & {
  variant?: "default" | "bare";
}): React.ReactElement {
  return (
    <div
      className={cn(
        "flex flex-col-reverse gap-2 px-6 sm:flex-row sm:justify-end",
        variant === "default" &&
          "border-t border-border bg-muted/50 py-4 sm:rounded-b-[calc(var(--radius-2xl)-1px)]",
        variant === "bare" && "pb-6",
        className,
      )}
      data-slot="alert-dialog-footer"
      {...props}
    />
  );
}

export function AlertDialogTitle({
  className,
  ...props
}: AlertDialogPrimitive.Title.Props): React.ReactElement {
  return (
    <AlertDialogPrimitive.Title
      className={cn(
        "font-inter font-semibold text-xl leading-none text-foreground",
        className,
      )}
      data-slot="alert-dialog-title"
      {...props}
    />
  );
}

export function AlertDialogDescription({
  className,
  ...props
}: AlertDialogPrimitive.Description.Props): React.ReactElement {
  return (
    <AlertDialogPrimitive.Description
      className={cn("text-muted-foreground text-sm", className)}
      data-slot="alert-dialog-description"
      {...props}
    />
  );
}

export function AlertDialogClose(
  props: AlertDialogPrimitive.Close.Props,
): React.ReactElement {
  return (
    <AlertDialogPrimitive.Close data-slot="alert-dialog-close" {...props} />
  );
}

export {
  AlertDialogPrimitive,
  AlertDialogBackdrop as AlertDialogOverlay,
  AlertDialogPopup as AlertDialogContent,
};
