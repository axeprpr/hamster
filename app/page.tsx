"use client";

import Link from "next/link";
import { Shield } from "lucide-react";
import { LocaleProvider, useLocale, LOCALES } from "@/lib/i18n/context";
import { Hero } from "@/components/landing/hero";
import { Features } from "@/components/landing/features";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Globe } from "lucide-react";

function LandingContent() {
  const { t, locale, setLocale } = useLocale();

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <Shield className="size-5 text-primary" />
            <span className="text-lg font-semibold">{t("brand.name")}</span>
          </Link>
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger render={<Button variant="ghost" size="icon-sm" />}>
                <Globe className="size-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {LOCALES.map((l) => (
                  <DropdownMenuItem
                    key={l.value}
                    onClick={() => setLocale(l.value)}
                    className={locale === l.value ? "font-semibold" : ""}
                  >
                    {l.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button variant="ghost" size="sm" render={<Link href="/login" />}>
              {t("auth.signIn")}
            </Button>
            <Button size="sm" render={<Link href="/register" />}>
              {t("auth.getStarted")}
            </Button>
          </div>
        </div>
      </header>

      <main>
        <Hero />
        <Features />
        <HowItWorks />
      </main>

      <footer className="border-t border-border px-4 py-8">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="size-4" />
            {t("landing.footer")}
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function Home() {
  return (
    <LocaleProvider>
      <LandingContent />
    </LocaleProvider>
  );
}
