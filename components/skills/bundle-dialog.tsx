"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useLocale } from "@/lib/i18n/context";

interface Skill {
  id: string;
  name: string;
  slug: string;
}

interface BundleData {
  id?: string;
  name: string;
  description?: string | null;
  skillIds: string[];
  isPublished: boolean;
}

export function BundleDialog({
  open,
  onOpenChange,
  bundle,
  skills,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bundle?: BundleData | null;
  skills: Skill[];
  onSave: (data: BundleData) => void;
}) {
  const { t } = useLocale();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedSkillIds, setSelectedSkillIds] = useState<string[]>([]);
  const [isPublished, setIsPublished] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (bundle) {
      setName(bundle.name);
      setDescription(bundle.description || "");
      setSelectedSkillIds(bundle.skillIds || []);
      setIsPublished(bundle.isPublished);
    } else {
      setName("");
      setDescription("");
      setSelectedSkillIds([]);
      setIsPublished(false);
    }
  }, [bundle, open]);

  function toggleSkill(id: string) {
    setSelectedSkillIds((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await onSave({
      id: bundle?.id,
      name,
      description,
      skillIds: selectedSkillIds,
      isPublished,
    });
    setSaving(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {bundle?.id ? t("bundles.edit") : t("bundles.create")}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>{t("form.name")}</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t("bundles.namePlaceholder")}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>{t("skills.form.description")}</Label>
            <Input
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={t("bundles.descriptionPlaceholder")}
            />
          </div>
          <div className="space-y-2">
            <Label>{t("bundles.selectSkills")}</Label>
            <div className="max-h-40 space-y-1 overflow-y-auto rounded-md border p-2">
              {skills.length === 0 ? (
                <p className="text-sm text-muted-foreground">
                  {t("skills.noSkills")}
                </p>
              ) : (
                skills.map((skill) => (
                  <label
                    key={skill.id}
                    className="flex cursor-pointer items-center gap-2 rounded px-2 py-1 hover:bg-muted/50"
                  >
                    <input
                      type="checkbox"
                      checked={selectedSkillIds.includes(skill.id)}
                      onChange={() => toggleSkill(skill.id)}
                      className="rounded"
                    />
                    <span className="text-sm">{skill.name}</span>
                    <code className="text-xs text-muted-foreground">
                      {skill.slug}
                    </code>
                  </label>
                ))
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              checked={isPublished}
              onCheckedChange={setIsPublished}
            />
            <Label>{t("skills.form.published")}</Label>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={saving || !name}>
              {saving ? t("common.saving") : t("common.save")}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
