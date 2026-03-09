"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, Info, Lock, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CategoryIcon, CREDENTIAL_CATEGORIES } from "./category-icon";
import { getSubTypesForCategory, getSubType } from "@/lib/credential-types";
import type { CredentialSubType } from "@/lib/credential-types";
import { useLocale } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

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

  const initialSubType = initialData?.metadata?.type || "";
  const [category, setCategory] = useState(initialData?.category || "");
  const [subType, setSubType] = useState(initialSubType);
  const [name, setName] = useState(initialData?.name || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [revealFields, setRevealFields] = useState<Record<string, boolean>>({});
  const [fieldValues, setFieldValues] = useState<Record<string, string>>(() => {
    if (initialData?.value) {
      try {
        return JSON.parse(initialData.value);
      } catch {
        return {};
      }
    }
    return {};
  });
  const [rawValue, setRawValue] = useState(initialData?.value || "");

  const subTypes = category ? getSubTypesForCategory(category) : [];
  const selectedSubType: CredentialSubType | undefined = subType ? getSubType(subType) : undefined;

  // Step logic: 0=category, 1=subtype (if available), 2=fields
  const hasSubTypes = subTypes.length > 0;
  const step = !category ? 0 : (hasSubTypes && !subType ? 1 : 2);

  function handleFieldChange(key: string, value: string) {
    setFieldValues((prev) => ({ ...prev, [key]: value }));
  }

  function toggleReveal(key: string) {
    setRevealFields((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    let value: string;
    if (selectedSubType) {
      value = JSON.stringify(fieldValues);
    } else {
      value = rawValue;
    }

    const body = {
      name,
      category,
      value,
      description: description || undefined,
      metadata: subType ? { type: subType } : undefined,
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

    router.push("/dashboard/credentials");
    router.refresh();
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
          {hasSubTypes && (
            <>
              <StepDot active={step >= 1} done={step > 1} label="2" />
              <div className={cn("h-px flex-1", step > 1 ? "bg-primary" : "bg-border")} />
            </>
          )}
          <StepDot active={step >= 2} done={false} label={hasSubTypes ? "3" : "2"} />
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
                  setSubType("");
                  setFieldValues({});
                }}
                className={cn(
                  "group flex items-center gap-3 rounded-xl border-2 p-4 text-left transition-all hover:shadow-sm",
                  category === cat.value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/40"
                )}
              >
                <CategoryIcon category={cat.value} className="size-6" />
                <span className="text-sm font-medium">{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 1: Sub-type selection grid */}
      {step === 1 && !isEdit && (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => { setCategory(""); setSubType(""); }}
            >
              <ArrowLeft className="size-4" />
            </Button>
            <div>
              <h3 className="text-lg font-medium">{t("credentials.form.subType")}</h3>
              <p className="text-sm text-muted-foreground">
                {CREDENTIAL_CATEGORIES.find((c) => c.value === category)?.label}
              </p>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {subTypes.map((st) => (
              <button
                key={st.value}
                type="button"
                onClick={() => {
                  setSubType(st.value);
                  setFieldValues({});
                  // Auto-set name if empty
                  if (!name) setName(st.label);
                }}
                className={cn(
                  "flex flex-col items-start rounded-xl border-2 p-4 text-left transition-all hover:shadow-sm",
                  subType === st.value
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/40"
                )}
              >
                <span className="text-sm font-semibold">{st.label}</span>
                <span className="mt-1 text-xs text-muted-foreground">
                  {st.fields.length} field{st.fields.length !== 1 ? "s" : ""}
                </span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Step 2: Fields form */}
      {(step === 2 || isEdit) && (
        <form onSubmit={onSubmit} className="space-y-5">
          {/* Back button and context header */}
          {!isEdit && (
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                onClick={() => {
                  if (hasSubTypes) {
                    setSubType("");
                  } else {
                    setCategory("");
                  }
                }}
              >
                <ArrowLeft className="size-4" />
              </Button>
              <div className="flex items-center gap-2">
                <CategoryIcon category={category} className="size-5" />
                <span className="font-medium">
                  {selectedSubType?.label || CREDENTIAL_CATEGORIES.find((c) => c.value === category)?.label}
                </span>
                {selectedSubType && (
                  <Badge variant="secondary" className="text-xs">
                    {CREDENTIAL_CATEGORIES.find((c) => c.value === category)?.label}
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Basic info card */}
          <Card>
            <CardContent className="pt-5 space-y-4">
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

          {/* Secret fields card */}
          <Card>
            <CardContent className="pt-5 space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Lock className="size-4 text-primary" />
                {selectedSubType ? selectedSubType.label + " Credentials" : t("credentials.form.value")}
              </div>

              {selectedSubType ? (
                <div className="space-y-3">
                  {selectedSubType.fields.map((field) => {
                    const isPassword = field.type === "password";
                    const revealed = revealFields[field.key];
                    return (
                      <div key={field.key} className="space-y-1.5">
                        <Label htmlFor={field.key} className="text-sm">
                          {field.label}
                        </Label>
                        <div className="relative">
                          <Input
                            id={field.key}
                            type={isPassword && !revealed ? "password" : field.type === "number" ? "number" : "text"}
                            placeholder={field.placeholder}
                            value={fieldValues[field.key] || ""}
                            onChange={(e) => handleFieldChange(field.key, e.target.value)}
                            required
                            className={cn(
                              "font-mono text-sm",
                              isPassword ? "pr-10" : ""
                            )}
                          />
                          {isPassword && (
                            <button
                              type="button"
                              onClick={() => toggleReveal(field.key)}
                              className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                            >
                              {revealed ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="space-y-2">
                  <Textarea
                    id="value"
                    placeholder={t("credentials.form.valuePlaceholder")}
                    value={rawValue}
                    onChange={(e) => setRawValue(e.target.value)}
                    required
                    rows={4}
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    {t("credentials.form.valueHelp")}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Setup guide */}
          {selectedSubType?.setupGuide && selectedSubType.setupGuide.length > 0 && (
            <Card className="border-blue-200 bg-blue-50/50 dark:border-blue-900 dark:bg-blue-950/20">
              <CardContent className="pt-5 space-y-2">
                <div className="flex items-center gap-2 text-sm font-medium text-blue-700 dark:text-blue-300">
                  <Info className="size-4" />
                  {t("credentials.form.setupGuide")}
                </div>
                <ol className="space-y-2">
                  {selectedSubType.setupGuide.map((guidStep, i) => (
                    <li key={i} className="flex gap-3 text-sm text-blue-800/80 dark:text-blue-200/80">
                      <span className="flex size-5 shrink-0 items-center justify-center rounded-full bg-blue-200 text-xs font-semibold text-blue-700 dark:bg-blue-800 dark:text-blue-200">
                        {i + 1}
                      </span>
                      <span className="pt-0.5">{guidStep}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          )}

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
