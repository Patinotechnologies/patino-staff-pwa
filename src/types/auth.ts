export type StaffRole = "school_admin" | "bursar" | "class_teacher" | "subject_teacher";

export interface StaffSummary {
  id: string;
  fullName: string;
  email: string;
  role: StaffRole;
}

export interface StaffAuthResponse {
  token: string;
  staff: StaffSummary;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface AcceptInvitePayload {
  token: string;
  password: string;
}
