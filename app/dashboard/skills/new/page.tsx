"use client";

import { PageHeader } from "@/components/layout/page-header";
import { SkillForm } from "@/components/skills/skill-form";
import { useLocale } from "@/lib/i18n/context";

export default function NewSkillPage() {
  const { t } = useLocale();
  return (
    <div className="space-y-6">
      <PageHeader
        title={t("skills.new")}
        description={t("skills.newDescription")}
      />
      <SkillForm />
    </div>
  );
}
