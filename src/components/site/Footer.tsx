export function Footer() {
  return (
    <footer className="mt-20 bg-[color:var(--brand)] text-primary-foreground">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 text-center space-y-2">
        <p className="font-semibold">TrialBridge India © 2026</p>
        <p className="text-sm text-primary-foreground/85">
          Data sourced live from ClinicalTrials.gov — U.S. National Library of Medicine.
          Free patient awareness tool.
        </p>
      </div>
    </footer>
  );
}