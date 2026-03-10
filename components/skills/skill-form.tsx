"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { CredentialPicker } from "./credential-picker";
import { SkillPicker } from "./skill-picker";
import { useLocale } from "@/lib/i18n/context";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => (
    <div className="flex h-64 items-center justify-center rounded-lg border bg-muted text-sm text-muted-foreground">
      Loading editor...
    </div>
  ),
});

interface SkillFormProps {
  initialData?: {
    slug: string;
    name: string;
    description?: string | null;
    instructionTemplate: string;
    credentialIds?: string[];
    linkedSkillIds?: string[];
    isPublished: boolean;
  };
}

export function SkillForm({ initialData }: SkillFormProps) {
  const router = useRouter();
  const { t } = useLocale();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [template, setTemplate] = useState(
    initialData?.instructionTemplate || getDefaultTemplate()
  );
  const [credentialIds, setCredentialIds] = useState<string[]>(
    initialData?.credentialIds || []
  );
  const [linkedSkillIds, setLinkedSkillIds] = useState<string[]>(
    initialData?.linkedSkillIds || []
  );
  const [isPublished, setIsPublished] = useState(
    initialData?.isPublished || false
  );
  const [name, setName] = useState(initialData?.name || "");
  const [slug, setSlug] = useState(initialData?.slug || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const isEdit = !!initialData;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const body = {
      slug,
      name,
      description: description || undefined,
      instructionTemplate: template,
      credentialIds,
      linkedSkillIds,
      isPublished,
    };

    const url = isEdit
      ? `/api/skills/${initialData.slug}`
      : "/api/skills";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || t("skills.failedToSave"));
      setLoading(false);
      return;
    }

    router.push("/dashboard/skills");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      {error && (
        <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">{t("skills.form.name")}</Label>
          <Input
            id="name"
            name="name"
            placeholder={t("skills.form.namePlaceholder")}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">{t("skills.form.slug")}</Label>
          <Input
            id="slug"
            name="slug"
            placeholder={t("skills.form.slugPlaceholder")}
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            required
            disabled={isEdit}
            pattern="[a-z0-9-]+"
            className="font-mono"
          />
          <p className="text-xs text-muted-foreground">
            {t("skills.form.slugHelp")}
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">{t("skills.form.description")}</Label>
        <Input
          id="description"
          name="description"
          placeholder={t("skills.form.descriptionPlaceholder")}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>{t("skills.form.template")}</Label>
        <p className="text-xs text-muted-foreground">
          {t("skills.form.templateHelp")}
        </p>
        <div className="overflow-hidden rounded-lg border">
          <MonacoEditor
            height="400px"
            defaultLanguage="markdown"
            value={template}
            onChange={(value) => setTemplate(value || "")}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 14,
              lineNumbers: "on",
              wordWrap: "on",
              scrollBeyondLastLine: false,
              padding: { top: 12 },
            }}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label>{t("skills.form.linkedCredentials")}</Label>
        <p className="text-xs text-muted-foreground">
          {t("skills.form.linkedCredentialsHelp")}
        </p>
        <CredentialPicker
          selected={credentialIds}
          onChange={setCredentialIds}
        />
      </div>

      <div className="space-y-2">
        <Label>{t("skills.form.linkedSkills")}</Label>
        <p className="text-xs text-muted-foreground">
          {t("skills.form.linkedSkillsHelp")}
        </p>
        <SkillPicker
          selected={linkedSkillIds}
          onChange={setLinkedSkillIds}
          excludeSlug={isEdit ? initialData.slug : undefined}
        />
      </div>

      <div className="flex items-center gap-3">
        <Switch
          checked={isPublished}
          onCheckedChange={setIsPublished}
        />
        <Label>{t("skills.form.published")}</Label>
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? t("common.saving") : isEdit ? t("skills.form.updateSkill") : t("skills.form.createSkill")}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          {t("common.cancel")}
        </Button>
      </div>
    </form>
  );
}

function getDefaultTemplate() {
  return `# Skill Name

## Setup Instructions

1. Configure the following settings:
   - Setting A: \`{{credential_name}}\`

## Usage

Describe how to use this skill...
`;
}
