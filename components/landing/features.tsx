"use client";

import { Shield, Key, Zap, Monitor, Lock, RefreshCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocale } from "@/lib/i18n/context";
import type { LocaleKeys } from "@/lib/i18n/locales/en";

const features: { icon: typeof Lock; titleKey: LocaleKeys; descKey: LocaleKeys }[] = [
  {
    icon: Lock,
    titleKey: "landing.features.encryption.title",
    descKey: "landing.features.encryption.description",
  },
  {
    icon: Key,
    titleKey: "landing.features.store.title",
    descKey: "landing.features.store.description",
  },
  {
    icon: Zap,
    titleKey: "landing.features.skills.title",
    descKey: "landing.features.skills.description",
  },
  {
    icon: Monitor,
    titleKey: "landing.features.machines.title",
    descKey: "landing.features.machines.description",
  },
  {
    icon: Shield,
    titleKey: "landing.features.verification.title",
    descKey: "landing.features.verification.description",
  },
  {
    icon: RefreshCcw,
    titleKey: "landing.features.logging.title",
    descKey: "landing.features.logging.description",
  },
];

export function Features() {
  const { t } = useLocale();

  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            {t("landing.features.title")}
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            {t("landing.features.description")}
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.titleKey}>
              <CardHeader>
                <feature.icon className="mb-2 size-8 text-primary" />
                <CardTitle className="text-base">{t(feature.titleKey)}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {t(feature.descKey)}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
