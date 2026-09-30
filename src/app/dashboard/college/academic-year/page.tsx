"use client";

import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import { useStore } from "@/lib/store";
import { ArrowLeft, CheckCheck, GraduationCap, X } from "lucide-react";

export default function AcademicYearPage() {
  const { students, passes } = useStore();
  const list = students.filter(s => s.college === "Jeppiaar College of Arts and Science");

  return (
    <DashboardLayout>
      <div className="mb-5">
        <Link href="/dashboard/college" className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-[var(--mtc-blue)]">
          <ArrowLeft size={16} /> Back
        </Link>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">Academic Year Verification (2026–27)</h1>
        <p className="text-sm text-slate-600">
          At the beginning of each academic year, confirm student continuation.
          Continuing students can re-apply with pre-filled details.
          Graduated/discontinued students have passes deactivated and renewal disabled.
        </p>
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student ID</th><th>Name</th><th>Course / Year</th><th>Current Pass</th><th>Verification Decision</th>
              </tr>
            </thead>
            <tbody>
              {list.map(s => {
                const p = passes.find(p => p.studentId === s.studentId && p.status === "active");
                return (
                  <tr key={s.id}>
                    <td className="font-mono text-xs">{s.studentId}</td>
                    <td className="font-medium">{s.name}</td>
                    <td className="text-xs">{s.course} • {s.year}</td>
                    <td>{p ? <span className="badge badge-green">{p.origin} → {p.destination}</span> : <span className="badge badge-slate">None</span>}</td>
                    <td>
                      <div className="flex flex-wrap gap-1">
                        <button className="btn-success !px-2 !py-1 text-xs"><CheckCheck size={12} /> Continuing</button>
                        <button className="btn-secondary !px-2 !py-1 text-xs"><GraduationCap size={12} /> Graduated</button>
                        <button className="btn-danger !px-2 !py-1 text-xs"><X size={12} /> Discontinued</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-6 notice-banner">
        For continuing students, re-application is pre-filled with last year's details (only changes need to be confirmed).
      </div>
    </DashboardLayout>
  );
}
