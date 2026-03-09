"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { CredentialPicker } from "./credential-picker";

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
    isPublished: boolean;
  };
}

export function SkillForm({ initialData }: SkillFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [template, setTemplate] = useState(
    initialData?.instructionTemplate || getDefaultTemplate()
  );
  const [credentialIds, setCredentialIds] = useState<string[]>(
    initialData?.credentialIds || []
  );
  const [isPublished, setIsPublished] = useState(
    initialData?.isPublished || false
  );
  const isEdit = !!initialData;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const body = {
      slug: formData.get("slug") as string,
      name: formData.get("name") as string,
      description: (formData.get("description") as string) || undefined,
      instructionTemplate: template,
      credentialIds,
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
      setError(data.error || "Failed to save skill");
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
          <Label htmlFor="name">Skill Name</Label>
          <Input
            id="name"
            name="name"
            placeholder="e.g. Send Email via Gmail"
            defaultValue={initialData?.name}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="slug">Slug</Label>
          <Input
            id="slug"
            name="slug"
            placeholder="e.g. send-email-gmail"
            defaultValue={initialData?.slug}
            required
            disabled={isEdit}
            pattern="[a-z0-9-]+"
            className="font-mono"
          />
          <p className="text-xs text-muted-foreground">
            Used in the API URL: /api/skills/[slug]
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Input
          id="description"
          name="description"
          placeholder="Brief description of what this skill does"
          defaultValue={initialData?.description || ""}
        />
      </div>

      <div className="space-y-2">
        <Label>Instruction Template</Label>
        <p className="text-xs text-muted-foreground">
          Use {"{{credentialName}}"} placeholders for credential values. They
          will be replaced when the skill is installed.
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
        <Label>Linked Credentials</Label>
        <p className="text-xs text-muted-foreground">
          Select which credentials this skill needs access to.
        </p>
        <CredentialPicker
          selected={credentialIds}
          onChange={setCredentialIds}
        />
      </div>

      <div className="flex items-center gap-3">
        <Switch
          checked={isPublished}
          onCheckedChange={setIsPublished}
        />
        <Label>Published (accessible via API)</Label>
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? "Saving..." : isEdit ? "Update Skill" : "Create Skill"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
        >
          Cancel
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
