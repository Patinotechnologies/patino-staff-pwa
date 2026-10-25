export type StaffAttendanceStatus = "present" | "late" | "absent";

export interface StaffCheckInResponse {
  staffId: string;
  date: string;
  checkInAt: string;
  status: StaffAttendanceStatus;
}
