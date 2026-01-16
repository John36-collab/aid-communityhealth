import * as React from "react";
import { useToast } from "@/hooks/use-toast";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export function Toaster() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={cn(
            "relative flex items-center justify-between gap-4 rounded-lg border p-4 shadow-lg transition-all",
            toast.variant === "destructive"
              ? "border-destructive bg-destructive text-destructive-foreground"
              : "border-border bg-card text-card-foreground"
          )}
        >
          <div className="flex flex-col gap-1">
            {toast.title && <p className="text-sm font-semibold">{toast.title}</p>}
            {toast.description && <p className="text-sm opacity-90">{toast.description}</p>}
          </div>
          <button
            onClick={() => dismiss(toast.id)}
            className="rounded-md p-1 hover:bg-foreground/10"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
