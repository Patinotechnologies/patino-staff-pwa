"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useLoginMutation } from "@/features/auth/api/staff-auth-api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginForm() {
  const router = useRouter();
  const loginMutation = useLoginMutation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    loginMutation.mutate({ email, password }, { onSuccess: () => router.push("/") });
  }

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-4 py-16">
      <div className="w-full max-w-sm">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-lg font-semibold text-white">
          P
        </div>

        <h1 className="mt-5 text-center text-2xl font-semibold text-zinc-950">Staff log in</h1>
        <p className="mt-1 text-center text-sm text-zinc-600">Log in to check in for today.</p>

        <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
          <Input
            label="Email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
          />
          <Input
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />

          <Button type="submit" size="lg" className="mt-2 w-full" isLoading={loginMutation.isPending} loadingText="Logging in…">
            Log in
          </Button>
        </form>
      </div>
    </div>
  );
}
