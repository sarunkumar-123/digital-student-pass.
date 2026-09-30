"use client";

import { useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import { useStore, type Application, type StudentMasterRecord } from "@/lib/store";
import {
  stageOf,
  stageLabel,
  stageBadgeClass,
  studentTimeline,
  isPaymentPending,
  isPassActive,
  isRejected,
} from "@/lib/application";
import {
  ArrowLeft,
  Search,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  CreditCard,
  Bus,
  Clock,
  ShieldCheck,
  Landmark,
} from "lucide-react";

const PASS_TYPES = ["College Student Concession Ticket", "Monthly Student Concession Pass"];

export default function ApplyPage() {
  const {
    session,
    masterRecords,
    applications,
    passes,
    getMasterRecord,
    submitPassApplication,
    studentPayForApplication,
  } = useStore();

  const [lookupId, setLookupId] = useState(session.id ?? "JAS001");
  const [found, setFound] = useState<StudentMasterRecord | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [passType, setPassType] = useState(PASS_TYPES[0]);
  const [confirmed, setConfirmed] = useState(false);
  const [submitted, setSubmitted] = useState<Application | null>(null);
  const [paying, setPaying] = useState(false);

  // Most recent application for this student (shared record across all portals).
  const myApplication =
    submitted ??
    applications.find((a) => a.studentId.trim().toLowerCase() === session.id?.trim().toLowerCase());
  const activePass = passes.find((p) => p.studentId === session.id && p.status === "active");

  const doLookup = () => {
    const rec = getMasterRecord(lookupId.trim());
    if (rec && rec.studentId.trim().toLowerCase() === session.id?.trim().toLowerCase()) {
      setFound(rec);
      setOrigin(rec.origin);
      setDestination(rec.destination);
      setPassType(rec.passType || PASS_TYPES[0]);
      setNotFound(false);
    } else if (rec) {
      // The master record belongs to another Student ID.
      setFound(null);
      setNotFound(true);
    } else {
      setFound(null);
      setNotFound(true);
    }
    setConfirmed(false);
  };

  const doSubmit = () => {
    if (!found) return;
    const app = submitPassApplication({
      studentId: found.studentId,
      origin,
      destination,
      passType,
    });
    if (app) setSubmitted(app);
  };

  const doPay = (appId: string) => {
    setPaying(true);
    setTimeout(() => {
      studentPayForApplication(appId, "upi");
      setPaying(false);
      setSubmitted(null); // refresh from shared store
    }, 900);
  };

  // ───────────────────────── Existing application / pass status ─────────────────────────
  if (myApplication || activePass) {
    const app = myApplication;
    const stage = app ? stageOf(app) : "PASS_ACTIVE";
    const timeline = app
      ? studentTimeline(app)
      : [true, true, true, true, true].map((d, i) => ({
          key: String(i),
          label: ["Application Submitted", "College Verified", "MTC Approved", "Payment Confirmed", "Digital Pass Activated"][i],
          done: d,
          current: false,
          rejected: false as boolean | undefined,
        }));
    return (
      <DashboardLayout>
        <div className="mb-5">
          <Link href="/dashboard/student" className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-[var(--mtc-blue)]">
            <ArrowLeft size={16} /> Back
          </Link>
          <h1 className="mt-1 text-2xl font-bold text-slate-900">Application Status</h1>
        </div>

        {app && (
          <div className="card mb-5 p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Application ID</div>
                <div className="text-xl font-bold text-slate-900">{app.applicationId}</div>
                <div className="mt-1 text-sm text-slate-600">
                  {app.studentId} · {app.studentName}
                </div>
                {activePass?.applicationId && (
                  <div className="mt-1 text-sm text-slate-600">
                    Linked Pass ID: <span className="font-semibold">{activePass.passId}</span>
                  </div>
                )}
              </div>
              <span className={stageBadgeClass(app)}>{stageLabel(app)}</span>
            </div>
            <dl className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
              <Info label="College" value={app.college} />
              <Info label="Course / Year" value={`${app.course ?? "—"} · ${app.year ?? "—"}`} />
              <Info label="Origin" value={app.origin} />
              <Info label="Destination" value={app.destination} />
              <Info label="Pass Type" value={app.passType ?? "College Student Concession Ticket"} />
              <Info label="Submitted Date" value={new Date(app.submittedAt).toLocaleString("en-IN")} />
            </dl>

            {isRejected(app) && (
              <div className="mt-4 rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-900">
                <div className="flex items-center gap-2 font-semibold">
                  <XCircle size={16} />
                  {stageOf(app) === "COLLEGE_REJECTED" ? "Application Rejected by College" : "Application Rejected by MTC"}
                </div>
                {app.rejectionReason && <div className="mt-1">Reason: {app.rejectionReason}</div>}
              </div>
            )}

            {isPaymentPending(app) && (
              <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-center gap-2 font-semibold text-amber-900">
                  <ShieldCheck size={16} /> MTC Approved — Payment Required
                </div>
                <p className="mt-1 text-sm text-amber-900">
                  Your concession pass has been approved by MTC. Complete the prototype payment
                  simulation (₹280, 10-stage SCT example — no real money is transferred) to activate your pass.
                </p>
                <button onClick={() => doPay(app.applicationId)} disabled={paying} className="btn-primary mt-3 disabled:opacity-50">
                  <CreditCard size={16} /> {paying ? "Processing…" : "Pay / Activate Pass"}
                </button>
              </div>
            )}

            {isPassActive(app) && (
              <div className="mt-4 flex flex-wrap items-center gap-3 rounded-md border border-emerald-200 bg-emerald-50 p-3">
                <span className="flex items-center gap-2 text-sm font-semibold text-emerald-900">
                  <CheckCircle2 size={16} /> Digital pass active
                </span>
                <Link href="/dashboard/student/pass" className="btn-primary !py-1.5 text-xs">
                  <Bus size={14} /> View Digital Pass
                </Link>
              </div>
            )}
          </div>
        )}

        {activePass && !app && (
          <div className="card mb-5 flex flex-wrap items-center justify-between gap-3 p-5">
            <div>
              <div className="text-sm font-semibold text-emerald-900">Your digital pass is active ({activePass.passId}).</div>
              <div className="text-sm text-slate-600">{activePass.origin} → {activePass.destination}</div>
            </div>
            <Link href="/dashboard/student/pass" className="btn-primary !py-1.5 text-xs"><Bus size={14} /> View Pass</Link>
          </div>
        )}

        {/* Timeline */}
        <div className="card p-5">
          <h2 className="font-bold text-slate-900">Application Timeline</h2>
          <ol className="mt-4 space-y-4">
            {timeline.map((t, i) => (
              <li key={t.key || i} className="flex items-start gap-3">
                {t.rejected ? (
                  <XCircle size={20} className="mt-0.5 flex-shrink-0 text-red-600" />
                ) : t.done ? (
                  <CheckCircle2 size={20} className="mt-0.5 flex-shrink-0 text-emerald-600" />
                ) : t.current ? (
                  <span className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center">
                    <Clock size={18} className="animate-pulse text-amber-500" />
                  </span>
                ) : (
                  <span className="mt-0.5 h-5 w-5 flex-shrink-0 rounded-full border-2 border-slate-300" />
                )}
                <div>
                  <div className={`text-sm font-medium ${t.done ? "text-slate-800" : t.current ? "text-amber-700" : t.rejected ? "text-red-700" : "text-slate-400"}`}>
                    {t.label}
                    {t.current && !t.done && " — in progress"}
                  </div>
                  {app?.history?.filter((h) => h.stage.replace(/_/g, " ").includes((t.label.split(" ")[0]))).map((h) => (
                    <div key={h.at + h.note} className="text-xs text-slate-500">
                      {new Date(h.at).toLocaleString("en-IN")} · {h.note}
                    </div>
                  ))}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </DashboardLayout>
    );
  }

  // ───────────────────────── New application: lookup → confirm → submit ─────────────────────────
  return (
    <DashboardLayout>
      <div className="mb-5">
        <Link href="/dashboard/student" className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-[var(--mtc-blue)]">
          <ArrowLeft size={16} /> Back
        </Link>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">Apply for Concession Pass</h1>
        <p className="text-sm text-slate-600">
          Enter your Student ID. The system finds your college-verified master record and prefills your details —
          you only confirm your route and pass type.
        </p>
      </div>

      {/* Step 1: lookup */}
      <div className="card mb-5 p-5">
        <h2 className="flex items-center gap-2 font-bold text-slate-900">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--mtc-blue)] text-xs text-white">1</span>
          Find your Student Master Record
        </h2>
        <div className="mt-3 flex flex-col gap-2 sm:flex-row">
          <input
            className="input-field flex-1"
            value={lookupId}
            onChange={(e) => setLookupId(e.target.value)}
            placeholder="e.g. JAS001"
          />
          <button onClick={doLookup} className="btn-primary whitespace-nowrap">
            <Search size={16} /> Find Student
          </button>
        </div>
        {notFound && (
          <div className="mt-3 flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
            <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
            <span>
              No college-verified master record found for <strong>{lookupId}</strong>. Please ask your college to
              include your details in the verified student list before applying. (Prototype demo: try{" "}
              <button className="font-semibold underline" onClick={() => setLookupId("JAS001")}>JAS001</button>.)
            </span>
          </div>
        )}
      </div>

      {/* Step 2: prefilled confirmation */}
      {found && (
        <div className="card p-5">
          <h2 className="flex items-center gap-2 font-bold text-slate-900">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--mtc-blue)] text-xs text-white">2</span>
            Confirm your details
          </h2>
          <div className="mt-4 grid gap-x-6 gap-y-3 text-sm sm:grid-cols-2">
            <Info label="Student ID" value={found.studentId} />
            <Info label="Student Name" value={found.studentName} />
            <Info label="College" value={found.collegeName} />
            <Info label="Course" value={found.course} />
            <Info label="Year of Study" value={found.yearOfStudy} />
            <Info label="Academic Year" value={found.academicYear} />
            <Info label="Mobile" value={found.mobile} />
            <Info label="Email" value={found.email} />
          </div>

          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div>
              <label className="label-field">Origin</label>
              <input className="input-field" value={origin} onChange={(e) => setOrigin(e.target.value)} />
            </div>
            <div>
              <label className="label-field">Destination</label>
              <input className="input-field" value={destination} onChange={(e) => setDestination(e.target.value)} />
            </div>
            <div>
              <label className="label-field">Pass Type</label>
              <select className="input-field" value={passType} onChange={(e) => setPassType(e.target.value)}>
                {PASS_TYPES.map((p) => <option key={p}>{p}</option>)}
              </select>
            </div>
          </div>

          <label className="mt-4 flex items-start gap-2 text-sm text-slate-700">
            <input type="checkbox" checked={confirmed} onChange={(e) => setConfirmed(e.target.checked)} className="mt-0.5" />
            I confirm that the above student information and route details are correct.
          </label>

          {/* Step 3 */}
          <h2 className="mt-5 flex items-center gap-2 font-bold text-slate-900">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--mtc-blue)] text-xs text-white">3</span>
            Submit
          </h2>
          <button onClick={doSubmit} disabled={!confirmed || !origin || !destination} className="btn-primary mt-3 disabled:opacity-50">
            Submit Concession Pass Application
          </button>
          <p className="mt-2 text-xs text-slate-500">
            After submission your college verifies the application, then MTC approves it. You cannot approve your own application.
          </p>
        </div>
      )}

      <div className="mt-4 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
        <Landmark size={14} /> Master records come from your college&apos;s verified Excel upload (prototype data stored in this browser).
      </div>
    </DashboardLayout>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</div>
      <div className="font-medium text-slate-900">{value || "—"}</div>
    </div>
  );
}
