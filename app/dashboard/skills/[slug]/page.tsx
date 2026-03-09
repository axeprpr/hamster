"use client";

import { useEffect, useState, use } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { SkillForm } from "@/components/skills/skill-form";
import { useLocale } from "@/lib/i18n/context";

export default function EditSkillPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { t } = useLocale();
  const [data, setData] = useState<{
    slug: string;
    name: string;
    description?: string | null;
    instructionTemplate: string;
    credentialIds?: string[];
    isPublished: boolean;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/skills`)
      .then((r) => r.json())
      .then((skills: Array<typeof data & { slug: string }>) => {
        const skill = skills.find((s) => s?.slug === slug);
        setData(skill || null);
      })
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title={t("skills.edit")} />
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          {t("common.loading")}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-6">
        <PageHeader title={t("skills.notFound")} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("skills.edit")}
        description={t("skills.editing", { name: data.name })}
      />
      <SkillForm initialData={data} />
    </div>
  );
}
