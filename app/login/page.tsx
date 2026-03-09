"use client";

import { SessionProvider } from "next-auth/react";
import Link from "next/link";
import { Shield } from "lucide-react";
import { LocaleProvider } from "@/lib/i18n/context";
import { LoginForm } from "@/components/auth/login-form";
import { useLocale } from "@/lib/i18n/context";

function LoginContent() {
  const { t } = useLocale();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <Shield className="size-10 text-primary" />
          <h1 className="text-2xl font-semibold">{t("auth.welcomeBack")}</h1>
          <p className="text-sm text-muted-foreground">
            {t("auth.signInDescription")}
          </p>
        </div>
        <LoginForm />
        <p className="text-center text-sm text-muted-foreground">
          {t("auth.noAccount")}{" "}
          <Link href="/register" className="font-medium text-primary hover:underline">
            {t("auth.signUp")}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <SessionProvider>
      <LocaleProvider>
        <LoginContent />
      </LocaleProvider>
    </SessionProvider>
  );
}
