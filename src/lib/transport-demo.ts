/**
 * DEMO / SIMULATED transport-assistance data.
 *
 * No external mapping or transport-service platform (e.g. Google Maps or
 * Chalo) is connected. These deterministic sample results illustrate the
 * proposed Journey Assistance module and are tied to the student's approved
 * origin → destination. A production deployment would source this from
 * authorized external services subject to API availability/authorization.
 */

export interface DemoService {
  serviceNo: string;
  boardingPoint: string;
  towards: string;
  frequency: string;
  approximateFare: string;
  kind: "MTC" | "Share" | "External";
}

export interface DemoSchedule {
  label: string;
  departure: string;
  boarding: string;
  durationMinutes: number;
  arrival: string;
}

export interface DemoBusStop {
  name: string;
  order: number;
  boarding?: boolean;
  destination?: boolean;
}

const STOPS_BY_ROUTE: DemoBusStop[] = [
  { name: "Origin Bus Stop", order: 0, boarding: true },
  { name: "Medavakkam Junction", order: 1 },
  { name: "Sithalapakkam", order: 2 },
  { name: "Arasankalani", order: 3 },
  { name: "Semmancheri", order: 4 },
  { name: "Sholinganallur", order: 5 },
  { name: "College / Destination Gate", order: 6, destination: true },
];

function addMinutes(time: string, mins: number): string {
  const m = time.match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
  if (!m) return time;
  let h = Number(m[1]);
  const min = Number(m[2]) + mins;
  const ap = m[3].toUpperCase();
  if (ap === "PM" && h !== 12) h += 12;
  if (ap === "AM" && h === 12) h = 0;
  const total = h * 60 + min;
  let nh = Math.floor(total / 60) % 24;
  const nm = total % 60;
  const nap = nh >= 12 ? "PM" : "AM";
  nh = nh % 12 || 12;
  return `${nh}:${String(nm).padStart(2, "0")} ${nap}`;
}

/** Deterministic demo schedule for the morning college trip. */
export function demoScheduleFor(): DemoSchedule[] {
  const departures = ["7:20 AM", "7:50 AM", "8:00 AM", "8:25 AM"];
  return departures.map((departure, i) => {
    const duration = 32 + ((i * 7) % 9); // 32–40 minutes
    const boarding = addMinutes(departure, 5);
    return {
      label: ["Service A", "Service B", "Recommended", "Service D"][i],
      departure,
      boarding,
      durationMinutes: duration,
      arrival: addMinutes(boarding, duration),
    };
  });
}

export function demoServicesFor(origin: string, destination: string): DemoService[] {
  const originLabel = origin || "Origin";
  const destLabel = destination || "Destination";
  return [
    {
      serviceNo: "570",
      boardingPoint: `${originLabel} Main Road`,
      towards: `${destLabel} via Sholinganallur`,
      frequency: "Every 12–18 min",
      approximateFare: "₹12–₹18",
      kind: "MTC",
    },
    {
      serviceNo: "19B",
      boardingPoint: `${originLabel} Junction`,
      towards: `${destLabel} via Semmancheri`,
      frequency: "Every 20–25 min",
      approximateFare: "₹14–₹20",
      kind: "MTC",
    },
    {
      serviceNo: "5A",
      boardingPoint: `${originLabel} Temple Stop`,
      towards: `${destLabel} (limited stop)`,
      frequency: "Every 30 min",
      approximateFare: "₹15–₹22",
      kind: "MTC",
    },
    {
      serviceNo: "Share Auto",
      boardingPoint: `${originLabel} Share Stand`,
      towards: destLabel,
      frequency: "On demand",
      approximateFare: "₹25",
      kind: "Share",
    },
  ];
}

export function demoStopsFor(origin: string, destination: string): DemoBusStop[] {
  return STOPS_BY_ROUTE.map((s) => {
    if (s.boarding) return { ...s, name: `${origin || "Origin"} Boarding Point` };
    if (s.destination) return { ...s, name: `${destination || "Destination"} (College Gate)` };
    return s;
  });
}
