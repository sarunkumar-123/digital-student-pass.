import Link from "next/link";
import PublicLayout from "@/components/PublicLayout";
import {
  Bus,
  Smartphone,
  CheckCircle2,
  Shield,
  Clock,
  Users,
  Building2,
  BadgeCheck,
  Landmark,
  CreditCard,
  QrCode,
} from "lucide-react";

export default function HomePage() {
  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[var(--mtc-blue)] via-[var(--mtc-blue)] to-[var(--mtc-blue-dark)] text-white">
        <div className="absolute inset-0 opacity-10 pass-stripes"></div>
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-2 md:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
              <span className="h-2 w-2 rounded-full bg-emerald-300"></span>
              Prototype • Proposed Digital System
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-tight sm:text-5xl md:text-[3.25rem]">
              Your Student Bus Pass, <br />
              Now Digital.
            </h1>
            <p className="mt-5 max-w-xl text-lg text-white/85">
              Apply through your college, get MTC approval, and access your
              student concession pass digitally — on your phone.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/login"
                className="inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-[var(--mtc-blue-dark)] shadow-lg hover:bg-slate-100"
              >
                <Smartphone size={18} /> Student Login
              </Link>
              <Link
                href="/how-it-works"
                className="inline-flex items-center gap-2 rounded-lg border border-white/40 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur hover:bg-white/20"
              >
                How It Works
              </Link>
            </div>

            <div className="mt-10 grid max-w-lg grid-cols-3 gap-2 sm:gap-4 text-sm">
              <div className="rounded-lg bg-white/10 p-2.5 sm:p-3 backdrop-blur">
                <div className="text-lg sm:text-xl font-bold">₹280</div>
                <div className="text-[10px] sm:text-xs text-white/75">10-stage SCT example</div>
              </div>
              <div className="rounded-lg bg-white/10 p-2.5 sm:p-3 backdrop-blur">
                <div className="text-lg sm:text-xl font-bold">3-step</div>
                <div className="text-[10px] sm:text-xs text-white/75">Verify → Approve → Pay</div>
              </div>
              <div className="rounded-lg bg-white/10 p-2.5 sm:p-3 backdrop-blur">
                <div className="text-lg sm:text-xl font-bold">Offline</div>
                <div className="text-[10px] sm:text-xs text-white/75">Pass viewable offline</div>
              </div>
            </div>
          </div>

          {/* Phone mockup */}
          <div className="relative flex items-center justify-center py-4">
            <div className="relative h-[480px] w-[240px] sm:h-[520px] sm:w-[260px] rounded-[40px] sm:rounded-[44px] border-[8px] sm:border-[10px] border-slate-900 bg-slate-900 shadow-2xl">
              <div className="absolute left-1/2 top-2 z-10 h-5 w-24 -translate-x-1/2 rounded-full bg-slate-900"></div>
              <div className="h-full w-full overflow-hidden rounded-[32px] bg-white">
                <div className="pass-card pass-stripes h-full p-4">
                  <div className="flex items-center justify-between text-[10px] font-semibold uppercase tracking-wider text-white/85">
                    <span>MTC Chennai</span>
                    <span className="inline-flex items-center gap-1">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-300"></span>
                      VALID
                    </span>
                  </div>
                  <div className="mt-2 text-xs font-bold uppercase tracking-wider text-white/80">
                    Digital Student Pass
                  </div>
                  <div className="mt-3 flex gap-3">
                    <div className="flex h-16 w-14 items-center justify-center rounded-md bg-white/20 text-2xl font-bold">
                      AK
                    </div>
                    <div className="text-[11px] leading-tight">
                      <div className="text-base font-bold leading-none">Arun Kumar</div>
                      <div className="mt-1 text-white/80">JAS001</div>
                      <div className="text-white/80">B.Com Accounting &amp; Finance • Year 3</div>
                    </div>
                  </div>
                  <div className="mt-3 rounded-md bg-white/10 p-2 text-[10px]">
                    <div className="text-white/75">College</div>
                    <div className="font-semibold">Jeppiaar College of Arts & Science</div>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-[10px]">
                    <div className="rounded-md bg-white/10 p-2">
                      <div className="text-white/75">From</div>
                      <div className="font-semibold">Medavakkam</div>
                    </div>
                    <div className="rounded-md bg-white/10 p-2">
                      <div className="text-white/75">To</div>
                      <div className="font-semibold">Padur</div>
                    </div>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-[10px]">
                    <div className="rounded-md bg-white/10 p-2">
                      <div className="text-white/75">Valid From</div>
                      <div className="font-semibold">11 Sep 2026</div>
                    </div>
                    <div className="rounded-md bg-white/10 p-2">
                      <div className="text-white/75">Valid Until</div>
                      <div className="font-semibold">10 Oct 2026</div>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-center rounded-md border border-dashed border-white/30 py-2 text-[10px] font-medium text-white/85">
                    Conductor: Visual Verification (Photo • ID • Route • Status)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Notice */}
      <section className="mx-auto max-w-7xl px-4 py-6 sm:px-6">
        <div className="notice-banner flex items-start gap-3">
          <Shield size={18} className="mt-0.5 flex-shrink-0 text-amber-700" />
          <div>
            <strong>Important notice:</strong> This is a prototype concept for
            digitalization of the MTC College Student Concession Ticket process.
            It is <strong>not an official MTC application</strong>. The existing
            responsibilities of students, colleges, and MTC are preserved.
          </div>
        </div>
      </section>

      {/* Process overview */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6">
        <div className="mb-10 text-center">
          <div className="text-sm font-semibold uppercase tracking-wider text-[var(--mtc-blue)]">
            The Process
          </div>
          <h2 className="mt-2 text-3xl font-bold text-slate-900">
            College verifies • MTC approves • You travel
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-slate-600">
            The proposed digital system streamlines the process while keeping
            all existing responsibilities intact.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-5">
          {[
            { icon: <Smartphone size={22} />, title: "Student Applies", text: "Submit details and route via the portal." },
            { icon: <Building2 size={22} />, title: "College Verifies", text: "College confirms enrollment and details." },
            { icon: <Landmark size={22} />, title: "MTC Approves", text: "MTC reviews and authorizes the pass." },
            { icon: <CreditCard size={22} />, title: "Pay & Activate", text: "Online payment activates the digital pass." },
            { icon: <Bus size={22} />, title: "Travel Digitally", text: "Show pass on phone to conductor." },
          ].map((s, i) => (
            <div key={i} className="card p-5 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--mtc-blue-light)] text-[var(--mtc-blue-dark)]">
                {s.icon}
              </div>
              <div className="mt-3 text-xs font-semibold text-slate-500">
                STEP {i + 1}
              </div>
              <div className="mt-1 font-bold text-slate-900">{s.title}</div>
              <div className="mt-1 text-sm text-slate-600">{s.text}</div>
            </div>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href="/how-it-works" className="btn-secondary">
            See full workflow
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-slate-900">
              Key features of the proposal
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {[
              {
                icon: <CheckCircle2 size={20} />,
                title: "Retains existing roles",
                text: "College still verifies; MTC still approves. The digital system does not replace responsibilities.",
              },
              {
                icon: <Smartphone size={20} />,
                title: "Digital pass on phone",
                text: "No QR required — visual verification by conductor: photo, ID, name, college, validity, route, VALID status.",
              },
              {
                icon: <Clock size={20} />,
                title: "Online renewal",
                text: "Renew monthly with UPI, card or net banking. Validity updates automatically after payment.",
              },
              {
                icon: <Shield size={20} />,
                title: "Offline capable",
                text: "Once activated, pass stays available locally. Journey entries queue and sync when online returns.",
              },
              {
                icon: <Users size={20} />,
                title: "Login on another device",
                text: "If phone is lost/dead, log in elsewhere with OTP. Log out after using a shared device.",
              },
              {
                icon: <BadgeCheck size={20} />,
                title: "Inclusive by design",
                text: "Students without smartphones continue using the existing normal MTC pass procedure.",
              },
            ].map((f, i) => (
              <div key={i} className="card p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--mtc-blue-light)] text-[var(--mtc-blue-dark)]">
                  {f.icon}
                </div>
                <div className="mt-4 text-lg font-bold text-slate-900">
                  {f.title}
                </div>
                <p className="mt-2 text-sm text-slate-600">{f.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Role quick links */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-slate-900">Portals for every role</h2>
          <p className="mt-2 text-slate-600">
            Use demo credentials to explore the prototype.
          </p>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
            <div className="card p-6">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                <GraduationCapIcon />
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-900">Student</h3>
              <p className="mt-1 text-sm text-slate-600">
                Apply, track status, pay, view digital pass, renew, record journeys.
              </p>
              <div className="mt-4 rounded-md bg-slate-50 p-3 font-mono text-[11px] text-slate-700">
                <div><strong>ID:</strong> JAS001</div>
                <div><strong>Password:</strong> student123</div>
                <div className="mt-1 text-[var(--mtc-blue)]">
                  <strong>Direct URL:</strong> /demo/student
                </div>
              </div>
              <div className="mt-4 flex gap-2">
                <Link href="/demo/student" className="btn-primary flex-1">
                  Student Login
                </Link>
              </div>
            </div>

            <div className="card p-6 ring-2 ring-emerald-200">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                <Building2 size={22} />
              </div>
              <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-800">
                (a) College Portal
              </div>
              <h3 className="mt-2 text-lg font-bold text-slate-900">College Verifier</h3>
              <p className="mt-1 text-sm text-slate-600">
                Verify student details, forward to MTC, manage academic year checks.
              </p>
              <div className="mt-4 rounded-md bg-slate-50 p-3 font-mono text-[11px] text-slate-700">
                <div><strong>College:</strong> Jeppiaar College of Arts and Science</div>
                <div><strong>Password:</strong> college123</div>
                <div className="mt-1 text-emerald-700">
                  <strong>Direct URL:</strong>
                  <a href="/demo/college" className="ml-1 underline break-all">/demo/college</a>
                </div>
              </div>
              <Link href="/demo/college" className="btn-success mt-4 w-full">
                College Login →
              </Link>
            </div>

            <div className="card p-6 ring-2 ring-amber-200">
              <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                <Landmark size={22} />
              </div>
              <div className="mt-1 inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-800">
                (b) MTC Authority
              </div>
              <h3 className="mt-2 text-lg font-bold text-slate-900">MTC Authority</h3>
              <p className="mt-1 text-sm text-slate-600">
                Review verified applications, approve/reject passes, view payments and stats.
              </p>
              <div className="mt-4 rounded-md bg-slate-50 p-3 font-mono text-[11px] text-slate-700">
                <div><strong>Role:</strong> MTC Authority</div>
                <div><strong>Password:</strong> mtc123</div>
                <div className="mt-1 text-amber-700">
                  <strong>Direct URL:</strong>
                  <a href="/demo/mtc" className="ml-1 underline break-all">/demo/mtc</a>
                </div>
              </div>
              <Link href="/demo/mtc" className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-lg bg-amber-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-amber-700">
                MTC Login →
              </Link>
            </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[var(--mtc-blue)] py-14 text-white">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-5 px-4 text-center sm:px-6">
          <h2 className="text-3xl font-bold">Ready to see the prototype?</h2>
          <p className="text-white/85">
            Login as a student, college verifier, or MTC authority to walk
            through the proposed digital workflow.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/login" className="rounded-lg bg-white px-6 py-3 font-semibold text-[var(--mtc-blue-dark)] hover:bg-slate-100">
              Get Started
            </Link>
            <Link href="/student-pass" className="rounded-lg border border-white/40 px-6 py-3 font-semibold text-white hover:bg-white/10">
              About the Student Pass
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

function GraduationCapIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}
