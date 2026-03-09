"use client";

import { useEffect, useState, use } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { SkillForm } from "@/components/skills/skill-form";

export default function EditSkillPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
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
        <PageHeader title="Edit Skill" />
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          Loading...
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-6">
        <PageHeader title="Skill not found" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Edit Skill"
        description={`Editing "${data.name}"`}
      />
      <SkillForm initialData={data} />
    </div>
  );
}
