"use client";

import Link from "next/link";
import { useMemo } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useStore } from "@/lib/store";
import { demoServicesFor, demoScheduleFor, demoStopsFor } from "@/lib/transport-demo";
import {
  ArrowLeft,
  Bus,
  MapPin,
  Clock,
  Navigation,
  ExternalLink,
} from "lucide-react";

export default function JourneyAssistancePage() {
  const { session, passes } = useStore();
  const activePass = passes.find((p) => p.studentId === session.id && p.status === "active");
  const origin = activePass?.origin ?? "Medavakkam";
  const destination = activePass?.destination ?? "Padur";
  const services = useMemo(() => demoServicesFor(origin, destination), [origin, destination]);
  const schedule = useMemo(() => demoScheduleFor(), []);
  const stops = useMemo(() => demoStopsFor(origin, destination), [origin, destination]);

  return (
    <DashboardLayout>
      <div className="mb-5">
        <Link href="/dashboard/student" className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-[var(--mtc-blue)]">
          <ArrowLeft size={16} /> Back
        </Link>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">Journey Assistance</h1>
        <p className="text-sm text-slate-600">
          Understand and plan your approved journey before using the existing Journey History validation flow.
        </p>
        <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-semibold text-slate-600">
          Transport, map and schedule information below is <strong className="mx-1">demo / simulated</strong> — no live MTC or map service is connected.
        </span>
      </div>

      {!activePass && (
        <div className="card mb-5 border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Your digital pass is not active yet. Journey Assistance becomes available after MTC approval and pass activation.{" "}
          <Link href="/dashboard/student/apply" className="font-semibold underline">View your application</Link>.
        </div>
      )}

      <div className="space-y-4">
        {/* A. Nearby Transport Services */}
        <section className="card p-5">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
            <Bus size={18} className="text-[var(--mtc-blue)]" /> Nearby Transport Services / Boarding Points
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Planning information relevant to your approved route <strong>{origin} → {destination}</strong>.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {services.map((s) => (
              <div key={s.serviceNo} className="rounded-xl border border-slate-200 bg-white p-3">
                <div className="flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-[var(--mtc-blue)] px-2 py-0.5 text-xs font-bold text-white">
                    <Bus size={12} /> {s.serviceNo}
                  </span>
                  <span className="text-[10px] font-semibold uppercase text-slate-500">{s.kind}</span>
                </div>
                <div className="mt-2 text-xs text-slate-700"><MapPin size={11} className="mr-1 inline" />{s.boardingPoint}</div>
                <div className="text-xs text-slate-500">{s.towards}</div>
                <div className="mt-1 flex justify-between text-[11px] text-slate-500">
                  <span>{s.frequency}</span><span>{s.approximateFare}</span>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-3 rounded-md border border-dashed border-slate-300 bg-slate-50 p-2 text-[11px] text-slate-600">
            <ExternalLink size={12} className="mr-1 inline" />
            <strong>External Transport-Service Integration (proposed):</strong> the system may obtain service information
            from an authorized external transport-service platform, subject to API availability and authorization. No such
            platform is connected in this prototype.
          </p>
        </section>

        {/* B. Map-Based Route Assistance */}
        <section className="card p-5">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
            <Navigation size={18} className="text-[var(--mtc-blue)]" /> Map-Based Route and Bus-Stop Assistance
          </h2>
          <div className="relative mt-4 overflow-hidden rounded-xl border border-slate-200 bg-[#eef3f8]">
            <div className="absolute right-2 top-2 z-10 rounded-md bg-white/90 px-2 py-1 text-[10px] font-semibold text-slate-600 shadow-sm">
              DEMO / SIMULATED MAP — not a live map service
            </div>
            <svg viewBox="0 0 400 180" className="h-48 w-full sm:h-60" role="img" aria-label="Simulated route map">
              <path d="M30 150 C 110 40, 150 160, 220 90 S 330 30, 370 40" fill="none" stroke="#9db8d6" strokeWidth="6" strokeLinecap="round" strokeDasharray="2 10" />
              <path d="M30 150 C 110 40, 150 160, 220 90 S 330 30, 370 40" fill="none" stroke="#0b4f9b" strokeWidth="3" strokeLinecap="round" />
              {stops.map((stop) => {
                const t = stop.order / (stops.length - 1);
                const x = 30 + t * 340;
                const y = 110 - Math.sin(t * Math.PI) * 70;
                return (
                  <g key={stop.name}>
                    <circle cx={x} cy={y} r={stop.boarding || stop.destination ? 7 : 4.5}
                      fill={stop.boarding ? "#059669" : stop.destination ? "#dc2626" : "#0b4f9b"} stroke="#fff" strokeWidth="2" />
                    <text x={x} y={y - 12} textAnchor="middle" fontSize="8" fill="#334155">
                      {stop.boarding ? "Boarding" : stop.destination ? "Destination" : ""}
                    </text>
                  </g>
                );
              })}
            </svg>
            <div className="grid gap-2 border-t border-slate-200 bg-white p-3 sm:grid-cols-2">
              <div className="text-xs"><MapPin size={12} className="mr-1 inline text-emerald-600" /><strong>Boarding:</strong> {stops[0]?.name}</div>
              <div className="text-xs"><MapPin size={12} className="mr-1 inline text-red-600" /><strong>Destination:</strong> {stops[stops.length - 1]?.name}</div>
            </div>
          </div>
          <ol className="mt-3 grid gap-1 sm:grid-cols-2 lg:grid-cols-4">
            {stops.map((s) => (
              <li key={s.name} className="flex items-center gap-2 text-xs text-slate-700">
                <span className={`h-2 w-2 flex-shrink-0 rounded-full ${s.boarding ? "bg-emerald-600" : s.destination ? "bg-red-600" : "bg-[var(--mtc-blue)]"}`} />
                {s.name}
                {s.boarding && <span className="badge badge-green !py-0 text-[10px]">Boarding</span>}
                {s.destination && <span className="badge badge-red !py-0 text-[10px]">Destination</span>}
              </li>
            ))}
          </ol>
          <p className="mt-3 rounded-md border border-dashed border-slate-300 bg-slate-50 p-2 text-[11px] text-slate-600">
            <Navigation size={12} className="mr-1 inline" />
            <strong>Map-Based Route Assistance (proposed):</strong> route, boarding-point, bus-stop and destination
            information may be displayed through an authorized mapping service. No Google Maps or other mapping API is connected.
          </p>
        </section>

        {/* C. Schedule & Time Estimation */}
        <section className="card p-5">
          <h2 className="flex items-center gap-2 text-lg font-bold text-slate-900">
            <Clock size={18} className="text-[var(--mtc-blue)]" /> Journey Schedule &amp; Estimated Travel Time
          </h2>
          <span className="mt-1 inline-block text-[11px] font-semibold text-amber-700">Demo / Simulated Schedule Data — not official live MTC timing.</span>
          <div className="mt-3 overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr><th>Service</th><th>Departure</th><th>Boarding</th><th>Est. Duration</th><th>Expected Arrival</th></tr>
              </thead>
              <tbody>
                {schedule.map((row) => (
                  <tr key={row.label} className={row.label === "Recommended" ? "bg-emerald-50" : ""}>
                    <td className="text-xs font-semibold">{row.label}{row.label === "Recommended" && " ★"}</td>
                    <td className="text-xs">{row.departure}</td>
                    <td className="text-xs">{row.boarding}</td>
                    <td className="text-xs">{row.durationMinutes} minutes</td>
                    <td className="text-xs font-semibold">{row.arrival}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

      </div>
    </DashboardLayout>
  );
}
