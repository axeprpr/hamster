"use client";

import { SessionProvider } from "next-auth/react";
import Link from "next/link";
import { Shield } from "lucide-react";
import { LocaleProvider } from "@/lib/i18n/context";
import { RegisterForm } from "@/components/auth/register-form";
import { useLocale } from "@/lib/i18n/context";

function RegisterContent() {
  const { t } = useLocale();
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="flex flex-col items-center gap-2 text-center">
          <Shield className="size-10 text-primary" />
          <h1 className="text-2xl font-semibold">{t("auth.createAccount")}</h1>
          <p className="text-sm text-muted-foreground">
            {t("auth.createAccountDescription")}
          </p>
        </div>
        <RegisterForm />
        <p className="text-center text-sm text-muted-foreground">
          {t("auth.hasAccount")}{" "}
          <Link href="/login" className="font-medium text-primary hover:underline">
            {t("auth.signIn")}
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <SessionProvider>
      <LocaleProvider>
        <RegisterContent />
      </LocaleProvider>
    </SessionProvider>
  );
}
