"use client";

import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import { useStore } from "@/lib/store";
import { ArrowLeft, UploadCloud, Database } from "lucide-react";

const COLLEGE_NAME = "Jeppiaar College of Arts and Science";

export default function MasterRecordsPage() {
  const { masterRecords } = useStore();
  const mine = masterRecords.filter((r) => r.collegeName === COLLEGE_NAME);

  return (
    <DashboardLayout>
      <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
        <div>
          <Link href="/dashboard/college" className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-[var(--mtc-blue)]">
            <ArrowLeft size={16} /> Back
          </Link>
          <h1 className="mt-1 flex items-center gap-2 text-2xl font-bold text-slate-900">
            <Database size={22} className="text-[var(--mtc-blue)]" /> Student Master Records
          </h1>
          <p className="text-sm text-slate-600">
            College-verified student data imported via Excel upload. These records are used to prefill
            student applications — uploading the list does <strong>not</strong> create a concession-pass application;
            each student must still apply.
          </p>
        </div>
        <Link href="/dashboard/college/bulk-upload" className="btn-primary whitespace-nowrap">
          <UploadCloud size={16} /> Upload Excel
        </Link>
      </div>

      <div className="card mb-4 grid gap-3 sm:grid-cols-3">
        <Stat label="Total master records" value={mine.length} />
        <Stat label="Academic year" value="2026–27" />
        <Stat label="Source" value="Excel / seed (prototype)" />
      </div>

      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Student ID</th><th>Name</th><th>Course</th><th>Year</th><th>Origin</th><th>Destination</th><th>Mobile</th><th>Source</th>
              </tr>
            </thead>
            <tbody>
              {mine.length === 0 && (
                <tr><td colSpan={8} className="py-8 text-center text-slate-500">
                  No master records yet. Upload an Excel file from Bulk Upload.
                </td></tr>
              )}
              {mine.map((r) => (
                <tr key={r.studentId}>
                  <td className="font-mono text-xs">{r.studentId}</td>
                  <td className="text-sm font-medium">{r.studentName}</td>
                  <td className="text-xs">{r.course}</td>
                  <td className="text-xs">{r.yearOfStudy}</td>
                  <td className="text-xs">{r.origin}</td>
                  <td className="text-xs">{r.destination}</td>
                  <td className="text-xs">{r.mobile}</td>
                  <td>
                    <span className={`badge ${r.source === "excel" ? "badge-blue" : "badge-slate"}`}>
                      {r.source === "excel" ? "Excel upload" : "Demo seed"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <p className="mt-4 text-xs text-slate-500">
        Prototype data stored in this browser (localStorage). Not connected to a live college or MTC database.
      </p>
    </DashboardLayout>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="p-3">
      <div className="text-2xl font-bold text-slate-900">{value}</div>
      <div className="text-xs font-medium text-slate-500">{label}</div>
    </div>
  );
}
