import PublicLayout from "@/components/PublicLayout";
import Link from "next/link";
import { PhoneOff, Bus, CheckCircle2, Info } from "lucide-react";

export default function NoSmartphonePage() {
  return (
    <PublicLayout>
      <section className="bg-gradient-to-b from-[var(--mtc-blue-light)] to-white py-14">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm text-[var(--mtc-blue)]">
            <PhoneOff size={26} />
          </div>
          <h1 className="mt-5 text-4xl font-bold text-slate-900">
            Can't use the digital system?
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-slate-700">
            No problem. The digital student pass is an <strong>additional
            option</strong>. Students without a smartphone or without reliable
            internet can continue using the <strong>existing normal MTC student
            pass procedure</strong>.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <div className="card p-6">
          <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900">
            <Bus size={22} className="text-[var(--mtc-blue)]" />
            Existing physical process remains available
          </h2>
          <ul className="mt-4 space-y-2 text-sm text-slate-700">
            <li className="flex gap-2"><CheckCircle2 size={16} className="mt-0.5 flex-shrink-0 text-emerald-600" /> Apply through your college office as you do today.</li>
            <li className="flex gap-2"><CheckCircle2 size={16} className="mt-0.5 flex-shrink-0 text-emerald-600" /> College verifies and forwards to MTC on your behalf.</li>
            <li className="flex gap-2"><CheckCircle2 size={16} className="mt-0.5 flex-shrink-0 text-emerald-600" /> MTC issues the physical concession pass.</li>
            <li className="flex gap-2"><CheckCircle2 size={16} className="mt-0.5 flex-shrink-0 text-emerald-600" /> Show the physical pass to the conductor while travelling.</li>
          </ul>
        </div>

        <div className="mt-6 card p-6">
          <h2 className="flex items-center gap-2 text-xl font-bold text-slate-900">
            <Info size={22} className="text-amber-600" />
            About this prototype
          </h2>
          <p className="mt-3 text-sm text-slate-700">
            The digital system is proposed as a convenient alternative to
            reduce queues and repeated visits for students who do have access
            to a smartphone. It is not intended to force every student to use a
            smartphone, nor to replace any existing physical channels.
          </p>
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/" className="btn-secondary">Back to home</Link>
          <Link href="/how-it-works" className="btn-primary">How the digital option works</Link>
        </div>
      </section>
    </PublicLayout>
  );
}
