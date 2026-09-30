"use client";

import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import { useStore } from "@/lib/store";
import { ArrowLeft, Bell, CheckCheck } from "lucide-react";

export default function NotificationsPage() {
  const { notifications, session, markNotificationRead } = useStore();
  const mine = notifications
    .filter((n) => n.studentId === session.id)
    .sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <DashboardLayout>
      <div className="mb-5">
        <Link href="/dashboard/student" className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-[var(--mtc-blue)]">
          <ArrowLeft size={16} /> Back
        </Link>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">Notifications</h1>
        <p className="text-sm text-slate-600">
          In-app application notifications for this prototype. These are not actual MTC SMS or email messages.
        </p>
      </div>

      <div className="card overflow-hidden">
        {mine.length === 0 ? (
          <div className="p-10 text-center text-slate-500">
            <Bell className="mx-auto mb-3 text-slate-300" size={28} />
            No notifications yet.
          </div>
        ) : (
          <ul className="divide-y divide-slate-100">
            {mine.map((n) => (
              <li
                key={n.id}
                className={`flex items-start gap-3 px-5 py-4 ${!n.read ? "bg-blue-50/40" : ""}`}
              >
                <span
                  className={`mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-full ${
                    n.type === "success"
                      ? "bg-emerald-500"
                      : n.type === "warning"
                      ? "bg-amber-500"
                      : n.type === "error"
                      ? "bg-red-500"
                      : "bg-blue-500"
                  }`}
                ></span>
                <div className="flex-1">
                  <div className={`text-sm ${!n.read ? "font-semibold text-slate-900" : "text-slate-700"}`}>
                    {n.message}
                  </div>
                  <div className="text-xs text-slate-500">
                    {new Date(n.date).toLocaleString("en-IN")}
                  </div>
                </div>
                {!n.read && (
                  <button
                    onClick={() => markNotificationRead(n.id)}
                    className="btn-ghost !py-1 !px-2 text-xs"
                  >
                    <CheckCheck size={14} /> Mark read
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </DashboardLayout>
  );
}
