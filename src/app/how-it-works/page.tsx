import Link from "next/link";
import PublicLayout from "@/components/PublicLayout";
import {
  Smartphone,
  Building2,
  Landmark,
  CreditCard,
  Bus,
  CheckCheck,
  ArrowRight,
  Shield,
  BadgeCheck,
} from "lucide-react";

const steps = [
  {
    icon: <Smartphone size={28} />,
    title: "Step 1: Student Application",
    desc: "Student logs in, fills in personal, college, course, and route details, uploads required identity/supporting documents as applicable, and submits. Status becomes Pending College Verification.",
  },
  {
    icon: <Building2 size={28} />,
    title: "Step 2: College Verification",
    desc: "The college reviews the application and confirms: the student is currently studying, details match, the academic year is valid, and route information is correct. The college verifies and forwards to MTC, or rejects with reason.",
  },
  {
    icon: <Landmark size={28} />,
    title: "Step 3: MTC Approval",
    desc: "MTC receives the verified application, reviews it, and approves or rejects. MTC holds final approval authority. Approval enables payment.",
  },
  {
    icon: <CreditCard size={28} />,
    title: "Step 4: Payment & Activation",
    desc: "Student pays the monthly amount online (₹280 shown as 10-stage SCT example). On successful payment, the digital pass is activated. Failed payments trigger verification/refund flow.",
  },
  {
    icon: <Bus size={28} />,
    title: "Step 5: Travel Digitally",
    desc: "Student opens the digital pass on their phone. The conductor verifies visually: photo, name, Student ID, college, validity dates, route, and green VALID status. No QR code required.",
  },
];

export default function HowItWorksPage() {
  return (
    <PublicLayout>
      <section className="border-b border-slate-200 bg-gradient-to-b from-[var(--mtc-blue-light)] to-white py-14">
        <div className="mx-auto max-w-4xl px-4 text-center sm:px-6">
          <div className="text-sm font-semibold uppercase tracking-wider text-[var(--mtc-blue)]">
            Workflow
          </div>
          <h1 className="mt-2 text-4xl font-bold text-slate-900">
            How the Digital Student Pass Works
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            The digital system preserves the existing responsibilities of
            students, colleges, and MTC — it simply makes the steps faster,
            trackable, and paperless.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        {/* Flow diagram */}
        <div className="card mb-12 p-6">
          <div className="mb-3 text-sm font-semibold uppercase tracking-wider text-slate-500">
            End-to-end flow
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 text-sm font-semibold text-slate-800">
            {["Student", "College", "MTC", "Payment", "Digital Pass", "Travel"].map(
              (label, i, arr) => (
                <div key={label} className="flex items-center gap-2">
                  <div className="rounded-full bg-[var(--mtc-blue)] px-4 py-2 text-white shadow-sm">
                    {label}
                  </div>
                  {i < arr.length - 1 && (
                    <ArrowRight size={18} className="text-slate-400" />
                  )}
                </div>
              )
            )}
          </div>
        </div>

        {/* Steps */}
        <ol className="relative space-y-8 border-l-2 border-slate-200 pl-8">
          {steps.map((s, i) => (
            <li key={i} className="relative">
              <div className="absolute -left-[41px] flex h-10 w-10 items-center justify-center rounded-full border-4 border-white bg-[var(--mtc-blue)] text-white shadow-sm">
                <span className="text-sm font-bold">{i + 1}</span>
              </div>
              <div className="card p-6">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--mtc-blue-light)] text-[var(--mtc-blue-dark)]">
                    {s.icon}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      {s.title}
                    </h2>
                    <p className="mt-2 text-slate-600">{s.desc}</p>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* Features */}
      <section className="border-t border-slate-200 bg-white py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-6 md:grid-cols-2">
            <div className="card p-6">
              <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                <CheckCheck size={20} className="text-emerald-600" /> What stays the same
              </h3>
              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                <li>✓ College verifies student enrollment and details.</li>
                <li>✓ MTC gives final approval for the concession pass.</li>
                <li>✓ Monthly fees remain based on stage count.</li>
                <li>✓ Conductor still verifies the pass visually.</li>
                <li>✓ Students without smartphones can use the existing physical process.</li>
              </ul>
            </div>
            <div className="card p-6">
              <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
                <BadgeCheck size={20} className="text-blue-600" /> What becomes digital
              </h3>
              <ul className="mt-4 space-y-2 text-sm text-slate-700">
                <li>• Online application submission and document upload.</li>
                <li>• Digital tracking of application status at every stage.</li>
                <li>• Online payment with digital receipts.</li>
                <li>• Digital pass displayed on the student's phone.</li>
                <li>• Online monthly renewal and route-change requests.</li>
                <li>• Notifications and AI assistance for common queries.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-5xl px-4 py-14 sm:px-6">
        <div className="notice-banner mb-8 flex items-start gap-3">
          <Shield size={18} className="mt-0.5 flex-shrink-0 text-amber-700" />
          <div>
            <strong>Prototype notice:</strong> ₹280 is used as an example of a
            10-stage SCT fare only. Actual fares vary. Journey recording is a
            proposed feature, not an existing MTC rule.
          </div>
        </div>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/login" className="btn-primary">Try the prototype</Link>
          <Link href="/student-pass" className="btn-secondary">About the Student Pass</Link>
        </div>
      </section>
    </PublicLayout>
  );
}
