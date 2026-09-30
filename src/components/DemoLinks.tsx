"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Copy, Check, Link2 } from "lucide-react";

const ROUTES = [
  { key: "home", label: "Home / Landing", path: "/", tag: "Public" },
  { key: "how", label: "How it works", path: "/how-it-works", tag: "Public" },
  { key: "login", label: "Login page", path: "/login", tag: "Public" },
  { key: "help", label: "Help / FAQ", path: "/help", tag: "Public" },
  { key: "student", label: "Student portal", path: "/demo/student", tag: "Auto-login" },
  { key: "college", label: "(a) College portal", path: "/demo/college", tag: "Auto-login" },
  { key: "mtc", label: "(b) MTC Authority", path: "/demo/mtc", tag: "Auto-login" },
];

export function DemoLinks() {
  const [host, setHost] = useState<string>("");
  const [copied, setCopied] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") setHost(window.location.origin);
  }, []);

  const copy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(url);
      setTimeout(() => setCopied(null), 1500);
    } catch {}
  };

  return (
    <div className="card p-5 sm:p-6">
      <div className="flex items-center gap-2">
        <Link2 size={18} className="text-[var(--mtc-blue)]" />
        <h2 className="text-lg font-bold text-slate-900">Permanent URLs</h2>
      </div>
      <p className="mt-1 text-sm text-slate-600">
        Share these links with faculty, judges, or evaluators. Each{" "}
        <code className="rounded bg-slate-100 px-1 text-[11px]">/demo/…</code>{" "}
        link automatically signs in with demo credentials and redirects to the
        corresponding portal.
      </p>

      {host && (
        <div className="mt-3 break-all rounded-md bg-slate-50 p-3 text-xs text-slate-700">
          <strong>Current host:</strong>{" "}
          <span className="font-mono text-[var(--mtc-blue)]">{host}</span>
        </div>
      )}

      <ul className="mt-4 divide-y divide-slate-100 rounded-lg border border-slate-200">
        {ROUTES.map((r) => {
          const url = host ? host + r.path : r.path;
          return (
            <li key={r.key} className="flex flex-col gap-2 p-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-semibold text-slate-900">{r.label}</span>
                  <span
                    className={`badge ${
                      r.tag === "Auto-login" ? "badge-blue" : "badge-slate"
                    }`}
                  >
                    {r.tag}
                  </span>
                </div>
                <div className="mt-0.5 break-all font-mono text-xs text-[var(--mtc-blue)]">
                  {url}
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  href={r.path}
                  className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                >
                  Open
                </Link>
                {host && navigator?.clipboard && (
                  <button
                    onClick={() => copy(url)}
                    className="inline-flex items-center gap-1 rounded-md border border-slate-300 bg-white px-2 py-1 text-xs font-medium text-slate-700 hover:bg-slate-50"
                  >
                    {copied === url ? <Check size={13} /> : <Copy size={13} />}
                    {copied === url ? "Copied" : "Copy"}
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <div className="mt-4 rounded-md border border-emerald-200 bg-emerald-50 p-3 text-xs text-emerald-900">
        <strong>Tip:</strong> These URL paths are fixed in the application code.
        Once you deploy this build to any permanent host (Vercel, Netlify,
        Cloudflare Pages, a university subdomain, etc.), all the links above
        will keep working permanently on that domain.
      </div>
    </div>
  );
}
