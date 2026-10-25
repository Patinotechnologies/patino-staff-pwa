import { Suspense } from "react";
import TakeAttendancePage from "@/features/attendance/pages/take-attendance-page";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <TakeAttendancePage />
    </Suspense>
  );
}
