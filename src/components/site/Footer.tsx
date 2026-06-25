import { Link } from "@tanstack/react-router";

export function Footer() {
  return (
    <footer className="mt-20 text-primary-foreground" style={{ background: "linear-gradient(135deg, #2d7a4f 0%, #1f5e3d 60%, #0f4c81 130%)" }}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-10 text-center space-y-2">
        <p className="font-semibold">TrialBridge India © 2026</p>
        <p className="text-sm text-primary-foreground/85">
          Data sourced live from ClinicalTrials.gov — U.S. National Library of Medicine.
          Free patient awareness tool.
        </p>
        <div className="pt-2 flex flex-wrap justify-center gap-x-5 gap-y-1 text-sm">
          <Link to="/privacy" className="text-primary-foreground/90 hover:text-primary-foreground hover:underline">Privacy Policy</Link>
          <Link to="/terms" className="text-primary-foreground/90 hover:text-primary-foreground hover:underline">Terms & Conditions</Link>
        </div>
      </div>
    </footer>
  );
}