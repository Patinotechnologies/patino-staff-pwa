"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { AlertCircle, BookOpen, ChevronRight, Users } from "lucide-react";
import { useAuthStore } from "@/stores/auth-store";
import { useMeQuery } from "@/features/auth/api/staff-auth-api";
import { useTodayCheckInQuery } from "@/features/attendance/api/staff-attendance-api";
import type { StaffAssignment } from "@/types/auth";

export default function HomePage() {
  const router = useRouter();
  const staff = useAuthStore((state) => state.staff);
  const meQuery = useMeQuery();
  const todayCheckIn = useTodayCheckInQuery();

  const assignments = meQuery.data?.assignments ?? [];
  const hasCheckedIn = Boolean(todayCheckIn.data);

  function openAssignment(assignment: StaffAssignment) {
    const params = new URLSearchParams({ classId: assignment.classId, className: assignment.className });
    if (assignment.subjectId) {
      params.set("subjectId", assignment.subjectId);
      params.set("subjectName", assignment.subjectName ?? "");
    }
    router.push(`/attendance?${params.toString()}`);
  }

  return (
    <div className="flex flex-1 flex-col gap-5 px-4 py-6">
      <div>
        <p className="text-sm text-zinc-600">Hi, {staff?.fullName.split(" ")[0]}</p>
        <h1 className="mt-0.5 text-xl font-semibold text-zinc-950">Today</h1>
      </div>

      {!todayCheckIn.isPending && !hasCheckedIn && (
        <Link
          href="/check-in"
          className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"
        >
          <AlertCircle className="h-5 w-5 shrink-0 text-amber-600" />
          <span className="flex-1">You haven&apos;t checked in today.</span>
          <ChevronRight className="h-4 w-4 shrink-0 text-amber-600" />
        </Link>
      )}

      <div>
        <h2 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">Take attendance</h2>

        {meQuery.isPending && <p className="mt-3 text-sm text-zinc-500">Loading…</p>}

        {!meQuery.isPending && assignments.length === 0 && (
          <div className="mt-3 flex flex-col items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-10 text-center">
            <Users className="h-6 w-6 text-zinc-400" />
            <p className="text-sm text-zinc-600">You&apos;re not assigned to any class or subject yet.</p>
          </div>
        )}

        {!meQuery.isPending && assignments.length > 0 && (
          <div className="mt-3 flex flex-col gap-2">
            {assignments.map((assignment) => (
              <button
                key={`${assignment.type}-${assignment.classId}-${assignment.subjectId ?? ""}`}
                type="button"
                onClick={() => openAssignment(assignment)}
                className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3.5 text-left"
              >
                {assignment.type === "subject" ? (
                  <BookOpen className="h-5 w-5 shrink-0 text-blue-600" />
                ) : (
                  <Users className="h-5 w-5 shrink-0 text-blue-600" />
                )}
                <div className="flex-1">
                  <p className="text-sm font-medium text-zinc-950">{assignment.className}</p>
                  <p className="text-xs text-zinc-500">{assignment.subjectName ?? "Whole class"}</p>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-zinc-400" />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
