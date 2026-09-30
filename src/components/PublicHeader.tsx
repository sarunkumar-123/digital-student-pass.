"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bus, Menu, X } from "lucide-react";
import { useState } from "react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/student-pass", label: "Student Pass" },
  { href: "/demo", label: "Demo Links" },
  { href: "/share", label: "Share" },
  { href: "/help", label: "Help" },
];

export default function PublicHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[var(--mtc-blue)] text-white shadow-sm">
            <Bus size={22} />
          </div>
          <div className="leading-tight">
            <div className="text-base font-bold text-slate-900 sm:text-lg">
              MTC Digital Student Pass
            </div>
            <div className="text-[11px] font-medium uppercase tracking-wider text-slate-500">
              Prototype • Chennai
            </div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                pathname === item.href
                  ? "bg-[var(--mtc-blue-light)] text-[var(--mtc-blue-dark)]"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Link href="/login" className="btn-primary">
            Apply / Login
          </Link>
        </div>

        <button
          className="md:hidden rounded-md p-2 text-slate-700 hover:bg-slate-100"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {open && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <div className="mx-auto max-w-7xl space-y-1 px-4 py-3">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`block rounded-md px-3 py-2 text-sm font-medium ${
                  pathname === item.href
                    ? "bg-[var(--mtc-blue-light)] text-[var(--mtc-blue-dark)]"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <Link
              href="/login"
              onClick={() => setOpen(false)}
              className="btn-primary mt-2 w-full"
            >
              Apply / Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
