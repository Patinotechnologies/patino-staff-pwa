import { Suspense } from "react";
import SetPasswordForm from "@/features/auth/pages/set-password-form";

export default function SetPasswordPage() {
  return (
    <Suspense fallback={null}>
      <SetPasswordForm />
    </Suspense>
  );
}
