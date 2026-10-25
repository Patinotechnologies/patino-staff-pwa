"use client";

import { useState, type FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { useAcceptInviteMutation } from "@/features/auth/api/staff-auth-api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function SetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const acceptInvite = useAcceptInviteMutation();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }
    acceptInvite.mutate({ token, password }, { onSuccess: () => router.push("/") });
  }

  if (!token) {
    return (
      <div className="flex flex-1 items-center justify-center bg-zinc-50 px-4 py-16">
        <p className="text-sm text-zinc-600">This invite link is missing its token. Ask your admin to resend it.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-lg font-semibold text-white">
          P
        </div>

        <h1 className="mt-5 text-center text-2xl font-semibold text-zinc-950">Set your password</h1>
        <p className="mt-1 text-center text-sm text-zinc-600">Choose a password to finish setting up your account.</p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <Input
            label="Password"
            type="password"
            required
            minLength={8}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="new-password"
          />
          <Input
            label="Confirm password"
            type="password"
            required
            minLength={8}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            autoComplete="new-password"
          />

          <Button type="submit" size="lg" className="mt-2 w-full" isLoading={acceptInvite.isPending} loadingText="Saving…">
            Set password and log in
          </Button>
        </form>
      </div>
    </div>
  );
}
