import Link from "next/link";
import PublicLayout from "@/components/PublicLayout";
import { Bus, ShieldCheck, Ban, CheckCircle2, Info } from "lucide-react";

export default function StudentPassPage() {
  return (
    <PublicLayout>
      <section className="bg-gradient-to-b from-[var(--mtc-blue-light)] to-white py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-sm font-semibold uppercase tracking-wider text-[var(--mtc-blue)]">
            About the pass
          </div>
          <h1 className="mt-2 text-4xl font-bold text-slate-900">
            College Student Concession Ticket (SCT)
          </h1>
          <p className="mt-4 text-lg text-slate-700">
            The SCT is a concessional bus pass issued by Chennai Metropolitan
            Transport Corporation to eligible college students. This prototype
            proposes a digital version of that existing process.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-12 sm:px-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div className="card p-6">
            <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900">
              <CheckCircle2 size={20} className="text-emerald-600" />
              Proposed digital features
            </h2>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              <li>• Online application through college verification</li>
              <li>• Real-time status tracking</li>
              <li>• Digital pass on your phone</li>
              <li>• Online monthly renewal</li>
              <li>• Digital route change requests</li>
              <li>• Offline visibility of already-activated pass</li>
              <li>• Notification reminders</li>
              <li>• AI assistance and support ticketing</li>
            </ul>
          </div>

          <div className="card p-6">
            <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900">
              <ShieldCheck size={20} className="text-blue-600" />
              Verification method (proposed)
            </h2>
            <p className="mt-3 text-sm text-slate-700">
              No QR code is required for the proposed digital pass. The
              conductor verifies the pass visually using:
            </p>
            <ul className="mt-3 space-y-1 text-sm text-slate-700">
              <li>1. Student photo</li>
              <li>2. Name and Student ID</li>
              <li>3. College name</li>
              <li>4. Validity dates</li>
              <li>5. Origin and destination</li>
              <li>6. Green VALID status indicator</li>
            </ul>
          </div>

          <div className="card p-6">
            <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900">
              <Info size={20} className="text-amber-600" />
              Fares (illustrative)
            </h2>
            <p className="mt-3 text-sm text-slate-700">
              The fare amount depends on the number of stages as per MTC's
              existing fare structure. Throughout this prototype, we use
              <strong> ₹280</strong> as a <strong>10-stage SCT example</strong>,
              not as a fixed universal student pass price.
            </p>
          </div>

          <div className="card p-6">
            <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900">
              <Ban size={20} className="text-red-600" />
              What this prototype is not
            </h2>
            <ul className="mt-4 space-y-2 text-sm text-slate-700">
              <li>✗ Not an official MTC website or service.</li>
              <li>✗ Not replacing college verification or MTC approval.</li>
              <li>✗ Not replacing the college's own student database.</li>
              <li>✗ Not forcing every student to use a smartphone.</li>
              <li>✗ Not a complete payment/accounting system.</li>
            </ul>
          </div>
        </div>

        <div className="mt-10 rounded-xl border border-slate-200 bg-slate-50 p-6">
          <div className="flex items-start gap-3">
            <Bus size={22} className="mt-0.5 flex-shrink-0 text-[var(--mtc-blue)]" />
            <div>
              <h3 className="font-bold text-slate-900">One Student ID, One Active Pass</h3>
              <p className="mt-1 text-sm text-slate-700">
                The proposed system enforces that each student can only have
                one active digital pass at a time. When changing college or
                route, the old pass is deactivated before the new one is
                activated.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/how-it-works" className="btn-secondary">How it works</Link>
          <Link href="/login" className="btn-primary">Apply / Login</Link>
        </div>
      </section>
    </PublicLayout>
  );
}
