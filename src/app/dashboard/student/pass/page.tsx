"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/DashboardLayout";
import { useStore } from "@/lib/store";
import {
  ArrowLeft,
  Bus,
  MapPin,
  Calendar,
  IdCard,
  GraduationCap,
  WifiOff,
  Eye,
  EyeOff,
  LogOut,
} from "lucide-react";

export default function DigitalPassPage() {
  const router = useRouter();
  const { passes, students, session, offline, logout } = useStore();
  const student = students.find((s) => s.studentId === session.id);
  const activePass = passes.find((p) => p.studentId === session.id && p.status === "active");
  const [showPass, setShowPass] = useState(true);
  const [fullscreen, setFullscreen] = useState(false);
  const [lastSync, setLastSync] = useState<string>(new Date().toLocaleString("en-IN"));

  useEffect(() => {
    // Update last sync when coming online
    if (!offline) setLastSync(new Date().toLocaleString("en-IN"));
  }, [offline]);

  if (!activePass || !student) {
    return (
      <DashboardLayout>
        <div className="card p-8 text-center">
          <h1 className="text-xl font-bold text-slate-900">No active pass</h1>
          <p className="mt-2 text-slate-600">
            You don't have an active digital pass yet. Once MTC approves and payment is done,
            your pass will appear here.
          </p>
          <Link href="/dashboard/student" className="btn-primary mt-4">
            Back to dashboard
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const validityStart = new Date(activePass.validityStart).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
  const validityEnd = new Date(activePass.validityEnd).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
  const initials = student.name.split(" ").map((n) => n[0]).slice(0, 2).join("").toUpperCase();

  return (
    <DashboardLayout>
      <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Link href="/dashboard/student" className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-[var(--mtc-blue)]">
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
          <h1 className="mt-1 flex flex-wrap items-center gap-2 text-2xl font-bold text-slate-900">
            My Digital Pass
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-slate-600">
              Prototype representation
            </span>
          </h1>
        </div>
        <button
          onClick={() => {
            setFullscreen(!fullscreen);
            if (!fullscreen) setShowPass(true);
          }}
          className="btn-secondary w-full sm:w-auto whitespace-nowrap"
        >
          {fullscreen ? "Exit Fullscreen" : "Show to Conductor"}
        </button>
      </div>

      {offline && (
        <div className="notice-banner mb-5 flex items-start gap-3">
          <WifiOff size={18} className="mt-0.5 flex-shrink-0 text-amber-700" />
          <div>
            <strong>Offline Mode — Pass Available.</strong> Last synced: {lastSync}.
            Validity/status shown is from your device's last sync. New applications
            and payments are disabled until you're back online.
          </div>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Pass card */}
        <div className="lg:col-span-2">
          <div
            className={`relative mx-auto w-full max-w-md transition-all ${
              fullscreen ? "scale-105" : ""
            }`}
          >
            <div className="pass-card pass-stripes overflow-hidden rounded-2xl shadow-2xl">
              {/* Top */}
              <div className="flex items-center justify-between p-4 pb-2 sm:p-5 sm:pb-3">
                <div>
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-white/80">
                    <Bus size={14} /> MTC Chennai
                  </div>
                  <div className="mt-0.5 text-base font-bold uppercase tracking-wide text-white">
                    Digital Student Pass
                  </div>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-emerald-400/20 px-3 py-1 text-[11px] font-bold uppercase text-emerald-200 ring-1 ring-emerald-300/40">
                  <span className="h-2 w-2 rounded-full bg-emerald-300 animate-pulse"></span>
                  VALID
                </div>
              </div>

              <div className="mx-5 border-t border-white/20"></div>

              {/* Body */}
              <div className="p-4 sm:p-5">
                {!showPass ? (
                  <div className="flex flex-col items-center gap-2 py-8 text-center">
                    <EyeOff size={26} className="text-white/80" />
                    <div className="text-sm font-semibold text-white">Pass details hidden for privacy</div>
                    <div className="text-xs text-white/75">Tap “Show details” to reveal the pass on this device.</div>
                  </div>
                ) : (
                <>
                <div className="flex gap-3 sm:gap-4">
                  <div className="flex h-20 w-16 sm:h-24 sm:w-20 flex-shrink-0 items-center justify-center rounded-md border-2 border-white/40 bg-white/15 text-2xl sm:text-3xl font-bold">
                    {initials}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[11px] uppercase tracking-wider text-white/70">
                      Student Name
                    </div>
                    <div className="truncate text-lg font-bold leading-tight">{student.name}</div>
                    <div className="mt-1 grid grid-cols-2 gap-2 text-[11px] text-white/80">
                      <div>
                        <div className="uppercase text-white/60">Student ID</div>
                        <div className="font-mono font-semibold text-white">{student.studentId}</div>
                      </div>
                      <div>
                        <div className="uppercase text-white/60">Gender / Year</div>
                        <div className="font-semibold text-white">{student.year}</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 rounded-md bg-white/10 p-3">
                  <div className="flex items-center gap-2 text-[11px] uppercase tracking-wider text-white/70">
                    <GraduationCap size={13} /> College
                  </div>
                  <div className="mt-0.5 text-sm font-semibold">{student.college}</div>
                  <div className="mt-0.5 text-xs text-white/80">
                    {student.course} • {student.year} Year
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div className="rounded-md bg-white/10 p-3">
                    <div className="flex items-center gap-1 text-[11px] uppercase tracking-wider text-white/70">
                      <MapPin size={12} /> Origin
                    </div>
                    <div className="mt-0.5 text-sm font-bold">{activePass.origin}</div>
                  </div>
                  <div className="rounded-md bg-white/10 p-3">
                    <div className="flex items-center gap-1 text-[11px] uppercase tracking-wider text-white/70">
                      <MapPin size={12} /> Destination
                    </div>
                    <div className="mt-0.5 text-sm font-bold">{activePass.destination}</div>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-2 gap-3">
                  <div className="rounded-md bg-white/10 p-3">
                    <div className="flex items-center gap-1 text-[11px] uppercase tracking-wider text-white/70">
                      <Calendar size={12} /> Valid From
                    </div>
                    <div className="mt-0.5 text-sm font-semibold">{validityStart}</div>
                  </div>
                  <div className="rounded-md bg-white/10 p-3">
                    <div className="flex items-center gap-1 text-[11px] uppercase tracking-wider text-white/70">
                      <Calendar size={12} /> Valid Until
                    </div>
                    <div className="mt-0.5 text-sm font-semibold">{validityEnd}</div>
                  </div>
                </div>

                <div className="mt-4 rounded-md border border-dashed border-white/30 p-2 text-center text-[11px] font-medium text-white/85">
                  Pass Type: {activePass.passType}
                  <div className="mt-0.5 text-white/70">
                    Conductor: please verify Photo, Name, ID, College, Route & Validity
                  </div>
                </div>
                </>
                )}
              </div>

              <div className="flex items-center justify-between bg-black/20 px-5 py-2 text-[11px] text-white/80">
                <div className="flex items-center gap-1">
                  <IdCard size={12} /> Pass ID: {activePass.passId}
                  {activePass.applicationId && <span className="ml-2">· App: {activePass.applicationId}</span>}
                </div>
                <div>₹{activePass.monthlyAmount}/month ({activePass.stages}-stage example)</div>
              </div>
            </div>
          </div>

          <div className="mx-auto mt-5 flex max-w-md items-center justify-between gap-2">
            <button onClick={() => setShowPass(!showPass)} className="btn-secondary flex-1">
              {showPass ? <><EyeOff size={16} /> Hide details</> : <><Eye size={16} /> Show details</>}
            </button>
            <button
              onClick={() => {
                logout();
                router.push("/");
              }}
              className="btn-danger flex-1"
              title="Log out from this device (important when using a shared phone)"
            >
              <LogOut size={16} /> Logout this device
            </button>
          </div>
        </div>

        {/* Info sidebar */}
        <div className="space-y-4">
          <div className="card p-5">
            <h3 className="font-bold text-slate-900">Conductor verification</h3>
            <p className="mt-2 text-sm text-slate-600">
              No QR code is needed. The conductor checks:
            </p>
            <ul className="mt-3 space-y-1.5 text-sm text-slate-700">
              <li>✓ Student photo / initials</li>
              <li>✓ Student name</li>
              <li>✓ Student ID</li>
              <li>✓ College and course</li>
              <li>✓ Origin and destination</li>
              <li>✓ Validity dates</li>
              <li>✓ Green VALID status</li>
            </ul>
          </div>

          <div className="card p-5">
            <h3 className="font-bold text-slate-900">Security reminder</h3>
            <p className="mt-2 text-sm text-slate-600">
              If you logged in on another device (e.g., a friend's phone),
              always tap <strong>Logout this device</strong> when done.
            </p>
            <p className="mt-2 text-sm text-slate-600">
              Route shown is your <strong>approved route</strong>. You can
              board any MTC bus that goes from your origin to your destination
              along the approved path.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
