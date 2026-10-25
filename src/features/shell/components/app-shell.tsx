"use client";

import { useEffect, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { LogOut } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";

export function AppShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const token = useAuthStore((state) => state.token);
  const staff = useAuthStore((state) => state.staff);
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const clearAuth = useAuthStore((state) => state.clearAuth);

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

  function handleLogout() {
    clearAuth();
    queryClient.clear();
    toast.success("Logged out");
    router.push("/login");
  }

  return (
    <div className="flex flex-1 flex-col bg-zinc-50">
      <header className="flex h-14 shrink-0 items-center justify-between border-b border-zinc-200 bg-white px-4">
        <p className="text-sm font-semibold text-zinc-950">Patino Staff</p>

        <button
          onClick={handleLogout}
          aria-label="Log out"
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium text-zinc-600 transition-colors hover:bg-zinc-100 hover:text-zinc-950"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </header>

      <main className="flex flex-1 flex-col">{children}</main>
    </div>
  );
}
