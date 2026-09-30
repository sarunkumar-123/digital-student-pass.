"use client";

import { useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import { useStore } from "@/lib/store";
import { ArrowLeft, ArrowRight, Info, CheckCircle2, Clock } from "lucide-react";

export default function RouteChangePage() {
  const { passes, session, submitRouteChange, routeChanges, students } = useStore();
  const activePass = passes.find((p) => p.studentId === session.id && p.status === "active");
  const student = students.find((s) => s.studentId === session.id);
  const myRequests = routeChanges
    .filter((r) => r.studentId === session.id)
    .sort((a, b) => (a.submittedAt < b.submittedAt ? 1 : -1));

  const usedChanges = myRequests.filter((r) => r.mtcStatus === "approved").length;
  const maxChanges = 2; // proposed policy (1–2 per year)

  const [newOrigin, setNewOrigin] = useState("");
  const [newDest, setNewDest] = useState("");
  const [reason, setReason] = useState("");
  const [submittedId, setSubmittedId] = useState<string | null>(null);

  const submit = () => {
    if (!activePass || !student) return;
    if (!newOrigin || !newDest || !reason) return;
    if (newOrigin.toLowerCase() === activePass.origin.toLowerCase() && newDest.toLowerCase() === activePass.destination.toLowerCase()) {
      alert("New route is same as existing.");
      return;
    }
    submitRouteChange(
      student.studentId,
      student.name,
      activePass.origin,
      activePass.destination,
      newOrigin,
      newDest,
      reason
    );
    setSubmittedId("RCR-" + Math.floor(1000 + Math.random() * 9000));
    setNewOrigin(""); setNewDest(""); setReason("");
  };

  return (
    <DashboardLayout>
      <div className="mb-5">
        <Link href="/dashboard/student" className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-[var(--mtc-blue)]">
          <ArrowLeft size={16} /> Back
        </Link>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">Route Change Request</h1>
        <p className="text-sm text-slate-600">
          Your current route remains active until MTC approves the new one.
        </p>
      </div>

      {!activePass ? (
        <div className="card p-6 text-slate-600">You need an active pass to request a route change.</div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="card p-6 lg:col-span-2">
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
              <Info size={15} className="mr-1 inline" />
              Proposed policy: maximum <strong>{maxChanges} route changes per academic year</strong>{" "}
              (configurable). You have used <strong>{usedChanges}</strong> of {maxChanges}.
            </div>

            <div className="mt-5 grid grid-cols-2 gap-4">
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <div className="text-xs font-semibold uppercase text-slate-500">Current Route</div>
                <div className="mt-1 flex items-center gap-2 font-bold text-slate-900">
                  {activePass.origin} <ArrowRight size={14} className="text-slate-400" /> {activePass.destination}
                </div>
              </div>
            </div>

            {submittedId ? (
              <div className="mt-5 rounded-md border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-900">
                <div className="flex items-center gap-2 font-semibold">
                  <CheckCircle2 size={16} /> Request submitted ({submittedId})
                </div>
                <p className="mt-1">Your college will verify first, then MTC. Old route remains active until then.</p>
              </div>
            ) : usedChanges >= maxChanges ? (
              <div className="mt-5 rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-900">
                You have reached the proposed limit of {maxChanges} route changes for this academic year.
              </div>
            ) : (
              <div className="mt-5 grid gap-4 md:grid-cols-2">
                <div>
                  <label className="label-field">New Starting Point</label>
                  <input className="input-field" value={newOrigin} onChange={(e) => setNewOrigin(e.target.value)} placeholder="e.g., Velachery" />
                </div>
                <div>
                  <label className="label-field">New Destination</label>
                  <input className="input-field" value={newDest} onChange={(e) => setNewDest(e.target.value)} placeholder="e.g., Padur" />
                </div>
                <div className="md:col-span-2">
                  <label className="label-field">Reason for change</label>
                  <textarea className="input-field min-h-[90px]" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g., Residence changed, changed college timings…" />
                </div>
                <div className="md:col-span-2">
                  <button onClick={submit} className="btn-primary">Submit Route Change Request</button>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="card p-5">
              <h3 className="font-bold">Workflow</h3>
              <ol className="mt-3 space-y-2 text-sm text-slate-700">
                <li>1. Student submits request</li>
                <li>2. College verifies</li>
                <li>3. MTC approves</li>
                <li>4. New route activated</li>
              </ol>
              <div className="mt-3 text-xs text-slate-500">
                Old route stays active throughout the process. If rejected,
                current route continues unchanged.
              </div>
            </div>
          </div>
        </div>
      )}

      {myRequests.length > 0 && (
        <div className="card mt-6 overflow-hidden">
          <div className="border-b border-slate-200 px-5 py-4"><h2 className="font-bold">My Route Change Requests</h2></div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Request ID</th>
                  <th>Old Route</th>
                  <th>New Route</th>
                  <th>College</th>
                  <th>MTC</th>
                  <th>Submitted</th>
                </tr>
              </thead>
              <tbody>
                {myRequests.map((r) => (
                  <tr key={r.id}>
                    <td className="font-mono text-xs">{r.requestId}</td>
                    <td>{r.oldOrigin} → {r.oldDestination}</td>
                    <td>{r.newOrigin} → {r.newDestination}</td>
                    <td><Badge status={r.collegeStatus} /></td>
                    <td><Badge status={r.mtcStatus} /></td>
                    <td className="text-xs text-slate-500">{new Date(r.submittedAt).toLocaleDateString("en-IN")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

function Badge({ status }: { status: string }) {
  if (status === "approved") return <span className="badge badge-green">Approved</span>;
  if (status === "rejected") return <span className="badge badge-red">Rejected</span>;
  return <span className="badge badge-yellow"><Clock size={11} /> Pending</span>;
}
