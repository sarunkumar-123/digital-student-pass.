"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import DashboardLayout from "@/components/DashboardLayout";
import { useStore, type BulkSubmission } from "@/lib/store";
import {
  downloadTemplate,
  readExcelFile,
  rowsToRecords,
  demoWorkbookRows,
  isExcelFile,
} from "@/lib/excel";
import type { BulkStudentRecord } from "@/lib/bulk";
import {
  ArrowLeft,
  UploadCloud,
  FileSpreadsheet,
  Download,
  CheckCircle2,
  AlertTriangle,
  Copy,
  Pencil,
  Trash2,
  Send,
  X,
  RotateCcw,
} from "lucide-react";

type Filter = "all" | "valid" | "correction" | "duplicate";

const COLLEGE_ID = "jeppiaar";
const COLLEGE_NAME = "Jeppiaar College of Arts and Science";

export default function BulkUploadPage() {
  const { bulkSubmissions, createBulkSubmission, updateBulkRecord, removeBulkRecord, submitBulkToMTC } = useStore();
  const [academicYear, setAcademicYear] = useState("2026-27");
  const [activeId, setActiveId] = useState<string | null>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [verified, setVerified] = useState(false);
  const [editing, setEditing] = useState<BulkStudentRecord | null>(null);
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [dragging, setDragging] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);

  const active: BulkSubmission | undefined = bulkSubmissions.find((b) => b.submissionId === activeId)
    ?? bulkSubmissions.find((b) => b.mtcStatus === "draft" || b.mtcStatus === "correction_required");

  const collegeSubmissions = useMemo(
    () => bulkSubmissions.filter((b) => b.collegeId === COLLEGE_ID),
    [bulkSubmissions]
  );

  const processRows = (fileName: string, rows: ReturnType<typeof rowsToRecords>) => {
    const id = createBulkSubmission({
      collegeId: COLLEGE_ID,
      collegeName: COLLEGE_NAME,
      academicYear,
      uploadFileName: fileName,
      records: rows,
    });
    setActiveId(id);
    setFilter("all");
    setVerified(false);
  };

  const handleFile = async (file: File) => {
    setNotice(null);
    if (!isExcelFile(file)) {
      setNotice("Please choose an .xlsx or .xls file.");
      return;
    }
    setBusy(true);
    try {
      const json = await readExcelFile(file);
      if (!json.length) {
        setNotice("No data rows found in the workbook. Check the template format.");
        return;
      }
      processRows(file.name, rowsToRecords(json));
    } finally {
      setBusy(false);
    }
  };

  const loadDemoFile = () => {
    setBusy(true);
    setTimeout(() => {
      processRows("students_2026_demo.xlsx", rowsToRecords(demoWorkbookRows()));
      setBusy(false);
    }, 300);
  };

  const filteredRecords = (active?.records ?? []).filter((r) =>
    filter === "all" ? true : r.validationStatus === filter
  );

  const canSubmit = !!active && active.counts.valid > 0 && active.counts.correction === 0 && active.counts.duplicate === 0;

  const resubmit = () => {
    if (!active) return;
    submitBulkToMTC(active.submissionId);
    setVerified(false);
    setActiveId(null);
    setNotice("Verified student list submitted to MTC.");
  };

  return (
    <DashboardLayout>
      <div className="mb-5">
        <Link href="/dashboard/college" className="inline-flex items-center gap-1 text-sm text-slate-600 hover:text-[var(--mtc-blue)]">
          <ArrowLeft size={16} /> Back
        </Link>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">Bulk Student Upload</h1>
        <p className="text-sm text-slate-600">
          Upload your existing eligible-student Excel list. The system applies rule-based validation,
          then you review and verify before it is sent to MTC. You do not need to re-enter students manually.
        </p>
      </div>

      {/* Upload card */}
      <div className="card p-5 sm:p-6">
        <div className="grid gap-4 md:grid-cols-[200px_1fr] md:items-start">
          <div>
            <label className="label-field">Academic Year</label>
            <select className="input-field" value={academicYear} onChange={(e) => setAcademicYear(e.target.value)}>
              <option value="2026-27">2026–27</option>
              <option value="2025-26">2025–26</option>
              <option value="2024-25">2024–25</option>
            </select>
            <button onClick={() => downloadTemplate()} className="btn-secondary mt-3 w-full !py-2 text-xs">
              <Download size={14} /> Download Excel Template
            </button>
          </div>

          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              const f = e.dataTransfer.files?.[0];
              if (f) void handleFile(f);
            }}
            className={`flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-center transition ${
              dragging ? "border-[var(--mtc-blue)] bg-[var(--mtc-blue-light)]" : "border-slate-300 bg-slate-50"
            }`}
          >
            <UploadCloud size={34} className="text-[var(--mtc-blue)]" />
            <div className="mt-2 text-sm font-semibold text-slate-800">Drag &amp; drop your Excel file here</div>
            <div className="text-xs text-slate-500">or</div>
            <button onClick={() => fileInput.current?.click()} className="btn-primary mt-2 !py-2 text-xs">
              <FileSpreadsheet size={14} /> Choose Excel File
            </button>
            <input
              ref={fileInput}
              type="file"
              accept=".xlsx,.xls"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void handleFile(f);
                e.target.value = "";
              }}
            />
            <div className="mt-2 text-[11px] text-slate-500">Supported format: .xlsx / .xls — processed entirely in this browser</div>
            <button onClick={loadDemoFile} disabled={busy} className="mt-3 text-xs font-semibold text-emerald-700 underline disabled:opacity-50">
              {busy ? "Processing…" : "Try the demo file (125 records: 118 valid · 5 correction · 2 duplicate)"}
            </button>
          </div>
        </div>
        {notice && (
          <div className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">{notice}</div>
        )}
      </div>

      {/* Active upload review */}
      {active && (
        <div className="card mt-5 p-5 sm:p-6">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="flex items-center gap-2 text-lg font-bold">
                <FileSpreadsheet size={18} className="text-emerald-700" /> {active.uploadFileName}
              </h2>
              <div className="mt-1 text-xs text-slate-500">
                {active.academicYear} · Uploaded {new Date(active.uploadDate).toLocaleString("en-IN")}
              </div>
            </div>
            <span className={`badge ${
              active.mtcStatus === "submitted" ? "badge-blue" :
              active.mtcStatus === "approved" ? "badge-green" :
              active.mtcStatus === "correction_required" ? "badge-yellow" :
              "badge-slate"
            }`}>
              {active.mtcStatus === "draft" ? "Reviewing" : active.mtcStatus.replace(/_/g, " ")}
            </span>
          </div>

          {/* Validation summary */}
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <SummaryCard label="Total Records" value={active.counts.total} tone="slate" onClick={() => setFilter("all")} activeFilter={filter === "all"} />
            <SummaryCard label="Valid" value={active.counts.valid} tone="green" onClick={() => setFilter("valid")} activeFilter={filter === "valid"} />
            <SummaryCard label="Needs Correction" value={active.counts.correction} tone="amber" onClick={() => setFilter("correction")} activeFilter={filter === "correction"} />
            <SummaryCard label="Duplicates" value={active.counts.duplicate} tone="amber" onClick={() => setFilter("duplicate")} activeFilter={filter === "duplicate"} />
          </div>

          {/* Review table */}
          <div className="mt-4 overflow-x-auto rounded-lg border border-slate-200">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Student ID</th><th>Name</th><th>Course</th><th>Year</th><th>Origin</th><th>Destination</th><th>Status</th><th>Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.length === 0 && (
                  <tr><td colSpan={8} className="py-6 text-center text-slate-500">No records in this category.</td></tr>
                )}
                {filteredRecords.map((r) => (
                  <tr key={r.rowId}>
                    <td className="font-mono text-xs">{r.studentId || "—"}</td>
                    <td className="text-xs">{r.studentName || <span className="text-red-600">Missing</span>}</td>
                    <td className="text-xs">{r.course || "—"}</td>
                    <td className="text-xs">{r.yearOfStudy || "—"}</td>
                    <td className="text-xs">{r.origin || "—"}</td>
                    <td className="text-xs">{r.destination || "—"}</td>
                    <td>
                      {r.validationStatus === "valid" ? (
                        <span className="badge badge-green"><CheckCircle2 size={11} /> Valid</span>
                      ) : r.validationStatus === "duplicate" ? (
                        <span className="badge badge-yellow" title={r.correctionReason}><Copy size={11} /> Duplicate ID</span>
                      ) : (
                        <span className="badge badge-yellow" title={r.correctionReason}><AlertTriangle size={11} /> {r.correctionReason.split("Missing ")[1]?.split(",")[0] || "Needs correction"}</span>
                      )}
                    </td>
                    <td>
                      <div className="flex gap-1">
                        <button onClick={() => setEditing(r)} className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-[var(--mtc-blue)] hover:bg-blue-50">
                          <Pencil size={12} /> Edit
                        </button>
                        <button
                          onClick={() => { if (window.confirm("Remove this record?")) removeBulkRecord(active.submissionId, r.rowId); }}
                          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-semibold text-red-600 hover:bg-red-50"
                        >
                          <Trash2 size={12} /> Remove
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Verification + submit */}
          {(active.mtcStatus === "draft" || active.mtcStatus === "correction_required") && (
            <div className="mt-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
              {canSubmit ? (
                <>
                  <div className="flex items-center gap-2 text-sm font-semibold text-emerald-800">
                    <CheckCircle2 size={16} /> Student records are ready for verification.
                  </div>
                  <label className="mt-3 flex items-start gap-2 text-sm text-slate-700">
                    <input type="checkbox" checked={verified} onChange={(e) => setVerified(e.target.checked)} className="mt-0.5" />
                    I confirm that these student records have been verified by the college.
                  </label>
                  <button onClick={resubmit} disabled={!verified} className="btn-primary mt-3 disabled:opacity-50">
                    <Send size={15} /> Submit Verified Student List to MTC
                  </button>
                  {active.mtcStatus === "correction_required" && active.mtcReason && (
                    <div className="mt-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900">
                      <strong>MTC correction request:</strong> {active.mtcReason}
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-start gap-2 text-sm text-amber-900">
                  <AlertTriangle size={16} className="mt-0.5 flex-shrink-0" />
                  <span>
                    Correct or remove every record flagged <strong>Needs Correction</strong> or <strong>Duplicate</strong> before
                    submitting. Remaining: {active.counts.correction + active.counts.duplicate} blocking record(s).
                  </span>
                </div>
              )}
            </div>
          )}

          {active.mtcStatus === "submitted" && (
            <div className="mt-4 space-y-1 rounded-lg border border-blue-200 bg-blue-50 p-4 text-sm">
              <div className="flex items-center gap-2 font-semibold text-blue-900"><CheckCircle2 size={15} /> College verification: Completed</div>
              <div className="flex items-center gap-2 font-semibold text-blue-900"><Send size={15} /> Submission: Sent to MTC ({active.counts.valid} students)</div>
              <div className="text-xs text-blue-800">Submitted {active.submittedAt ? new Date(active.submittedAt).toLocaleString("en-IN") : "—"}. Awaiting MTC review.</div>
            </div>
          )}
          {active.mtcStatus === "approved" && (
            <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-900">
              <CheckCircle2 size={15} className="mr-1 inline" /> MTC approval: Approved — Student pass processing is ready.
            </div>
          )}
          {active.mtcStatus === "rejected" && (
            <div className="mt-4 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-900">
              MTC rejected this submission.{active.mtcReason ? " Reason: " + active.mtcReason : ""}
            </div>
          )}
        </div>
      )}

      {/* Past submissions */}
      <div className="card mt-5 overflow-hidden">
        <div className="border-b border-slate-200 px-5 py-4"><h2 className="font-bold">Previous Submissions</h2></div>
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr><th>Submission ID</th><th>File</th><th>Year</th><th>Students</th><th>Verification</th><th>MTC Status</th><th>Date</th><th></th></tr>
            </thead>
            <tbody>
              {collegeSubmissions.length === 0 && (
                <tr><td colSpan={8} className="py-6 text-center text-slate-500">No uploads yet.</td></tr>
              )}
              {collegeSubmissions.map((s) => (
                <tr key={s.submissionId}>
                  <td className="font-mono text-xs">{s.submissionId}</td>
                  <td className="text-xs">{s.uploadFileName}</td>
                  <td className="text-xs">{s.academicYear}</td>
                  <td>{s.counts.valid}</td>
                  <td>{s.verificationStatus === "verified" ? <span className="badge badge-green">✓ Verified</span> : <span className="badge badge-slate">Not verified</span>}</td>
                  <td>
                    {s.mtcStatus === "submitted" ? <span className="badge badge-blue">Pending MTC Review</span>
                      : s.mtcStatus === "approved" ? <span className="badge badge-green">Approved</span>
                      : s.mtcStatus === "rejected" ? <span className="badge badge-red">Rejected</span>
                      : s.mtcStatus === "correction_required" ? <span className="badge badge-yellow">Correction Required</span>
                      : <span className="badge badge-slate">Draft</span>}
                  </td>
                  <td className="text-xs text-slate-500">{new Date(s.uploadDate).toLocaleDateString("en-IN")}</td>
                  <td>
                    {(s.mtcStatus === "draft" || s.mtcStatus === "correction_required") && (
                      <button onClick={() => { setActiveId(s.submissionId); setFilter("all"); }} className="text-xs font-semibold text-[var(--mtc-blue)] hover:underline">
                        Review
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit modal */}
      {editing && active && (
        <EditModal
          record={editing}
          onClose={() => setEditing(null)}
          onSave={(patch) => {
            updateBulkRecord(active.submissionId, editing.rowId, patch);
            setEditing(null);
          }}
        />
      )}

      <p className="mt-4 text-xs text-slate-500">
        Rule-based validation only (missing fields, format checks, duplicate Student IDs) — not AI fraud detection.
        Excel data is stored in this browser prototype (localStorage); no live MTC system is connected.
      </p>
    </DashboardLayout>
  );
}

function SummaryCard({ label, value, tone, onClick, activeFilter }: {
  label: string;
  value: number;
  tone: "slate" | "green" | "amber";
  onClick: () => void;
  activeFilter: boolean;
}) {
  const tones = {
    slate: "border-slate-200 bg-white",
    green: "border-emerald-200 bg-emerald-50",
    amber: "border-amber-200 bg-amber-50",
  };
  return (
    <button
      onClick={onClick}
      className={`rounded-xl border p-3 text-left transition hover:shadow-sm ${tones[tone]} ${activeFilter ? "ring-2 ring-[var(--mtc-blue)]" : ""}`}
    >
      <div className="text-2xl font-bold text-slate-900">{value}</div>
      <div className="text-[11px] font-medium text-slate-500">{label}</div>
    </button>
  );
}

function EditModal({ record, onClose, onSave }: {
  record: BulkStudentRecord;
  onClose: () => void;
  onSave: (patch: Partial<BulkStudentRecord>) => void;
}) {
  const [form, setForm] = useState({ ...record });
  const set = (k: keyof BulkStudentRecord, v: string) => setForm((f) => ({ ...f, [k]: v }));
  const fields: { key: keyof BulkStudentRecord; label: string }[] = [
    { key: "studentId", label: "Student ID" },
    { key: "studentName", label: "Student Name" },
    { key: "course", label: "Course" },
    { key: "yearOfStudy", label: "Year of Study" },
    { key: "academicYear", label: "Academic Year" },
    { key: "collegeName", label: "College Name" },
    { key: "origin", label: "Origin" },
    { key: "destination", label: "Destination" },
    { key: "mobile", label: "Mobile Number" },
    { key: "email", label: "Email" },
    { key: "passType", label: "Pass Type" },
  ];
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 p-4">
      <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white p-5 shadow-2xl">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold">Edit Record <span className="font-mono text-xs text-slate-500">Row {record.rowNumber}</span></h3>
          <button onClick={onClose} className="rounded-md p-1 hover:bg-slate-100"><X size={18} /></button>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {fields.map((f) => (
            <div key={f.key}>
              <label className="label-field">{f.label}</label>
              <input className="input-field" value={(form[f.key] as string) ?? ""} onChange={(e) => set(f.key, e.target.value)} />
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-end gap-2">
          <button onClick={onClose} className="btn-secondary"><RotateCcw size={14} /> Cancel</button>
          <button onClick={() => onSave(form)} className="btn-primary"><CheckCircle2 size={14} /> Save &amp; Revalidate</button>
        </div>
      </div>
    </div>
  );
}
