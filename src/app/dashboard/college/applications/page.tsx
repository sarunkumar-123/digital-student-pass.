"use client";

import Link from "next/link";
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useStore, type Application } from "@/lib/store";
import {
  isCollegePending,
  isMtcPending,
  isPaymentPending,
  isPassActive,
  stageOf,
} from "@/lib/application";
import { ArrowLeft, Eye, CheckCheck, XCircle, X } from "lucide-react";

type Tab = "pending" | "all";

export default function CollegeApplications() {
  const { applications, collegeVerifyApplication, collegeRejectApplicationReason } = useStore();
  const [tab, setTab] = useState<Tab>("pending");
  const [rejecting, setRejecting] = useState<Application | null>(null);
  const [reason, setReason] = useState("");

  const collegeApps = applications.filter(
    (a) => a.college === "Jeppiaar College of Arts and Science"
  );
  const pending = collegeApps.filter((a) => isCollegePending(a));
  const shown = tab === "pending" ? pending : collegeApps;

  const statusBadge = (a: Application) => {
    const s = stageOf(a);
    if (s === "COLLEGE_REJECTED" || s === "MTC_REJECTED") return <span className="badge badge-red">Rejected</span>;
    if (isCollegePending(a)) return <span className="badge badge-yellow">Pending Verification</span>;
    if (isMtcPending(a)) return <span className="badge badge-blue">Sent to MTC</span>;
    if (isPaymentPending(a)) return <span className="badge badge-yellow">MTC Approved · Payment Required</span>;
    if (isPassActive(a)) return <span className="badge badge-green">Pass Active</span>;
    return <span className="badge badge-slate">{s.replace(/_/g, " ")}</span>;
  };

  const confirmReject = () => {
    if (rejecting && reason.trim()) {
      collegeRejectApplicationReason(rejecting.applicationId, reason.trim());
      setRejecting(null);
      setReason("");
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-5">
        <Link href="/dashboard/college" className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-[var(--mtc-blue)]">
          <ArrowLeft size={16} /> Back
        </Link>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">Student Pass Applications</h1>
        <p className="text-sm text-slate-600">
          Applications submitted by students of your college. Verify to forward them automatically to MTC.
        </p>
      </div>

      <div className="mb-4 flex gap-2">
        {([["pending", `Pending Verification (${pending.length})`], ["all", "All Applications"]] as [Tab, string][]).map(
          ([key, label]) => (
            <button
              key={key}
              onClick={() => setTab(key)}
              className={`rounded-full border px-3 py-1.5 text-xs font-semibold ${
                tab === key ? "border-[var(--mtc-blue)] bg-[var(--mtc-blue-light)] text-[var(--mtc-blue-dark)]" : "border-slate-200 bg-white text-slate-600"
              }`}
            >
              {label}
            </button>
          )
        )}
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Application ID</th>
                <th>Student ID</th>
                <th>Name</th>
                <th>Course</th>
                <th>Year</th>
                <th>Route</th>
                <th>Pass Type</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {shown.length === 0 && (
                <tr><td colSpan={9} className="py-8 text-center text-slate-500">
                  {tab === "pending" ? "No applications pending verification." : "No applications found."}
                </td></tr>
              )}
              {shown.map((a) => (
                <tr key={a.id}>
                  <td className="font-mono text-xs">{a.applicationId}</td>
                  <td className="font-mono text-xs">{a.studentId}</td>
                  <td className="font-medium">{a.studentName}</td>
                  <td className="text-xs">{a.course}</td>
                  <td className="text-xs">{a.year}</td>
                  <td className="text-xs">{a.origin} → {a.destination}</td>
                  <td className="text-xs">{a.passType?.replace("College Student Concession Ticket", "College SCT") ?? "College SCT"}</td>
                  <td>{statusBadge(a)}</td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      <Link
                        href={`/dashboard/college/verification?id=${a.applicationId}`}
                        className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-[var(--mtc-blue)] hover:bg-blue-50"
                      >
                        <Eye size={13} /> View
                      </Link>
                      {isCollegePending(a) && (
                        <>
                          <button
                            onClick={() => collegeVerifyApplication(a.applicationId)}
                            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-50"
                          >
                            <CheckCheck size={13} /> Verify
                          </button>
                          <button
                            onClick={() => { setRejecting(a); setReason(""); }}
                            className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                          >
                            <XCircle size={13} /> Reject
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {rejecting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Reject {rejecting.applicationId}</h3>
              <button onClick={() => setRejecting(null)} className="rounded-md p-1 hover:bg-slate-100"><X size={18} /></button>
            </div>
            <p className="mt-1 text-sm text-slate-600">
              {rejecting.studentId} · {rejecting.studentName}. The student will see this reason.
            </p>
            <label className="label-field mt-3">Rejection reason</label>
            <textarea
              className="input-field min-h-[90px]"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Destination does not match college records."
            />
            <div className="mt-3 flex justify-end gap-2">
              <button onClick={() => setRejecting(null)} className="btn-secondary">Cancel</button>
              <button onClick={confirmReject} disabled={!reason.trim()} className="btn-danger disabled:opacity-50">
                Confirm Rejection
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
