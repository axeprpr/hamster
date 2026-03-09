"use client";

import { SessionProvider } from "next-auth/react";
import Link from "next/link";
import { Shield } from "lucide-react";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <SessionProvider>
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-sm space-y-6">
          <div className="flex flex-col items-center gap-2 text-center">
            <Shield className="size-10 text-primary" />
            <h1 className="text-2xl font-semibold">Welcome back</h1>
            <p className="text-sm text-muted-foreground">
              Sign in to your Hamster account
            </p>
          </div>
          <LoginForm />
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </SessionProvider>
  );
}
