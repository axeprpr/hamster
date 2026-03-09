"use client";

import { PageHeader } from "@/components/layout/page-header";
import { CredentialForm } from "@/components/credentials/credential-form";
import { useLocale } from "@/lib/i18n/context";

export default function NewCredentialPage() {
  const { t } = useLocale();
  return (
    <div className="space-y-6">
      <PageHeader
        title={t("credentials.new")}
        description={t("credentials.newDescription")}
      />
      <CredentialForm />
    </div>
  );
}
