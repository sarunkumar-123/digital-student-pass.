"use client";

import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import { useStore } from "@/lib/store";
import { ArrowLeft } from "lucide-react";

export default function CollegeStudents() {
  const { students, passes, updateStudent } = useStore();
  const list = students.filter(s => s.college === "Jeppiaar College of Arts and Science");

  const setStatus = (sid: string, status: "active" | "graduated" | "discontinued") => {
    updateStudent(sid, { status });
    // Also deactivate active passes for grad/discontinued
  };

  return (
    <DashboardLayout>
      <div className="mb-5">
        <Link href="/dashboard/college" className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-[var(--mtc-blue)]">
          <ArrowLeft size={16} /> Back
        </Link>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">Students</h1>
      </div>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student ID</th><th>Name</th><th>Course</th><th>Year</th><th>Phone</th><th>Status</th><th>Has Active Pass</th><th>Action</th>
              </tr>
            </thead>
            <tbody>
              {list.map(s => {
                const p = passes.find(p => p.studentId === s.studentId && p.status === "active");
                return (
                  <tr key={s.id}>
                    <td className="font-mono text-xs">{s.studentId}</td>
                    <td className="font-medium">{s.name}</td>
                    <td className="text-xs">{s.course}</td>
                    <td className="text-xs">{s.year}</td>
                    <td className="text-xs">{s.phone}</td>
                    <td>
                      {s.status === "active" ? <span className="badge badge-green">Active</span> :
                       s.status === "graduated" ? <span className="badge badge-slate">Graduated</span> :
                       s.status === "discontinued" ? <span className="badge badge-red">Discontinued</span> :
                       <span className="badge badge-yellow">{s.status}</span>}
                    </td>
                    <td>{p ? <span className="badge badge-blue">Yes ({p.origin} → {p.destination})</span> : <span className="badge badge-slate">No</span>}</td>
                    <td>
                      <select
                        className="rounded-md border border-slate-300 bg-white px-2 py-1 text-xs"
                        defaultValue={s.status}
                        onChange={(e) => setStatus(s.studentId, e.target.value as any)}
                      >
                        <option value="active">Active</option>
                        <option value="graduated">Graduated</option>
                        <option value="discontinued">Discontinued</option>
                      </select>
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
