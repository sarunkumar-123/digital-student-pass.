"use client";

import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import { useStore } from "@/lib/store";
import { ArrowLeft, Eye, Inbox, Users, CheckCircle2, Undo2 } from "lucide-react";

function isToday(iso?: string) {
  if (!iso) return false;
  const d = new Date(iso);
  const now = new Date();
  return d.toDateString() === now.toDateString();
}

export default function MTCSumbissions() {
  const { bulkSubmissions } = useStore();
  const ordered = [...bulkSubmissions].sort((a, b) =>
    (a.submittedAt || a.uploadDate) < (b.submittedAt || b.uploadDate) ? 1 : -1
  );
  const pending = ordered.filter((s) => s.mtcStatus === "submitted");
  const awaiting = pending.reduce((sum, s) => sum + s.counts.valid, 0);
  const approvedToday = ordered.filter((s) => s.mtcStatus === "approved" && isToday(s.mtcDecidedAt)).length;
  const returned = ordered.filter((s) => s.mtcStatus === "correction_required").length;

  const stats = [
    { label: "Pending Submissions", value: pending.length, icon: <Inbox size={20} />, color: "bg-blue-100 text-blue-700" },
    { label: "Students Awaiting Review", value: awaiting, icon: <Users size={20} />, color: "bg-indigo-100 text-indigo-700" },
    { label: "Approved Today", value: approvedToday, icon: <CheckCircle2 size={20} />, color: "bg-emerald-100 text-emerald-700" },
    { label: "Returned for Correction", value: returned, icon: <Undo2 size={20} />, color: "bg-amber-100 text-amber-700" },
  ];

  return (
    <DashboardLayout>
      <div className="mb-5">
        <Link href="/dashboard/mtc" className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-[var(--mtc-blue)]">
          <ArrowLeft size={16} /> Back
        </Link>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">College Student Submissions</h1>
        <p className="text-sm text-slate-600">
          Verified student lists submitted by colleges — prototype representation of the proposed MTC review workflow.
        </p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <div key={s.label} className="stat-card">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${s.color}`}>{s.icon}</div>
            <div className="mt-3 text-2xl font-bold">{s.value}</div>
            <div className="text-xs font-medium text-slate-500">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>College</th><th>Academic Year</th><th>Students</th><th>College Verification</th><th>Status</th><th>Date</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {ordered.length === 0 && (
                <tr><td colSpan={7} className="py-8 text-center text-slate-500">
                  No college submissions yet. Use the College portal → Bulk Student Upload to submit a verified list.
                </td></tr>
              )}
              {ordered.map((s) => (
                <tr key={s.submissionId}>
                  <td className="text-sm font-medium">{s.collegeName}<div className="font-mono text-[10px] text-slate-500">{s.submissionId}</div></td>
                  <td>{s.academicYear}</td>
                  <td>{s.counts.valid} Students</td>
                  <td>{s.verificationStatus === "verified" ? <span className="badge badge-green">✓ Verified</span> : <span className="badge badge-slate">Pending</span>}</td>
                  <td>
                    {s.mtcStatus === "submitted" ? <span className="badge badge-blue">Pending MTC Review</span>
                      : s.mtcStatus === "approved" ? <span className="badge badge-green">Approved</span>
                      : s.mtcStatus === "rejected" ? <span className="badge badge-red">Rejected</span>
                      : s.mtcStatus === "correction_required" ? <span className="badge badge-yellow">Correction Required</span>
                      : <span className="badge badge-slate">College Draft</span>}
                  </td>
                  <td className="text-xs text-slate-500">
                    {new Date(s.submittedAt || s.uploadDate).toLocaleDateString("en-IN")}
                  </td>
                  <td>
                    <Link href={`/dashboard/mtc/submissions/view?id=${s.submissionId}`} className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-[var(--mtc-blue)] hover:bg-blue-50">
                      <Eye size={13} /> View
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-4 text-xs text-slate-500">
        Prototype demonstration. This is not connected to MTC's internal system, a live database, or any production authentication.
      </p>
    </DashboardLayout>
  );
}
