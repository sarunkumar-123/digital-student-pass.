"use client";

import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import { useStore } from "@/lib/store";
import { ArrowLeft, CheckCheck, XCircle } from "lucide-react";

export default function MTCRouteRequests() {
  const { routeChanges, approveRouteChangeMTC, rejectRouteChange, addNotification } = useStore();
  return (
    <DashboardLayout>
      <div className="mb-5">
        <Link href="/dashboard/mtc" className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-[var(--mtc-blue)]">
          <ArrowLeft size={16} /> Back
        </Link>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">Route Change Requests</h1>
        <p className="text-sm text-slate-600">College-verified requests for your final approval. Old route stays active until new one is approved.</p>
      </div>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead><tr><th>Request ID</th><th>Student</th><th>Old</th><th>New</th><th>Reason</th><th>College</th><th>MTC</th><th>Action</th></tr></thead>
            <tbody>
              {routeChanges.length === 0 && <tr><td colSpan={8} className="py-6 text-center text-slate-500">No route change requests.</td></tr>}
              {routeChanges.map(r => (
                <tr key={r.id}>
                  <td className="font-mono text-xs">{r.requestId}</td>
                  <td className="text-xs">{r.studentName}<div className="text-[10px] text-slate-500">{r.studentId}</div></td>
                  <td className="text-xs">{r.oldOrigin} → {r.oldDestination}</td>
                  <td className="text-xs">{r.newOrigin} → {r.newDestination}</td>
                  <td className="text-xs max-w-[200px] truncate" title={r.reason}>{r.reason || "—"}</td>
                  <td>{r.collegeStatus === "approved" ? <span className="badge badge-green">Approved</span> : r.collegeStatus === "rejected" ? <span className="badge badge-red">Rejected</span> : <span className="badge badge-yellow">Pending</span>}</td>
                  <td>{r.mtcStatus === "approved" ? <span className="badge badge-green">Approved</span> : r.mtcStatus === "rejected" ? <span className="badge badge-red">Rejected</span> : <span className="badge badge-yellow">Pending</span>}</td>
                  <td>
                    {r.collegeStatus === "approved" && r.mtcStatus === "pending" && (
                      <div className="flex gap-1">
                        <button onClick={() => { approveRouteChangeMTC(r.id); addNotification({ studentId: r.studentId, message: `Your route change to ${r.newOrigin} → ${r.newDestination} was approved by MTC.`, type: "success" }); }} className="btn-success !px-2 !py-1 text-xs"><CheckCheck size={12} /> Approve</button>
                        <button onClick={() => { rejectRouteChange(r.id); addNotification({ studentId: r.studentId, message: "Your route change was rejected by MTC.", type: "error" }); }} className="btn-danger !px-2 !py-1 text-xs"><XCircle size={12} /> Reject</button>
                      </div>
                    )}
                    {r.collegeStatus === "pending" && <span className="text-xs text-slate-500">Awaiting college</span>}
                    {r.mtcStatus === "approved" && <span className="badge badge-green">Approved</span>}
                    {r.mtcStatus === "rejected" && <span className="badge badge-red">Rejected</span>}
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
