"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth-store";
import { BottomNav } from "./bottom-nav";

export function AppShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const staff = useAuthStore((state) => state.staff);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);

  const isUnauthenticated = hasHydrated && (!token || !staff);

  useEffect(() => {
    if (isUnauthenticated) {
      router.replace("/login");
    }
  }, [isUnauthenticated, router]);

  if (!hasHydrated || !token || !staff) {
    return (
      <div className="flex flex-1 items-center justify-center bg-zinc-50">
        <p className="text-sm text-zinc-500">Loading…</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col bg-zinc-50">
      <header className="flex h-14 shrink-0 items-center border-b border-zinc-200 bg-white px-4">
        <p className="text-sm font-semibold text-zinc-950">Patino Staff</p>
      </header>

      <main className="flex flex-1 flex-col overflow-y-auto">{children}</main>

      <BottomNav />
    </div>
  );
}
