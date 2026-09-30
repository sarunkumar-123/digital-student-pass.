"use client";

import { useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import { useStore } from "@/lib/store";
import {
  ArrowLeft,
  Calendar,
  CreditCard,
  CheckCircle2,
  AlertTriangle,
  Loader2,
  RefreshCw,
  Clock,
} from "lucide-react";

type PayState = "idle" | "method" | "processing" | "success" | "failed_pending" | "failed_refund";
type Method = "upi" | "card" | "netbanking";

export default function RenewPage() {
  const { passes, students, session, renewPass, recordPayment, activatePass, applications, offline } = useStore();
  const activePass = passes.find((p) => p.studentId === session.id && p.status === "active");
  const student = students.find((s) => s.studentId === session.id);

  const [state, setState] = useState<PayState>("idle");
  const [method, setMethod] = useState<Method>("upi");
  const [simulate, setSimulate] = useState<"success" | "failed_pending" | "failed_refund">("success");

  if (!activePass) {
    return (
      <DashboardLayout>
        <div className="card p-6">
          <h1 className="text-xl font-bold">No active pass</h1>
          <p className="mt-2 text-sm text-slate-600">
            You need an activated pass before you can renew. If your pass has
            expired, please submit a fresh application.
          </p>
          <Link href="/dashboard/student/apply" className="btn-primary mt-4">Apply for pass</Link>
        </div>
      </DashboardLayout>
    );
  }

  const daysLeft = Math.ceil((new Date(activePass.validityEnd).getTime() - Date.now()) / 86400000);
  const renewalAvailable = daysLeft <= 10 || daysLeft < 0;

  const submitPayment = () => {
    if (offline) {
      alert("Payments require an internet connection.");
      return;
    }
    setState("processing");
    setTimeout(() => {
      if (simulate === "success") {
        renewPass(session.id!, method);
        setState("success");
      } else if (simulate === "failed_pending") {
        recordPayment(session.id!, method, "renewal", "failed_pending");
        setState("failed_pending");
      } else {
        recordPayment(session.id!, method, "renewal", "failed_refund");
        setState("failed_refund");
      }
    }, 1600);
  };

  const reset = () => {
    setState("idle");
  };

  const newEnd = new Date(activePass.validityEnd);
  newEnd.setDate(newEnd.getDate() + 30);

  return (
    <DashboardLayout>
      <div className="mb-5">
        <Link href="/dashboard/student" className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-[var(--mtc-blue)]">
          <ArrowLeft size={16} /> Back
        </Link>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">Renew Monthly Pass</h1>
      </div>

      {state === "idle" && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="card p-6 lg:col-span-2">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-xs uppercase tracking-wide text-slate-500">Current Pass</div>
                <div className="mt-1 flex items-center gap-2 text-lg font-bold">
                  <span className="badge badge-green">ACTIVE</span>
                  {activePass.passType}
                </div>
                <div className="mt-2 text-sm text-slate-700">
                  Route: <strong>{activePass.origin} → {activePass.destination}</strong>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-1 text-xs text-slate-500"><Calendar size={13} /> Expires</div>
                <div className={`font-bold ${daysLeft <= 10 ? "text-amber-600" : "text-slate-900"}`}>
                  {new Date(activePass.validityEnd).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}
                </div>
                <div className="text-xs text-slate-500">
                  {daysLeft >= 0 ? `${daysLeft} day${daysLeft !== 1 ? "s" : ""} left` : "Expired"}
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-4 rounded-lg bg-slate-50 p-4">
              <div>
                <div className="text-xs text-slate-500">Renewal Amount</div>
                <div className="text-2xl font-bold text-slate-900">₹{activePass.monthlyAmount}</div>
                <div className="text-xs text-slate-500">{activePass.stages}-stage SCT example</div>
              </div>
              <div>
                <div className="text-xs text-slate-500">New Validity (if renewed today)</div>
                <div className="text-base font-bold text-slate-900">Until {newEnd.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
                <div className="text-xs text-slate-500">+30 days extension</div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-md border border-blue-200 bg-blue-50 p-3 text-xs text-blue-900">
              <AlertTriangle size={14} />
              Renewal is available {renewalAvailable ? "now" : "when your pass is within 10 days of expiry"}.
              This prototype shows the renewal flow with mocked payment results.
            </div>

            <div className="mt-4">
              <div className="label-field">Simulate payment result (prototype)</div>
              <div className="flex flex-wrap gap-2">
                <button onClick={() => setSimulate("success")} className={simulate === "success" ? "btn-primary !py-1.5 !px-3 text-xs" : "btn-secondary !py-1.5 !px-3 text-xs"}>Success</button>
                <button onClick={() => setSimulate("failed_pending")} className={simulate === "failed_pending" ? "btn-primary !py-1.5 !px-3 text-xs" : "btn-secondary !py-1.5 !px-3 text-xs"}>Failed — verifying</button>
                <button onClick={() => setSimulate("failed_refund")} className={simulate === "failed_refund" ? "btn-primary !py-1.5 !px-3 text-xs" : "btn-secondary !py-1.5 !px-3 text-xs"}>Failed — refund</button>
              </div>
            </div>

            <button
              onClick={() => {
                if (!renewalAvailable) {
                  alert("Renewal is available only within 10 days of expiry (prototype rule).");
                  return;
                }
                setState("method");
              }}
              className="btn-primary mt-5"
            >
              <RefreshCw size={16} /> Renew Pass
            </button>
          </div>

          <div className="card p-5">
            <h3 className="font-bold text-slate-900">About renewal</h3>
            <ul className="mt-3 space-y-2 text-sm text-slate-700">
              <li>• Renewal keeps your same route and college.</li>
              <li>• Pay online via UPI, card, or net banking.</li>
              <li>• Validity extends automatically after success.</li>
              <li>• Failed payments trigger verification/refund flow.</li>
              <li>• Need to change college or route? Use the Route Change page.</li>
            </ul>
            <div className="mt-4 text-xs text-slate-500">
              Pass holder: <strong>{student?.name}</strong> ({student?.studentId})
            </div>
          </div>
        </div>
      )}

      {state === "method" && (
        <div className="card mx-auto max-w-xl p-6">
          <h2 className="text-xl font-bold">Payment simulation</h2>
          <p className="mt-1 text-sm text-slate-600">
            Prototype payment processing — no real money is transferred and no UPI, bank, or
            payment gateway is connected. Demonstrated amount:{" "}
            <strong>₹{activePass.monthlyAmount}</strong>
          </p>

          <div className="mt-5 space-y-2">
            {([
              { id: "upi", label: "UPI (simulated)", desc: "Prototype option — not connected to any UPI app" },
              { id: "card", label: "Debit / Credit Card (simulated)", desc: "Prototype option — no card is charged" },
              { id: "netbanking", label: "Net Banking (simulated)", desc: "Prototype option — no bank is connected" },
            ] as { id: Method; label: string; desc: string }[]).map((m) => (
              <label key={m.id} className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 ${method === m.id ? "border-[var(--mtc-blue)] bg-[var(--mtc-blue-light)]" : "border-slate-200"}`}>
                <input type="radio" name="pm" checked={method === m.id} onChange={() => setMethod(m.id)} className="mt-1" />
                <div>
                  <div className="font-semibold text-slate-900">{m.label}</div>
                  <div className="text-xs text-slate-600">{m.desc}</div>
                </div>
              </label>
            ))}
          </div>

          <div className="mt-5 flex gap-2">
            <button onClick={() => setState("idle")} className="btn-secondary">Cancel</button>
            <button onClick={submitPayment} className="btn-primary flex-1">
              <CreditCard size={16} /> Simulate Payment of ₹{activePass.monthlyAmount}
            </button>
          </div>
        </div>
      )}

      {state === "processing" && (
        <div className="card mx-auto max-w-xl p-10 text-center">
          <Loader2 className="mx-auto h-10 w-10 animate-spin text-[var(--mtc-blue)]" />
          <div className="mt-4 font-semibold">Simulating payment…</div>
          <div className="text-sm text-slate-500">Prototype payment processing — no bank or gateway is contacted.</div>
        </div>
      )}

      {state === "success" && (
        <div className="card mx-auto max-w-xl p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="mt-4 text-2xl font-bold">Simulated Payment Successful</h2>
          <p className="mt-2 text-slate-600">Prototype transaction of ₹{activePass.monthlyAmount} ({method.toUpperCase()}) completed. No real money was transferred.</p>
          <div className="mx-auto mt-4 max-w-sm rounded-md bg-emerald-50 p-3 text-left text-sm text-emerald-900">
            <div className="font-semibold">Pass Renewal Successful</div>
            <div className="mt-1">New validity: until {newEnd.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</div>
          </div>
          <button onClick={reset} className="btn-primary mt-5">Done</button>
        </div>
      )}

      {state === "failed_pending" && (
        <div className="card mx-auto max-w-xl p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-amber-600">
            <Clock size={32} />
          </div>
          <h2 className="mt-4 text-xl font-bold">Payment verification in progress</h2>
          <p className="mt-2 text-sm text-slate-600">
            We couldn't get an immediate confirmation from your bank. We're
            checking the transaction status. This usually resolves within a few
            minutes.
          </p>
          <div className="mt-4 rounded-md bg-slate-50 p-3 text-left text-xs text-slate-700">
            <div>Amount: ₹{activePass.monthlyAmount}</div>
            <div>Method: {method.toUpperCase()}</div>
            <div>Status: verifying…</div>
          </div>
          <button onClick={reset} className="btn-secondary mt-5">Close</button>
        </div>
      )}

      {state === "failed_refund" && (
        <div className="card mx-auto max-w-xl p-8 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100 text-red-600">
            <AlertTriangle size={32} />
          </div>
          <h2 className="mt-4 text-xl font-bold">Payment failed — Refund initiated</h2>
          <p className="mt-2 text-sm text-slate-600">
            The transaction was confirmed as failed but money appears to have
            been deducted. A refund has been initiated.
          </p>
          <div className="mx-auto mt-4 max-w-sm rounded-md bg-amber-50 p-3 text-left text-sm text-amber-900">
            <div className="flex items-center justify-between"><span>Refund status</span><span className="font-semibold">Processing</span></div>
            <div className="mt-1 text-xs">Target refund processing time: <strong>2–3 hours</strong>. Actual bank timelines may vary; we do not guarantee every bank will process within this window.</div>
          </div>
          <button onClick={reset} className="btn-primary mt-5">Okay</button>
        </div>
      )}
    </DashboardLayout>
  );
}
