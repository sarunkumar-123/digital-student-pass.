"use client";

import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import { useStore } from "@/lib/store";
import { ArrowLeft, CheckCheck, XCircle } from "lucide-react";

export default function CollegeRouteRequests() {
  const { routeChanges, students, approveRouteChangeCollege, rejectRouteChange, addNotification } = useStore();
  const collegeStudents = students.filter(s => s.college === "Jeppiaar College of Arts and Science").map(s => s.studentId);
  const collegeReqs = routeChanges.filter(r => collegeStudents.includes(r.studentId));

  const approve = (id: string, sid: string) => {
    approveRouteChangeCollege(id);
    addNotification({ studentId: sid, message: "Your route change was verified by college and sent to MTC.", type: "info" });
  };
  const reject = (id: string, sid: string) => {
    if (confirm("Reject this route change?")) {
      rejectRouteChange(id);
      addNotification({ studentId: sid, message: "Your route change request was rejected by the college.", type: "error" });
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-5">
        <Link href="/dashboard/college" className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-[var(--mtc-blue)]">
          <ArrowLeft size={16} /> Back
        </Link>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">Route Change Requests</h1>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Request ID</th><th>Student</th><th>Old Route</th><th>New Route</th><th>Reason</th><th>College</th><th>MTC</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {collegeReqs.length === 0 && (
                <tr><td colSpan={8} className="py-6 text-center text-slate-500">No route change requests yet.</td></tr>
              )}
              {collegeReqs.map((r) => (
                <tr key={r.id}>
                  <td className="font-mono text-xs">{r.requestId}</td>
                  <td className="text-xs">{r.studentName}<div className="text-[10px] text-slate-500">{r.studentId}</div></td>
                  <td className="text-xs">{r.oldOrigin} → {r.oldDestination}</td>
                  <td className="text-xs">{r.newOrigin} → {r.newDestination}</td>
                  <td className="text-xs max-w-[200px] truncate" title={r.reason}>{r.reason || "—"}</td>
                  <td>{r.collegeStatus === "approved" ? <span className="badge badge-green">Approved</span> : r.collegeStatus === "rejected" ? <span className="badge badge-red">Rejected</span> : <span className="badge badge-yellow">Pending</span>}</td>
                  <td>{r.mtcStatus === "approved" ? <span className="badge badge-green">Approved</span> : r.mtcStatus === "rejected" ? <span className="badge badge-red">Rejected</span> : <span className="badge badge-yellow">Pending</span>}</td>
                  <td>
                    {r.collegeStatus === "pending" ? (
                      <div className="flex gap-1">
                        <button onClick={() => approve(r.id, r.studentId)} className="btn-success !px-2 !py-1 text-xs">
                          <CheckCheck size={12} /> Approve
                        </button>
                        <button onClick={() => reject(r.id, r.studentId)} className="btn-danger !px-2 !py-1 text-xs">
                          <XCircle size={12} /> Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs text-slate-500">Decided</span>
                    )}
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
