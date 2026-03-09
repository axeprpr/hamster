"use client";

import { useLocale } from "@/lib/i18n/context";
import type { LocaleKeys } from "@/lib/i18n/locales/en";

const steps: { step: string; titleKey: LocaleKeys; descKey: LocaleKeys }[] = [
  {
    step: "01",
    titleKey: "landing.howItWorks.step1.title",
    descKey: "landing.howItWorks.step1.description",
  },
  {
    step: "02",
    titleKey: "landing.howItWorks.step2.title",
    descKey: "landing.howItWorks.step2.description",
  },
  {
    step: "03",
    titleKey: "landing.howItWorks.step3.title",
    descKey: "landing.howItWorks.step3.description",
  },
  {
    step: "04",
    titleKey: "landing.howItWorks.step4.title",
    descKey: "landing.howItWorks.step4.description",
  },
];

export function HowItWorks() {
  const { t } = useLocale();

  return (
    <section className="bg-muted/30 px-4 py-20">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">{t("landing.howItWorks.title")}</h2>
          <p className="mt-4 text-muted-foreground">
            {t("landing.howItWorks.description")}
          </p>
        </div>
        <div className="mt-12 space-y-8">
          {steps.map((item, i) => (
            <div key={item.step} className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="flex size-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {item.step}
                </div>
                {i < steps.length - 1 && (
                  <div className="mt-2 h-full w-px bg-border" />
                )}
              </div>
              <div className="pb-8">
                <h3 className="text-lg font-semibold">{t(item.titleKey)}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t(item.descKey)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
