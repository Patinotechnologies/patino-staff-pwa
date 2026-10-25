export type PupilAttendanceStatus = "present" | "absent" | "late";

export interface PupilSummary {
  id: string;
  fullName: string;
}

export interface MarkAttendanceEntry {
  pupilId: string;
  status: PupilAttendanceStatus;
}

export interface MarkAttendancePayload {
  classId: string;
  date: string;
  subjectId?: string | null;
  records: MarkAttendanceEntry[];
}

export interface AttendanceRecordEntry {
  id: string;
  pupil: PupilSummary;
  status: PupilAttendanceStatus;
}

export interface AttendanceSessionResponse {
  id: string;
  classId: string;
  subjectId: string | null;
  subjectName: string | null;
  activity: string | null;
  date: string;
  records: AttendanceRecordEntry[];
}
