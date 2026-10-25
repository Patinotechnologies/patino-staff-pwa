import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { StaffSummary } from "@/types/auth";

interface AuthState {
  token: string | null;
  staff: StaffSummary | null;
  /** True once the persisted state has been read back from localStorage on the client. */
  hasHydrated: boolean;
  setAuth: (token: string, staff: StaffSummary) => void;
  clearAuth: () => void;
  setHasHydrated: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      staff: null,
      hasHydrated: false,
      setAuth: (token, staff) => set({ token, staff }),
      clearAuth: () => set({ token: null, staff: null }),
      setHasHydrated: (value) => set({ hasHydrated: value }),
    }),
    {
      name: "patino-staff-auth",
      partialize: (state) => ({ token: state.token, staff: state.staff }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
