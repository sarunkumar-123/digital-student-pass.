"use client";

import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import { ArrowLeft, MessageCircle, Phone, Mail, FileText, Ticket } from "lucide-react";

export default function StudentHelp() {
  return (
    <DashboardLayout>
      <div className="mb-5">
        <Link href="/dashboard/student" className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-[var(--mtc-blue)]">
          <ArrowLeft size={16} /> Back
        </Link>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">Help & Support</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="card p-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
            <MessageCircle size={20} />
          </div>
          <h3 className="mt-3 font-bold">AI Assistant</h3>
          <p className="text-sm text-slate-600">Tap the blue chat icon at the bottom-right for instant answers.</p>
        </div>
        <div className="card p-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
            <Ticket size={20} />
          </div>
          <h3 className="mt-3 font-bold">Customer Care Ticket</h3>
          <p className="text-sm text-slate-600">Open a ticket from the AI chat if your issue isn't resolved. Status: Open → In Progress → Resolved.</p>
        </div>
        <div className="card p-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
            <Phone size={20} />
          </div>
          <h3 className="mt-3 font-bold">Helpline (prototype)</h3>
          <p className="text-sm text-slate-600">044-1800-XXX-XXXX (illustrative).</p>
        </div>
        <div className="card p-5">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-purple-100 text-purple-700">
            <FileText size={20} />
          </div>
          <h3 className="mt-3 font-bold">FAQ</h3>
          <Link href="/help" className="text-sm text-[var(--mtc-blue)] hover:underline">View public FAQ page →</Link>
        </div>
      </div>
    </DashboardLayout>
  );
}
