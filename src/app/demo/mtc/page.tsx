"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useStore } from "@/lib/store";

export default function DemoMTC() {
  const router = useRouter();
  const { login } = useStore();
  useEffect(() => {
    login("mtc", "mtc");
    router.replace("/dashboard/mtc");
  }, [login, router]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50">
      <div className="text-center">
        <div className="mx-auto mb-3 h-8 w-8 animate-spin rounded-full border-4 border-amber-500 border-t-transparent"></div>
        <div className="text-sm text-slate-600">Signing you in as demo MTC authority…</div>
      </div>
    </div>
  );
}
