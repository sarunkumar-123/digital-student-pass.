"use client";

import Link from "next/link";
import { useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useStore, type Application } from "@/lib/store";
import {
  isMtcPending,
  isPaymentPending,
  isPaymentConfirmed,
  isPassActive,
  isRejected,
  stageOf,
} from "@/lib/application";
import {
  ArrowLeft,
  CheckCheck,
  XCircle,
  CreditCard,
  ShieldCheck,
  X,
  Bus,
} from "lucide-react";

type Filter = "pending" | "approved" | "rejected" | "all";

export default function MTCApprovals() {
  const {
    applications,
    passes,
    mtcApproveApplication,
    mtcRejectApplicationReason,
    studentPayForApplication,
  } = useStore();
  const [filter, setFilter] = useState<Filter>("pending");
  const [rejecting, setRejecting] = useState<Application | null>(null);
  const [reason, setReason] = useState("");

  const visible = applications.filter((a) => {
    if (filter === "pending") return isMtcPending(a);
    if (filter === "approved") return ["MTC_APPROVED", "PAYMENT_PENDING", "PAYMENT_CONFIRMED", "PASS_ACTIVE"].includes(stageOf(a));
    if (filter === "rejected") return isRejected(a);
    return true;
  });

  const hasActivePass = (sid: string) => passes.some((p) => p.studentId === sid && p.status === "active");

  const approve = (a: Application) => {
    if (hasActivePass(a.studentId)) {
      window.alert("Cannot approve: this student already has an active pass. One Student ID = one active pass.");
      return;
    }
    mtcApproveApplication(a.applicationId);
  };
  const confirmReject = () => {
    if (rejecting && reason.trim()) {
      mtcRejectApplicationReason(rejecting.applicationId, reason.trim());
      setRejecting(null);
      setReason("");
    }
  };

  return (
    <DashboardLayout>
      <div className="mb-5">
        <Link href="/dashboard/mtc" className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-[var(--mtc-blue)]">
          <ArrowLeft size={16} /> Back
        </Link>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">College Verified Applications</h1>
        <p className="text-sm text-slate-600">
          College-verified applications awaiting MTC decision — prototype representation of the proposed MTC approval workflow (not connected to MTC's internal system).
        </p>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {(["pending", "approved", "rejected", "all"] as Filter[]).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${
              filter === f ? "bg-[var(--mtc-blue)] text-white" : "border border-slate-300 bg-white text-slate-700"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {visible.length === 0 && <div className="card p-8 text-center text-slate-500">No applications for this filter.</div>}
        {visible.map((a) => {
          const active = hasActivePass(a.studentId);
          const s = stageOf(a);
          return (
            <div key={a.id} className="card p-5">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs text-slate-500">{a.applicationId}</span>
                    {active && <span className="badge badge-green">Pass Active</span>}
                  </div>
                  <div className="mt-1 text-lg font-bold">{a.studentName}</div>
                  <div className="text-xs text-slate-500">{a.studentId} • {a.course} • {a.year}</div>
                  <div className="mt-2 text-sm"><span className="text-slate-500">College:</span> {a.college}</div>
                  <div className="text-sm"><span className="text-slate-500">Route:</span> <strong>{a.origin} → {a.destination}</strong></div>
                  <div className="text-sm"><span className="text-slate-500">Pass Type:</span> {a.passType ?? "College Student Concession Ticket"}</div>
                  <div className="mt-2 text-xs text-slate-500">Academic year: {a.academicYear}</div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <div className="flex flex-wrap items-center justify-end gap-2 text-xs">
                    <span className="badge badge-green">College verified</span>
                    {s === "MTC_PENDING" && <span className="badge badge-yellow">MTC pending</span>}
                    {isPaymentPending(a) && <span className="badge badge-yellow">MTC approved · payment required</span>}
                    {isPaymentConfirmed(a) && <span className="badge badge-green">Payment confirmed</span>}
                    {isPassActive(a) && <span className="badge badge-green">Pass activated</span>}
                    {s === "MTC_REJECTED" && <span className="badge badge-red">MTC rejected</span>}
                  </div>
                  <div className="flex flex-wrap justify-end gap-2">
                    {isMtcPending(a) && (
                      <>
                        <button onClick={() => approve(a)} className="btn-success !px-3 !py-1.5 text-xs" disabled={active}>
                          <ShieldCheck size={14} /> Approve
                        </button>
                        <button onClick={() => { setRejecting(a); setReason(""); }} className="btn-danger !px-3 !py-1.5 text-xs">
                          <XCircle size={14} /> Reject
                        </button>
                      </>
                    )}
                    {isRejected(a) && (
                      <div className="max-w-xs rounded-md bg-red-50 p-2 text-xs text-red-900">
                        Rejected{a.rejectedBy ? ` by ${a.rejectedBy}` : ""}: {a.rejectionReason}
                      </div>
                    )}
                    {/* Prototype convenience: simulate the student's mock payment & pass activation */}
                    {isPaymentPending(a) && (
                      <button
                        onClick={() => studentPayForApplication(a.applicationId, "upi")}
                        className="btn-primary !px-3 !py-1.5 text-xs"
                        title="Prototype payment simulation — no real payment gateway is connected"
                      >
                        <CreditCard size={14} /> Simulate Payment &amp; Activate
                      </button>
                    )}
                    {isPassActive(a) && (
                      <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                        <Bus size={13} /> Pass active
                      </span>
                    )}
                    {isPaymentConfirmed(a) && !isPassActive(a) && (
                      <span className="inline-flex items-center gap-1 text-xs text-slate-600">
                        <CheckCheck size={13} /> Payment confirmed — activating…
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {rejecting && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-2xl">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold">Reject {rejecting.applicationId}</h3>
              <button onClick={() => setRejecting(null)} className="rounded-md p-1 hover:bg-slate-100"><X size={18} /></button>
            </div>
            <p className="mt-1 text-sm text-slate-600">{rejecting.studentId} · {rejecting.studentName}. The student will see this reason.</p>
            <label className="label-field mt-3">Rejection reason</label>
            <textarea
              className="input-field min-h-[90px]"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="e.g., Route information could not be verified."
            />
            <div className="mt-3 flex justify-end gap-2">
              <button onClick={() => setRejecting(null)} className="btn-secondary">Cancel</button>
              <button onClick={confirmReject} disabled={!reason.trim()} className="btn-danger disabled:opacity-50">Confirm Rejection</button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
