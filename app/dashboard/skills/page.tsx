"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Zap, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { PageHeader } from "@/components/layout/page-header";
import { SkillCard } from "@/components/skills/skill-card";
import { BundleCard } from "@/components/skills/bundle-card";
import { BundleDialog } from "@/components/skills/bundle-dialog";
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

interface Bundle {
  id: string;
  name: string;
  description?: string | null;
  skillIds: string[];
  isPublished: boolean;
  createdAt: string;
}

export default function SkillsPage() {
  const { t } = useLocale();
  const router = useRouter();
  const [skills, setSkills] = useState<Skill[]>([]);
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteSlug, setDeleteSlug] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteBundleId, setDeleteBundleId] = useState<string | null>(null);
  const [deletingBundle, setDeletingBundle] = useState(false);
  const [bundleDialogOpen, setBundleDialogOpen] = useState(false);
  const [editingBundle, setEditingBundle] = useState<Bundle | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/skills").then((r) => r.json()),
      fetch("/api/skill-bundles").then((r) => r.json()),
    ])
      .then(([skillsData, bundlesData]) => {
        setSkills(skillsData);
        setBundles(bundlesData);
      })
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

  async function handleDuplicate(skill: Skill) {
    try {
      const res = await fetch(`/api/skills/${skill.slug}`);
      const fullSkill = await res.json();
      const newSlug = `${skill.slug}-copy`;
      const body = {
        slug: newSlug,
        name: `${skill.name} (Copy)`,
        description: fullSkill.description || "",
        instructionTemplate: fullSkill.instructionTemplate || "",
        credentialIds: [],
        isPublished: false,
      };
      const createRes = await fetch("/api/skills", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (createRes.ok) {
        const newSkill = await createRes.json();
        router.push(`/dashboard/skills/${newSkill.slug}`);
      }
    } catch {
      // silently fail
    }
  }

  async function handleDeleteBundle() {
    if (!deleteBundleId) return;
    setDeletingBundle(true);
    await fetch(`/api/skill-bundles/${deleteBundleId}`, { method: "DELETE" });
    setBundles((prev) => prev.filter((b) => b.id !== deleteBundleId));
    setDeleteBundleId(null);
    setDeletingBundle(false);
  }

  async function handleSaveBundle(data: {
    id?: string;
    name: string;
    description?: string | null;
    skillIds: string[];
    isPublished: boolean;
  }) {
    if (data.id) {
      const res = await fetch(`/api/skill-bundles/${data.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          description: data.description,
          skillIds: data.skillIds,
          isPublished: data.isPublished,
        }),
      });
      if (res.ok) {
        const updated = await res.json();
        setBundles((prev) =>
          prev.map((b) => (b.id === data.id ? updated : b))
        );
      }
    } else {
      const res = await fetch("/api/skill-bundles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          description: data.description,
          skillIds: data.skillIds,
          isPublished: data.isPublished,
        }),
      });
      if (res.ok) {
        const created = await res.json();
        setBundles((prev) => [...prev, created]);
      }
    }
    setBundleDialogOpen(false);
    setEditingBundle(null);
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
      />

      <Tabs defaultValue="skills">
        <TabsList>
          <TabsTrigger value="skills">{t("nav.skills")}</TabsTrigger>
          <TabsTrigger value="bundles">{t("bundles.title")}</TabsTrigger>
        </TabsList>

        <TabsContent value="skills">
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button render={<Link href="/dashboard/skills/new" />}>
                <Plus className="size-4" />
                {t("skills.new")}
              </Button>
            </div>

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
                    onDuplicate={handleDuplicate}
                  />
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="bundles">
          <div className="space-y-4">
            <div className="flex justify-end">
              <Button
                onClick={() => {
                  setEditingBundle(null);
                  setBundleDialogOpen(true);
                }}
              >
                <Plus className="size-4" />
                {t("bundles.create")}
              </Button>
            </div>

            {bundles.length === 0 ? (
              <EmptyState
                icon={Package}
                title={t("bundles.noBundles")}
                description={t("bundles.noBundlesDescription")}
                action={
                  <Button
                    onClick={() => {
                      setEditingBundle(null);
                      setBundleDialogOpen(true);
                    }}
                  >
                    <Plus className="size-4" />
                    {t("bundles.create")}
                  </Button>
                }
              />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {bundles.map((bundle) => (
                  <BundleCard
                    key={bundle.id}
                    bundle={bundle}
                    onEdit={(b) => {
                      setEditingBundle(b);
                      setBundleDialogOpen(true);
                    }}
                    onDelete={setDeleteBundleId}
                  />
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>

      <ConfirmDialog
        open={!!deleteSlug}
        onOpenChange={(open) => !open && setDeleteSlug(null)}
        title={t("skills.deleteTitle")}
        description={t("skills.deleteDescription")}
        onConfirm={handleDelete}
        loading={deleting}
        destructive
      />

      <ConfirmDialog
        open={!!deleteBundleId}
        onOpenChange={(open) => !open && setDeleteBundleId(null)}
        title={t("bundles.deleteTitle")}
        description={t("bundles.deleteDescription")}
        onConfirm={handleDeleteBundle}
        loading={deletingBundle}
        destructive
      />

      <BundleDialog
        open={bundleDialogOpen}
        onOpenChange={(open) => {
          setBundleDialogOpen(open);
          if (!open) setEditingBundle(null);
        }}
        bundle={editingBundle}
        skills={skills.map((s) => ({ id: s.id, name: s.name, slug: s.slug }))}
        onSave={handleSaveBundle}
      />
    </div>
  );
}
