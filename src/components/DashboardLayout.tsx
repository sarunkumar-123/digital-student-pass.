"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  CreditCard,
  Route,
  Bell,
  HelpCircle,
  User as UserIcon,
  LogOut,
  Bus,
  Users,
  CheckCheck,
  Receipt,
  BarChart3,
  GraduationCap,
  ShieldCheck,
  Menu,
  X,
  History,
  Wifi,
  WifiOff,
  UploadCloud,
  Inbox,
  Database,
  Navigation,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useStore, Role } from "@/lib/store";
import { ChatWidget } from "./ChatWidget";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

const studentNav: NavItem[] = [
  { href: "/dashboard/student", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { href: "/dashboard/student/apply", label: "My Application", icon: <FileText size={18} /> },
  { href: "/dashboard/student/pass", label: "My Pass", icon: <Bus size={18} /> },
  { href: "/dashboard/student/assistance", label: "Journey Assistance", icon: <Navigation size={18} /> },
  { href: "/dashboard/student/journeys", label: "Journey History", icon: <History size={18} /> },
  { href: "/dashboard/student/renew", label: "Renew", icon: <CreditCard size={18} /> },
  { href: "/dashboard/student/route-change", label: "Route Change", icon: <Route size={18} /> },
  { href: "/dashboard/student/notifications", label: "Notifications", icon: <Bell size={18} /> },
  { href: "/dashboard/student/help", label: "Help", icon: <HelpCircle size={18} /> },
  { href: "/dashboard/student/profile", label: "Profile", icon: <UserIcon size={18} /> },
];

const collegeNav: NavItem[] = [
  { href: "/dashboard/college", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { href: "/dashboard/college/applications", label: "Applications", icon: <FileText size={18} /> },
  { href: "/dashboard/college/bulk-upload", label: "Bulk Upload", icon: <UploadCloud size={18} /> },
  { href: "/dashboard/college/master-records", label: "Master Records", icon: <Database size={18} /> },
  { href: "/dashboard/college/verification", label: "Verification", icon: <CheckCheck size={18} /> },
  { href: "/dashboard/college/route-requests", label: "Route Requests", icon: <Route size={18} /> },
  { href: "/dashboard/college/students", label: "Students", icon: <Users size={18} /> },
  { href: "/dashboard/college/academic-year", label: "Academic Year", icon: <GraduationCap size={18} /> },
  { href: "/dashboard/college/reports", label: "Reports", icon: <BarChart3 size={18} /> },
];

const mtcNav: NavItem[] = [
  { href: "/dashboard/mtc", label: "Dashboard", icon: <LayoutDashboard size={18} /> },
  { href: "/dashboard/mtc/applications", label: "Applications", icon: <FileText size={18} /> },
  { href: "/dashboard/mtc/approvals", label: "Approvals", icon: <ShieldCheck size={18} /> },
  { href: "/dashboard/mtc/submissions", label: "Student Submissions", icon: <Inbox size={18} /> },
  { href: "/dashboard/mtc/passes", label: "Digital Passes", icon: <Bus size={18} /> },
  { href: "/dashboard/mtc/route-requests", label: "Route Requests", icon: <Route size={18} /> },
  { href: "/dashboard/mtc/payments", label: "Payments", icon: <Receipt size={18} /> },
  { href: "/dashboard/mtc/reports", label: "Reports", icon: <BarChart3 size={18} /> },
];

function getNav(role: Role) {
  if (role === "student") return studentNav;
  if (role === "college") return collegeNav;
  if (role === "mtc") return mtcNav;
  return [];
}

function roleLabel(role: Role) {
  if (role === "student") return "Student";
  if (role === "college") return "College Portal";
  if (role === "mtc") return "MTC Authority";
  return "";
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { session, logout, offline, setOffline, hydrated } = useStore();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!hydrated) return;
    if (!session.role) {
      router.replace("/login");
      return;
    }
    const onStudent = pathname.startsWith("/dashboard/student");
    const onCollege = pathname.startsWith("/dashboard/college");
    const onMtc = pathname.startsWith("/dashboard/mtc");
    if (onStudent && session.role !== "student") {
      router.replace(`/dashboard/${session.role}`);
    } else if (onCollege && session.role !== "college") {
      router.replace(`/dashboard/${session.role}`);
    } else if (onMtc && session.role !== "mtc") {
      router.replace(`/dashboard/${session.role}`);
    }
  }, [hydrated, session.role, pathname, router]);

  if (!hydrated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-sm text-slate-500">Loading demo session…</div>
      </div>
    );
  }

  if (!session.role) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-slate-500">Redirecting to login…</div>
      </div>
    );
  }

  const nav = getNav(session.role);
  const unreadCount = 0; // we can keep simple

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 transform bg-white border-r border-slate-200 transition-transform md:static md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex h-16 items-center gap-2.5 border-b border-slate-200 px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--mtc-blue)] text-white">
            <Bus size={18} />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-bold text-slate-900">MTC Student Pass</div>
            <div className="text-[11px] font-medium uppercase tracking-wide text-slate-500">
              {roleLabel(session.role)}
            </div>
          </div>
        </div>
        <nav className="space-y-0.5 p-3">
          {nav.map((item) => {
            const active = pathname === item.href || (item.href !== "/dashboard/student" && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`sidebar-link ${active ? "sidebar-link-active" : ""}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
        <div className="absolute bottom-0 left-0 right-0 border-t border-slate-200 p-3">
          <button
            onClick={() => {
              logout();
              router.push("/");
            }}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between gap-2 border-b border-slate-200 bg-white px-3 sm:px-6">
          <div className="flex min-w-0 items-center gap-2 sm:gap-3">
            <button
              className="md:hidden flex-shrink-0 rounded-md p-2 text-slate-700 hover:bg-slate-100"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={20} />
            </button>
            <div className="min-w-0">
              <div className="truncate text-[10px] uppercase tracking-wide text-slate-500 sm:text-xs">Prototype Portal</div>
              <div className="truncate text-sm font-semibold text-slate-800">
                {roleLabel(session.role)}
              </div>
            </div>
          </div>

          <div className="flex flex-shrink-0 items-center gap-1 sm:gap-2">
            <button
              onClick={() => setOffline(!offline)}
              title="Toggle offline (prototype)"
              className={`inline-flex items-center gap-1 rounded-full border px-2 py-1 text-[10px] font-medium sm:px-3 sm:text-xs ${
                offline
                  ? "border-amber-300 bg-amber-50 text-amber-800"
                  : "border-emerald-300 bg-emerald-50 text-emerald-800"
              }`}
            >
              {offline ? <><WifiOff size={12} className="sm:h-3.5 sm:w-3.5" /><span className="hidden sm:inline">Offline</span></> : <><Wifi size={12} className="sm:h-3.5 sm:w-3.5" /><span className="hidden sm:inline">Online</span></>}
            </button>
            <Link
              href={
                session.role === "student"
                  ? "/dashboard/student/notifications"
                  : "#"
              }
              className="relative rounded-md p-2 text-slate-600 hover:bg-slate-100"
              aria-label="Notifications"
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-red-500"></span>
              )}
            </Link>
            <div className="hidden items-center gap-2 rounded-full border border-slate-200 px-2 py-1 md:flex">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[var(--mtc-blue)] text-xs font-bold text-white">
                {session.role === "student" ? "A" : session.role === "college" ? "J" : "M"}
              </div>
              <span className="pr-1 text-xs font-medium text-slate-700">
                {session.role === "student"
                  ? "Arun Kumar"
                  : session.role === "college"
                  ? "Jeppiaar College"
                  : "MTC Authority"}
              </span>
            </div>
          </div>
        </header>

        {offline && (
          <div className="border-b border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-800 sm:px-6">
            <WifiOff size={13} className="mr-1 inline" />
            <strong>Offline Mode.</strong> Previously activated pass is available. New applications, payments, and route changes require internet.
          </div>
        )}

        <main className="flex-1 p-4 sm:p-6">{children}</main>
      </div>
      <ChatWidget />
    </div>
  );
}
