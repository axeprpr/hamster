"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { SkillCard } from "@/components/skills/skill-card";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useLocale } from "@/lib/i18n/context";

interface Skill {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  isPublished: boolean;
  credentialIds?: string[];
  createdAt: string;
}

export default function SkillsPage() {
  const { t } = useLocale();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteSlug, setDeleteSlug] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch("/api/skills")
      .then((r) => r.json())
      .then(setSkills)
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete() {
    if (!deleteSlug) return;
    setDeleting(true);
    await fetch(`/api/skills/${deleteSlug}`, { method: "DELETE" });
    setSkills((prev) => prev.filter((s) => s.slug !== deleteSlug));
    setDeleteSlug(null);
    setDeleting(false);
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title={t("skills.title")} />
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          {t("common.loading")}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("skills.title")}
        description={t("skills.description")}
        action={
          <Button render={<Link href="/dashboard/skills/new" />}>
            <Plus className="size-4" />
            {t("skills.new")}
          </Button>
        }
      />

      {skills.length === 0 ? (
        <EmptyState
          icon={Zap}
          title={t("skills.noSkills")}
          description={t("skills.noSkillsDescription")}
          action={
            <Button render={<Link href="/dashboard/skills/new" />}>
              <Plus className="size-4" />
              {t("skills.new")}
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill) => (
            <SkillCard
              key={skill.id}
              skill={skill}
              onDelete={setDeleteSlug}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteSlug}
        onOpenChange={(open) => !open && setDeleteSlug(null)}
        title={t("skills.deleteTitle")}
        description={t("skills.deleteDescription")}
        onConfirm={handleDelete}
        loading={deleting}
        destructive
      />
    </div>
  );
}
