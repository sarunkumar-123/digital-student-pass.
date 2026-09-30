"use client";

import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import { useStore } from "@/lib/store";
import { stageLabel, stageBadgeClass, isPaymentConfirmed, isPaymentPending } from "@/lib/application";
import { ArrowLeft, Eye } from "lucide-react";

export default function MTCApplications() {
  const { applications } = useStore();
  return (
    <DashboardLayout>
      <div className="mb-5">
        <Link href="/dashboard/mtc" className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-[var(--mtc-blue)]">
          <ArrowLeft size={16} /> Back
        </Link>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">All Applications</h1>
      </div>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Application ID</th><th>Student ID</th><th>Name</th><th>College</th><th>Route</th><th>College</th><th>MTC</th><th>Payment</th><th>Status</th><th></th>
              </tr>
            </thead>
            <tbody>
              {applications.map(a => (
                <tr key={a.id}>
                  <td className="font-mono text-xs">{a.applicationId}</td>
                  <td className="font-mono text-xs">{a.studentId}</td>
                  <td className="text-sm">{a.studentName}</td>
                  <td className="text-xs">{a.college}</td>
                  <td className="text-xs">{a.origin} → {a.destination}</td>
                  <td>{a.collegeVerification === "verified" ? <span className="badge badge-green">Verified</span> : a.collegeVerification === "rejected" ? <span className="badge badge-red">Rejected</span> : <span className="badge badge-yellow">Pending</span>}</td>
                  <td>{a.mtcApproval === "approved" ? <span className="badge badge-green">Approved</span> : a.mtcApproval === "rejected" ? <span className="badge badge-red">Rejected</span> : <span className="badge badge-yellow">Pending</span>}</td>
                  <td>
                    {isPaymentConfirmed(a) ? <span className="badge badge-green">Confirmed</span> :
                     isPaymentPending(a) ? <span className="badge badge-yellow">Pending</span> :
                     <span className="badge badge-slate">—</span>}
                  </td>
                  <td><span className={stageBadgeClass(a)}>{stageLabel(a)}</span></td>
                  <td>
                    <Link href="/dashboard/mtc/approvals" className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--mtc-blue)] hover:underline">
                      <Eye size={12} /> Review
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
