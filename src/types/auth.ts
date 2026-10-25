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

/** One thing a staff member can take attendance for — either their whole class, or one subject they teach in it. */
export interface StaffAssignment {
  type: "class" | "subject";
  classId: string;
  className: string;
  subjectId?: string;
  subjectName?: string;
}

export interface StaffMeResponse {
  staff: StaffSummary;
  assignments: StaffAssignment[];
}
