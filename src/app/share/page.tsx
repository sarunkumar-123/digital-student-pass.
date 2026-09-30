import PublicLayout from "@/components/PublicLayout";
import Link from "next/link";
import { Download, ExternalLink, Globe, Archive, Usb, Mail, MessageCircle } from "lucide-react";

export const metadata = { title: "Share this prototype — MTC Digital Student Pass" };

export default function SharePage() {
  return (
    <PublicLayout>
      <section className="bg-gradient-to-b from-[var(--mtc-blue-light)] to-white py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-sm font-semibold uppercase tracking-wider text-[var(--mtc-blue)]">
            Share with friends / faculty / judges
          </div>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
            How to share this prototype
          </h1>
          <p className="mt-3 text-slate-700">
            This is a fully static demo — no server, no database, no account needed.
            Everything runs locally in the viewer's browser. Pick any option below.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl space-y-5 px-4 py-10 sm:px-6">
        {/* Option 1 */}
        <div className="card p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
              <Globe size={22} />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-slate-900">
                Option 1 — Send them the live preview URL
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Just copy and paste the preview URL from your browser's address bar.
                Your friends can open it on any phone, tablet, or laptop. They can
                click the demo login buttons or use:
              </p>
              <ul className="mt-3 space-y-1 text-sm text-slate-700">
                <li>• <strong>Student:</strong> <code className="rounded bg-slate-100 px-1.5">/demo/student</code></li>
                <li>• <strong>(a) College verifier:</strong> <code className="rounded bg-slate-100 px-1.5">/demo/college</code></li>
                <li>• <strong>(b) MTC authority:</strong> <code className="rounded bg-slate-100 px-1.5">/demo/mtc</code></li>
              </ul>
              <p className="mt-3 text-xs text-amber-700">
                Note: preview URLs from the sandbox are temporary. For a permanent
                URL you control, see Option 2.
              </p>
            </div>
          </div>
        </div>

        {/* Option 2 */}
        <div className="card p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
              <ExternalLink size={22} />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-slate-900">
                Option 2 — Deploy free to Vercel / Netlify (permanent public URL)
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Deploy in 1 click to get a permanent shareable URL like{" "}
                <code className="rounded bg-slate-100 px-1.5">mtc-pass.vercel.app</code>.
                The prototype is 100% static (no database needed), so free hosting works forever.
              </p>
              <ol className="mt-3 list-decimal space-y-1.5 pl-5 text-sm text-slate-700">
                <li>Download the source ZIP (Option 3 below) and upload it to GitHub / Vercel / Netlify.</li>
                <li>No environment variables or database setup are required.</li>
                <li>After deploy, share the URL and append <code className="rounded bg-slate-100 px-1">/demo/college</code> or <code className="rounded bg-slate-100 px-1">/demo/mtc</code> to link directly to each role.</li>
              </ol>
              <div className="mt-3 flex flex-wrap gap-2">
                <a href="https://vercel.com/new" target="_blank" rel="noreferrer" className="btn-secondary !py-2 text-xs">Deploy to Vercel ↗</a>
                <a href="https://app.netlify.com/start" target="_blank" rel="noreferrer" className="btn-secondary !py-2 text-xs">Deploy to Netlify ↗</a>
              </div>
            </div>
          </div>
        </div>

        {/* Option 3 */}
        <div className="card p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-purple-100 text-purple-700">
              <Archive size={22} />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-slate-900">
                Option 3 — Download as a ZIP and share directly
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                This prototype is a fully static site. You can zip the built
                site and send it via WhatsApp, Gmail, Google Drive, USB stick —
                your friend just unzips and double-clicks <code className="rounded bg-slate-100 px-1">index.html</code>.
                No install, no internet required after download.
              </p>
              <p className="mt-2 text-sm text-slate-600">
                If you have the project folder from this sandbox, the static
                site lives in the <code className="rounded bg-slate-100 px-1">out/</code> directory after running{" "}
                <code className="rounded bg-slate-100 px-1">npm run build</code>.
                Zip that folder and share it.
              </p>
            </div>
          </div>
        </div>

        {/* Option 4 */}
        <div className="card p-6">
          <div className="flex items-start gap-4">
            <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
              <Download size={22} />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-bold text-slate-900">
                Option 4 — Run locally on your own computer
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                If your friend has Node.js installed:
              </p>
              <pre className="mt-2 overflow-x-auto rounded-lg bg-slate-900 p-3 text-xs text-slate-100">
{`# 1. extract the project zip
cd mtc-digital-student-pass
npm install
npm run build
npm start      # opens at http://localhost:3000`}
              </pre>
              <p className="mt-2 text-sm text-slate-600">
                All demo data is in the browser — no database needed.
              </p>
            </div>
          </div>
        </div>

        {/* Technology / simulation status */}
        <div className="card p-6">
          <h2 className="text-lg font-bold text-slate-900">What's real vs simulated in this prototype</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr><th>Area</th><th>Current prototype</th></tr>
              </thead>
              <tbody>
                <tr><td className="font-medium">Frontend</td><td>Next.js, React, TypeScript, Tailwind CSS</td></tr>
                <tr><td className="font-medium">Data storage</td><td>Browser localStorage (mock demo data)</td></tr>
                <tr><td className="font-medium">Database</td><td>Not connected. PostgreSQL + Drizzle schema is prepared for a future backend</td></tr>
                <tr><td className="font-medium">OTP</td><td>Simulated — no real SMS/email gateway or MTC OTP API</td></tr>
                <tr><td className="font-medium">Payment</td><td>Payment simulation — no UPI/bank/gateway; no money is transferred</td></tr>
                <tr><td className="font-medium">MTC integration</td><td>No live MTC API/database; the authority dashboard is a proposed-workflow representation</td></tr>
                <tr><td className="font-medium">Bus/service ID</td><td>Recorded and associated with the journey; not validated against a live route database</td></tr>
                <tr><td className="font-medium">Daily journey limit</td><td>Prototype-configured maximum of 4 journeys/day (adjustable); not an official MTC rule</td></tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick tips */}
        <div className="card p-6">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
            <MessageCircle size={20} className="text-[var(--mtc-blue)]" />
            Quick links to share
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Add these to the end of any URL (live preview, your own deployed URL, or local host):
          </p>
          <div className="mt-3 grid gap-2 sm:grid-cols-3">
            <Link href="/demo" className="rounded-lg border border-slate-200 p-3 text-sm hover:border-[var(--mtc-blue)] hover:bg-[var(--mtc-blue-light)]">
              <div className="font-semibold">/demo</div>
              <div className="text-xs text-slate-500">Index of all portals</div>
            </Link>
            <Link href="/demo/college" className="rounded-lg border border-slate-200 p-3 text-sm hover:border-emerald-500 hover:bg-emerald-50">
              <div className="font-semibold text-emerald-800">/demo/college</div>
              <div className="text-xs text-slate-500">Goes directly to portal (a)</div>
            </Link>
            <Link href="/demo/mtc" className="rounded-lg border border-slate-200 p-3 text-sm hover:border-amber-500 hover:bg-amber-50">
              <div className="font-semibold text-amber-800">/demo/mtc</div>
              <div className="text-xs text-slate-500">Goes directly to portal (b)</div>
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
