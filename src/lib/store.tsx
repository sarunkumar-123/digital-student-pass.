"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { DAILY_JOURNEY_LIMIT } from "@/lib/config";
import {
  validateRecords,
  countRecords,
  type BulkStudentRecord,
} from "@/lib/bulk";
import {
  nextApplicationId,
  type ApplicationStage,
  type ApplicationHistoryEntry,
} from "@/lib/application";

export type Role = "student" | "college" | "mtc" | null;

export interface Student {
  id: string;
  studentId: string;
  name: string;
  password: string;
  photo?: string;
  dob?: string;
  phone?: string;
  email?: string;
  college: string;
  course?: string;
  year?: string;
  status: "active" | "graduated" | "discontinued" | "inactive";
}

export interface Application {
  id: string;
  applicationId: string;
  studentId: string;
  studentName: string;
  college: string;
  course?: string;
  year?: string;
  academicYear?: string;
  origin: string;
  destination: string;
  phone?: string;
  email?: string;
  dob?: string;
  passType?: string;
  /** Canonical end-to-end stage shared by all three portals. */
  stage?: ApplicationStage;
  /** Legacy status kept in sync for backward compatibility. */
  status:
    | "draft"
    | "pending_college"
    | "college_verified"
    | "sent_to_mtc"
    | "mtc_review"
    | "approved"
    | "rejected"
    | "payment_pending"
    | "paid"
    | "activated";
  collegeVerification: "pending" | "verified" | "rejected";
  mtcApproval: "pending" | "approved" | "rejected";
  paymentStatus?: "pending" | "confirmed";
  rejectedBy?: "college" | "mtc";
  rejectionReason?: string;
  submittedAt: string;
  history?: ApplicationHistoryEntry[];
}

/** A college-verified master record created/updated from the Excel upload. */
export interface StudentMasterRecord {
  studentId: string;
  studentName: string;
  course: string;
  academicYear: string;
  yearOfStudy: string;
  collegeName: string;
  origin: string;
  destination: string;
  mobile: string;
  email: string;
  passType: string;
  source: "excel" | "seed";
  updatedAt: string;
}

export interface Pass {
  id: string;
  passId: string;
  studentId: string;
  passType: string;
  origin: string;
  destination: string;
  validityStart: string;
  validityEnd: string;
  status: "active" | "expired" | "deactivated";
  monthlyAmount: number;
  stages: number;
  /** Linked application of record (one pass per approved application). */
  applicationId?: string;
}

export interface Payment {
  id: string;
  transactionId: string;
  studentId: string;
  amount: number;
  paymentMethod?: "upi" | "card" | "netbanking";
  paymentStatus: "pending" | "successful" | "failed" | "verifying" | "refund_initiated" | "refunded";
  refundStatus?: "none" | "processing" | "completed";
  date: string;
  purpose: "new_pass" | "renewal";
}

export interface Journey {
  id: string;
  journeyId: string;
  studentId: string;
  route: string;
  /** Bus / service identifier entered by the student (recorded, not live-verified). */
  bus: string;
  date: string;
  time: string;
  /** Automatically assigned daily slot (1..DAILY_JOURNEY_LIMIT). Never chosen manually. */
  slot?: number;
  syncStatus: "synced" | "pending" | "offline";
}

export interface RouteChangeRequest {
  id: string;
  requestId: string;
  studentId: string;
  studentName: string;
  oldOrigin: string;
  oldDestination: string;
  newOrigin: string;
  newDestination: string;
  reason: string;
  collegeStatus: "pending" | "approved" | "rejected";
  mtcStatus: "pending" | "approved" | "rejected";
  submittedAt: string;
}

export interface Notification {
  id: string;
  notificationId: string;
  studentId: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  date: string;
  read: boolean;
}

export interface SupportTicket {
  id: string;
  ticketId: string;
  studentId?: string;
  issueType: string;
  description: string;
  applicationId?: string;
  contactNumber?: string;
  status: "open" | "in_progress" | "resolved";
  createdAt: string;
}

export interface Session {
  role: Role;
  id: string | null;
  deviceName?: string;
  isNewDevice?: boolean;
}

export type BulkMtcStatus =
  | "draft" // uploaded, college reviewing/correcting
  | "submitted" // verified by college, sent to MTC, pending MTC review
  | "approved"
  | "rejected"
  | "correction_required"; // MTC returned for correction

export interface BulkSubmission {
  submissionId: string;
  collegeId: string;
  collegeName: string;
  academicYear: string;
  uploadFileName: string;
  uploadDate: string;
  submittedAt?: string;
  mtcDecidedAt?: string;
  mtcReason?: string;
  records: BulkStudentRecord[];
  counts: ReturnType<typeof countRecords>;
  verificationStatus: "not_verified" | "verified";
  mtcStatus: BulkMtcStatus;
}

interface StoreState {
  session: Session;
  students: Student[];
  applications: Application[];
  passes: Pass[];
  payments: Payment[];
  journeys: Journey[];
  routeChanges: RouteChangeRequest[];
  notifications: Notification[];
  tickets: SupportTicket[];
  bulkSubmissions: BulkSubmission[];
  masterRecords: StudentMasterRecord[];
  offline: boolean;
}

const STORAGE_KEY = "mtc_dsp_state_v4";

const today = new Date();
const addDays = (d: Date, n: number) => {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x.toISOString().split("T")[0];
};

const isoNow = () => new Date().toISOString();

const seedStudents: Student[] = [
  {
    id: "s1",
    studentId: "STU2026001",
    name: "Arun Kumar",
    password: "student123",
    dob: "2004-05-12",
    phone: "9876543210",
    email: "arun.kumar@jeppiaarcollege.edu.in",
    college: "Jeppiaar College of Arts and Science",
    course: "B.Com",
    year: "II",
    status: "active",
  },
  {
    id: "s2",
    studentId: "STU2026002",
    name: "Divya Rajan",
    password: "student123",
    dob: "2004-11-20",
    phone: "9876501234",
    email: "divya.r@jeppiaarcollege.edu.in",
    college: "Jeppiaar College of Arts and Science",
    course: "B.Sc Computer Science",
    year: "III",
    status: "active",
  },
  {
    id: "s3",
    studentId: "STU2026003",
    name: "Karthik S",
    password: "student123",
    college: "Jeppiaar College of Arts and Science",
    course: "BBA",
    year: "I",
    status: "active",
  },
  // Primary demo identity for the end-to-end flow (matches the Excel master-record ID).
  {
    id: "s4",
    studentId: "JAS001",
    name: "Arun Kumar",
    password: "student123",
    phone: "9876543210",
    email: "arun.jas001@jeppiaarcollege.edu.in",
    college: "Jeppiaar College of Arts and Science",
    course: "B.Com Accounting & Finance",
    year: "3",
    status: "active",
  },
];

/** College-verified master records (simulated Excel import). These do NOT create applications. */
const seedMasterRecords: StudentMasterRecord[] = [
  {
    studentId: "JAS001",
    studentName: "Arun Kumar",
    course: "B.Com Accounting & Finance",
    academicYear: "2026-27",
    yearOfStudy: "3",
    collegeName: "Jeppiaar College of Arts and Science",
    origin: "Medavakkam",
    destination: "Padur",
    mobile: "9876543210",
    email: "arun.jas001@jeppiaarcollege.edu.in",
    passType: "College Student Concession Ticket",
    source: "seed",
    updatedAt: isoNow(),
  },
  {
    studentId: "JAS002",
    studentName: "Divya Rajan",
    course: "B.Sc Computer Science",
    academicYear: "2026-27",
    yearOfStudy: "2",
    collegeName: "Jeppiaar College of Arts and Science",
    origin: "Velachery",
    destination: "Padur",
    mobile: "9876501234",
    email: "divya.jas002@jeppiaarcollege.edu.in",
    passType: "College Student Concession Ticket",
    source: "seed",
    updatedAt: isoNow(),
  },
  {
    studentId: "JAS003",
    studentName: "Karthik S",
    course: "BBA",
    academicYear: "2026-27",
    yearOfStudy: "1",
    collegeName: "Jeppiaar College of Arts and Science",
    origin: "Tambaram",
    destination: "Padur",
    mobile: "9876502345",
    email: "karthik.jas003@jeppiaarcollege.edu.in",
    passType: "College Student Concession Ticket",
    source: "seed",
    updatedAt: isoNow(),
  },
];

const seedPasses: Pass[] = [
  {
    id: "p1",
    passId: "MTC-PASS-001",
    studentId: "STU2026001",
    passType: "College Student Concession Ticket",
    origin: "Medavakkam",
    destination: "Padur",
    validityStart: addDays(today, -20),
    validityEnd: addDays(today, 10),
    status: "active",
    monthlyAmount: 280,
    stages: 10,
  },
];

const seedApplications: Application[] = [
  {
    id: "a1",
    applicationId: "APP-2026-1042",
    studentId: "STU2026001",
    studentName: "Arun Kumar",
    college: "Jeppiaar College of Arts and Science",
    course: "B.Com",
    year: "II",
    academicYear: "2026-27",
    origin: "Medavakkam",
    destination: "Padur",
    phone: "9876543210",
    email: "arun.kumar@jeppiaarcollege.edu.in",
    dob: "2004-05-12",
    status: "activated",
    collegeVerification: "verified",
    mtcApproval: "approved",
    submittedAt: new Date(today.getTime() - 25 * 86400000).toISOString(),
  },
  {
    id: "a2",
    applicationId: "APP-2026-1043",
    studentId: "STU2026002",
    studentName: "Divya Rajan",
    college: "Jeppiaar College of Arts and Science",
    course: "B.Sc Computer Science",
    year: "III",
    academicYear: "2026-27",
    origin: "Tambaram",
    destination: "Padur",
    phone: "9876501234",
    status: "pending_college",
    collegeVerification: "pending",
    mtcApproval: "pending",
    submittedAt: new Date(today.getTime() - 2 * 86400000).toISOString(),
  },
  {
    id: "a3",
    applicationId: "APP-2026-1044",
    studentId: "STU2026003",
    studentName: "Karthik S",
    college: "Jeppiaar College of Arts and Science",
    course: "BBA",
    year: "I",
    academicYear: "2026-27",
    origin: "Velachery",
    destination: "Padur",
    status: "college_verified",
    collegeVerification: "verified",
    mtcApproval: "pending",
    submittedAt: new Date(today.getTime() - 5 * 86400000).toISOString(),
  },
];

const seedPayments: Payment[] = [
  {
    id: "pay1",
    transactionId: "TXN20260910001",
    studentId: "STU2026001",
    amount: 280,
    paymentMethod: "upi",
    paymentStatus: "successful",
    refundStatus: "none",
    date: new Date(today.getTime() - 20 * 86400000).toISOString(),
    purpose: "new_pass",
  },
];

// Seed history uses plain bus/service identifiers and pre-assigned slots.
// These are simulated records; the bus/service ID is recorded, not live-verified.
const seedJourneys: Journey[] = [
  { id: "j1", journeyId: "JRN001", studentId: "STU2026001", route: "—", bus: "570", date: "2026-09-10", time: "8:10 AM", slot: 1, syncStatus: "synced" },
  { id: "j2", journeyId: "JRN002", studentId: "STU2026001", route: "—", bus: "570", date: "2026-09-10", time: "1:20 PM", slot: 2, syncStatus: "synced" },
  { id: "j3", journeyId: "JRN003", studentId: "STU2026001", route: "—", bus: "19B", date: "2026-09-10", time: "4:30 PM", slot: 3, syncStatus: "synced" },
  { id: "j4", journeyId: "JRN004", studentId: "STU2026001", route: "—", bus: "570", date: "2026-09-11", time: "8:10 AM", slot: 1, syncStatus: "synced" },
  { id: "j5", journeyId: "JRN005", studentId: "STU2026001", route: "—", bus: "570", date: "2026-09-11", time: "1:20 PM", slot: 2, syncStatus: "synced" },
  { id: "j6", journeyId: "JRN006", studentId: "STU2026001", route: "—", bus: "19B", date: "2026-09-11", time: "4:30 PM", slot: 3, syncStatus: "synced" },
  { id: "j7", journeyId: "JRN007", studentId: "STU2026001", route: "—", bus: "570", date: "2026-09-11", time: "6:15 PM", slot: 4, syncStatus: "synced" },
  { id: "j8", journeyId: "JRN008", studentId: "STU2026001", route: "—", bus: "570", date: "2026-09-08", time: "8:05 AM", slot: 1, syncStatus: "synced" },
  { id: "j9", journeyId: "JRN009", studentId: "STU2026001", route: "—", bus: "19B", date: "2026-09-08", time: "4:40 PM", slot: 2, syncStatus: "synced" },
  { id: "j10", journeyId: "JRN010", studentId: "STU2026001", route: "—", bus: "570", date: "2026-09-09", time: "8:12 AM", slot: 1, syncStatus: "synced" },
  { id: "j11", journeyId: "JRN011", studentId: "STU2026001", route: "—", bus: "570", date: "2026-09-15", time: "8:08 AM", slot: 1, syncStatus: "synced" },
  { id: "j12", journeyId: "JRN012", studentId: "STU2026001", route: "—", bus: "19B", date: "2026-09-15", time: "4:28 PM", slot: 2, syncStatus: "synced" },
];

const seedNotifications: Notification[] = [
  {
    id: "n1",
    notificationId: "NOTIF001",
    studentId: "STU2026001",
    message: "Pass expires in 10 days. Renewal available.",
    type: "warning",
    date: isoNow(),
    read: false,
  },
  {
    id: "n2",
    notificationId: "NOTIF002",
    studentId: "STU2026001",
    message: "MTC approved your pass application.",
    type: "success",
    date: new Date(today.getTime() - 21 * 86400000).toISOString(),
    read: true,
  },
];

const seedRouteChanges: RouteChangeRequest[] = [];
const seedTickets: SupportTicket[] = [];

const initialState: StoreState = {
  session: { role: null, id: null },
  students: seedStudents,
  applications: seedApplications,
  passes: seedPasses,
  payments: seedPayments,
  journeys: seedJourneys,
  routeChanges: seedRouteChanges,
  notifications: seedNotifications,
  tickets: seedTickets,
  bulkSubmissions: [],
  masterRecords: seedMasterRecords,
  offline: false,
};

interface StoreContextValue extends StoreState {
  hydrated: boolean;
  login: (role: Role, id: string, opts?: { newDevice?: boolean }) => void;
  logout: () => void;
  setOffline: (v: boolean) => void;
  addNotification: (n: Omit<Notification, "id" | "notificationId" | "date" | "read">) => void;
  markNotificationRead: (id: string) => void;
  submitApplication: (data: Partial<Application>) => Application;
  verifyApplicationCollege: (appId: string) => void;
  rejectApplicationCollege: (appId: string) => void;
  sendToMTC: (appId: string) => void;
  mtcApprove: (appId: string) => void;
  mtcReject: (appId: string) => void;
  recordPayment: (studentId: string, method: Payment["paymentMethod"], purpose: Payment["purpose"], simulate?: "success" | "failed_pending" | "failed_refund") => Payment;
  activatePass: (appId: string) => void;
  renewPass: (studentId: string, method: Payment["paymentMethod"]) => void;
  lockJourney: (studentId: string, chennaiOneBusId: string, date?: string) => Journey | null;
  submitRouteChange: (studentId: string, studentName: string, oldOrigin: string, oldDest: string, newOrigin: string, newDest: string, reason: string) => void;
  approveRouteChangeCollege: (id: string) => void;
  approveRouteChangeMTC: (id: string) => void;
  rejectRouteChange: (id: string) => void;
  createTicket: (data: Omit<SupportTicket, "id" | "ticketId" | "createdAt" | "status">) => void;
  updateTicketStatus: (id: string, status: SupportTicket["status"]) => void;
  updateStudent: (studentId: string, patch: Partial<Student>) => void;
  registerStudent: (data: Omit<Student, "id" | "status">) => Student;
  deactivatePass: (passId: string) => void;
  getStudentByStudentId: (sid: string) => Student | undefined;
  getActivePass: (studentId: string) => Pass | undefined;

  // Connected end-to-end application workflow
  getMasterRecord: (studentId: string) => StudentMasterRecord | undefined;
  submitPassApplication: (input: {
    studentId: string;
    origin: string;
    destination: string;
    passType: string;
  }) => Application | null;
  collegeVerifyApplication: (appId: string) => void;
  collegeRejectApplicationReason: (appId: string, reason: string) => void;
  mtcApproveApplication: (appId: string) => void;
  mtcRejectApplicationReason: (appId: string, reason: string) => void;
  studentPayForApplication: (appId: string, method?: "upi" | "card" | "netbanking") => void;

  // Bulk Excel verification/submission (college → MTC)
  createBulkSubmission: (input: {
    collegeId: string;
    collegeName: string;
    academicYear: string;
    uploadFileName: string;
    records: BulkStudentRecord[];
  }) => string;
  updateBulkRecord: (submissionId: string, rowId: string, patch: Partial<BulkStudentRecord>) => void;
  removeBulkRecord: (submissionId: string, rowId: string) => void;
  submitBulkToMTC: (submissionId: string) => void;
  decideBulkSubmission: (
    submissionId: string,
    decision: "approved" | "rejected" | "correction_required",
    reason?: string
  ) => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

function persist(next: StoreState) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {}
}

/** Merge seeded master records with any stored records (stored entries win on conflict). */
function mergeMasterRecords(seed: StudentMasterRecord[], stored: StudentMasterRecord[]): StudentMasterRecord[] {
  const map = new Map<string, StudentMasterRecord>();
  for (const r of seed) map.set(r.studentId.trim().toLowerCase(), r);
  for (const r of stored) map.set(r.studentId.trim().toLowerCase(), r);
  return [...map.values()];
}

/** Build the set of Student IDs that already have an active application/submission. */
function existingIdsFromState(s: StoreState, excludeSubmissionId?: string): Set<string> {
  const set = new Set<string>();
  for (const a of s.applications) {
    if (a.status !== "rejected") set.add(a.studentId.toLowerCase());
  }
  for (const sub of s.bulkSubmissions) {
    if (sub.submissionId === excludeSubmissionId) continue;
    if (sub.mtcStatus === "approved" || sub.mtcStatus === "submitted") {
      for (const r of sub.records) {
        if (r.studentId) set.add(r.studentId.trim().toLowerCase());
      }
    }
  }
  return set;
}

function revalidateRecords(records: BulkStudentRecord[], s: StoreState, excludeSubmissionId?: string) {
  return validateRecords(records, existingIdsFromState(s, excludeSubmissionId));
}

function loadPersisted(): StoreState {
  if (typeof window === "undefined") return initialState;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return initialState;
    const parsed = JSON.parse(raw) as Partial<StoreState>;
    return {
      ...initialState,
      ...parsed,
      session: parsed.session ?? initialState.session,
      students: parsed.students?.length ? parsed.students : initialState.students,
      applications: parsed.applications ?? initialState.applications,
      passes: parsed.passes ?? initialState.passes,
      payments: parsed.payments ?? initialState.payments,
      journeys: parsed.journeys ?? initialState.journeys,
      routeChanges: parsed.routeChanges ?? initialState.routeChanges,
      notifications: parsed.notifications ?? initialState.notifications,
      tickets: parsed.tickets ?? initialState.tickets,
      bulkSubmissions: parsed.bulkSubmissions ?? initialState.bulkSubmissions,
      masterRecords:
        parsed.masterRecords && parsed.masterRecords.length
          ? mergeMasterRecords(initialState.masterRecords, parsed.masterRecords)
          : initialState.masterRecords,
      offline: parsed.offline ?? false,
    };
  } catch {
    return initialState;
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<StoreState>(initialState);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setState(loadPersisted());
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    persist(state);
  }, [state, hydrated]);

  const login: StoreContextValue["login"] = useCallback((role, id, opts) => {
    setState((s) => {
      const next = {
        ...s,
        session: { role, id, isNewDevice: opts?.newDevice ?? false },
      };
      persist(next);
      return next;
    });
  }, []);

  const logout = useCallback(() => {
    setState((s) => {
      const next = { ...s, session: { role: null, id: null } as Session };
      persist(next);
      return next;
    });
  }, []);

  const setOffline = useCallback((v: boolean) => {
    setState((s) => ({ ...s, offline: v }));
  }, []);

  const addNotification: StoreContextValue["addNotification"] = useCallback((n) => {
    setState((s) => ({
      ...s,
      notifications: [
        {
          ...n,
          id: "n" + Math.random().toString(36).slice(2, 8),
          notificationId: "NOTIF" + Math.floor(Math.random() * 90000 + 10000),
          date: isoNow(),
          read: false,
        },
        ...s.notifications,
      ],
    }));
  }, []);

  const markNotificationRead = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
    }));
  }, []);

  const submitApplication: StoreContextValue["submitApplication"] = useCallback((data) => {
    const app: Application = {
      id: "a" + Math.random().toString(36).slice(2, 8),
      applicationId: "APP-2026-" + Math.floor(Math.random() * 9000 + 1000),
      studentId: data.studentId!,
      studentName: data.studentName!,
      college: data.college!,
      course: data.course,
      year: data.year,
      academicYear: data.academicYear || "2026-27",
      origin: data.origin!,
      destination: data.destination!,
      phone: data.phone,
      email: data.email,
      dob: data.dob,
      status: "pending_college",
      collegeVerification: "pending",
      mtcApproval: "pending",
      submittedAt: isoNow(),
    };
    setState((s) => ({
      ...s,
      applications: [app, ...s.applications],
    }));
    return app;
  }, []);

  const verifyApplicationCollege = useCallback((appId: string) => {
    setState((s) => ({
      ...s,
      applications: s.applications.map((a) =>
        a.applicationId === appId
          ? { ...a, collegeVerification: "verified", status: "college_verified" }
          : a
      ),
    }));
  }, []);

  const rejectApplicationCollege = useCallback((appId: string) => {
    setState((s) => ({
      ...s,
      applications: s.applications.map((a) =>
        a.applicationId === appId
          ? { ...a, collegeVerification: "rejected", status: "rejected" }
          : a
      ),
    }));
  }, []);

  const sendToMTC = useCallback((appId: string) => {
    setState((s) => ({
      ...s,
      applications: s.applications.map((a) =>
        a.applicationId === appId && a.collegeVerification === "verified"
          ? { ...a, status: "sent_to_mtc" }
          : a
      ),
    }));
  }, []);

  const mtcApprove = useCallback((appId: string) => {
    setState((s) => ({
      ...s,
      applications: s.applications.map((a) =>
        a.applicationId === appId
          ? { ...a, mtcApproval: "approved", status: "approved" }
          : a
      ),
    }));
  }, []);

  const mtcReject = useCallback((appId: string) => {
    setState((s) => ({
      ...s,
      applications: s.applications.map((a) =>
        a.applicationId === appId
          ? { ...a, mtcApproval: "rejected", status: "rejected" }
          : a
      ),
    }));
  }, []);

  const recordPayment: StoreContextValue["recordPayment"] = useCallback(
    (studentId, method, purpose, simulate = "success") => {
      const pay: Payment = {
        id: "pay" + Math.random().toString(36).slice(2, 8),
        transactionId: "TXN" + Date.now(),
        studentId,
        amount: 280,
        paymentMethod: method,
        paymentStatus:
          simulate === "success"
            ? "successful"
            : simulate === "failed_pending"
            ? "verifying"
            : "failed",
        refundStatus: simulate === "failed_refund" ? "processing" : "none",
        date: isoNow(),
        purpose,
      };
      setState((s) => {
        // mark app as paid
        const applications = s.applications.map((a) => {
          if (a.studentId === studentId && (a.status === "approved" || a.status === "payment_pending")) {
            return { ...a, status: "paid" as const };
          }
          return a;
        });
        return { ...s, payments: [pay, ...s.payments], applications };
      });
      return pay;
    },
    []
  );

  const activatePass = useCallback((appId: string) => {
    setState((s) => {
      const app = s.applications.find((a) => a.applicationId === appId);
      if (!app) return s;
      if (app.status !== "paid") return s;
      // check existing active pass
      const existing = s.passes.find(
        (p) => p.studentId === app.studentId && p.status === "active"
      );
      const newPass: Pass = {
        id: "p" + Math.random().toString(36).slice(2, 8),
        passId: "MTC-PASS-" + Math.floor(Math.random() * 9000 + 1000),
        studentId: app.studentId,
        passType: "College Student Concession Ticket",
        origin: app.origin,
        destination: app.destination,
        validityStart: addDays(today, 0),
        validityEnd: addDays(today, 30),
        status: "active",
        monthlyAmount: 280,
        stages: 10,
      };
      return {
        ...s,
        passes: [
          newPass,
          ...s.passes.map((p) =>
            p.id === existing?.id ? { ...p, status: "deactivated" as const } : p
          ),
        ],
        applications: s.applications.map((a) =>
          a.applicationId === appId ? { ...a, status: "activated" as const } : a
        ),
        notifications: [
          {
            id: "n" + Math.random().toString(36).slice(2, 8),
            notificationId: "NOTIF" + Math.floor(Math.random() * 90000 + 10000),
            studentId: app.studentId,
            message: "Your digital pass has been activated.",
            type: "success",
            date: isoNow(),
            read: false,
          },
          ...s.notifications,
        ],
      };
    });
  }, []);

  const renewPass = useCallback((studentId: string, method: Payment["paymentMethod"]) => {
    setState((s) => {
      const pay: Payment = {
        id: "pay" + Math.random().toString(36).slice(2, 8),
        transactionId: "TXN" + Date.now(),
        studentId,
        amount: 280,
        paymentMethod: method,
        paymentStatus: "successful",
        refundStatus: "none",
        date: isoNow(),
        purpose: "renewal",
      };
      const passes = s.passes.map((p) => {
        if (p.studentId === studentId && p.status === "active") {
          const currentEnd = new Date(p.validityEnd);
          const newEnd = new Date(currentEnd.getTime() + 30 * 86400000);
          return { ...p, validityEnd: newEnd.toISOString().split("T")[0] };
        }
        return p;
      });
      return {
        ...s,
        payments: [pay, ...s.payments],
        passes,
        notifications: [
          {
            id: "n" + Math.random().toString(36).slice(2, 8),
            notificationId: "NOTIF" + Math.floor(Math.random() * 90000 + 10000),
            studentId,
            message: "Pass renewed successfully. Validity extended by 30 days.",
            type: "success",
            date: isoNow(),
            read: false,
          },
          ...s.notifications,
        ],
      };
    });
  }, []);

  const lockJourney: StoreContextValue["lockJourney"] = useCallback(
    (studentId, chennaiOneBusId, date) => {
      const now = new Date();
      const day = date || now.toISOString().split("T")[0];
      const busLabel = chennaiOneBusId.trim();
      if (!busLabel) return null;
      let created: Journey | null = null;
      setState((s) => {
        // Count today's already-recorded journeys and enforce the prototype-configured daily limit.
        const todays = s.journeys
          .filter((j) => j.studentId === studentId && j.date === day)
          .sort((a, b) => (a.slot ?? 1) - (b.slot ?? 1));
        const used = todays.length;
        if (used >= DAILY_JOURNEY_LIMIT) return s;
        const nextSlot = used + 1; // automatic next-available slot assignment
        const j: Journey = {
          id: "j" + Math.random().toString(36).slice(2, 8),
          journeyId: "JRN" + Math.floor(Math.random() * 9000 + 1000),
          studentId,
          route: "—",
          bus: busLabel,
          date: day,
          time: now.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true }),
          slot: nextSlot,
          syncStatus: "synced",
        };
        created = j;
        const next = { ...s, journeys: [j, ...s.journeys] };
        persist(next);
        return next;
      });
      return created;
    },
    []
  );

  const submitRouteChange: StoreContextValue["submitRouteChange"] = useCallback(
    (studentId, studentName, oldOrigin, oldDest, newOrigin, newDest, reason) => {
      const rc: RouteChangeRequest = {
        id: "rc" + Math.random().toString(36).slice(2, 8),
        requestId: "RCR-" + Math.floor(Math.random() * 9000 + 1000),
        studentId,
        studentName,
        oldOrigin,
        oldDestination: oldDest,
        newOrigin,
        newDestination: newDest,
        reason,
        collegeStatus: "pending",
        mtcStatus: "pending",
        submittedAt: isoNow(),
      };
      setState((s) => ({ ...s, routeChanges: [rc, ...s.routeChanges] }));
    },
    []
  );

  const approveRouteChangeCollege = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      routeChanges: s.routeChanges.map((r) =>
        r.id === id ? { ...r, collegeStatus: "approved" } : r
      ),
    }));
  }, []);

  const approveRouteChangeMTC = useCallback((id: string) => {
    setState((s) => {
      const req = s.routeChanges.find((r) => r.id === id);
      if (!req) return s;
      return {
        ...s,
        routeChanges: s.routeChanges.map((r) =>
          r.id === id ? { ...r, mtcStatus: "approved" } : r
        ),
        passes: s.passes.map((p) =>
          p.studentId === req.studentId && p.status === "active"
            ? { ...p, origin: req.newOrigin, destination: req.newDestination }
            : p
        ),
        applications: s.applications.map((a) =>
          a.studentId === req.studentId
            ? {
                ...a,
                origin: req.newOrigin,
                destination: req.newDestination,
                history: [
                  ...(a.history ?? []),
                  { at: isoNow(), stage: (a.stage ?? "PASS_ACTIVE") as ApplicationStage, note: `Approved route updated to ${req.newOrigin} → ${req.newDestination}.` },
                ],
              }
            : a
        ),
        notifications: [
          {
            id: "n" + Math.random().toString(36).slice(2, 8),
            notificationId: "NOTIF" + Math.floor(Math.random() * 90000 + 10000),
            studentId: req.studentId,
            message: `Route change approved. New route: ${req.newOrigin} → ${req.newDestination}`,
            type: "success",
            date: isoNow(),
            read: false,
          },
          ...s.notifications,
        ],
      };
    });
  }, []);

  const rejectRouteChange = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      routeChanges: s.routeChanges.map((r) =>
        r.id === id ? { ...r, collegeStatus: "rejected", mtcStatus: "rejected" } : r
      ),
    }));
  }, []);

  const createTicket = useCallback(
    (data: Omit<SupportTicket, "id" | "ticketId" | "createdAt" | "status">) => {
      setState((s) => ({
        ...s,
        tickets: [
          {
            ...data,
            id: "t" + Math.random().toString(36).slice(2, 8),
            ticketId: "TKT" + Math.floor(Math.random() * 90000 + 10000),
            status: "open",
            createdAt: isoNow(),
          },
          ...s.tickets,
        ],
      }));
    },
    []
  );

  const updateTicketStatus = useCallback((id: string, status: SupportTicket["status"]) => {
    setState((s) => ({
      ...s,
      tickets: s.tickets.map((t) => (t.id === id ? { ...t, status } : t)),
    }));
  }, []);

  const updateStudent = useCallback((studentId: string, patch: Partial<Student>) => {
    setState((s) => ({
      ...s,
      students: s.students.map((st) => (st.studentId === studentId ? { ...st, ...patch } : st)),
    }));
  }, []);

  const registerStudent = useCallback((data: Omit<Student, "id" | "status">) => {
    const st: Student = {
      ...data,
      id: "s" + Math.random().toString(36).slice(2, 8),
      status: "active",
    };
    setState((s) => ({ ...s, students: [...s.students, st] }));
    return st;
  }, []);

  const deactivatePass = useCallback((passId: string) => {
    setState((s) => ({
      ...s,
      passes: s.passes.map((p) =>
        p.passId === passId ? { ...p, status: "deactivated" } : p
      ),
    }));
  }, []);

  const getStudentByStudentId = useCallback(
    (sid: string) => state.students.find((s) => s.studentId === sid),
    [state.students]
  );

  const getActivePass = useCallback(
    (studentId: string) => state.passes.find((p) => p.studentId === studentId && p.status === "active"),
    [state.passes]
  );

  // -------- Connected end-to-end application workflow --------
  const getMasterRecord: StoreContextValue["getMasterRecord"] = useCallback(
    (studentId) =>
      state.masterRecords.find((r) => r.studentId.trim().toLowerCase() === studentId.trim().toLowerCase()),
    [state.masterRecords]
  );

  /** Upsert college-verified master records from a bulk Excel submission. */
  const syncMasterFromRecords = useCallback((records: BulkStudentRecord[]) => {
    setState((s) => {
      const map = new Map<string, StudentMasterRecord>();
      for (const r of s.masterRecords) map.set(r.studentId.trim().toLowerCase(), r);
      for (const r of records) {
        if (r.validationStatus !== "valid" || !r.studentId) continue;
        map.set(r.studentId.trim().toLowerCase(), {
          studentId: r.studentId.trim(),
          studentName: r.studentName,
          course: r.course,
          academicYear: r.academicYear,
          yearOfStudy: r.yearOfStudy,
          collegeName: r.collegeName,
          origin: r.origin,
          destination: r.destination,
          mobile: r.mobile,
          email: r.email,
          passType: r.passType || "College Student Concession Ticket",
          source: "excel",
          updatedAt: isoNow(),
        });
      }
      const next = { ...s, masterRecords: [...map.values()] };
      persist(next);
      return next;
    });
  }, []);

  const submitPassApplication: StoreContextValue["submitPassApplication"] = useCallback(
    ({ studentId, origin, destination, passType }) => {
      let created: Application | null = null;
      setState((s) => {
        const master = s.masterRecords.find(
          (r) => r.studentId.trim().toLowerCase() === studentId.trim().toLowerCase()
        );
        if (!master) return s;
        // One active/pending application per Student ID.
        const blocked = s.applications.find((a) =>
          a.studentId.trim().toLowerCase() === studentId.trim().toLowerCase() &&
          !["rejected", "college_rejected", "mtc_rejected"].includes(a.status) &&
          !["COLLEGE_REJECTED", "MTC_REJECTED"].includes(a.stage ?? "")
        );
        if (blocked) return s;
        const now = isoNow();
        const app: Application = {
          id: "a" + Math.random().toString(36).slice(2, 8),
          applicationId: nextApplicationId(s.applications),
          studentId: master.studentId,
          studentName: master.studentName,
          college: master.collegeName,
          course: master.course,
          year: master.yearOfStudy,
          academicYear: master.academicYear,
          origin: origin || master.origin,
          destination: destination || master.destination,
          phone: master.mobile,
          email: master.email,
          passType: passType || master.passType,
          stage: "COLLEGE_PENDING",
          status: "pending_college",
          collegeVerification: "pending",
          mtcApproval: "pending",
          paymentStatus: "pending",
          submittedAt: now,
          history: [
            { at: now, stage: "SUBMITTED", note: "Application submitted by student — awaiting college verification." },
            { at: now, stage: "COLLEGE_PENDING", note: "Pending college verification." },
          ],
        };
        created = app;
        const next: StoreState = {
          ...s,
          applications: [app, ...s.applications],
          notifications: [
            {
              id: "n" + Math.random().toString(36).slice(2, 8),
              notificationId: "NOTIF" + Math.floor(Math.random() * 90000 + 10000),
              studentId: master.studentId,
              message: `Your application ${app.applicationId} has been submitted and is pending college verification.`,
              type: "success",
              date: now,
              read: false,
            },
            {
              id: "n" + Math.random().toString(36).slice(2, 8),
              notificationId: "NOTIF" + Math.floor(Math.random() * 90000 + 10000),
              studentId: "jeppiaar",
              message: `New student pass application ${app.applicationId} (${master.studentName}) received.`,
              type: "info",
              date: now,
              read: false,
            },
            ...s.notifications,
          ],
        };
        persist(next);
        return next;
      });
      return created;
    },
    []
  );

  const collegeVerifyApplication: StoreContextValue["collegeVerifyApplication"] = useCallback(
    (appId) => {
      setState((s) => {
        const now = isoNow();
        const applications = s.applications.map((a) => {
          if (a.applicationId !== appId) return a;
          const history = [
            ...(a.history ?? []),
            { at: now, stage: "COLLEGE_VERIFIED" as ApplicationStage, note: "Application verified by college." },
            { at: now, stage: "MTC_PENDING" as ApplicationStage, note: "Forwarded to MTC for approval." },
          ];
          return {
            ...a,
            stage: "MTC_PENDING" as ApplicationStage,
            status: "sent_to_mtc" as Application["status"],
            collegeVerification: "verified" as const,
            history,
          };
        });
        const app = applications.find((a) => a.applicationId === appId);
        const next: StoreState = {
          ...s,
          applications,
          notifications: app
            ? [
                {
                  id: "n" + Math.random().toString(36).slice(2, 8),
                  notificationId: "NOTIF" + Math.floor(Math.random() * 90000 + 10000),
                  studentId: app.studentId,
                  message: `Your application ${app.applicationId} has been verified by your college and forwarded to MTC.`,
                  type: "success",
                  date: now,
                  read: false,
                },
                {
                  id: "n" + Math.random().toString(36).slice(2, 8),
                  notificationId: "NOTIF" + Math.floor(Math.random() * 90000 + 10000),
                  studentId: "mtc",
                  message: `New verified application ${app.applicationId} from ${app.college} received.`,
                  type: "info",
                  date: now,
                  read: false,
                },
                ...s.notifications,
              ]
            : s.notifications,
        };
        persist(next);
        return next;
      });
    },
    []
  );

  const collegeRejectApplicationReason: StoreContextValue["collegeRejectApplicationReason"] = useCallback(
    (appId, reason) => {
      setState((s) => {
        const now = isoNow();
        const applications = s.applications.map((a) =>
          a.applicationId === appId
            ? {
                ...a,
                stage: "COLLEGE_REJECTED" as ApplicationStage,
                status: "rejected" as Application["status"],
                collegeVerification: "rejected" as const,
                rejectedBy: "college" as const,
                rejectionReason: reason,
                history: [
                  ...(a.history ?? []),
                  { at: now, stage: "COLLEGE_REJECTED" as ApplicationStage, note: `Rejected by college: ${reason}` },
                ],
              }
            : a
        );
        const app = applications.find((a) => a.applicationId === appId);
        const next: StoreState = {
          ...s,
          applications,
          notifications: app
            ? [
                {
                  id: "n" + Math.random().toString(36).slice(2, 8),
                  notificationId: "NOTIF" + Math.floor(Math.random() * 90000 + 10000),
                  studentId: app.studentId,
                  message: `Your application ${app.applicationId} was rejected by college. Reason: ${reason}`,
                  type: "error",
                  date: now,
                  read: false,
                },
                ...s.notifications,
              ]
            : s.notifications,
        };
        persist(next);
        return next;
      });
    },
    []
  );

  const mtcApproveApplication: StoreContextValue["mtcApproveApplication"] = useCallback((appId) => {
    setState((s) => {
      const now = isoNow();
      const applications = s.applications.map((a) => {
        if (a.applicationId !== appId) return a;
        return {
          ...a,
          // Canonical current stage remains MTC_APPROVED until the student completes the mock payment.
          // paymentStatus carries the pending condition; the next action transitions to PASS_ACTIVE.
          stage: "MTC_APPROVED" as ApplicationStage,
          status: "payment_pending" as Application["status"],
          mtcApproval: "approved" as const,
          paymentStatus: "pending" as const,
          history: [
            ...(a.history ?? []),
            { at: now, stage: "MTC_APPROVED" as ApplicationStage, note: "Application approved by MTC." },
            { at: now, stage: "PAYMENT_PENDING" as ApplicationStage, note: "Payment required to activate the digital pass." },
          ],
        };
      });
      const app = applications.find((a) => a.applicationId === appId);
      const next: StoreState = {
        ...s,
        applications,
        notifications: app
          ? [
              {
                id: "n" + Math.random().toString(36).slice(2, 8),
                notificationId: "NOTIF" + Math.floor(Math.random() * 90000 + 10000),
                studentId: app.studentId,
                message: `Your concession pass application ${app.applicationId} has been approved by MTC. Payment is required to activate your pass.`,
                type: "success",
                date: now,
                read: false,
              },
              ...s.notifications,
            ]
          : s.notifications,
      };
      persist(next);
      return next;
    });
  }, []);

  const mtcRejectApplicationReason: StoreContextValue["mtcRejectApplicationReason"] = useCallback(
    (appId, reason) => {
      setState((s) => {
        const now = isoNow();
        const applications = s.applications.map((a) =>
          a.applicationId === appId
            ? {
                ...a,
                stage: "MTC_REJECTED" as ApplicationStage,
                status: "rejected" as Application["status"],
                mtcApproval: "rejected" as const,
                rejectedBy: "mtc" as const,
                rejectionReason: reason,
                history: [
                  ...(a.history ?? []),
                  { at: now, stage: "MTC_REJECTED" as ApplicationStage, note: `Rejected by MTC: ${reason}` },
                ],
              }
            : a
        );
        const app = applications.find((a) => a.applicationId === appId);
        const next: StoreState = {
          ...s,
          applications,
          notifications: app
            ? [
                {
                  id: "n" + Math.random().toString(36).slice(2, 8),
                  notificationId: "NOTIF" + Math.floor(Math.random() * 90000 + 10000),
                  studentId: app.studentId,
                  message: `Your application ${app.applicationId} was rejected by MTC. Reason: ${reason}`,
                  type: "error",
                  date: now,
                  read: false,
                },
                ...s.notifications,
              ]
            : s.notifications,
        };
        persist(next);
        return next;
      });
    },
    []
  );

  /** Simulated student payment → confirms payment and activates the digital pass (no real gateway). */
  const studentPayForApplication: StoreContextValue["studentPayForApplication"] = useCallback(
    (appId, method = "upi") => {
      setState((s) => {
        const app = s.applications.find((a) => a.applicationId === appId);
        if (!app) return s;
        const now = isoNow();
        const payment: Payment = {
          id: "pay" + Math.random().toString(36).slice(2, 8),
          transactionId: "TXN" + Date.now(),
          studentId: app.studentId,
          amount: 280,
          paymentMethod: method,
          paymentStatus: "successful",
          refundStatus: "none",
          date: now,
          purpose: "new_pass",
        };
        const passNum = s.passes.length + 1;
        const start = new Date();
        const end = new Date();
        end.setDate(end.getDate() + 30);
        const pass: Pass = {
          id: "p" + Math.random().toString(36).slice(2, 8),
          passId: `MTC-PASS-${String(passNum).padStart(3, "0")}`,
          studentId: app.studentId,
          passType: app.passType || "College Student Concession Ticket",
          origin: app.origin,
          destination: app.destination,
          validityStart: start.toISOString().split("T")[0],
          validityEnd: end.toISOString().split("T")[0],
          status: "active",
          monthlyAmount: 280,
          stages: 10,
          applicationId: app.applicationId,
        };
        const applications = s.applications.map((a) =>
          a.applicationId === appId
            ? {
                ...a,
                stage: "PASS_ACTIVE" as ApplicationStage,
                status: "activated" as Application["status"],
                paymentStatus: "confirmed" as const,
                history: [
                  ...(a.history ?? []),
                  { at: now, stage: "PAYMENT_CONFIRMED" as ApplicationStage, note: "Prototype payment simulation completed." },
                  { at: now, stage: "PASS_ACTIVE" as ApplicationStage, note: `Digital pass ${pass.passId} activated.` },
                ],
              }
            : a
        );
        // Deactivate any older pass for the same student.
        const passes = [pass, ...s.passes.map((p) =>
          p.studentId === app.studentId && p.passId !== pass.passId
            ? { ...p, status: "deactivated" as const }
            : p
        )];
        const next: StoreState = {
          ...s,
          applications,
          passes,
          payments: [payment, ...s.payments],
          notifications: [
            {
              id: "n" + Math.random().toString(36).slice(2, 8),
              notificationId: "NOTIF" + Math.floor(Math.random() * 90000 + 10000),
              studentId: app.studentId,
              message: "Payment confirmed. Your digital student concession pass is now active.",
              type: "success",
              date: now,
              read: false,
            },
            ...s.notifications,
          ],
        };
        persist(next);
        return next;
      });
    },
    []
  );

  // -------- Bulk (Excel) college → MTC submission --------
  const createBulkSubmission: StoreContextValue["createBulkSubmission"] = useCallback(
    ({ collegeId, collegeName, academicYear, uploadFileName, records }) => {
      const submissionId =
        "BSM-" + academicYear.replace(/\D/g, "") + "-" + Math.floor(1000 + Math.random() * 9000);
      setState((s) => {
        // Rule-based validation (missing fields, format, in-file duplicates, system duplicates).
        const validated = validateRecords(records, existingIdsFromState(s));
        const submission: BulkSubmission = {
          submissionId,
          collegeId,
          collegeName,
          academicYear,
          uploadFileName,
          uploadDate: isoNow(),
          records: validated,
          counts: countRecords(validated),
          verificationStatus: "not_verified",
          mtcStatus: "draft",
        };
        const needs = submission.counts.correction + submission.counts.duplicate;
        // Valid Excel rows immediately become college-verified Student Master Records.
        const masterMap = new Map<string, StudentMasterRecord>();
        for (const r of s.masterRecords) masterMap.set(r.studentId.trim().toLowerCase(), r);
        for (const r of validated) {
          if (r.validationStatus !== "valid") continue;
          masterMap.set(r.studentId.trim().toLowerCase(), {
            studentId: r.studentId.trim(),
            studentName: r.studentName,
            course: r.course,
            academicYear: r.academicYear,
            yearOfStudy: r.yearOfStudy,
            collegeName: r.collegeName || collegeName,
            origin: r.origin,
            destination: r.destination,
            mobile: r.mobile,
            email: r.email,
            passType: r.passType || "College Student Concession Ticket",
            source: "excel",
            updatedAt: isoNow(),
          });
        }
        const next: StoreState = {
          ...s,
          bulkSubmissions: [submission, ...s.bulkSubmissions],
          masterRecords: [...masterMap.values()],
          notifications: [
            {
              id: "n" + Math.random().toString(36).slice(2, 8),
              notificationId: "NOTIF" + Math.floor(Math.random() * 90000 + 10000),
              studentId: collegeId,
              message: "Student list successfully uploaded.",
              type: "success",
              date: isoNow(),
              read: false,
            },
            ...(needs > 0
              ? [
                  {
                    id: "n" + Math.random().toString(36).slice(2, 8),
                    notificationId: "NOTIF" + Math.floor(Math.random() * 90000 + 10000),
                    studentId: collegeId,
                    message: `${submission.counts.correction} record(s) require correction and ${submission.counts.duplicate} are duplicates.`,
                    type: "warning" as const,
                    date: isoNow(),
                    read: false,
                  },
                ]
              : []),
            ...s.notifications,
          ],
        };
        persist(next);
        return next;
      });
      return submissionId;
    },
    []
  );

  const updateBulkRecord: StoreContextValue["updateBulkRecord"] = useCallback((submissionId, rowId, patch) => {
    setState((s) => {
      let validRecords: BulkStudentRecord[] = [];
      const bulkSubmissions = s.bulkSubmissions.map((sub) => {
        if (sub.submissionId !== submissionId) return sub;
        const records = sub.records.map((r) => (r.rowId === rowId ? { ...r, ...patch } : r));
        const revalidated = revalidateRecords(records, s, submissionId);
        validRecords = revalidated;
        return { ...sub, records: revalidated, counts: countRecords(revalidated) };
      });
      const masterMap = new Map<string, StudentMasterRecord>();
      for (const r of s.masterRecords) masterMap.set(r.studentId.trim().toLowerCase(), r);
      for (const r of validRecords) {
        if (r.validationStatus !== "valid") continue;
        masterMap.set(r.studentId.trim().toLowerCase(), {
          studentId: r.studentId.trim(),
          studentName: r.studentName,
          course: r.course,
          academicYear: r.academicYear,
          yearOfStudy: r.yearOfStudy,
          collegeName: r.collegeName,
          origin: r.origin,
          destination: r.destination,
          mobile: r.mobile,
          email: r.email,
          passType: r.passType || "College Student Concession Ticket",
          source: "excel",
          updatedAt: isoNow(),
        });
      }
      const next = { ...s, bulkSubmissions, masterRecords: [...masterMap.values()] };
      persist(next);
      return next;
    });
  }, []);

  const removeBulkRecord: StoreContextValue["removeBulkRecord"] = useCallback((submissionId, rowId) => {
    setState((s) => {
      let validRecords: BulkStudentRecord[] = [];
      const bulkSubmissions = s.bulkSubmissions.map((sub) => {
        if (sub.submissionId !== submissionId) return sub;
        const records = sub.records.filter((r) => r.rowId !== rowId);
        const revalidated = revalidateRecords(records, s, submissionId);
        validRecords = revalidated;
        return { ...sub, records: revalidated, counts: countRecords(revalidated) };
      });
      const masterMap = new Map<string, StudentMasterRecord>();
      for (const r of s.masterRecords) masterMap.set(r.studentId.trim().toLowerCase(), r);
      for (const r of validRecords) {
        if (r.validationStatus !== "valid") continue;
        masterMap.set(r.studentId.trim().toLowerCase(), {
          studentId: r.studentId.trim(),
          studentName: r.studentName,
          course: r.course,
          academicYear: r.academicYear,
          yearOfStudy: r.yearOfStudy,
          collegeName: r.collegeName,
          origin: r.origin,
          destination: r.destination,
          mobile: r.mobile,
          email: r.email,
          passType: r.passType || "College Student Concession Ticket",
          source: "excel",
          updatedAt: isoNow(),
        });
      }
      const next = { ...s, bulkSubmissions, masterRecords: [...masterMap.values()] };
      persist(next);
      return next;
    });
  }, []);

  const submitBulkToMTC: StoreContextValue["submitBulkToMTC"] = useCallback((submissionId) => {
    setState((s) => {
      const bulkSubmissions = s.bulkSubmissions.map((sub) =>
        sub.submissionId === submissionId
          ? {
              ...sub,
              verificationStatus: "verified" as const,
              mtcStatus: "submitted" as const,
              submittedAt: isoNow(),
            }
          : sub
      );
      const sub = bulkSubmissions.find((x) => x.submissionId === submissionId);
      let notifications = s.notifications;
      if (sub) {
        // Notify in-system students whose IDs appear in the verified list.
        const ids = new Set(sub.records.map((r) => r.studentId.trim().toLowerCase()));
        const studentNotes: Notification[] = s.students
          .filter((st) => ids.has(st.studentId.toLowerCase()))
          .flatMap((st) => [
            {
              id: "n" + Math.random().toString(36).slice(2, 8),
              notificationId: "NOTIF" + Math.floor(Math.random() * 90000 + 10000),
              studentId: st.studentId,
              message: "Your college has verified your student details.",
              type: "success" as const,
              date: isoNow(),
              read: false,
            },
            {
              id: "n" + Math.random().toString(36).slice(2, 8),
              notificationId: "NOTIF" + Math.floor(Math.random() * 90000 + 10000),
              studentId: st.studentId,
              message: "Your application has been submitted to MTC.",
              type: "info" as const,
              date: isoNow(),
              read: false,
            },
          ]);
        notifications = [
          {
            id: "n" + Math.random().toString(36).slice(2, 8),
            notificationId: "NOTIF" + Math.floor(Math.random() * 90000 + 10000),
            studentId: sub.collegeId,
            message: "Verified student list submitted to MTC.",
            type: "success",
            date: isoNow(),
            read: false,
          },
          ...studentNotes,
          ...notifications,
        ];
      }
      const next = { ...s, bulkSubmissions, notifications };
      persist(next);
      return next;
    });
  }, []);

  const decideBulkSubmission: StoreContextValue["decideBulkSubmission"] = useCallback(
    (submissionId, decision, reason) => {
      setState((s) => {
        const bulkSubmissions = s.bulkSubmissions.map((sub) =>
          sub.submissionId === submissionId
            ? {
                ...sub,
                mtcStatus: decision,
                mtcDecidedAt: isoNow(),
                mtcReason: reason || sub.mtcReason,
                // Correction returns the submission to the college as a draft.
                verificationStatus:
                  decision === "correction_required" ? ("not_verified" as const) : sub.verificationStatus,
              }
            : sub
        );
        const sub = bulkSubmissions.find((x) => x.submissionId === submissionId);
        let notifications = s.notifications;
        if (sub) {
          const ids = new Set(sub.records.map((r) => r.studentId.trim().toLowerCase()));
          const matchedStudents = s.students.filter((st) => ids.has(st.studentId.toLowerCase()));
          if (decision === "approved") {
            // Feed approved bulk verification into the existing pass workflow:
            // advance any pending student applications to MTC-approved / ready for payment.
            const applications = s.applications.map((a) => {
              if (!ids.has(a.studentId.toLowerCase())) return a;
              if (a.mtcApproval === "pending") {
                return { ...a, mtcApproval: "approved" as const, status: "approved" as Application["status"] };
              }
              return a;
            });
            const studentNotes: Notification[] = matchedStudents.map((st) => ({
              id: "n" + Math.random().toString(36).slice(2, 8),
              notificationId: "NOTIF" + Math.floor(Math.random() * 90000 + 10000),
              studentId: st.studentId,
              message: "Your concession pass has been approved by MTC.",
              type: "success",
              date: isoNow(),
              read: false,
            }));
            notifications = [...studentNotes, ...notifications];
            const next = { ...s, bulkSubmissions, notifications, applications };
            persist(next);
            return next;
          }
          if (decision === "correction_required") {
            notifications = [
              {
                id: "n" + Math.random().toString(36).slice(2, 8),
                notificationId: "NOTIF" + Math.floor(Math.random() * 90000 + 10000),
                studentId: sub.collegeId,
                message: `MTC requested correction for the submitted student list.${reason ? " Reason: " + reason : ""}`,
                type: "error",
                date: isoNow(),
                read: false,
              },
              ...notifications,
            ];
          }
        }
        const next = { ...s, bulkSubmissions, notifications };
        persist(next);
        return next;
      });
    },
    []
  );

  const value: StoreContextValue = {
    ...state,
    hydrated,
    login,
    logout,
    setOffline,
    addNotification,
    markNotificationRead,
    submitApplication,
    verifyApplicationCollege,
    rejectApplicationCollege,
    sendToMTC,
    mtcApprove,
    mtcReject,
    recordPayment,
    activatePass,
    renewPass,
    lockJourney,
    submitRouteChange,
    approveRouteChangeCollege,
    approveRouteChangeMTC,
    rejectRouteChange,
    createTicket,
    updateTicketStatus,
    updateStudent,
    registerStudent,
    deactivatePass,
    getStudentByStudentId,
    getActivePass,
    createBulkSubmission,
    updateBulkRecord,
    removeBulkRecord,
    submitBulkToMTC,
    decideBulkSubmission,
    getMasterRecord,
    submitPassApplication,
    collegeVerifyApplication,
    collegeRejectApplicationReason,
    mtcApproveApplication,
    mtcRejectApplicationReason,
    studentPayForApplication,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside StoreProvider");
  return ctx;
}
