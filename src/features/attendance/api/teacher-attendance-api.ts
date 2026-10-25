import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createApiClient } from "@/lib/api/api-client";
import { toastError } from "@/lib/utils/toast-error";
import { apiConfig } from "@/config/api";
import { queryKeys } from "@/constants/query-keys";
import { useAuthStore } from "@/stores/auth-store";
import type { AttendanceSessionResponse, MarkAttendancePayload, PupilSummary } from "@/types/pupil-attendance";

const client = createApiClient(apiConfig.baseUrl);

export const teacherAttendanceApi = {
  listPupils(classId: string) {
    return client.get<PupilSummary[]>(`/teacher-attendance/pupils?classId=${classId}`);
  },

  listSessions(classId: string, date?: string) {
    const qs = date ? `&date=${date}` : "";
    return client.get<AttendanceSessionResponse[]>(`/teacher-attendance/sessions?classId=${classId}${qs}`);
  },

  markAttendance(payload: MarkAttendancePayload) {
    return client.post<AttendanceSessionResponse>("/teacher-attendance/mark", payload);
  },
};

export function useClassPupilsQuery(classId: string) {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: [...queryKeys.classPupils, classId],
    queryFn: () => teacherAttendanceApi.listPupils(classId),
    enabled: Boolean(token && classId),
  });
}

export function useClassSessionsQuery(classId: string, date?: string) {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: [...queryKeys.classSessions, classId, date],
    queryFn: () => teacherAttendanceApi.listSessions(classId, date),
    enabled: Boolean(token && classId),
  });
}

export function useMarkAttendanceMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: MarkAttendancePayload) => teacherAttendanceApi.markAttendance(payload),
    onSuccess: (session) => {
      queryClient.invalidateQueries({ queryKey: [...queryKeys.classSessions, session.classId] });
      toast.success("Attendance saved");
    },
    onError: (err) => toastError(err, "Could not save attendance"),
  });
}
