"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import PublicLayout from "@/components/PublicLayout";
import { useStore } from "@/lib/store";
import { Bus, GraduationCap, Building2, Landmark, ShieldCheck, KeyRound, Smartphone } from "lucide-react";

type Role = "student" | "college" | "mtc";

export default function LoginPage() {
  const router = useRouter();
  const { login, students } = useStore();
  const [role, setRole] = useState<Role>("student");
  const [studentId, setStudentId] = useState("JAS001");
  const [password, setPassword] = useState("student123");
  const [collegeId, setCollegeId] = useState("jeppiaar");
  const [collegePwd, setCollegePwd] = useState("college123");
  const [mtcId, setMtcId] = useState("mtc");
  const [mtcPwd, setMtcPwd] = useState("mtc123");
  const [error, setError] = useState("");
  const [step, setStep] = useState<"credentials" | "otp" | "new-device">("credentials");
  const [otp, setOtp] = useState("");
  const [newDevice, setNewDevice] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState("");

  const submitCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (role === "student") {
      const student = students.find(
        (s) => s.studentId === studentId.trim() && s.password === password
      );
      if (!student) {
        setError("Invalid Student ID or password.");
        return;
      }
      if (newDevice) {
        const code = String(Math.floor(100000 + Math.random() * 900000));
        setGeneratedOtp(code);
        setStep("otp");
        return;
      }
      login("student", student.studentId);
      router.push("/dashboard/student");
    } else if (role === "college") {
      if (collegeId === "jeppiaar" && collegePwd === "college123") {
        login("college", "jeppiaar");
        router.push("/dashboard/college");
      } else {
        setError("Invalid college credentials.");
      }
    } else if (role === "mtc") {
      if (mtcId === "mtc" && mtcPwd === "mtc123") {
        login("mtc", "mtc");
        router.push("/dashboard/mtc");
      } else {
        setError("Invalid MTC credentials.");
      }
    }
  };

  const verifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp === generatedOtp) {
      const student = students.find((s) => s.studentId === studentId.trim());
      if (student) {
        login("student", student.studentId, { newDevice: true });
        router.push("/dashboard/student");
      }
    } else {
      setError("Incorrect OTP. For the prototype, enter the code shown on screen.");
    }
  };

  const demoLogin = (r: Role) => {
    setRole(r);
    if (r === "student") {
      login("student", "STU2026001");
      router.push("/dashboard/student");
    } else if (r === "college") {
      login("college", "jeppiaar");
      router.push("/dashboard/college");
    } else {
      login("mtc", "mtc");
      router.push("/dashboard/mtc");
    }
  };

  return (
    <PublicLayout>
      <section className="mx-auto flex min-h-[calc(100vh-200px)] max-w-5xl items-center px-4 py-12 sm:px-6">
        <div className="grid w-full gap-8 md:grid-cols-2">
          {/* Left */}
          <div className="flex flex-col justify-center">
            <Link href="/" className="flex items-center gap-2 text-slate-700 hover:text-[var(--mtc-blue)]">
              <Bus size={18} />
              <span className="text-sm font-medium">← Back to home</span>
            </Link>
            <h1 className="mt-6 text-3xl font-bold text-slate-900">Sign in to MTC Digital Student Pass</h1>
            <p className="mt-3 text-slate-600">
              Access the portal as a student, college verifier, or MTC authority.
              This is a prototype — demo credentials are pre-filled.
            </p>

            <div className="mt-8 space-y-3">
              <Link
                href="/demo/student"
                className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left hover:border-[var(--mtc-blue)] hover:bg-[var(--mtc-blue-light)] transition"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                  <GraduationCap size={20} />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-slate-900">Demo Login — Student</div>
                  <div className="text-xs text-slate-600">Arun Kumar (STU2026001) · <span className="font-mono text-[var(--mtc-blue)]">/demo/student</span></div>
                </div>
              </Link>
              <Link
                href="/demo/college"
                className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left hover:border-[var(--mtc-blue)] hover:bg-[var(--mtc-blue-light)] transition"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                  <Building2 size={20} />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-slate-900">(a) Demo Login — College</div>
                  <div className="text-xs text-slate-600">Jeppiaar College · <span className="font-mono text-emerald-700">/demo/college</span></div>
                </div>
              </Link>
              <Link
                href="/demo/mtc"
                className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white p-4 text-left hover:border-[var(--mtc-blue)] hover:bg-[var(--mtc-blue-light)] transition"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-100 text-amber-700">
                  <Landmark size={20} />
                </div>
                <div className="flex-1">
                  <div className="font-semibold text-slate-900">(b) Demo Login — MTC Authority</div>
                  <div className="text-xs text-slate-600">Approval dashboard · <span className="font-mono text-amber-700">/demo/mtc</span></div>
                </div>
              </Link>
            </div>
          </div>

          {/* Right - form */}
          <div className="space-y-4">
            <div className="card p-6 sm:p-8">
            {step === "credentials" && (
              <>
                <div className="mb-5 flex gap-2 rounded-lg bg-slate-100 p-1">
                  {(["student", "college", "mtc"] as Role[]).map((r) => (
                    <button
                      key={r}
                      onClick={() => {
                        setRole(r);
                        setError("");
                      }}
                      className={`flex-1 rounded-md px-3 py-2 text-sm font-medium capitalize transition ${
                        role === r
                          ? "bg-white text-slate-900 shadow-sm"
                          : "text-slate-600 hover:text-slate-900"
                      }`}
                    >
                      {r === "mtc" ? "MTC" : r}
                    </button>
                  ))}
                </div>

                <form onSubmit={submitCredentials} className="space-y-4">
                  {role === "student" && (
                    <>
                      <div>
                        <label className="label-field">Student ID</label>
                        <input
                          className="input-field"
                          value={studentId}
                          onChange={(e) => setStudentId(e.target.value)}
                          placeholder="STUxxxxxx"
                        />
                      </div>
                      <div>
                        <label className="label-field">Password</label>
                        <input
                          type="password"
                          className="input-field"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                      <label className="flex items-center gap-2 text-sm text-slate-700">
                        <input
                          type="checkbox"
                          checked={newDevice}
                          onChange={(e) => setNewDevice(e.target.checked)}
                          className="h-4 w-4 rounded border-slate-300"
                        />
                        <Smartphone size={14} className="text-slate-500" />
                        Login on another device (OTP)
                      </label>
                    </>
                  )}

                  {role === "college" && (
                    <>
                      <div>
                        <label className="label-field">College ID</label>
                        <input
                          className="input-field"
                          value={collegeId}
                          onChange={(e) => setCollegeId(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="label-field">Password</label>
                        <input
                          type="password"
                          className="input-field"
                          value={collegePwd}
                          onChange={(e) => setCollegePwd(e.target.value)}
                        />
                      </div>
                    </>
                  )}

                  {role === "mtc" && (
                    <>
                      <div>
                        <label className="label-field">Officer ID</label>
                        <input
                          className="input-field"
                          value={mtcId}
                          onChange={(e) => setMtcId(e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="label-field">Password</label>
                        <input
                          type="password"
                          className="input-field"
                          value={mtcPwd}
                          onChange={(e) => setMtcPwd(e.target.value)}
                        />
                      </div>
                    </>
                  )}

                  {error && (
                    <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                      {error}
                    </div>
                  )}

                  <button type="submit" className="btn-primary w-full">
                    Login
                  </button>

                  {role === "student" && (
                    <div className="flex items-center justify-between text-xs text-slate-600">
                      <button type="button" className="hover:text-[var(--mtc-blue)] hover:underline">
                        Forgot password?
                      </button>
                      <button type="button" className="hover:text-[var(--mtc-blue)] hover:underline">
                        Create account
                      </button>
                    </div>
                  )}
                </form>
              </>
            )}

            {step === "otp" && (
              <form onSubmit={verifyOtp} className="space-y-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[var(--mtc-blue-light)] text-[var(--mtc-blue-dark)]">
                  <KeyRound size={22} />
                </div>
                <h2 className="text-xl font-bold text-slate-900">OTP Verification <span className="text-xs font-medium text-amber-700">(simulated)</span></h2>
                <p className="text-sm text-slate-600">
                  OTP verification is simulated in the prototype — no real SMS or
                  email gateway is connected. The code is displayed below. A real
                  OTP service can be integrated later without changing this flow.
                </p>
                <div className="rounded-md border border-blue-200 bg-blue-50 px-3 py-2 text-sm text-blue-900">
                  <strong>Simulated OTP:</strong> {generatedOtp}
                </div>
                <div>
                  <label className="label-field">Enter OTP</label>
                  <input
                    className="input-field text-center text-lg tracking-[0.5em]"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="••••••"
                  />
                </div>
                {error && (
                  <div className="rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-800">
                    {error}
                  </div>
                )}
                <button type="submit" className="btn-primary w-full">
                  Verify & Login
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStep("credentials");
                    setOtp("");
                    setError("");
                  }}
                  className="btn-secondary w-full"
                >
                  Back
                </button>
              </form>
            )}

            <div className="mt-6 flex items-start gap-2 rounded-md bg-slate-50 p-3 text-xs text-slate-600">
              <ShieldCheck size={14} className="mt-0.5 flex-shrink-0 text-slate-500" />
              <div>
                Session timeout, role-based access, and one-active-pass per
                Student ID are implemented in the prototype. Always log out
                after using a shared device.
              </div>
            </div>
            </div>

            <div className="card p-5">
              <div className="flex items-center gap-2">
                <Link2Icon />
                <h3 className="font-bold text-slate-900">Direct demo URLs</h3>
              </div>
              <p className="mt-1 text-xs text-slate-600">
                Share these permanent paths — they auto-login the demo user:
              </p>
              <ul className="mt-3 space-y-1.5 text-xs">
                <li>
                  <Link href="/demo/student" className="font-mono text-[var(--mtc-blue)] hover:underline">
                    /demo/student
                  </Link>
                  <span className="text-slate-500"> — Student portal</span>
                </li>
                <li>
                  <Link href="/demo/college" className="font-mono text-emerald-700 hover:underline">
                    /demo/college
                  </Link>
                  <span className="text-slate-500"> — (a) College portal</span>
                </li>
                <li>
                  <Link href="/demo/mtc" className="font-mono text-amber-700 hover:underline">
                    /demo/mtc
                  </Link>
                  <span className="text-slate-500"> — (b) MTC Authority</span>
                </li>
                <li>
                  <Link href="/demo" className="font-mono text-slate-700 hover:underline">
                    /demo
                  </Link>
                  <span className="text-slate-500"> — all links with copy buttons</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </PublicLayout>
  );
}

function Link2Icon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-[var(--mtc-blue)]">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
    </svg>
  );
}
