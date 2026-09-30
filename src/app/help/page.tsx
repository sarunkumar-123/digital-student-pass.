import PublicLayout from "@/components/PublicLayout";
import Link from "next/link";

const faqs = [
  {
    q: "How do I apply for a digital student pass?",
    a: "Register/login as a student, fill the multi-step form (personal, college, route, documents), and submit. Your college verifies first, then MTC approves.",
  },
  {
    q: "Is ₹280 the fixed monthly price?",
    a: "No. ₹280 is shown as an example 10-stage SCT fare. Actual prices vary by stage count as per MTC's existing fare structure.",
  },
  {
    q: "Do I need to scan a QR code?",
    a: "No. The conductor visually verifies your photo, name, Student ID, college, route, validity, and green VALID indicator.",
  },
  {
    q: "Can I use the pass without internet?",
    a: "Yes. Once activated, the pass is cached on your device and can be displayed offline. Journey entries queue and sync when back online. New applications and payments require internet.",
  },
  {
    q: "What if payment fails but money was deducted?",
    a: "The system shows 'verification in progress'. If the transaction failed, a refund is initiated. Target processing time is 2–3 hours (bank timelines may vary).",
  },
  {
    q: "How do I change my route?",
    a: "Submit a route change request. College verifies, then MTC approves. Your old route remains active until the new route is approved. Proposed limit: 1–2 changes per academic year.",
  },
  {
    q: "What if my phone is lost or the battery dies?",
    a: "You can log in on another device using Student ID, password, and OTP. Always log out after using shared devices. If you can't use any device, the existing physical pass process remains available.",
  },
  {
    q: "I don't have a smartphone / stable internet.",
    a: "You can continue using the existing normal MTC student pass procedure. The digital system is an additional option, not a replacement.",
  },
  {
    q: "Is this an official MTC website?",
    a: "No. This is a prototype concept demonstrating how the existing process could be digitized. It is not an official MTC service.",
  },
];

export default function HelpPage() {
  return (
    <PublicLayout>
      <section className="bg-gradient-to-b from-[var(--mtc-blue-light)] to-white py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h1 className="text-4xl font-bold text-slate-900">Help & Support</h1>
          <p className="mt-3 text-slate-700">
            Answers to common questions about the proposed digital student pass.
            You can also click the blue AI Help button in the corner for
            interactive assistance.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <div className="space-y-4">
          {faqs.map((f, i) => (
            <details key={i} className="card group p-5">
              <summary className="flex cursor-pointer items-center justify-between gap-3 font-semibold text-slate-900">
                <span>{f.q}</span>
                <span className="text-slate-400 group-open:rotate-45 transition">+</span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-slate-700">{f.a}</p>
            </details>
          ))}
        </div>

        <div className="mt-10 card p-6">
          <h2 className="text-lg font-bold text-slate-900">Need more help?</h2>
          <p className="mt-2 text-sm text-slate-700">
            Use the AI chat (blue button, bottom-right) to ask custom questions,
            or click "Contact Customer Care" inside the chat to open a support
            ticket (status: Open → In Progress → Resolved).
          </p>
          <div className="mt-4">
            <Link href="/login" className="btn-primary">
              Login to raise a ticket
            </Link>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}
