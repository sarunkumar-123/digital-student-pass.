/**
 * Rule-based validation helpers for the college bulk (Excel) student
 * submission prototype. This is NOT AI / fraud detection — it applies
 * straightforward field and duplicate rules in the browser.
 */

export interface BulkStudentRecord {
  rowId: string;
  rowNumber: number;
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
  validationStatus: "valid" | "correction" | "duplicate";
  correctionReason: string;
}

export interface RawRow {
  [key: string]: unknown;
}

const HEADER_MAP: Record<string, keyof BulkStudentRecord> = {
  "student id": "studentId",
  studentid: "studentId",
  roll: "studentId",
  "student name": "studentName",
  name: "studentName",
  course: "course",
  "academic year": "academicYear",
  academicyear: "academicYear",
  "year of study": "yearOfStudy",
  year: "yearOfStudy",
  "college name": "collegeName",
  college: "collegeName",
  origin: "origin",
  "boarding point": "origin",
  destination: "destination",
  "mobile number": "mobile",
  mobile: "mobile",
  phone: "mobile",
  email: "email",
  "pass type": "passType",
  passtype: "passType",
};

const REQUIRED_FIELDS: { key: keyof BulkStudentRecord; label: string }[] = [
  { key: "studentId", label: "Student ID" },
  { key: "studentName", label: "Student Name" },
  { key: "course", label: "Course" },
  { key: "academicYear", label: "Academic Year" },
  { key: "yearOfStudy", label: "Year of Study" },
  { key: "origin", label: "Origin" },
  { key: "destination", label: "Destination" },
];

function str(v: unknown): string {
  return String(v ?? "").trim();
}

/** Convert an arbitrary Excel row (header → value) into a normalized record. */
export function normalizeRow(raw: RawRow, rowNumber: number): BulkStudentRecord {
  const mapped: Partial<BulkStudentRecord> = {};
  for (const rawKey of Object.keys(raw)) {
    const target = HEADER_MAP[rawKey.trim().toLowerCase()];
    if (target && (mapped[target] === undefined || mapped[target] === "")) {
      (mapped as Record<string, string>)[target] = str(raw[rawKey]);
    }
  }
  return {
    rowId: `r${rowNumber}-${Math.random().toString(36).slice(2, 8)}`,
    rowNumber,
    studentId: mapped.studentId ?? "",
    studentName: mapped.studentName ?? "",
    course: mapped.course ?? "",
    academicYear: mapped.academicYear ?? "",
    yearOfStudy: mapped.yearOfStudy ?? "",
    collegeName: mapped.collegeName ?? "",
    origin: mapped.origin ?? "",
    destination: mapped.destination ?? "",
    mobile: mapped.mobile ?? "",
    email: mapped.email ?? "",
    passType: mapped.passType ?? "College Student Concession Ticket",
    validationStatus: "valid",
    correctionReason: "",
  };
}

export interface ValidationCounts {
  total: number;
  valid: number;
  correction: number;
  duplicate: number;
}

/**
 * Validate all records:
 *  - missing required fields → correction
 *  - bad email / mobile format (when provided) → correction
 *  - duplicate Student ID within the file → duplicate
 *  - Student ID already present as an active application / prior submission → duplicate
 */
export function validateRecords(
  records: BulkStudentRecord[],
  existingActiveIds: Set<string>
): BulkStudentRecord[] {
  const seenInFile = new Map<string, number>(); // studentId → first row index
  return records.map((r) => {
    const out: BulkStudentRecord = { ...r };
    const missing = REQUIRED_FIELDS.filter((f) => !str(out[f.key] as string)).map((f) => f.label);

    if (out.origin && out.destination && out.origin.trim().toLowerCase() === out.destination.trim().toLowerCase()) {
      missing.push("Origin and Destination must differ");
    }
    if (out.mobile && !/^[0-9]{10}$/.test(out.mobile.replace(/[\s-]/g, ""))) {
      missing.push("Invalid Mobile Number (10 digits)");
    }
    if (out.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(out.email)) {
      missing.push("Invalid Email format");
    }

    const id = out.studentId.trim().toLowerCase();
    let duplicate = false;
    if (id) {
      if (seenInFile.has(id)) {
        duplicate = true;
        out.correctionReason = `Duplicate Student ID (also on row ${seenInFile.get(id)})`;
      } else if (existingActiveIds.has(id)) {
        duplicate = true;
        out.correctionReason = "Duplicate active application already present in the system";
      } else {
        seenInFile.set(id, out.rowNumber);
      }
    }

    if (duplicate) {
      out.validationStatus = "duplicate";
    } else if (missing.length > 0) {
      out.validationStatus = "correction";
      out.correctionReason = `Missing ${missing.join(", ")}`;
    } else {
      out.validationStatus = "valid";
      out.correctionReason = "";
    }
    return out;
  });
}

export function countRecords(records: BulkStudentRecord[]): ValidationCounts {
  return {
    total: records.length,
    valid: records.filter((r) => r.validationStatus === "valid").length,
    correction: records.filter((r) => r.validationStatus === "correction").length,
    duplicate: records.filter((r) => r.validationStatus === "duplicate").length,
  };
}

export const TEMPLATE_HEADERS = [
  "Student ID",
  "Student Name",
  "Course",
  "Academic Year",
  "Year of Study",
  "College Name",
  "Origin",
  "Destination",
  "Mobile Number",
  "Email",
  "Pass Type",
];

export const TEMPLATE_SAMPLE_ROWS = [
  {
    "Student ID": "JAS001",
    "Student Name": "Sample Student One",
    Course: "B.Com",
    "Academic Year": "2026-27",
    "Year of Study": "II",
    "College Name": "Jeppiaar College of Arts and Science",
    Origin: "Medavakkam",
    Destination: "Padur",
    "Mobile Number": "9876543210",
    Email: "sample.one@example.edu.in",
    "Pass Type": "College Student Concession Ticket",
  },
  {
    "Student ID": "JAS002",
    "Student Name": "Sample Student Two",
    Course: "B.Sc Computer Science",
    "Academic Year": "2026-27",
    "Year of Study": "I",
    "College Name": "Jeppiaar College of Arts and Science",
    Origin: "Velachery",
    Destination: "Padur",
    "Mobile Number": "9876543211",
    Email: "sample.two@example.edu.in",
    "Pass Type": "College Student Concession Ticket",
  },
];

/** Build the 125-row demo dataset: 118 valid, 5 need correction, 2 duplicate. */
export function buildDemoRows(): RawRow[] {
  const college = "Jeppiaar College of Arts and Science";
  const courses = ["B.Com", "BBA", "B.A", "B.Sc", "B.Sc Computer Science", "B.E", "B.Tech"];
  const origins = ["Medavakkam", "Velachery", "Tambaram", "Sholinganallur", "Perungudi", "Thoraipakkam", "Adyar"];
  const years = ["I", "II", "III", "IV"];
  const rows: RawRow[] = [];
  let valid = 0;
  let i = 1;
  while (valid < 118) {
    const id = `JAS${String(i).padStart(3, "0")}`;
    rows.push({
      "Student ID": id,
      "Student Name": `Demo Student ${i}`,
      Course: courses[i % courses.length],
      "Academic Year": "2026-27",
      "Year of Study": years[i % years.length],
      "College Name": college,
      Origin: origins[i % origins.length],
      Destination: "Padur",
      "Mobile Number": `9${String(876543210 + i).slice(0, 9)}`,
      Email: `student${i}@example.edu.in`,
      "Pass Type": "College Student Concession Ticket",
    });
    valid++;
    i++;
  }
  // 5 rows needing correction
  rows.push({
    "Student ID": "JAS119",
    "Student Name": "Demo Student 119",
    Course: "B.Com",
    "Academic Year": "2026-27",
    "Year of Study": "I",
    "College Name": college,
    Origin: "",
    Destination: "Padur",
    "Mobile Number": "9876500000",
    Email: "student119@example.edu.in",
    "Pass Type": "College Student Concession Ticket",
  });
  rows.push({
    "Student ID": "JAS120",
    "Student Name": "",
    Course: "BBA",
    "Academic Year": "2026-27",
    "Year of Study": "II",
    "College Name": college,
    Origin: "Tambaram",
    Destination: "Padur",
    "Mobile Number": "9876500001",
    Email: "student120@example.edu.in",
    "Pass Type": "College Student Concession Ticket",
  });
  rows.push({
    "Student ID": "JAS121",
    "Student Name": "Demo Student 121",
    Course: "",
    "Academic Year": "2026-27",
    "Year of Study": "I",
    "College Name": college,
    Origin: "Adyar",
    Destination: "Padur",
    "Mobile Number": "9876500002",
    Email: "student121@example.edu.in",
    "Pass Type": "College Student Concession Ticket",
  });
  rows.push({
    "Student ID": "JAS122",
    "Student Name": "Demo Student 122",
    Course: "B.Sc",
    "Academic Year": "2026-27",
    "Year of Study": "",
    "College Name": college,
    Origin: "Perungudi",
    Destination: "Padur",
    "Mobile Number": "9876500003",
    Email: "not-an-email",
    "Pass Type": "College Student Concession Ticket",
  });
  rows.push({
    "Student ID": "JAS123",
    "Student Name": "Demo Student 123",
    Course: "B.A",
    "Academic Year": "",
    "Year of Study": "III",
    "College Name": college,
    Origin: "Velachery",
    Destination: "",
    "Mobile Number": "123",
    Email: "student123@example.edu.in",
    "Pass Type": "College Student Concession Ticket",
  });
  // 2 duplicates (same IDs as earlier valid rows)
  rows.push({
    "Student ID": "JAS001",
    "Student Name": "Demo Student One Duplicate",
    Course: "B.Com",
    "Academic Year": "2026-27",
    "Year of Study": "II",
    "College Name": college,
    Origin: "Medavakkam",
    Destination: "Padur",
    "Mobile Number": "9876500004",
    Email: "dup1@example.edu.in",
    "Pass Type": "College Student Concession Ticket",
  });
  rows.push({
    "Student ID": "JAS002",
    "Student Name": "Demo Student Two Duplicate",
    Course: "B.Sc Computer Science",
    "Academic Year": "2026-27",
    "Year of Study": "I",
    "College Name": college,
    Origin: "Velachery",
    Destination: "Padur",
    "Mobile Number": "9876500005",
    Email: "dup2@example.edu.in",
    "Pass Type": "College Student Concession Ticket",
  });
  return rows;
}
