"use client";

import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import { useStore } from "@/lib/store";
import {
  FileText,
  Clock,
  CheckCheck,
  XCircle,
  Bus,
  Route,
  CreditCard,
  RefreshCw,
  ExternalLink,
  Inbox,
  Users,
  Undo2,
} from "lucide-react";

function isToday(iso?: string) {
  if (!iso) return false;
  return new Date(iso).toDateString() === new Date().toDateString();
}

export default function MTCDashboard() {
  const { applications, passes, payments, routeChanges, bulkSubmissions } = useStore();

  const pendingSubmissions = bulkSubmissions.filter((s) => s.mtcStatus === "submitted");
  const bulkStats = [
    { label: "Pending Submissions", value: pendingSubmissions.length, icon: <Inbox size={20} />, color: "bg-blue-100 text-blue-700" },
    { label: "Students Awaiting Review", value: pendingSubmissions.reduce((n, s) => n + s.counts.valid, 0), icon: <Users size={20} />, color: "bg-indigo-100 text-indigo-700" },
    { label: "Approved Today", value: bulkSubmissions.filter((s) => s.mtcStatus === "approved" && isToday(s.mtcDecidedAt)).length, icon: <CheckCheck size={20} />, color: "bg-emerald-100 text-emerald-700" },
    { label: "Returned for Correction", value: bulkSubmissions.filter((s) => s.mtcStatus === "correction_required").length, icon: <Undo2 size={20} />, color: "bg-amber-100 text-amber-700" },
  ];

  // Role-specific operational statistics (derived from real prototype state).
  const awaitingReview = applications.filter(
    (a) => a.status === "sent_to_mtc" || a.status === "mtc_review" || a.stage === "MTC_PENDING"
  );
  const collegeVerified = applications.filter((a) => a.collegeVerification === "verified");
  const approved = applications.filter((a) => a.mtcApproval === "approved");
  const rejectedApps = applications.filter(
    (a) => a.mtcApproval === "rejected"
  );
  const returnedBulk = bulkSubmissions.filter((s) => s.mtcStatus === "correction_required");
  const activePasses = passes.filter((p) => p.status === "active");
  const rcPending = routeChanges.filter((r) => r.collegeStatus === "approved" && r.mtcStatus === "pending");

  const txTotal = payments.length;
  const txSuccess = payments.filter((p) => p.paymentStatus === "successful").length;
  const txPending = payments.filter((p) => ["pending", "verifying", "refund_initiated"].includes(p.paymentStatus)).length;
  const txFailed = payments.filter((p) => ["failed", "refunded"].includes(p.paymentStatus)).length;

  const stats = [
    { label: "Applications Awaiting Review", value: awaitingReview.length, icon: <Clock size={20} />, color: "bg-amber-100 text-amber-700" },
    { label: "College-Verified Applications", value: collegeVerified.length, icon: <CheckCheck size={20} />, color: "bg-blue-100 text-blue-700" },
    { label: "Approved Applications", value: approved.length, icon: <FileText size={20} />, color: "bg-emerald-100 text-emerald-700" },
    { label: "Rejected / Returned", value: rejectedApps.length + returnedBulk.length, icon: <XCircle size={20} />, color: "bg-red-100 text-red-700" },
    { label: "Active Digital Passes", value: activePasses.length, icon: <Bus size={20} />, color: "bg-indigo-100 text-indigo-700" },
    { label: "Route-Change Requests", value: rcPending.length, icon: <Route size={20} />, color: "bg-purple-100 text-purple-700" },
  ];

  const pendingApps = awaitingReview;

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">MTC Authority Dashboard</h1>
        <p className="text-sm text-slate-600">
          Final approval and digital pass administration — Prototype
        </p>
      </div>

      <div className="mb-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((s) => (
          <div key={s.label} className="stat-card">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${s.color}`}>{s.icon}</div>
            <div className="mt-3 text-2xl font-bold text-slate-900">{s.value}</div>
            <div className="text-xs font-medium text-slate-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Box 7 — Payment / transaction overview (existing demo payment data) */}
      <div className="mb-6 card p-5">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="flex items-center gap-2 text-sm font-bold text-slate-900">
            <CreditCard size={16} className="text-[var(--mtc-blue)]" /> Payment / Transaction Overview
          </h2>
          <Link href="/dashboard/mtc/payments" className="inline-flex items-center gap-1 text-xs font-medium text-[var(--mtc-blue)] hover:underline">
            View all <ExternalLink size={12} />
          </Link>
        </div>
        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <TxStat label="Total transactions" value={txTotal} tone="slate" />
          <TxStat label="Successful" value={txSuccess} tone="green" />
          <TxStat label="Pending / verifying" value={txPending} tone="amber" />
          <TxStat label="Failed / refunded" value={txFailed} tone="red" />
        </div>
        <p className="mt-2 text-[11px] text-slate-500">Prototype payment simulation — no real payment gateway or bank is connected.</p>
      </div>

      {/* College bulk submissions */}
      <div className="mb-6">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">College Student Submissions</h2>
          <Link href="/dashboard/mtc/submissions" className="inline-flex items-center gap-1 text-xs font-medium text-[var(--mtc-blue)] hover:underline">
            View all <ExternalLink size={12} />
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {bulkStats.map((s) => (
            <div key={s.label} className="stat-card">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${s.color}`}>{s.icon}</div>
              <div className="mt-3 text-2xl font-bold text-slate-900">{s.value}</div>
              <div className="text-xs font-medium text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <h2 className="font-bold">Pending MTC Approvals</h2>
            <Link href="/dashboard/mtc/approvals" className="inline-flex items-center gap-1 text-xs font-medium text-[var(--mtc-blue)] hover:underline">
              Review all <ExternalLink size={12} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr><th>App ID</th><th>Student</th><th>College</th><th>Route</th><th></th></tr>
              </thead>
              <tbody>
                {pendingApps.length === 0 && (
                  <tr><td colSpan={5} className="py-6 text-center text-slate-500">No applications pending your approval.</td></tr>
                )}
                {pendingApps.slice(0, 5).map(a => (
                  <tr key={a.id}>
                    <td className="font-mono text-xs">{a.applicationId}</td>
                    <td className="text-xs">{a.studentName}<div className="font-mono text-[10px] text-slate-500">{a.studentId}</div></td>
                    <td className="text-xs">{a.college}</td>
                    <td className="text-xs">{a.origin} → {a.destination}</td>
                    <td>
                      <Link href="/dashboard/mtc/approvals" className="text-xs font-semibold text-[var(--mtc-blue)] hover:underline">Review</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <h2 className="font-bold">Recent Payments</h2>
            <Link href="/dashboard/mtc/payments" className="inline-flex items-center gap-1 text-xs font-medium text-[var(--mtc-blue)] hover:underline">
              View all <ExternalLink size={12} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr><th>Txn ID</th><th>Student</th><th>Amount</th><th>Status</th></tr>
              </thead>
              <tbody>
                {payments.slice(0, 5).map(p => (
                  <tr key={p.id}>
                    <td className="font-mono text-xs">{p.transactionId.slice(0, 18)}…</td>
                    <td className="text-xs">{p.studentId}</td>
                    <td>₹{p.amount}</td>
                    <td>
                      {p.paymentStatus === "successful" ? <span className="badge badge-green">Successful</span> :
                       p.paymentStatus === "verifying" ? <span className="badge badge-yellow">Verifying</span> :
                       p.paymentStatus === "refund_initiated" ? <span className="badge badge-yellow">Refund initiated</span> :
                       <span className="badge badge-red">Failed</span>}
                    </td>
                  </tr>
                ))}
                {payments.length === 0 && <tr><td colSpan={4} className="py-6 text-center text-slate-500">No payments yet.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-6 notice-banner">
        This is a prototype. Payment records represent a proposed integration with
        MTC's existing financial/accounting process — a separate accounting system
        is not built here.
      </div>
    </DashboardLayout>
  );
}

function TxStat({ label, value, tone }: { label: string; value: number; tone: "slate" | "green" | "amber" | "red" }) {
  const tones = {
    slate: "border-slate-200 bg-white text-slate-900",
    green: "border-emerald-200 bg-emerald-50 text-emerald-900",
    amber: "border-amber-200 bg-amber-50 text-amber-900",
    red: "border-red-200 bg-red-50 text-red-900",
  };
  return (
    <div className={`rounded-lg border p-3 ${tones[tone]}`}>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-[11px] font-medium opacity-80">{label}</div>
    </div>
  );
}
