"use client";

import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import { useStore } from "@/lib/store";
import { DAILY_JOURNEY_LIMIT } from "@/lib/config";
import { stageLabel } from "@/lib/application";
import {
  CreditCard,
  MapPin,
  Calendar,
  CheckCircle2,
  Bus,
  BellRing,
  Route,
  History,
  RefreshCw,
  AlertTriangle,
  WifiOff,
  Navigation,
} from "lucide-react";

export default function StudentDashboardHome() {
  const { passes, applications, notifications, students, session, journeys, bulkSubmissions } = useStore();
  const student = students.find((s) => s.studentId === session.id);
  const activePass = passes.find((p) => p.studentId === session.id && p.status === "active");
  const myApp = applications.find((a) => a.studentId === session.id);
  const myNotifs = notifications.filter((n) => n.studentId === session.id && !n.read);
  const myBulk = bulkSubmissions.find((b) =>
    b.records.some((r) => r.studentId.trim().toLowerCase() === session.id?.toLowerCase())
  );

  const daysLeft = activePass
    ? Math.ceil(
        (new Date(activePass.validityEnd).getTime() - Date.now()) / 86400000
      )
    : 0;

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Welcome, {student?.name?.split(" ")[0] || "Student"}
        </h1>
        <p className="text-sm text-slate-600">
          Here&apos;s an overview of your digital student pass.
        </p>
      </div>


      {!activePass && myApp && (
        <div className="mb-6 notice-banner flex items-start gap-3">
          <AlertTriangle size={18} className="mt-0.5 flex-shrink-0 text-amber-700" />
          <div>
            Your application is currently{" "}
            <strong>{stageLabel(myApp)}</strong>.{" "}
            <Link href="/dashboard/student/apply" className="underline font-semibold">
              View status
            </Link>
          </div>
        </div>
      )}

      {/* Top status card */}
      {activePass && (
        <div className="card mb-6 overflow-hidden">
          <div className="pass-card pass-stripes p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-white/75">
                  Pass Status
                </div>
                <div className="mt-1 flex items-center gap-2 text-2xl font-bold">
                  <span className="inline-flex h-3 w-3 rounded-full bg-emerald-300 shadow-[0_0_0_4px_rgba(16,185,129,0.2)]"></span>
                  ACTIVE
                </div>
                <div className="mt-2 text-sm text-white/85">
                  MTC Digital Student Pass •{" "}
                  {activePass.passType}
                </div>
              </div>
              <Link
                href="/dashboard/student/pass"
                className="rounded-lg bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur hover:bg-white/25"
              >
                Show Pass
              </Link>
            </div>
          </div>

          <div className="grid gap-0 divide-slate-200 grid-cols-2 sm:grid-cols-2 md:grid-cols-4 sm:divide-x md:divide-x">
            <Stat
              icon={<Calendar size={18} />}
              label="Valid Until"
              value={new Date(activePass.validityEnd).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
              accent={daysLeft <= 10 ? "text-amber-600" : "text-slate-900"}
            />
            <Stat
              icon={<MapPin size={18} />}
              label="Route"
              value={`${activePass.origin} → ${activePass.destination}`}
            />
            <Stat
              icon={<Bus size={18} />}
              label="Pass Type"
              value="College SCT"
            />
            <Stat
              icon={<CreditCard size={18} />}
              label="Monthly"
              value={`₹${activePass.monthlyAmount}`}
              hint={`${activePass.stages}-stage SCT example`}
            />
          </div>
        </div>
      )}

      {!activePass && !myApp && (
        <div className="card mb-6 p-6">
          <h2 className="text-lg font-bold text-slate-900">No application yet</h2>
          <p className="mt-1 text-sm text-slate-600">
            Apply for your digital student concession pass. Your college will
            verify, then MTC gives final approval.
          </p>
          <Link href="/dashboard/student/apply" className="btn-primary mt-4">
            Apply for Pass
          </Link>
        </div>
      )}

      {/* Quick actions */}
      <div className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <QuickAction href="/dashboard/student/pass" icon={<Bus size={20} />} title="Digital Pass" desc="View the digital pass" />
        <QuickAction href="/dashboard/student/assistance" icon={<Navigation size={20} />} title="Journey Assistance" desc="Services, map & schedule" />
        <QuickAction href="/dashboard/student/journeys" icon={<History size={20} />} title="Journey History" desc="Validate & record trip" />
        <QuickAction href="/dashboard/student/renew" icon={<RefreshCw size={20} />} title="Renewal" desc={activePass ? `Expires in ${daysLeft} days` : "Renew pass"} />
      </div>

      {/* Today's Journey card */}
      {activePass && (
        <div className="card p-5">
          <div className="flex items-center justify-between gap-2">
            <h2 className="flex items-center gap-2 font-bold text-slate-900">
              Today's Journey
            </h2>
            <Link href="/dashboard/student/journeys" className="text-xs font-semibold text-[var(--mtc-blue)] hover:underline">
              Start / View →
            </Link>
          </div>
          {(() => {
            const today = new Date().toISOString().split("T")[0];
            const slots = journeys
              .filter((j) => j.studentId === session.id && j.date === today)
              .sort((a, b) => (a.slot ?? 1) - (b.slot ?? 1))
              .slice(0, DAILY_JOURNEY_LIMIT);
            const used = slots.length;
            const limitReached = used >= DAILY_JOURNEY_LIMIT;
            return (
              <>
                <p className="mt-1 text-sm">
                  {used} / {DAILY_JOURNEY_LIMIT} used · {DAILY_JOURNEY_LIMIT - used} remaining
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                  {Array.from({ length: DAILY_JOURNEY_LIMIT }, (_, i) => {
                    const slot = slots[i];
                    return (
                      <span
                        key={i}
                        className={`block truncate rounded-lg border p-2 text-center text-xs font-medium ${
                          slot
                            ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                            : "border-slate-200 bg-white text-slate-500"
                        }`}
                        title={slot ? `Slot ${slot.slot ?? i + 1} · Bus/Service ID ${slot.bus}` : "Available"}
                      >
                        {slot ? slot.bus : "Available"}
                      </span>
                    );
                  })}
                </div>
                {limitReached && (
                  <p className="mt-2 text-center text-xs font-semibold text-amber-700">
                    Daily travel allocation reached
                  </p>
                )}
              </>
            );
          })()}
        </div>
      )}

      {/* Bulk college-list status (if this student appears in an Excel submission) */}
      {myBulk && (
        <div className="card mb-6 p-5">
          <h2 className="font-bold text-slate-900">College Record Status</h2>
          <p className="mt-1 text-xs text-slate-500">From your college's verified student list ({myBulk.academicYear}).</p>
          <ol className="mt-3 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-5">
            <BulkStep label="College Record Submitted" done={true} />
            <BulkStep label="College Verified" done={myBulk.verificationStatus === "verified"} />
            <BulkStep label="Submitted to MTC" done={myBulk.mtcStatus !== "draft" && myBulk.mtcStatus !== "correction_required"} />
            <BulkStep label="MTC Review" done={myBulk.mtcStatus === "submitted"} current={myBulk.mtcStatus === "submitted"} />
            <BulkStep label="MTC Approved / Pass Activation" done={myBulk.mtcStatus === "approved"} />
          </ol>
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Notifications */}
        <div className="card p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 font-bold text-slate-900">
              <BellRing size={18} className="text-[var(--mtc-blue)]" /> Recent Notifications
            </h2>
            <Link href="/dashboard/student/notifications" className="text-xs font-medium text-[var(--mtc-blue)] hover:underline">
              View all
            </Link>
          </div>
          <ul className="mt-4 divide-y divide-slate-100">
            {myNotifs.length === 0 && (
              <li className="py-3 text-sm text-slate-500">No unread notifications.</li>
            )}
            {myNotifs.slice(0, 4).map((n) => (
              <li key={n.id} className="flex items-start gap-3 py-3">
                <span
                  className={`mt-1 h-2 w-2 flex-shrink-0 rounded-full ${
                    n.type === "success"
                      ? "bg-emerald-500"
                      : n.type === "warning"
                      ? "bg-amber-500"
                      : n.type === "error"
                      ? "bg-red-500"
                      : "bg-blue-500"
                  }`}
                ></span>
                <div>
                  <div className="text-sm text-slate-800">{n.message}</div>
                  <div className="text-xs text-slate-500">
                    {new Date(n.date).toLocaleString("en-IN")}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Status card */}
        <div className="card p-5">
          <h2 className="font-bold text-slate-900">Pass Timeline</h2>
          <ol className="mt-4 space-y-3 text-sm">
            {activePass ? (
              <>
                <li className="flex items-start gap-2"><CheckCircle2 size={16} className="mt-0.5 text-emerald-600" /> Application submitted</li>
                <li className="flex items-start gap-2"><CheckCircle2 size={16} className="mt-0.5 text-emerald-600" /> College verified</li>
                <li className="flex items-start gap-2"><CheckCircle2 size={16} className="mt-0.5 text-emerald-600" /> MTC approved</li>
                <li className="flex items-start gap-2"><CheckCircle2 size={16} className="mt-0.5 text-emerald-600" /> Payment completed</li>
                <li className="flex items-start gap-2 text-emerald-700 font-semibold">
                  <CheckCircle2 size={16} className="mt-0.5" /> Digital pass activated
                </li>
              </>
            ) : myApp ? (
              <>
                <Timeline label="Application submitted" done={true} />
                <Timeline label="College verification" done={myApp.collegeVerification === "verified"} current={myApp.status === "pending_college" || myApp.status === "college_verified"} />
                <Timeline label="Sent to MTC" done={myApp.status === "sent_to_mtc" || myApp.status === "mtc_review" || myApp.status === "approved" || myApp.status === "paid" || myApp.status === "activated"} current={myApp.status === "sent_to_mtc" || myApp.status === "mtc_review"} />
                <Timeline label="MTC approval" done={myApp.mtcApproval === "approved"} current={myApp.status === "mtc_review"} />
                <Timeline label="Payment & activation" done={myApp.status === "activated"} current={myApp.status === "approved" || myApp.status === "paid"} />
              </>
            ) : (
              <li className="text-slate-500">No application yet.</li>
            )}
          </ol>
        </div>
      </div>

      <div className="mt-6 flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 p-3 text-xs text-slate-600">
        <WifiOff size={14} />
        <span>
          You can simulate offline mode from the top-right toggle. Once
          activated, your pass stays visible offline — new applications and
          payments are disabled until you're back online.
        </span>
      </div>
    </DashboardLayout>
  );
}

function Stat({
  icon,
  label,
  value,
  hint,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint?: string;
  accent?: string;
}) {
  return (
    <div className="p-4 sm:p-5">
      <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-medium uppercase tracking-wide text-slate-500">
        {icon}<span className="hidden sm:inline">{label}</span><span className="sm:hidden">{label.length > 8 ? label.slice(0, 7) : label}</span>
      </div>
      <div className={`mt-1.5 sm:mt-2 text-sm sm:text-base font-bold leading-tight ${accent || "text-slate-900"}`}>{value}</div>
      {hint && <div className="mt-0.5 text-[10px] sm:text-xs text-slate-500">{hint}</div>}
    </div>
  );
}

function QuickAction({
  href,
  icon,
  title,
  desc,
}: {
  href: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
}) {
  return (
    <Link
      href={href}
      className="card flex items-start gap-3 p-4 transition hover:border-[var(--mtc-blue)] hover:shadow-md"
    >
      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-[var(--mtc-blue-light)] text-[var(--mtc-blue-dark)]">
        {icon}
      </div>
      <div>
        <div className="font-semibold text-slate-900">{title}</div>
        <div className="text-xs text-slate-600">{desc}</div>
      </div>
    </Link>
  );
}

function BulkStep({ label, done, current }: { label: string; done: boolean; current?: boolean }) {
  return (
    <li className="flex items-center gap-2">
      {done ? (
        <CheckCircle2 size={16} className="flex-shrink-0 text-emerald-600" />
      ) : current ? (
        <span className="h-4 w-4 flex-shrink-0 animate-pulse rounded-full border-2 border-amber-500 bg-amber-100" />
      ) : (
        <span className="h-4 w-4 flex-shrink-0 rounded-full border-2 border-slate-300" />
      )}
      <span className={`text-xs ${done ? "text-slate-800" : current ? "font-medium text-amber-700" : "text-slate-400"}`}>
        {label}
      </span>
    </li>
  );
}

function Timeline({ label, done, current }: { label: string; done: boolean; current?: boolean }) {
  return (
    <li className="flex items-start gap-2">
      {done ? (
        <CheckCircle2 size={16} className="mt-0.5 text-emerald-600" />
      ) : current ? (
        <span className="mt-0.5 h-4 w-4 flex-shrink-0 rounded-full border-2 border-amber-500 bg-amber-100"></span>
      ) : (
        <span className="mt-0.5 h-4 w-4 flex-shrink-0 rounded-full border-2 border-slate-300"></span>
      )}
      <span className={done ? "text-slate-700" : current ? "text-amber-700 font-medium" : "text-slate-400"}>
        {label}
        {current && !done && " (in progress)"}
      </span>
    </li>
  );
}
