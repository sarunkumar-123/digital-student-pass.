"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { useStore } from "@/lib/store";
import { ArrowLeft, LogOut, User as UserIcon, Shield, Smartphone, Info } from "lucide-react";

export default function StudentProfile() {
  const router = useRouter();
  const { students, session, logout, passes } = useStore();
  const student = students.find((s) => s.studentId === session.id);
  const activePass = passes.find((p) => p.studentId === session.id && p.status === "active");

  if (!student) return <DashboardLayout><div>Not found</div></DashboardLayout>;

  return (
    <DashboardLayout>
      <div className="mb-5">
        <Link href="/dashboard/student" className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-[var(--mtc-blue)]">
          <ArrowLeft size={16} /> Back
        </Link>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">My Profile</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center gap-4">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[var(--mtc-blue-light)] text-2xl font-bold text-[var(--mtc-blue-dark)]">
              {student.name.split(" ").map((n) => n[0]).slice(0, 2).join("")}
            </div>
            <div>
              <h2 className="text-xl font-bold">{student.name}</h2>
              <div className="text-sm text-slate-500">{student.studentId} • {student.course} • {student.year} Year</div>
              <span className="mt-1 inline-flex items-center gap-1 badge badge-green">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500"></span>
                {student.status === "active" ? "Active student" : student.status}
              </span>
            </div>
          </div>

          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <Field label="College" value={student.college} />
            <Field label="Course" value={student.course || "—"} />
            <Field label="Phone" value={student.phone || "—"} />
            <Field label="Email" value={student.email || "—"} />
            <Field label="Date of Birth" value={student.dob || "—"} />
            <Field label="Current Route" value={activePass ? `${activePass.origin} → ${activePass.destination}` : "No active pass"} />
          </dl>
        </div>

        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="flex items-center gap-2 font-bold"><Shield size={16} /> Security</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              <li>• New device login requires OTP</li>
              <li>• Session timeout after inactivity</li>
              <li>• One active pass per Student ID</li>
              <li>• Role-based access enforced</li>
            </ul>
          </div>
          <div className="card p-5">
            <h3 className="flex items-center gap-2 font-bold"><Smartphone size={16} /> Device</h3>
            <div className="mt-2 text-sm text-slate-600">
              {session.isNewDevice ? (
                <span className="text-amber-700">You're logged in on a new device. Remember to log out after use.</span>
              ) : (
                <span>This device is recognized.</span>
              )}
            </div>
          </div>
          <div className="card p-5">
            <h3 className="flex items-center gap-2 font-bold"><Info size={16} /> Prototype info</h3>
            <p className="mt-2 text-xs text-slate-600">
              This is a prototype of the proposed MTC Digital Student Pass.
              It is not an official MTC service.
            </p>
          </div>
          <button
            onClick={() => { logout(); router.push("/"); }}
            className="btn-danger w-full"
          >
            <LogOut size={16} /> Logout
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="text-xs font-medium uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-0.5 font-medium text-slate-900">{value}</div>
    </div>
  );
}
