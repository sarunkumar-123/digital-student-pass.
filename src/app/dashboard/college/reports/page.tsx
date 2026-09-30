"use client";

import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import { useStore } from "@/lib/store";
import { ArrowLeft, BarChart3 } from "lucide-react";

export default function CollegeReports() {
  const { applications, students, passes, routeChanges } = useStore();
  const collegeName = "Jeppiaar College of Arts and Science";
  const apps = applications.filter(a => a.college === collegeName);
  const studs = students.filter(s => s.college === collegeName);
  const activePasses = passes.filter(p => studs.some(s => s.studentId === p.studentId) && p.status === "active");
  const rcrs = routeChanges.filter(r => studs.some(s => s.studentId === r.studentId));

  const rows = [
    { label: "Total applications received", value: apps.length },
    { label: "Pending college verification", value: apps.filter(a => a.collegeVerification === "pending").length },
    { label: "Verified & sent to MTC", value: apps.filter(a => a.collegeVerification === "verified").length },
    { label: "Rejected by college", value: apps.filter(a => a.collegeVerification === "rejected").length },
    { label: "MTC approved", value: apps.filter(a => a.mtcApproval === "approved").length },
    { label: "Active student passes", value: activePasses.length },
    { label: "Total students", value: studs.length },
    { label: "Route change requests", value: rcrs.length },
  ];

  return (
    <DashboardLayout>
      <div className="mb-5">
        <Link href="/dashboard/college" className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-[var(--mtc-blue)]">
          <ArrowLeft size={16} /> Back
        </Link>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">College Reports</h1>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {rows.slice(0, 8).map((r) => (
          <div key={r.label} className="stat-card">
            <BarChart3 size={20} className="text-[var(--mtc-blue)]" />
            <div className="mt-3 text-2xl font-bold">{r.value}</div>
            <div className="text-xs text-slate-500">{r.label}</div>
          </div>
        ))}
      </div>

      <div className="mt-6 card p-5">
        <h2 className="font-bold">Summary</h2>
        <p className="mt-2 text-sm text-slate-600">
          This prototype report is for demonstration purposes. Real
          implementation would integrate with the college's existing internal
          reporting systems and only expose the minimum data needed.
        </p>
      </div>
    </DashboardLayout>
  );
}
