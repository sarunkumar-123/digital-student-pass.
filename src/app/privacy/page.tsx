import PublicLayout from "@/components/PublicLayout";
import { Shield, Lock, Eye, UserCheck, FileText } from "lucide-react";

export default function PrivacyPage() {
  return (
    <PublicLayout>
      <section className="bg-gradient-to-b from-[var(--mtc-blue-light)] to-white py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <h1 className="text-4xl font-bold text-slate-900">Privacy & Security</h1>
          <p className="mt-3 text-slate-700">
            A proposed set of principles for handling student data in the
            digital student pass system.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-12 sm:px-6">
        <div className="notice-banner mb-8">
          <strong>Prototype notice:</strong> This is a concept proposal and
          does not claim "100% security". Real-world implementation would need
          full security audit, encryption, and compliance with applicable law.
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {[
            {
              icon: <UserCheck size={20} />,
              title: "Minimum necessary data",
              text: "Only the information required to verify and issue the pass is shared. Data minimization is applied at every step.",
            },
            {
              icon: <FileText size={20} />,
              title: "Role-based access",
              text: "College staff see only applications from their college. MTC staff see verified applications needed for approval. Students see only their own data.",
            },
            {
              icon: <Eye size={20} />,
              title: "No public visibility",
              text: "Student information is never publicly visible. The digital pass is shown only to the student and the conductor during travel.",
            },
            {
              icon: <Lock size={20} />,
              title: "Authentication required",
              text: "All users must sign in. New-device logins require OTP verification. Sessions timeout, and logout is always available.",
            },
            {
              icon: <Shield size={20} />,
              title: "Documents protected",
              text: "Sensitive supporting documents are accessible only to authorized verifiers and are not displayed more than necessary.",
            },
            {
              icon: <Lock size={20} />,
              title: "College retains its systems",
              text: "The digital pass system does not replace the college's existing student database. The college continues to verify using its own systems of record.",
            },
          ].map((p, i) => (
            <div key={i} className="card p-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--mtc-blue-light)] text-[var(--mtc-blue-dark)]">
                {p.icon}
              </div>
              <h3 className="mt-3 font-bold text-slate-900">{p.title}</h3>
              <p className="mt-1 text-sm text-slate-600">{p.text}</p>
            </div>
          ))}
        </div>
      </section>
    </PublicLayout>
  );
}
