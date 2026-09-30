"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { useStore } from "@/lib/store";
import { ArrowLeft, CheckCircle2, XCircle, Undo2, Send } from "lucide-react";

function ViewContent() {
  const params = useSearchParams();
  const id = params.get("id");
  const { bulkSubmissions, decideBulkSubmission } = useStore();
  const sub = bulkSubmissions.find((b) => b.submissionId === id);
  const [reason, setReason] = useState("");
  const [correctionOpen, setCorrectionOpen] = useState(false);

  if (!sub) {
    return (
      <DashboardLayout>
        <div className="card p-6 text-center text-slate-600">
          Submission not found.{" "}
          <Link href="/dashboard/mtc/submissions" className="text-[var(--mtc-blue)] underline">Back to submissions</Link>
        </div>
      </DashboardLayout>
    );
  }

  const decide = (decision: "approved" | "rejected" | "correction_required") => {
    decideBulkSubmission(sub.submissionId, decision, reason || undefined);
    setCorrectionOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="mb-5">
        <Link href="/dashboard/mtc/submissions" className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-[var(--mtc-blue)]">
          <ArrowLeft size={16} /> Back to submissions
        </Link>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">College Submission Review</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-1">
          <div className="card p-5">
            <h2 className="font-bold">Summary</h2>
            <dl className="mt-3 space-y-2 text-sm">
              <Row label="College" value={sub.collegeName} />
              <Row label="Academic Year" value={sub.academicYear} />
              <Row label="File" value={sub.uploadFileName} />
              <Row label="Total Students" value={String(sub.counts.total)} />
              <Row label="Valid" value={String(sub.counts.valid)} />
              <Row label="Needs Correction" value={String(sub.counts.correction)} />
              <Row label="Duplicates" value={String(sub.counts.duplicate)} />
              <Row label="Submission Date" value={new Date(sub.submittedAt || sub.uploadDate).toLocaleString("en-IN")} />
            </dl>
            <div className="mt-3 space-y-1 text-sm">
              <div className="flex items-center gap-2">
                {sub.verificationStatus === "verified"
                  ? <><CheckCircle2 size={15} className="text-emerald-600" /> <span className="text-emerald-800">College Verification: Completed</span></>
                  : <span className="text-slate-500">College verification pending</span>}
              </div>
              <div className="flex items-center gap-2">
                {sub.mtcStatus === "approved"
                  ? <><CheckCircle2 size={15} className="text-emerald-600" /> <span className="text-emerald-800">MTC Approval: Approved</span></>
                  : sub.mtcStatus === "rejected"
                  ? <><XCircle size={15} className="text-red-600" /> <span className="text-red-800">Rejected</span></>
                  : sub.mtcStatus === "correction_required"
                  ? <><Undo2 size={15} className="text-amber-600" /> <span className="text-amber-800">Correction Required</span></>
                  : <span className="text-slate-500">Awaiting MTC review</span>}
              </div>
              {sub.mtcReason && (
                <div className="mt-2 rounded-md border border-amber-200 bg-amber-50 p-2 text-xs text-amber-900">
                  <strong>Note:</strong> {sub.mtcReason}
                </div>
              )}
              {sub.mtcStatus === "approved" && (
                <div className="mt-2 rounded-md border border-emerald-200 bg-emerald-50 p-2 text-xs font-semibold text-emerald-900">
                  Student Pass Processing: Ready
                </div>
              )}
            </div>
          </div>

          {sub.mtcStatus === "submitted" && (
            <div className="card p-5">
              <h2 className="font-bold">MTC Decision</h2>
              <div className="mt-3 space-y-2">
                <button onClick={() => decide("approved")} className="btn-success w-full">
                  <CheckCircle2 size={15} /> Approve
                </button>
                <button onClick={() => setCorrectionOpen((v) => !v)} className="btn-secondary w-full">
                  <Undo2 size={15} /> Request Correction
                </button>
                <button onClick={() => decide("rejected")} className="btn-danger w-full">
                  <XCircle size={15} /> Reject
                </button>
              </div>
              {correctionOpen && (
                <div className="mt-3">
                  <label className="label-field">Correction reason</label>
                  <textarea
                    className="input-field min-h-[90px]"
                    placeholder="e.g., Please correct the destination for Student ID JAS119."
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                  />
                  <button
                    onClick={() => decide("correction_required")}
                    disabled={!reason.trim()}
                    className="btn-primary mt-2 w-full disabled:opacity-50"
                  >
                    <Send size={14} /> Send Correction Request
                  </button>
                </div>
              )}
              <p className="mt-3 text-[11px] text-slate-500">
                Prototype decisions — not connected to the real MTC system.
              </p>
            </div>
          )}
        </div>

        <div className="card lg:col-span-2 overflow-hidden">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="font-bold">Student List ({sub.records.length})</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr><th>Student ID</th><th>Name</th><th>Course</th><th>Year</th><th>Origin</th><th>Destination</th><th>Status</th></tr>
              </thead>
              <tbody>
                {sub.records.map((r) => (
                  <tr key={r.rowId}>
                    <td className="font-mono text-xs">{r.studentId}</td>
                    <td className="text-xs">{r.studentName}</td>
                    <td className="text-xs">{r.course}</td>
                    <td className="text-xs">{r.yearOfStudy}</td>
                    <td className="text-xs">{r.origin}</td>
                    <td className="text-xs">{r.destination}</td>
                    <td>
                      {r.validationStatus === "valid" ? <span className="badge badge-green">✓ Valid</span>
                        : r.validationStatus === "duplicate" ? <span className="badge badge-yellow">Duplicate</span>
                        : <span className="badge badge-yellow" title={r.correctionReason}>{r.correctionReason.split("Missing ")[1]?.split(",")[0] || "Correction"}</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-slate-500">{label}</dt>
      <dd className="text-right font-medium text-slate-900">{value}</dd>
    </div>
  );
}

export default function ViewSubmissionPage() {
  return (
    <Suspense fallback={<DashboardLayout><div className="p-6">Loading…</div></DashboardLayout>}>
      <ViewContent />
    </Suspense>
  );
}
