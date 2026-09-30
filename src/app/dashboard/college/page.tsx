"use client";

import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import { useStore } from "@/lib/store";
import {
  Clock,
  CheckCheck,
  Send,
  Route,
  Undo2,
  ExternalLink,
  UploadCloud,
  Database,
} from "lucide-react";
import { isCollegePending, isMtcPending } from "@/lib/application";

const COLLEGE_NAME = "Jeppiaar College of Arts and Science";

export default function CollegeDashboardHome() {
  const { applications, routeChanges, students, bulkSubmissions } = useStore();

  const collegeStudents = students.filter((s) => s.college === COLLEGE_NAME);
  const collegeApps = applications.filter((a) => a.college === COLLEGE_NAME);

  // Role-specific verification statistics (from real prototype state).
  const pendingVerification = collegeApps.filter((a) => isCollegePending(a));
  const verifiedStudents = collegeApps.filter(
    (a) => a.collegeVerification === "verified"
  );
  const returnedApps = collegeApps.filter(
    (a) => a.collegeVerification === "rejected" || a.stage === "COLLEGE_REJECTED"
  );
  const correctionBulk = bulkSubmissions.filter(
    (b) => b.collegeId === "jeppiaar" && b.mtcStatus === "correction_required"
  );
  const sentToMtc = collegeApps.filter((a) => isMtcPending(a));
  const rcRequests = routeChanges.filter((r) => {
    const s = collegeStudents.find((cs) => cs.studentId === r.studentId);
    return !!s && r.collegeStatus === "pending";
  });
  const pending = pendingVerification;

  const stats = [
    { label: "Pending Student Verifications", value: pendingVerification.length, icon: <Clock size={20} />, color: "bg-amber-100 text-amber-700" },
    { label: "Verified Students", value: verifiedStudents.length, icon: <CheckCheck size={20} />, color: "bg-emerald-100 text-emerald-700" },
    { label: "Returned / Correction Required", value: returnedApps.length + correctionBulk.length, icon: <Undo2 size={20} />, color: "bg-red-100 text-red-700" },
    { label: "Applications Sent to MTC", value: sentToMtc.length, icon: <Send size={20} />, color: "bg-indigo-100 text-indigo-700" },
    { label: "Route-Change Requests", value: rcRequests.length, icon: <Route size={20} />, color: "bg-purple-100 text-purple-700" },
  ];

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Jeppiaar College of Arts and Science
        </h1>
        <p className="text-sm text-slate-600">
          College verification portal — Prototype
        </p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {stats.map((s) => (
          <div key={s.label} className="stat-card">
            <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${s.color}`}>
              {s.icon}
            </div>
            <div className="mt-3 text-2xl font-bold text-slate-900">{s.value}</div>
            <div className="text-xs font-medium text-slate-500">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Prominent Excel / Student Master quick actions */}
      <div className="mb-6 grid gap-4 sm:grid-cols-2">
        <Link href="/dashboard/college/bulk-upload" className="card flex items-center gap-3 p-5 transition hover:border-[var(--mtc-blue)] hover:shadow-md">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
            <UploadCloud size={20} />
          </div>
          <div>
            <div className="font-semibold text-slate-900">Upload Student Excel</div>
            <div className="text-xs text-slate-500">Bulk upload, validate and verify eligible students</div>
          </div>
        </Link>
        <Link href="/dashboard/college/master-records" className="card flex items-center gap-3 p-5 transition hover:border-[var(--mtc-blue)] hover:shadow-md">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--mtc-blue-light)] text-[var(--mtc-blue-dark)]">
            <Database size={20} />
          </div>
          <div>
            <div className="font-semibold text-slate-900">Manage Student Master</div>
            <div className="text-xs text-slate-500">View imported college-verified student records</div>
          </div>
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <h2 className="font-bold">Pending Verifications</h2>
            <Link href="/dashboard/college/applications" className="text-xs font-medium text-[var(--mtc-blue)] hover:underline inline-flex items-center gap-1">
              View all <ExternalLink size={12} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr><th>Student ID</th><th>Name</th><th>Course</th><th>Route</th><th></th></tr>
              </thead>
              <tbody>
                {pending.length === 0 && (
                  <tr><td colSpan={5} className="py-6 text-center text-slate-500">No pending verifications.</td></tr>
                )}
                {pending.slice(0, 5).map((a) => (
                  <tr key={a.id}>
                    <td className="font-mono text-xs">{a.studentId}</td>
                    <td>{a.studentName}</td>
                    <td className="text-xs">{a.course} • {a.year}</td>
                    <td className="text-xs">{a.origin} → {a.destination}</td>
                    <td>
                      <Link href={`/dashboard/college/verification?id=${a.applicationId}`} className="text-xs font-semibold text-[var(--mtc-blue)] hover:underline">
                        Verify
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
            <h2 className="font-bold">Route Change Requests</h2>
            <Link href="/dashboard/college/route-requests" className="text-xs font-medium text-[var(--mtc-blue)] hover:underline inline-flex items-center gap-1">
              View all <ExternalLink size={12} />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr><th>Student</th><th>Old Route</th><th>New Route</th><th></th></tr>
              </thead>
              <tbody>
                {rcRequests.length === 0 && (
                  <tr><td colSpan={4} className="py-6 text-center text-slate-500">No pending route changes.</td></tr>
                )}
                {rcRequests.slice(0, 5).map((r) => (
                  <tr key={r.id}>
                    <td className="text-xs">{r.studentName}<div className="font-mono text-[10px] text-slate-500">{r.studentId}</div></td>
                    <td className="text-xs">{r.oldOrigin} → {r.oldDestination}</td>
                    <td className="text-xs">{r.newOrigin} → {r.newDestination}</td>
                    <td>
                      <Link href={`/dashboard/college/route-requests`} className="text-xs font-semibold text-[var(--mtc-blue)] hover:underline">
                        Review
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="mt-6 card flex flex-col gap-3 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
            <UploadCloud size={20} />
          </div>
          <div>
            <h2 className="font-bold text-slate-900">Bulk Student Upload (Excel)</h2>
            <p className="text-sm text-slate-600">
              Upload your existing eligible-student list, let the system validate it, then review and
              submit the verified list to MTC — no manual re-entry.
            </p>
          </div>
        </div>
        <Link href="/dashboard/college/bulk-upload" className="btn-primary flex-shrink-0 whitespace-nowrap">
          Bulk Student Upload
        </Link>
      </div>

      <div className="mt-6 notice-banner">
        <strong>Prototype note:</strong> The college portal is a demonstration.
        It does not replace or interfere with your college's existing student
        database. Verification decisions are made using your existing systems
        of record.
      </div>
    </DashboardLayout>
  );
}
