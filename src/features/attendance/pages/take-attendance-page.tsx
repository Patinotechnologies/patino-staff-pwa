"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";
import { useClassPupilsQuery, useMarkAttendanceMutation } from "@/features/attendance/api/teacher-attendance-api";
import type { PupilAttendanceStatus } from "@/types/pupil-attendance";

const STATUS_OPTIONS: PupilAttendanceStatus[] = ["present", "absent", "late"];

const STATUS_STYLES: Record<PupilAttendanceStatus, string> = {
  present: "bg-green-50 text-green-700",
  absent: "bg-red-50 text-red-700",
  late: "bg-amber-50 text-amber-700",
};

function todayISODate(): string {
  return new Date().toISOString().slice(0, 10);
}

export default function TakeAttendancePage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const classId = searchParams.get("classId") ?? "";
  const subjectId = searchParams.get("subjectId");
  const className = searchParams.get("className") ?? "Class";
  const subjectName = searchParams.get("subjectName");

  const [date, setDate] = useState(todayISODate());
  const [statuses, setStatuses] = useState<Record<string, PupilAttendanceStatus>>({});

  const pupilsQuery = useClassPupilsQuery(classId);
  const markAttendance = useMarkAttendanceMutation();

  const pupils = pupilsQuery.data ?? [];

  function statusFor(pupilId: string): PupilAttendanceStatus {
    return statuses[pupilId] ?? "present";
  }

  function setStatus(pupilId: string, status: PupilAttendanceStatus) {
    setStatuses((prev) => ({ ...prev, [pupilId]: status }));
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (pupils.length === 0) return;
    markAttendance.mutate(
      {
        classId,
        date,
        subjectId: subjectId || null,
        records: pupils.map((pupil) => ({ pupilId: pupil.id, status: statusFor(pupil.id) })),
      },
      { onSuccess: () => router.push("/") },
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-1 flex-col">
      <div className="flex items-center gap-3 border-b border-zinc-200 bg-white px-4 py-3">
        <button type="button" onClick={() => router.back()} aria-label="Back" className="text-zinc-500">
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <p className="text-sm font-semibold text-zinc-950">{className}</p>
          <p className="text-xs text-zinc-500">{subjectName || "Whole class"}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4">
        <Input type="date" required value={date} onChange={(e) => setDate(e.target.value)} />

        {pupilsQuery.isPending && <p className="mt-6 text-sm text-zinc-500">Loading roster…</p>}

        {!pupilsQuery.isPending && pupils.length === 0 && (
          <p className="mt-6 text-sm text-zinc-500">No pupils in this class yet.</p>
        )}

        <div className="mt-4 flex flex-col gap-2">
          {pupils.map((pupil) => (
            <div
              key={pupil.id}
              className="flex items-center justify-between gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3"
            >
              <span className="text-sm font-medium text-zinc-950">{pupil.fullName}</span>
              <div className="inline-flex rounded-lg border border-zinc-200 p-0.5">
                {STATUS_OPTIONS.map((status) => (
                  <button
                    key={status}
                    type="button"
                    onClick={() => setStatus(pupil.id, status)}
                    className={cn(
                      "rounded-md px-2.5 py-1.5 text-xs font-medium capitalize transition-colors",
                      statusFor(pupil.id) === status ? STATUS_STYLES[status] : "text-zinc-500",
                    )}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-zinc-200 bg-white px-4 py-3">
        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={pupils.length === 0}
          isLoading={markAttendance.isPending}
          loadingText="Saving…"
        >
          Submit attendance
        </Button>
      </div>
    </form>
  );
}
