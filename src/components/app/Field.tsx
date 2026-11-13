import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";

export function Field({ id, label, optional, children }: { id: string; label: string; optional?: boolean; children: ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs font-semibold text-muted-foreground">
        {label}
        {optional && <span className="ml-1 font-normal opacity-70">(nem kötelező)</span>}
      </Label>
      {children}
    </div>
  );
}

export const inputClass = "h-12 rounded-xl bg-surface text-base";
