import Link from "next/link";

export default function PublicFooter() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 md:grid-cols-4">
          <div>
            <div className="text-base font-bold text-slate-900">
              MTC Digital Student Pass
            </div>
            <p className="mt-2 text-sm text-slate-600">
              A prototype concept for digitizing the College Student Concession
              Ticket process of Chennai Metropolitan Transport Corporation.
            </p>
            <p className="mt-3 text-xs font-semibold uppercase tracking-wide text-amber-700">
              Not an official MTC service
            </p>
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">Students</div>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li><Link href="/login" className="hover:text-[var(--mtc-blue)]">Login</Link></li>
              <li><Link href="/how-it-works" className="hover:text-[var(--mtc-blue)]">How it works</Link></li>
              <li><Link href="/no-smartphone" className="hover:text-[var(--mtc-blue)]">No smartphone?</Link></li>
              <li><Link href="/privacy" className="hover:text-[var(--mtc-blue)]">Privacy & Security</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">Partners</div>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li><Link href="/login" className="hover:text-[var(--mtc-blue)]">College Login</Link></li>
              <li><Link href="/login" className="hover:text-[var(--mtc-blue)]">MTC Authority Login</Link></li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-semibold text-slate-900">Support</div>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li><Link href="/help" className="hover:text-[var(--mtc-blue)]">Help & FAQ</Link></li>
              <li><Link href="/help" className="hover:text-[var(--mtc-blue)]">AI Support</Link></li>
              <li><Link href="/privacy" className="hover:text-[var(--mtc-blue)]">Data Privacy</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 flex flex-col items-start justify-between gap-3 border-t border-slate-200 pt-6 text-xs text-slate-500 md:flex-row md:items-center">
          <div>© {new Date().getFullYear()} MTC Digital Student Pass — Prototype Demonstration.</div>
          <div className="flex gap-4">
            <span>Chennai Metropolitan Transport Corporation (concept)</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
