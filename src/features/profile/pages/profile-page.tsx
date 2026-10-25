"use client";

import { useRouter } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";
import type { StaffRole } from "@/types/auth";

const ROLE_LABELS: Record<StaffRole, string> = {
  school_admin: "School Admin",
  bursar: "Bursar",
  class_teacher: "Class Teacher",
  subject_teacher: "Subject Teacher",
};

export default function ProfilePage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const staff = useAuthStore((state) => state.staff);
  const clearAuth = useAuthStore((state) => state.clearAuth);

  function handleLogout() {
    clearAuth();
    queryClient.clear();
    toast.success("Logged out");
    router.push("/login");
  }

  if (!staff) return null;

  return (
    <div className="flex flex-1 flex-col gap-5 px-4 py-6">
      <h1 className="text-xl font-semibold text-zinc-950">Profile</h1>

      <div className="flex flex-col items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 text-xl font-semibold text-blue-700">
          {staff.fullName.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-base font-semibold text-zinc-950">{staff.fullName}</p>
          <p className="text-sm text-zinc-500">{ROLE_LABELS[staff.role]}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-zinc-200 bg-white p-5">
        <dl className="flex flex-col gap-4 text-sm">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400">Email</dt>
            <dd className="mt-0.5 text-zinc-900">{staff.email}</dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wide text-zinc-400">Role</dt>
            <dd className="mt-0.5 text-zinc-900">{ROLE_LABELS[staff.role]}</dd>
          </div>
        </dl>
      </div>

      <Button variant="outline" size="lg" className="mt-auto w-full" onClick={handleLogout}>
        <LogOut className="h-4 w-4" />
        Log out
      </Button>
    </div>
  );
}
