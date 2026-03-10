"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { CategoryIcon, CREDENTIAL_CATEGORIES } from "./category-icon";
import { useLocale } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

const CATEGORY_PLACEHOLDERS: Record<string, string> = {
  email: `# SMTP Configuration
- host: smtp.gmail.com
- port: 587
- username: you@gmail.com
- password: your-app-password

## Setup Guide
1. Enable 2FA on your email account
2. Generate an app-specific password
3. Use the credentials above`,
  oss: `# Object Storage
- provider: Aliyun OSS
- access_key_id: LTAI...
- access_key_secret: your-secret
- bucket: my-bucket
- endpoint: oss-cn-hangzhou.aliyuncs.com`,
  im: `# IM Bot Configuration
- platform: DingTalk
- client_id: your-app-key
- client_secret: your-app-secret

## Setup Guide
1. Create an application on the platform
2. Enable Bot capability
3. Copy the credentials`,
  api: `# API Key
- provider: OpenAI
- api_key: sk-...

## Notes
- Keep this key secure
- Set usage limits in the provider dashboard`,
  database: `# Database Connection
- type: PostgreSQL
- host: localhost
- port: 5432
- database: mydb
- username: postgres
- password: your-password`,
  other: `# Custom Credential
- key: value
- secret: your-secret-value

## Notes
Add any relevant configuration here`,
};

interface CredentialFormProps {
  initialData?: {
    id: string;
    name: string;
    category: string;
    value: string;
    description?: string;
    metadata?: Record<string, string> | null;
  };
}

export function CredentialForm({ initialData }: CredentialFormProps) {
  const router = useRouter();
  const { t } = useLocale();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const isEdit = !!initialData;

  const [category, setCategory] = useState(initialData?.category || "");
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [rawValue, setRawValue] = useState(initialData?.value || "");
  const [success, setSuccess] = useState(false);

  // Step logic: 0=category, 1=fill content, 2=success
  const step = isEdit ? 1 : (!category ? 0 : (success ? 2 : 1));

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const body = {
      name,
      category,
      value: rawValue,
      description: description || undefined,
    };

    const url = isEdit
      ? `/api/credentials/${initialData.id}`
      : "/api/credentials";
    const method = isEdit ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || t("credentials.failedToSave"));
      setLoading(false);
      return;
    }

    if (isEdit) {
      router.push("/dashboard/credentials");
      router.refresh();
    } else {
      setLoading(false);
      setSuccess(true);
    }
  }

  return (
    <div className="max-w-2xl">
      {error && (
        <div className="mb-4 rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* Progress indicator */}
      {!isEdit && (
        <div className="mb-6 flex items-center gap-2 text-sm">
          <StepDot active={step >= 0} done={step > 0} label="1" />
          <div className={cn("h-px flex-1", step > 0 ? "bg-primary" : "bg-border")} />
          <StepDot active={step >= 1} done={step > 1} label="2" />
          <div className={cn("h-px flex-1", step > 1 ? "bg-primary" : "bg-border")} />
          <StepDot active={step >= 2} done={false} label="3" />
        </div>
      )}

      {/* Step 0: Category selection */}
      {step === 0 && !isEdit && (
        <div className="space-y-3">
          <h3 className="text-lg font-medium">{t("credentials.form.category")}</h3>
          <p className="text-sm text-muted-foreground">
            {t("credentials.form.selectCategory")}
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {CREDENTIAL_CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                type="button"
                onClick={() => {
                  setCategory(cat.value);
                  if (!name) {
                    setName(cat.label);
                  }
                }}
                className={cn(
                  "group flex flex-col items-center gap-3 rounded-xl border-2 p-5 text-center transition-all hover:shadow-sm",
                  category === cat.value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/40"
                )}
              >
                <CategoryIcon category={cat.value} className="size-10" />
                <span className="text-sm font-medium">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 1: Fill content (markdown) */}
      {step === 1 && (
        <form onSubmit={onSubmit} className="space-y-5">
          {/* Back button and context header */}
          {!isEdit && (
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => {
                  setCategory("");
                }}
              >
                <ArrowLeft className="size-4" />
              </Button>
              <div className="flex items-center gap-2">
                <CategoryIcon category={category} className="size-5" />
                <span className="font-medium">
                  {CREDENTIAL_CATEGORIES.find((c) => c.value === category)?.label}
                </span>
              </div>
            </div>
          )}

          {/* Basic info card */}
          <Card>
            <CardContent className="space-y-4 pt-5">
              <div className="space-y-2">
                <Label htmlFor="name">{t("credentials.form.name")}</Label>
                <Input
                  id="name"
                  placeholder={t("credentials.form.namePlaceholder")}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">{t("credentials.form.description")}</Label>
                <Input
                  id="description"
                  placeholder={t("credentials.form.descriptionPlaceholder")}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Markdown content */}
          <Card>
            <CardContent className="space-y-3 pt-5">
              <div className="text-sm font-medium">
                {t("credentials.form.value")}
              </div>
              <p className="text-xs text-muted-foreground">
                {t("credentials.form.markdownHelp")}
              </p>
              <Textarea
                id="value"
                placeholder={CATEGORY_PLACEHOLDERS[category] || CATEGORY_PLACEHOLDERS.other}
                value={rawValue}
                onChange={(e) => setRawValue(e.target.value)}
                required
                rows={10}
                className="font-mono text-sm"
              />
              <p className="text-xs text-muted-foreground">
                {t("credentials.form.valueHelp")}
              </p>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <Button type="submit" disabled={loading}>
              {loading ? t("common.saving") : isEdit ? t("common.update") : t("common.create")}
              {!loading && <ArrowRight className="size-4" />}
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
      )}

      {/* Step 2: Success */}
      {step === 2 && (
        <div className="flex flex-col items-center gap-4 py-12 text-center">
          <CheckCircle2 className="size-16 text-green-500" />
          <h3 className="text-xl font-semibold">{t("credentials.createSuccess")}</h3>
          <p className="text-sm text-muted-foreground">
            {t("credentials.createSuccessDescription")}
          </p>
          <div className="flex gap-3 pt-4">
            <Button onClick={() => router.push("/dashboard/credentials")}>
              {t("credentials.backToList")}
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setCategory("");
                setName("");
                setDescription("");
                setRawValue("");
                setSuccess(false);
              }}
            >
              <Plus className="size-4" />
              {t("credentials.createAnother")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

function StepDot({ active, done, label }: { active: boolean; done: boolean; label: string }) {
  return (
    <div
      className={cn(
        "flex size-7 items-center justify-center rounded-full text-xs font-semibold transition-colors",
        done
          ? "bg-primary text-primary-foreground"
          : active
            ? "border-2 border-primary text-primary"
            : "border-2 border-border text-muted-foreground"
      )}
    >
      {label}
    </div>
  );
}
