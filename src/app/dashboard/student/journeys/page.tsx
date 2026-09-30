"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import DashboardLayout from "@/components/DashboardLayout";
import { useStore, type Journey } from "@/lib/store";
import { DAILY_JOURNEY_LIMIT, PROTOTYPE_CONFIG } from "@/lib/config";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Lock,
  Check,
} from "lucide-react";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function ymd(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function monthLabel(year: number, month: number) {
  return new Date(year, month, 1).toLocaleDateString("en-IN", { month: "long", year: "numeric" });
}

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString("en-IN", {
    day: "numeric", month: "short", year: "numeric",
  });
}

function sundayIndex(jsDay: number) {
  return jsDay % 7;
}

/** Journeys for a date, ordered by their automatically assigned slot. */
function orderedSlots(journeys: Journey[]): Journey[] {
  return [...journeys]
    .slice(0, DAILY_JOURNEY_LIMIT)
    .sort((a, b) => (a.slot ?? 0) - (b.slot ?? 0) || a.time.localeCompare(b.time));
}

export default function JourneysPage() {
  const { journeys, session, passes, lockJourney, addNotification } = useStore();
  const activePass = passes.find((p) => p.studentId === session.id && p.status === "active");

  // Calendar defaults to the active pass (renewal) month.
  const now = new Date();
  const defaultYear = activePass ? new Date(activePass.validityStart).getFullYear() : now.getFullYear();
  const defaultMonth = activePass ? new Date(activePass.validityStart).getMonth() : now.getMonth();
  const [cursor, setCursor] = useState({ year: defaultYear, month: defaultMonth });
  const [selected, setSelected] = useState<string>(ymd(defaultYear, defaultMonth, now.getDate()));
  const [busServiceId, setBusServiceId] = useState("");
  const [message, setMessage] = useState<string | null>(null);

  const myJourneys = useMemo(
    () => journeys.filter((j) => j.studentId === session.id),
    [journeys, session.id]
  );

  const byDate = useMemo(() => {
    const map: Record<string, Journey[]> = {};
    for (const j of myJourneys) {
      if (!map[j.date]) map[j.date] = [];
      map[j.date].push(j);
    }
    return map;
  }, [myJourneys]);

  const daysInMonth = new Date(cursor.year, cursor.month + 1, 0).getDate();
  const leadingBlanks = sundayIndex(new Date(cursor.year, cursor.month, 1).getDay());

  const cells: Array<{ day: number; iso: string } | null> = [
    ...Array.from({ length: leadingBlanks }, () => null),
    ...Array.from({ length: daysInMonth }, (_, i) => ({
      day: i + 1,
      iso: ymd(cursor.year, cursor.month, i + 1),
    })),
  ];

  const todayIso = ymd(now.getFullYear(), now.getMonth(), now.getDate());
  const todaySlots = orderedSlots(byDate[todayIso] ?? []);
  const usedToday = todaySlots.length;
  const limitReached = usedToday >= DAILY_JOURNEY_LIMIT;
  const selectedSlots = orderedSlots(byDate[selected] ?? []);

  const prevMonth = () => {
    setCursor((c) => {
      const d = new Date(c.year, c.month - 1, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  };
  const nextMonth = () => {
    setCursor((c) => {
      const d = new Date(c.year, c.month + 1, 1);
      return { year: d.getFullYear(), month: d.getMonth() };
    });
  };

  const lock = () => {
    setMessage(null);
    if (!session.id) return;
    if (!activePass) {
      setMessage("You need an active digital pass to record a journey.");
      return;
    }
    if (limitReached) {
      setMessage("Daily travel allocation reached. You cannot record another journey today.");
      return;
    }
    const id = busServiceId.trim();
    if (!id) {
      setMessage("Enter a bus/service identifier before recording the journey.");
      return;
    }
    const created = lockJourney(session.id, id, todayIso);
    if (!created) {
      setMessage("Daily travel allocation reached. You cannot record another journey today.");
      return;
    }
    setBusServiceId("");
    const assignedSlot = created.slot ?? usedToday + 1;
    setMessage(`Journey recorded — bus/service ID ${id} automatically assigned to Slot ${assignedSlot}.`);
    addNotification({
      studentId: session.id,
      message: `Journey recorded. Bus/service ID: ${id} → Slot ${assignedSlot}.`,
      type: "success",
    });
  };

  return (
    <DashboardLayout>
      <div className="mb-5">
        <Link href="/dashboard/student" className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-[var(--mtc-blue)]">
          <ArrowLeft size={16} /> Back
        </Link>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">Journey History</h1>
        <p className="text-sm text-slate-600">
          Date-specific journey tracking for the active monthly pass.
        </p>
      </div>

      <div className="space-y-4">
        {/* Start Journey */}
        <div className="card p-5">
          <h2 className="text-lg font-bold text-slate-900">Start Journey</h2>
          <p className="mt-1 text-sm text-slate-600">
            Today ({formatDate(todayIso)}): <strong>{usedToday} / {DAILY_JOURNEY_LIMIT}</strong> slots used.
            Enter the bus/service identifier and the next available slot is assigned automatically —
            you do not choose a slot manually.
          </p>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row">
            <input
              type="text"
              className="input-field flex-1"
              value={busServiceId}
              onChange={(e) => setBusServiceId(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && lock()}
              placeholder="Enter Chennai One Bus ID"
              disabled={limitReached}
            />
            <button
              type="button"
              onClick={lock}
              disabled={limitReached}
              className="btn-primary disabled:cursor-not-allowed disabled:opacity-50"
            >
              Lock Journey
            </button>
          </div>

          <div className="mt-3 grid grid-cols-4 gap-2">
            {Array.from({ length: DAILY_JOURNEY_LIMIT }, (_, i) => {
              const slot = todaySlots[i];
              return (
                <div
                  key={i}
                  className={`rounded-lg border p-2 text-center text-xs font-medium ${
                    slot
                      ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                      : "border-slate-200 bg-white text-slate-500"
                  }`}
                >
                  <div className="font-semibold">Slot {i + 1}</div>
                  <div className="mt-0.5 truncate">{slot ? slot.bus : "Available"}</div>
                </div>
              );
            })}
          </div>

          {limitReached && (
            <div className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
              <Lock size={14} className="mr-1 inline" />
              <strong>Daily travel allocation reached.</strong> You have used all {DAILY_JOURNEY_LIMIT} journeys
              allowed for today in this prototype. You cannot record another journey today.
            </div>
          )}
          {message && (
            <div className="mt-3 rounded-md border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
              {message}
            </div>
          )}
          <p className="mt-2 text-xs text-slate-500">
            The bus/service identifier is recorded and associated with the journey. This prototype does
            not verify it against a live MTC route/service database; that validation is a proposed
            future integration.
          </p>
        </div>

        {/* Calendar */}
        <div className="card p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={prevMonth}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              aria-label="Previous month"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="text-base font-bold text-slate-900 sm:text-lg">
              {monthLabel(cursor.year, cursor.month)}
            </div>
            <button
              type="button"
              onClick={nextMonth}
              className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-700 hover:bg-slate-50"
              aria-label="Next month"
            >
              <ChevronRight size={18} />
            </button>
          </div>

          <div className="mb-2 grid grid-cols-7 gap-1 sm:gap-2">
            {WEEKDAYS.map((name) => (
              <div key={name} className="truncate px-0.5 text-center text-[10px] font-semibold uppercase tracking-wide text-slate-500 sm:text-xs">
                {name}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1 sm:gap-2">
            {cells.map((cell, idx) => {
              if (!cell) return <div key={`blank-${idx}`} className="min-h-[72px] sm:min-h-[90px]" />;
              const slots = orderedSlots(byDate[cell.iso] ?? []);
              const hasJourneys = slots.length > 0;
              const isSelected = selected === cell.iso;
              const isTodayCell = cell.iso === todayIso;
              return (
                <button
                  key={cell.iso}
                  type="button"
                  onClick={() => setSelected(cell.iso)}
                  className={`relative flex min-h-[72px] flex-col rounded-lg border p-1 text-left transition sm:min-h-[90px] sm:p-1.5 ${
                    isSelected
                      ? "border-[var(--mtc-blue)] bg-[var(--mtc-blue-light)]"
                      : hasJourneys
                      ? "border-emerald-200 bg-emerald-50"
                      : "border-slate-200 bg-white hover:border-slate-300"
                  }`}
                >
                  <span className={`text-[11px] font-semibold sm:text-sm ${isTodayCell ? "text-[var(--mtc-blue)]" : "text-slate-900"}`}>
                    {cell.day}
                    {isTodayCell && <span className="ml-1 text-[8px] font-bold uppercase text-[var(--mtc-blue)]">Today</span>}
                  </span>
                  <div className="mt-auto flex flex-col gap-0.5 pt-1">
                    {Array.from({ length: DAILY_JOURNEY_LIMIT }, (_, i) => {
                      const slot = slots[i];
                      return (
                        <span
                          key={i}
                          className={`truncate rounded px-0.5 text-[9px] font-medium sm:text-[10px] ${
                            slot ? "bg-emerald-600 text-white" : "text-slate-300"
                          }`}
                          title={slot ? `Slot ${slot.slot ?? i + 1} · Bus/Service ID: ${slot.bus}` : "Available slot"}
                        >
                          {slot ? `✓ S${slot.slot ?? i + 1} ${slot.bus}` : "□"}
                        </span>
                      );
                    })}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-slate-700">
            <span className="inline-flex items-center gap-1.5">
              <Check size={14} className="text-emerald-600" /> Used slot (bus/service ID shown)
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="text-slate-400">□</span> Available slot
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Lock size={13} /> Daily allocation reached
            </span>
          </div>
        </div>

        {/* Selected date journey record */}
        <div className="card p-5">
          <h2 className="text-lg font-bold text-slate-900">{formatDate(selected)}</h2>
          <p className="mt-1 text-sm text-slate-600">
            {selectedSlots.length} / {DAILY_JOURNEY_LIMIT} slots used
          </p>
          <ol className="mt-4 space-y-2">
            {Array.from({ length: DAILY_JOURNEY_LIMIT }, (_, i) => {
              const slot = selectedSlots[i];
              return (
                <li
                  key={i}
                  className={`rounded-lg border px-3 py-2 text-sm ${
                    slot ? "border-emerald-200 bg-emerald-50" : "border-slate-200 bg-white"
                  }`}
                >
                  {slot ? (
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-semibold text-emerald-900">
                        ✓ Slot {slot.slot ?? i + 1} — Bus/Service ID: {slot.bus} — Used
                      </span>
                      <span className="text-xs text-emerald-800">{slot.time} · Completed</span>
                    </div>
                  ) : (
                    <span className="font-medium text-slate-500">□ Slot {i + 1} — Available</span>
                  )}
                </li>
              );
            })}
          </ol>
          {selectedSlots.length >= DAILY_JOURNEY_LIMIT && (
            <div className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-amber-100 px-3 py-1 text-sm font-semibold text-amber-900">
              <Lock size={14} /> Daily limit reached
            </div>
          )}
        </div>
      </div>

      <p className="mt-4 text-xs text-slate-500">
        Prototype-configured maximum: {DAILY_JOURNEY_LIMIT} journeys per day. This is a demonstration
        setting and is not an official MTC rule; it can be adjusted to transport-authority policy in a
        future deployment. {PROTOTYPE_CONFIG.PROTOTYPE_NOTE}
      </p>
    </DashboardLayout>
  );
}
