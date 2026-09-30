"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import { useStore } from "@/lib/store";
import {
  ArrowLeft,
  CheckCheck,
  XCircle,
  Send,
  User,
  MapPin,
  FileText,
  X,
} from "lucide-react";
import { Suspense, useState } from "react";
import { isCollegePending, isMtcPending, stageOf } from "@/lib/application";

function VerificationContent() {
  const params = useSearchParams();
  const id = params.get("id");
  const {
    applications,
    collegeVerifyApplication,
    collegeRejectApplicationReason,
  } = useStore();
  const app = applications.find((a) => a.applicationId === id);
  const [showReject, setShowReject] = useState(false);
  const [reason, setReason] = useState("");

  if (!app) {
    return (
      <DashboardLayout>
        <div className="card p-6 text-center">
          Application not found.{" "}
          <Link href="/dashboard/college/applications" className="text-[var(--mtc-blue)] underline">
            Back to list
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const doVerify = () => {
    // College verification immediately forwards the SAME application record to MTC.
    collegeVerifyApplication(app.applicationId);
  };
  const doReject = () => {
    if (reason.trim()) {
      collegeRejectApplicationReason(app.applicationId, reason.trim());
      setShowReject(false);
      setReason("");
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-5">
        <Link href="/dashboard/college/applications" className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-[var(--mtc-blue)]">
          <ArrowLeft size={16} /> Back to applications
        </Link>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          Verification: {app.applicationId}
        </h1>
        <div className="mt-1 text-sm text-slate-600">
          Please confirm the student details against your college records.
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <h2 className="flex items-center gap-2 font-bold">
            <User size={18} className="text-[var(--mtc-blue)]" /> Student Details
          </h2>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            <Row label="Student Name" value={app.studentName} />
            <Row label="Student ID" value={app.studentId} />
            <Row label="Date of Birth" value={app.dob || "—"} />
            <Row label="Phone" value={app.phone || "—"} />
            <Row label="Email" value={app.email || "—"} />
            <Row label="College" value={app.college} />
            <Row label="Course" value={app.course || "—"} />
            <Row label="Year" value={app.year || "—"} />
            <Row label="Academic Year" value={app.academicYear || "—"} />
          </dl>

          <h2 className="mt-8 flex items-center gap-2 font-bold">
            <MapPin size={18} className="text-[var(--mtc-blue)]" /> Route Details
          </h2>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            <Row label="Origin" value={app.origin} />
            <Row label="Destination" value={app.destination} />
          </dl>

          <h2 className="mt-8 flex items-center gap-2 font-bold">
            <FileText size={18} className="text-[var(--mtc-blue)]" /> Documents
          </h2>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg border border-slate-200 p-3 text-sm">
              <div className="font-semibold">College ID Card</div>
              <div className="text-xs text-slate-500">uploaded_file_college_id.jpg (prototype)</div>
            </div>
            <div className="rounded-lg border border-slate-200 p-3 text-sm">
              <div className="font-semibold">Supporting document</div>
              <div className="text-xs text-slate-500">As applicable (prototype)</div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="font-bold">Verification Checklist</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              <li>✓ Student is currently studying</li>
              <li>✓ Student details are correct</li>
              <li>✓ Academic year is valid</li>
              <li>✓ Route information is correct</li>
            </ul>
            <p className="mt-3 text-xs text-slate-500">
              Student records are shown as imported/synchronized from your existing
              college student information system (simulated in this prototype) — staff
              primarily verify information rather than re-entering every detail. This
              portal does not replace your system of record.
            </p>
          </div>

          <div className="card p-5">
            <h3 className="font-bold">Decision</h3>
            <div className="mt-2 text-xs text-slate-500">Current status</div>
            <div className="mt-1 inline-flex items-center gap-1.5">
              <span className={`badge ${
                stageOf(app) === "COLLEGE_REJECTED" || stageOf(app) === "MTC_REJECTED" ? "badge-red"
                : isCollegePending(app) ? "badge-yellow"
                : "badge-green"
              }`}>
                {isMtcPending(app) ? "Verified · Sent to MTC" : isCollegePending(app) ? "Pending Verification" : stageOf(app).replace(/_/g, " ")}
              </span>
            </div>

            <div className="mt-4 space-y-2">
              {isCollegePending(app) && (
                <button onClick={doVerify} className="btn-success w-full">
                  <CheckCheck size={16} /> Verify &amp; Send to MTC
                </button>
              )}
              {isMtcPending(app) && (
                <div className="rounded-md bg-blue-50 p-3 text-sm text-blue-900">
                  <Send size={14} className="mr-1 inline" />
                  Verified and forwarded to MTC. The same application ({app.applicationId}) now appears in the MTC portal.
                </div>
              )}
              {isCollegePending(app) && (
                <button onClick={() => setShowReject(true)} className="btn-danger w-full">
                  <XCircle size={16} /> Reject
                </button>
              )}
              {stageOf(app) === "COLLEGE_REJECTED" && (
                <div className="rounded-md bg-red-50 p-3 text-sm text-red-900">
                  Rejected. {app.rejectionReason ? `Reason: ${app.rejectionReason}` : ""}
                </div>
              )}
            </div>
          </div>

          <div className="card p-5">
            <h3 className="font-bold">Important</h3>
            <p className="mt-2 text-xs text-slate-600">
              The college is responsible for student verification. MTC is
              responsible for final pass approval.
            </p>
          </div>
        </div>
      </div>

      {showReject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Reject {app.applicationId}</h3>
              <button onClick={() => setShowReject(false)} className="rounded-md p-1 hover:bg-slate-100"><X size={18} /></button>
            </div>
            <label className="label-field mt-3">Rejection reason (shown to student)</label>
            <textarea
              className="input-field min-h-[90px]"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Destination does not match college records."
            />
            <div className="mt-3 flex justify-end gap-2">
              <button onClick={() => setShowReject(false)} className="btn-secondary">Cancel</button>
              <button onClick={doReject} disabled={!reason.trim()} className="btn-danger disabled:opacity-50">Confirm Rejection</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-0.5 font-medium text-slate-900">{value}</div>
    </div>
  );
}

export default function VerificationPage() {
  return (
    <Suspense fallback={<DashboardLayout><div className="p-6">Loading…</div></DashboardLayout>}>
      <VerificationContent />
    </Suspense>
  );
}
