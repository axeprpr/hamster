"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CREDENTIAL_CATEGORIES } from "./category-icon";
import { getSubTypesForCategory, getSubType } from "@/lib/credential-types";
import type { CredentialSubType } from "@/lib/credential-types";
import { useLocale } from "@/lib/i18n/context";

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

  const subTypes = category ? getSubTypesForCategory(category) : [];
  const selectedSubType: CredentialSubType | undefined = subType ? getSubType(subType) : undefined;

  function handleFieldChange(key: string, value: string) {
    setFieldValues((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const name = formData.get("name") as string;
    const description = (formData.get("description") as string) || undefined;

    // Build the value: if sub-type is selected, serialize fields as JSON; otherwise use raw textarea
    let value: string;
    if (selectedSubType) {
      value = JSON.stringify(fieldValues);
    } else {
      value = formData.get("value") as string;
    }

    const body = {
      name,
      category,
      value,
      description,
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
    <form onSubmit={onSubmit} className="max-w-lg space-y-4">
      {error && (
        <div className="rounded-lg bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}
      <div className="space-y-2">
        <Label htmlFor="name">{t("credentials.form.name")}</Label>
        <Input
          id="name"
          name="name"
          placeholder={t("credentials.form.namePlaceholder")}
          defaultValue={initialData?.name}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="category">{t("credentials.form.category")}</Label>
        <Select
          name="category"
          value={category}
          onValueChange={(v) => {
            setCategory(v || "");
            setSubType("");
            setFieldValues({});
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder={t("credentials.form.selectCategory")} />
          </SelectTrigger>
          <SelectContent>
            {CREDENTIAL_CATEGORIES.map((cat) => (
              <SelectItem key={cat.value} value={cat.value}>
                {cat.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {subTypes.length > 0 && (
        <div className="space-y-2">
          <Label>{t("credentials.form.subType")}</Label>
          <Select value={subType} onValueChange={(v) => { setSubType(v || ""); setFieldValues({}); }}>
            <SelectTrigger>
              <SelectValue placeholder={t("credentials.form.selectSubType")} />
            </SelectTrigger>
            <SelectContent>
              {subTypes.map((st) => (
                <SelectItem key={st.value} value={st.value}>
                  {st.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}

      {selectedSubType ? (
        <>
          {selectedSubType.fields.map((field) => (
            <div key={field.key} className="space-y-2">
              <Label htmlFor={field.key}>{field.label}</Label>
              <Input
                id={field.key}
                type={field.type || "text"}
                placeholder={field.placeholder}
                value={fieldValues[field.key] || ""}
                onChange={(e) => handleFieldChange(field.key, e.target.value)}
                required
                className={field.type === "password" ? "font-mono text-sm" : ""}
              />
            </div>
          ))}
          {selectedSubType.setupGuide && selectedSubType.setupGuide.length > 0 && (
            <div className="rounded-lg border bg-muted/50 p-3 space-y-1">
              <p className="text-sm font-medium">{t("credentials.form.setupGuide")}</p>
              <ol className="list-decimal list-inside text-xs text-muted-foreground space-y-1">
                {selectedSubType.setupGuide.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ol>
            </div>
          )}
        </>
      ) : (
        <div className="space-y-2">
          <Label htmlFor="value">{t("credentials.form.value")}</Label>
          <Textarea
            id="value"
            name="value"
            placeholder={t("credentials.form.valuePlaceholder")}
            defaultValue={initialData?.value}
            required={!selectedSubType}
            rows={3}
            className="font-mono text-sm"
          />
          <p className="text-xs text-muted-foreground">
            {t("credentials.form.valueHelp")}
          </p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="description">{t("credentials.form.description")}</Label>
        <Input
          id="description"
          name="description"
          placeholder={t("credentials.form.descriptionPlaceholder")}
          defaultValue={initialData?.description || ""}
        />
      </div>
      <div className="flex gap-2">
        <Button type="submit" disabled={loading}>
          {loading ? t("common.saving") : isEdit ? t("common.update") : t("common.create")}
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
