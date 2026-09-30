import PublicLayout from "@/components/PublicLayout";
import { DemoLinks } from "@/components/DemoLinks";
import Link from "next/link";

export const metadata = {
  title: "Demo Links — MTC Digital Student Pass",
};

export default function DemoIndexPage() {
  return (
    <PublicLayout>
      <section className="bg-gradient-to-b from-[var(--mtc-blue-light)] to-white py-10">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="text-xs font-semibold uppercase tracking-wider text-[var(--mtc-blue)]">
            Shareable demo entry points
          </div>
          <h1 className="mt-2 text-3xl font-bold text-slate-900 sm:text-4xl">
            Direct portal links
          </h1>
          <p className="mt-2 max-w-2xl text-slate-600">
            Use these permanent URL paths to jump straight into any of the three
            demo portals. Each <code className="rounded bg-white px-1.5 py-0.5 text-[12px]">/demo/…</code> link
            automatically signs in with demo credentials — no password typing needed.
          </p>
          <div className="mt-3">
            <Link href="/" className="text-sm font-medium text-[var(--mtc-blue)] hover:underline">
              ← Back to home
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <DemoLinks />
      </section>
    </PublicLayout>
  );
}
