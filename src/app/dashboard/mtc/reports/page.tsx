"use client";

import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import { useStore } from "@/lib/store";
import { ArrowLeft, BarChart3, TrendingUp } from "lucide-react";

export default function MTCReports() {
  const { applications, passes, payments, routeChanges, students } = useStore();

  const stats = [
    { label: "Total applications", value: applications.length },
    { label: "College verified", value: applications.filter(a => a.collegeVerification === "verified").length },
    { label: "MTC approved", value: applications.filter(a => a.mtcApproval === "approved").length },
    { label: "MTC rejected", value: applications.filter(a => a.mtcApproval === "rejected").length },
    { label: "Active digital passes", value: passes.filter(p => p.status === "active").length },
    { label: "Total revenue (successful)", value: "₹" + payments.filter(p => p.paymentStatus === "successful").reduce((s, p) => s + p.amount, 0) },
    { label: "Refunds in progress", value: payments.filter(p => p.refundStatus === "processing").length },
    { label: "Route change requests", value: routeChanges.length },
  ];

  const colleges = Array.from(new Set(students.map(s => s.college)));

  return (
    <DashboardLayout>
      <div className="mb-5">
        <Link href="/dashboard/mtc" className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-[var(--mtc-blue)]">
          <ArrowLeft size={16} /> Back
        </Link>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">Reports & Statistics</h1>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map(s => (
          <div key={s.label} className="stat-card">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
              <BarChart3 size={20} />
            </div>
            <div className="mt-3 text-2xl font-bold">{s.value}</div>
            <div className="text-xs text-slate-500">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="card p-5">
        <h2 className="flex items-center gap-2 font-bold"><TrendingUp size={18} /> Per-college summary</h2>
        <div className="mt-4 overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr><th>College</th><th>Total Applications</th><th>Verified</th><th>Approved</th><th>Active Passes</th></tr>
            </thead>
            <tbody>
              {colleges.map(c => {
                const collegeApps = applications.filter(a => a.college === c);
                const collegeStudents = students.filter(s => s.college === c).map(s => s.studentId);
                return (
                  <tr key={c}>
                    <td className="font-medium">{c}</td>
                    <td>{collegeApps.length}</td>
                    <td>{collegeApps.filter(a => a.collegeVerification === "verified").length}</td>
                    <td>{collegeApps.filter(a => a.mtcApproval === "approved").length}</td>
                    <td>{passes.filter(p => collegeStudents.includes(p.studentId) && p.status === "active").length}</td>
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
