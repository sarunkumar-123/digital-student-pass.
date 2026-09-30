"use client";

import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import { useStore } from "@/lib/store";
import { ArrowLeft, Ban, CheckCheck } from "lucide-react";

export default function MTCPasses() {
  const { passes, deactivatePass, students } = useStore();

  return (
    <DashboardLayout>
      <div className="mb-5">
        <Link href="/dashboard/mtc" className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-[var(--mtc-blue)]">
          <ArrowLeft size={16} /> Back
        </Link>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">Digital Passes</h1>
      </div>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Pass ID</th><th>Student</th><th>Student ID</th><th>Route</th><th>Validity</th><th>Amount</th><th>Status</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {passes.map(p => {
                const s = students.find(s => s.studentId === p.studentId);
                return (
                  <tr key={p.id}>
                    <td className="font-mono text-xs">{p.passId}</td>
                    <td className="text-sm">{s?.name || "—"}</td>
                    <td className="font-mono text-xs">{p.studentId}</td>
                    <td className="text-xs">{p.origin} → {p.destination}</td>
                    <td className="text-xs">{new Date(p.validityStart).toLocaleDateString("en-IN")} → {new Date(p.validityEnd).toLocaleDateString("en-IN")}</td>
                    <td>₹{p.monthlyAmount}</td>
                    <td>
                      {p.status === "active" ? <span className="badge badge-green">Active</span> :
                       p.status === "expired" ? <span className="badge badge-yellow">Expired</span> :
                       <span className="badge badge-slate">Deactivated</span>}
                    </td>
                    <td>
                      {p.status === "active" ? (
                        <button onClick={() => { if (confirm("Deactivate this pass?")) deactivatePass(p.passId); }} className="btn-danger !px-2 !py-1 text-xs">
                          <Ban size={12} /> Deactivate
                        </button>
                      ) : <span className="text-xs text-slate-400">—</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
