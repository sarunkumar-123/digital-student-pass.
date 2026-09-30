import type { Application } from "./store";

/**
 * Canonical end-to-end application stages. The same application record is
 * read and updated by the Student, College and MTC portals.
 */
export type ApplicationStage =
  | "DRAFT"
  | "SUBMITTED"
  | "COLLEGE_PENDING"
  | "COLLEGE_VERIFIED"
  | "COLLEGE_REJECTED"
  | "MTC_PENDING"
  | "MTC_APPROVED"
  | "MTC_REJECTED"
  | "PAYMENT_PENDING"
  | "PAYMENT_CONFIRMED"
  | "PASS_ACTIVE";

export interface ApplicationHistoryEntry {
  at: string;
  stage: ApplicationStage;
  note: string;
}

/** Canonical stage of an application (new stage field wins, else mapped from legacy status). */
export function stageOf(app: Application): ApplicationStage {
  if (app.stage) return app.stage;
  switch (app.status) {
    case "draft": return "DRAFT";
    case "pending_college": return "COLLEGE_PENDING";
    case "college_verified": return "COLLEGE_VERIFIED";
    case "sent_to_mtc":
    case "mtc_review": return "MTC_PENDING";
    case "approved": return "PAYMENT_PENDING";
    case "payment_pending": return "PAYMENT_PENDING";
    case "paid": return "PAYMENT_CONFIRMED";
    case "activated": return "PASS_ACTIVE";
    case "rejected":
      return app.rejectedBy === "college" ? "COLLEGE_REJECTED" : "MTC_REJECTED";
    default: return "DRAFT";
  }
}

export const isCollegePending = (a: Application) =>
  ["COLLEGE_PENDING", "SUBMITTED", "DRAFT"].includes(stageOf(a)) || a.status === "pending_college";

export const isMtcPending = (a: Application) =>
  ["MTC_PENDING", "COLLEGE_VERIFIED"].includes(stageOf(a)) ||
  ["sent_to_mtc", "mtc_review", "college_verified"].includes(a.status);

export const isPaymentPending = (a: Application) =>
  ["MTC_APPROVED", "PAYMENT_PENDING"].includes(stageOf(a)) ||
  ["approved", "payment_pending"].includes(a.status);

export const isPaymentConfirmed = (a: Application) =>
  stageOf(a) === "PAYMENT_CONFIRMED" || a.status === "paid";

export const isPassActive = (a: Application) =>
  stageOf(a) === "PASS_ACTIVE" || a.status === "activated";

export const isRejected = (a: Application) =>
  ["COLLEGE_REJECTED", "MTC_REJECTED"].includes(stageOf(a)) || a.status === "rejected";

export function stageBadgeClass(a: Application): string {
  const s = stageOf(a);
  if (s === "PASS_ACTIVE" || s === "PAYMENT_CONFIRMED") return "badge-green";
  if (s === "MTC_APPROVED" || s === "PAYMENT_PENDING") return "badge-yellow";
  if (s === "COLLEGE_REJECTED" || s === "MTC_REJECTED") return "badge-red";
  if (s === "MTC_PENDING" || s === "COLLEGE_VERIFIED") return "badge-blue";
  return "badge-slate";
}

export function stageLabel(a: Application): string {
  const labels: Record<ApplicationStage, string> = {
    DRAFT: "Draft",
    SUBMITTED: "Submitted",
    COLLEGE_PENDING: "Pending College Verification",
    COLLEGE_VERIFIED: "College Verified",
    COLLEGE_REJECTED: "Rejected by College",
    MTC_PENDING: "Pending MTC Review",
    MTC_APPROVED: "MTC Approved",
    MTC_REJECTED: "Rejected by MTC",
    PAYMENT_PENDING: "Payment Required",
    PAYMENT_CONFIRMED: "Payment Confirmed",
    PASS_ACTIVE: "Pass Active",
  };
  return labels[stageOf(a)];
}

/** The five visual timeline steps shown to students. */
export interface TimelineStep {
  key: string;
  label: string;
  done: boolean;
  current: boolean;
  rejected?: boolean;
}

export function studentTimeline(a: Application): TimelineStep[] {
  const s = stageOf(a);
  const order: ApplicationStage[] = [
    "SUBMITTED",
    "COLLEGE_VERIFIED",
    "MTC_APPROVED",
    "PAYMENT_CONFIRMED",
    "PASS_ACTIVE",
  ];
  const rank: Record<string, number> = {
    SUBMITTED: 1,
    COLLEGE_PENDING: 1,
    COLLEGE_VERIFIED: 2,
    MTC_PENDING: 2,
    MTC_APPROVED: 3,
    PAYMENT_PENDING: 3,
    PAYMENT_CONFIRMED: 4,
    PASS_ACTIVE: 5,
  };
  const currentRank = s === "COLLEGE_REJECTED" || s === "MTC_REJECTED"
    ? s === "COLLEGE_REJECTED" ? 1 : 3
    : rank[s] ?? 0;
  const labels = [
    "Application Submitted",
    "College Verified",
    "MTC Approved",
    "Payment Confirmed",
    "Digital Pass Activated",
  ];
  return labels.map((label, i) => {
    const stepRank = i + 1;
    return {
      key: order[i],
      label,
      done: currentRank >= stepRank && s !== "COLLEGE_REJECTED" && s !== "MTC_REJECTED",
      current: currentRank === stepRank - 1 ||
        (stepRank === 2 && s === "COLLEGE_PENDING") ||
        (stepRank === 3 && s === "MTC_PENDING") ||
        (stepRank === 4 && s === "PAYMENT_PENDING"),
      rejected:
        (stepRank === 2 && s === "COLLEGE_REJECTED") ||
        (stepRank === 3 && s === "MTC_REJECTED"),
    };
  });
}

/** Sequential, human-readable application number: APP-0001. Legacy APP-YYYY-NNNN IDs are ignored. */
export function nextApplicationId(existing: Application[]): string {
  let max = 0;
  for (const a of existing) {
    const m = a.applicationId.match(/APP-(\d{4})$/i);
    if (m) max = Math.max(max, Number(m[1]));
  }
  return `APP-${String(max + 1).padStart(4, "0")}`;
}
