import { useMutation } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { createApiClient } from "@/lib/api/api-client";
import { toastError } from "@/lib/utils/toast-error";
import { apiConfig } from "@/config/api";
import { useAuthStore } from "@/stores/auth-store";
import type { AcceptInvitePayload, LoginPayload, StaffAuthResponse } from "@/types/auth";

const client = createApiClient(apiConfig.baseUrl);

export const staffAuthApi = {
  login(payload: LoginPayload) {
    return client.post<StaffAuthResponse>("/staff-auth/login", payload);
  },

  acceptInvite(payload: AcceptInvitePayload) {
    return client.post<StaffAuthResponse>("/staff-auth/accept-invite", payload);
  },
};

function useAuthSuccess() {
  const setAuth = useAuthStore((state) => state.setAuth);
  return (res: StaffAuthResponse) => setAuth(res.token, res.staff);
}

export function useLoginMutation() {
  const onAuthSuccess = useAuthSuccess();

  return useMutation({
    mutationFn: (payload: LoginPayload) => staffAuthApi.login(payload),
    onSuccess: (res) => {
      onAuthSuccess(res);
      toast.success(`Welcome back, ${res.staff.fullName}!`);
    },
    onError: (err) => toastError(err, "Could not log you in"),
  });
}

export function useAcceptInviteMutation() {
  const onAuthSuccess = useAuthSuccess();

  return useMutation({
    mutationFn: (payload: AcceptInvitePayload) => staffAuthApi.acceptInvite(payload),
    onSuccess: (res) => {
      onAuthSuccess(res);
      toast.success(`Welcome, ${res.staff.fullName}! Your password is set.`);
    },
    onError: (err) => toastError(err, "Could not set your password"),
  });
}
