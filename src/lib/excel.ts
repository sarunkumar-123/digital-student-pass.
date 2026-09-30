"use client";

/**
 * Browser-side Excel helpers for the bulk student upload prototype.
 * Uses SheetJS (xlsx) loaded on demand. All processing happens locally in
 * the browser; nothing is uploaded to a server.
 */
import {
  TEMPLATE_HEADERS,
  TEMPLATE_SAMPLE_ROWS,
  buildDemoRows,
  normalizeRow,
  type BulkStudentRecord,
  type RawRow,
} from "@/lib/bulk";

export async function readExcelFile(file: File): Promise<RawRow[]> {
  const XLSX = await import("xlsx");
  const data = await file.arrayBuffer();
  const workbook = XLSX.read(data, { type: "array" });
  const firstSheet = workbook.SheetNames[0];
  const sheet = workbook.Sheets[firstSheet];
  const rows = XLSX.utils.sheet_to_json<RawRow>(sheet, { defval: "" });
  return rows;
}

export function rowsToRecords(rows: RawRow[]): BulkStudentRecord[] {
  return rows.map((row, i) => normalizeRow(row, i + 2)); // +2 = header row offset in Excel
}

export async function downloadTemplate(): Promise<void> {
  const XLSX = await import("xlsx");
  const worksheet = XLSX.utils.json_to_sheet(TEMPLATE_SAMPLE_ROWS, {
    header: TEMPLATE_HEADERS,
  });
  worksheet["!cols"] = TEMPLATE_HEADERS.map((h) => ({ wch: Math.max(h.length + 2, 18) }));
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
  XLSX.writeFile(workbook, "MTC_Student_Upload_Template.xlsx");
}

/** In-memory demo workbook (125 rows: 118 valid, 5 correction, 2 duplicate). */
export function demoWorkbookRows(): RawRow[] {
  return buildDemoRows();
}

export function isExcelFile(file: File): boolean {
  return /\.(xlsx|xls)$/i.test(file.name);
}
