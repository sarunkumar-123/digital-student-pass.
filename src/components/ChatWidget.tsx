"use client";

import { MessageCircle, X, Send, Bot, AlertCircle } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useStore } from "@/lib/store";

interface Msg {
  from: "bot" | "user";
  text: string;
}

const QUICK_REPLIES = [
  "How do I apply?",
  "How do I renew?",
  "Why is my application pending?",
  "How do I change my route?",
  "What happens if payment fails?",
  "Can I use my pass offline?",
  "What if my phone is lost?",
  "I don't have a smartphone",
];

function getReply(q: string): string {
  const s = q.toLowerCase();
  if (s.includes("appl"))
    return "To apply: log in as a student, go to 'Apply', fill in your personal, college, and route details, upload required documents, and submit. Your college will verify first, then MTC approves.";
  if (s.includes("renew"))
    return "Renewal is available near the end of your monthly cycle. In 'Renew', choose a payment option and run the payment simulation (₹280 is a 10-stage SCT example). Payment is simulated in this prototype — no real UPI/card/gateway is connected. On success, validity is extended by 30 days.";
  if (s.includes("pend"))
    return "Application status updates step-by-step: Submitted → College Verification → Sent to MTC → MTC Review → Approved → Payment → Activated. Each step may take a few working days.";
  if (s.includes("route") && s.includes("change"))
    return "Submit a route change request from the student menu. Your college verifies, then MTC approves. Your old route remains active until the new one is approved. Limit: 1–2 changes per academic year (proposed policy).";
  if (s.includes("payment") && s.includes("fail"))
    return "This is a payment simulation with no real bank or gateway. If it shows 'verifying', the prototype is demonstrating the verification state. The failed-refund option shows the proposed refund flow (target processing 2–3 hours; real bank timelines vary). No actual money is involved.";
  if (s.includes("offline"))
    return "Once activated, your pass is cached locally. You can view it without internet, including last-synced validity. Journey entries are queued and sync when online. New applications/payments need internet.";
  if (s.includes("phone") && (s.includes("lost") || s.includes("dead") || s.includes("new")))
    return "You can log in on another device using your Student ID, password, and OTP verification. Remember to log out after using a shared device. If your phone is unavailable you can also use the existing physical pass system.";
  if (s.includes("smartphone") || s.includes("internet"))
    return "Students without smartphones or reliable internet can continue to use the existing normal MTC student pass procedure. The digital system is an additional option, not a replacement.";
  if (s.includes("qr"))
    return "No QR code is required. The conductor verifies visually: photo, name, Student ID, college, validity, route and the green VALID status.";
  if (s.includes("refund"))
    return "Refund status is shown on the payment page. Target processing time: 2–3 hours. If it takes longer, please raise a support ticket.";
  if (s.includes("price") || s.includes("cost") || s.includes("280"))
    return "₹280 is shown as a 10-stage SCT example only, not a universal fixed price. Actual fares vary by stage count as per MTC's schedule.";
  if (s.includes("assistance") || s.includes("map") || s.includes("nearby") || s.includes("schedule") || s.includes("eta") || s.includes("bus stop") || s.includes("boarding"))
    return "Journey Assistance (student sidebar) helps you after the pass is active: Nearby Transport Services and boarding points for your approved route, a simulated Map-Based Route with bus stops, and a Demo/Simulated schedule with departure, boarding, duration and ETA. These are demo data — no live MTC, Chalo or mapping API is connected. From there you can enter your Bus/Service ID and validate & lock the journey, which consumes the next daily slot and writes the Journey History record.";
  if (s.includes("journey") || s.includes("slot") || s.includes("travel") || s.includes("bus id") || s.includes("chennai one"))
    return "In Journey History, enter the Chennai One Bus/Service ID and tap 'Lock Journey'. The system automatically assigns the next available slot (1→2→3→4). The prototype-configured maximum is 4 journeys per day; a 5th is blocked. This 4-journey value is a demo setting, not an official MTC rule, and can be changed. The bus/service ID is recorded — it is not verified against a live MTC database in this prototype.";
  return "I can help with application, renewal, route changes, payment, offline use, lost phone, and daily journey slots. Try a quick reply below, or click 'Contact Customer Care' to open a ticket.";
}

export function ChatWidget() {
  const { createTicket, session } = useStore();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([
    {
      from: "bot",
      text: "Hi! I'm the MTC Digital Student Pass assistant (prototype). Ask me anything about the service, or choose a topic below.",
    },
  ]);
  const [input, setInput] = useState("");
  const [showTicket, setShowTicket] = useState(false);
  const [ticketType, setTicketType] = useState("Application / Pass Issue");
  const [ticketDesc, setTicketDesc] = useState("");
  const [ticketAppId, setTicketAppId] = useState("");
  const [ticketPhone, setTicketPhone] = useState("");
  const [ticketSubmitted, setTicketSubmitted] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open, showTicket, ticketSubmitted]);

  const send = (text?: string) => {
    const q = (text ?? input).trim();
    if (!q) return;
    setMessages((m) => [...m, { from: "user", text: q }]);
    setInput("");
    setTimeout(() => {
      setMessages((m) => [...m, { from: "bot", text: getReply(q) }]);
    }, 350);
  };

  const submitTicket = () => {
    if (!ticketDesc.trim()) return;
    createTicket({
      studentId: session.role === "student" && session.id ? session.id : undefined,
      issueType: ticketType,
      description: ticketDesc,
      applicationId: ticketAppId || undefined,
      contactNumber: ticketPhone || undefined,
    });
    setTicketSubmitted(true);
    setTimeout(() => {
      setShowTicket(false);
      setTicketSubmitted(false);
      setTicketDesc("");
      setTicketAppId("");
      setTicketPhone("");
    }, 2000);
  };

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-5 right-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--mtc-blue)] text-white shadow-lg transition hover:bg-[var(--mtc-blue-dark)]"
        aria-label="AI Help"
      >
        {open ? <X size={24} /> : <MessageCircle size={24} />}
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-40 flex h-[560px] w-[calc(100vw-2.5rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">
          <div className="flex items-center gap-3 bg-[var(--mtc-blue)] px-4 py-3 text-white">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/20">
              <Bot size={18} />
            </div>
            <div>
              <div className="text-sm font-semibold">AI Support Assistant</div>
              <div className="text-xs text-white/80">
                Prototype • Can answer common questions
              </div>
            </div>
          </div>

          {!showTicket ? (
            <>
              <div className="flex-1 space-y-3 overflow-y-auto bg-slate-50 px-3 py-3">
                {messages.map((m, i) => (
                  <div
                    key={i}
                    className={`flex ${
                      m.from === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2 text-sm leading-relaxed ${
                        m.from === "user"
                          ? "bg-[var(--mtc-blue)] text-white"
                          : "border border-slate-200 bg-white text-slate-800"
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
                <div ref={endRef} />
              </div>

              <div className="border-t border-slate-200 bg-white px-3 py-2">
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {QUICK_REPLIES.slice(0, 4).map((q) => (
                    <button
                      key={q}
                      onClick={() => send(q)}
                      className="rounded-full border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-700 hover:bg-slate-100"
                    >
                      {q}
                    </button>
                  ))}
                </div>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    send();
                  }}
                  className="flex items-center gap-2"
                >
                  <input
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Type your question…"
                    className="input-field flex-1 !py-2 text-sm"
                  />
                  <button
                    type="submit"
                    className="flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--mtc-blue)] text-white"
                    aria-label="Send"
                  >
                    <Send size={16} />
                  </button>
                </form>
                <button
                  onClick={() => setShowTicket(true)}
                  className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-slate-200 py-1.5 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  <AlertCircle size={13} /> Contact Customer Care
                </button>
              </div>
            </>
          ) : (
            <div className="flex-1 overflow-y-auto bg-slate-50 p-4">
              <button
                onClick={() => setShowTicket(false)}
                className="mb-3 text-xs font-medium text-[var(--mtc-blue)] hover:underline"
              >
                ← Back to chat
              </button>
              {ticketSubmitted ? (
                <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                  ✓ Ticket submitted successfully. Our team will respond within 24–48 hours.
                </div>
              ) : (
                <div className="space-y-3">
                  <div>
                    <label className="label-field">Issue Type</label>
                    <select
                      className="input-field"
                      value={ticketType}
                      onChange={(e) => setTicketType(e.target.value)}
                    >
                      <option>Application / Pass Issue</option>
                      <option>Payment / Refund</option>
                      <option>Route Change</option>
                      <option>Login / Device</option>
                      <option>Other</option>
                    </select>
                  </div>
                  <div>
                    <label className="label-field">Description</label>
                    <textarea
                      className="input-field min-h-[90px]"
                      placeholder="Please describe your issue…"
                      value={ticketDesc}
                      onChange={(e) => setTicketDesc(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="label-field">Application ID (optional)</label>
                    <input
                      className="input-field"
                      value={ticketAppId}
                      onChange={(e) => setTicketAppId(e.target.value)}
                      placeholder="APP-2026-xxxx"
                    />
                  </div>
                  <div>
                    <label className="label-field">Contact Number (optional)</label>
                    <input
                      className="input-field"
                      value={ticketPhone}
                      onChange={(e) => setTicketPhone(e.target.value)}
                      placeholder="10-digit mobile"
                    />
                  </div>
                  <button onClick={submitTicket} className="btn-primary w-full">
                    Submit Ticket
                  </button>
                </div>
              )}
              <div ref={endRef} />
            </div>
          )}
        </div>
      )}
    </>
  );
}
