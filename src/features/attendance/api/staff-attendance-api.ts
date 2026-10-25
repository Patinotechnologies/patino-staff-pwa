import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createApiClient } from "@/lib/api/api-client";
import { toastError } from "@/lib/utils/toast-error";
import { apiConfig } from "@/config/api";
import { queryKeys } from "@/constants/query-keys";
import { useAuthStore } from "@/stores/auth-store";
import type { StaffCheckInResponse } from "@/types/attendance";

const client = createApiClient(apiConfig.baseUrl);

export const staffAttendanceApi = {
  getToday() {
    return client.get<StaffCheckInResponse | null>("/staff-attendance/check-in/today");
  },

  checkIn() {
    return client.post<StaffCheckInResponse>("/staff-attendance/check-in", {});
  },
};

export function useTodayCheckInQuery() {
  const token = useAuthStore((state) => state.token);

  return useQuery({
    queryKey: queryKeys.todayCheckIn,
    queryFn: () => staffAttendanceApi.getToday(),
    enabled: Boolean(token),
  });
}

export function useCheckInMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => staffAttendanceApi.checkIn(),
    onSuccess: (result) => {
      queryClient.setQueryData(queryKeys.todayCheckIn, result);
      toast.success("Checked in!");
    },
    onError: (err) => toastError(err, "Could not check in"),
  });
}
