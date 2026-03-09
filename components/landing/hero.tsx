"use client";

import Link from "next/link";
import { Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useLocale } from "@/lib/i18n/context";

export function Hero() {
  const { t } = useLocale();

  return (
    <section className="relative overflow-hidden px-4 py-24 sm:py-32">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
      <div className="mx-auto max-w-3xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-1.5 text-sm">
          <Shield className="size-4 text-primary" />
          {t("landing.hero.badge")}
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          {t("landing.hero.title")}
          <span className="text-primary">{t("landing.hero.titleHighlight")}</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
          {t("landing.hero.description")}
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button size="lg" render={<Link href="/register" />}>
            {t("auth.getStarted")} <ArrowRight className="size-4" />
          </Button>
          <Button variant="outline" size="lg" render={<Link href="/login" />}>
            {t("auth.signIn")}
          </Button>
        </div>
      </div>
    </section>
  );
}
