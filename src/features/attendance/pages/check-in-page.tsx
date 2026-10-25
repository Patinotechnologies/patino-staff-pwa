"use client";

import { useRouter } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { Badge, type BadgeProps } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/stores/auth-store";
import { useCheckInMutation, useTodayCheckInQuery } from "@/features/attendance/api/staff-attendance-api";
import type { StaffAttendanceStatus } from "@/types/attendance";

const STATUS_LABEL: Record<StaffAttendanceStatus, string> = {
  present: "Present",
  late: "Late",
  absent: "Absent",
};

const STATUS_VARIANT: Record<StaffAttendanceStatus, BadgeProps["variant"]> = {
  present: "green",
  late: "amber",
  absent: "red",
};

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatToday(): string {
  return new Date().toLocaleDateString([], { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

export default function CheckInPage() {
  const router = useRouter();
  const staff = useAuthStore((state) => state.staff);
  const todayQuery = useTodayCheckInQuery();
  const checkIn = useCheckInMutation();

  const record = todayQuery.data;

  return (
    <div className="flex flex-1 flex-col items-center justify-center bg-zinc-50 px-5 py-10">
      <div className="w-full max-w-sm text-center">
        <p className="text-sm text-zinc-600">Hi, {staff?.fullName.split(" ")[0]}</p>
        <h1 className="mt-1 text-xl font-semibold text-zinc-950">{formatToday()}</h1>

        <div className="mt-10 flex flex-col items-center gap-5 rounded-2xl border border-zinc-200 bg-white p-8">
          {todayQuery.isPending ? (
            <p className="text-sm text-zinc-500">Loading…</p>
          ) : record ? (
            <>
              <CheckCircle2 className="h-14 w-14 text-green-600" />
              <div>
                <p className="text-lg font-semibold text-zinc-950">Checked in at {formatTime(record.checkInAt)}</p>
                <div className="mt-2 flex justify-center">
                  <Badge variant={STATUS_VARIANT[record.status]}>{STATUS_LABEL[record.status]}</Badge>
                </div>
              </div>
            </>
          ) : (
            <>
              <p className="text-sm text-zinc-600">You haven&apos;t checked in today.</p>
              <Button
                size="lg"
                className="w-full"
                onClick={() => checkIn.mutate(undefined, { onSuccess: () => router.push("/") })}
                isLoading={checkIn.isPending}
                loadingText="Checking in…"
              >
                Check in
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
