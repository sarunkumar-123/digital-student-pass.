"use client";

import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import { useStore } from "@/lib/store";
import { ArrowLeft, Receipt } from "lucide-react";

export default function MTCPayments() {
  const { payments, students } = useStore();
  return (
    <DashboardLayout>
      <div className="mb-5">
        <Link href="/dashboard/mtc" className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-[var(--mtc-blue)]">
          <ArrowLeft size={16} /> Back
        </Link>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">Payments & Transactions</h1>
        <p className="text-sm text-slate-600">
          <span className="font-semibold text-amber-700">Payment simulation —</span> these are
          prototype transactions. No payment gateway or bank is connected. They illustrate a
          proposed integration with MTC's existing financial/accounting process.
        </p>
      </div>
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Transaction ID</th><th>Student ID</th><th>Student Name</th><th>Amount</th><th>Method</th><th>Purpose</th><th>Date</th><th>Payment Status</th><th>Refund</th>
              </tr>
            </thead>
            <tbody>
              {payments.length === 0 && <tr><td colSpan={9} className="py-6 text-center text-slate-500">No transactions yet.</td></tr>}
              {payments.map(p => {
                const s = students.find(x => x.studentId === p.studentId);
                return (
                  <tr key={p.id}>
                    <td className="font-mono text-xs">{p.transactionId}</td>
                    <td className="font-mono text-xs">{p.studentId}</td>
                    <td className="text-sm">{s?.name || "—"}</td>
                    <td>₹{p.amount}</td>
                    <td className="uppercase text-xs">{p.paymentMethod || "—"}</td>
                    <td className="capitalize text-xs">{p.purpose?.replace("_", " ")}</td>
                    <td className="text-xs">{new Date(p.date).toLocaleString("en-IN")}</td>
                    <td>
                      {p.paymentStatus === "successful" ? <span className="badge badge-green">Successful</span> :
                       p.paymentStatus === "verifying" ? <span className="badge badge-yellow">Verifying</span> :
                       p.paymentStatus === "refund_initiated" ? <span className="badge badge-yellow">Refund init.</span> :
                       p.paymentStatus === "refunded" ? <span className="badge badge-slate">Refunded</span> :
                       <span className="badge badge-red">Failed</span>}
                    </td>
                    <td>
                      {p.refundStatus === "processing" ? <span className="badge badge-yellow">Processing</span> :
                       p.refundStatus === "completed" ? <span className="badge badge-green">Completed</span> :
                       <span className="text-xs text-slate-400">—</span>}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-6 notice-banner">
        <Receipt size={14} className="mr-1 inline" /> This is not a full accounting system. It demonstrates how payment confirmations and refund states could integrate with MTC's existing processes.
      </div>
    </DashboardLayout>
  );
}
