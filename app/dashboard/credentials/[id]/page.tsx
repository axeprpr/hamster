"use client";

import { useEffect, useState, use } from "react";
import { PageHeader } from "@/components/layout/page-header";
import { CredentialForm } from "@/components/credentials/credential-form";
import { useLocale } from "@/lib/i18n/context";

export default function EditCredentialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { t } = useLocale();
  const [data, setData] = useState<{
    id: string;
    name: string;
    category: string;
    value: string;
    description?: string;
    metadata?: Record<string, string> | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/credentials/${id}`)
      .then((r) => r.json())
      .then(setData)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title={t("credentials.edit")} />
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          {t("common.loading")}
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="space-y-6">
        <PageHeader title={t("credentials.notFound")} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("credentials.edit")}
        description={t("credentials.editing", { name: data.name })}
      />
      <CredentialForm initialData={data} />
    </div>
  );
}
