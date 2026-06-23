import { Stethoscope } from "lucide-react";

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
        <Stethoscope className="h-5 w-5" strokeWidth={2.4} />
      </div>
      <div className="leading-tight">
        <div className="font-bold text-[color:var(--brand-dark)] text-base sm:text-lg">
          TrialBridge India
        </div>
        {!compact && (
          <div className="text-[11px] sm:text-xs text-muted-foreground">
            Clinical Trial Discovery Platform
          </div>
        )}
      </div>
    </div>
  );
}