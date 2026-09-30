"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";

export default function DemoStudent() {
  const router = useRouter();
  const { login } = useStore();
  useEffect(() => {
    login("student", "JAS001");
    router.replace("/dashboard/student");
  }, [login, router]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-[var(--mtc-blue)] border-t-transparent"></div>
        <div className="text-sm text-slate-600">Signing you in as demo student…</div>
      </div>
    </div>
  );
}
