"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import { CopyButton } from "@/components/shared/copy-button";
import { useLocale } from "@/lib/i18n/context";

export default function SettingsPage() {
  const { data: session } = useSession();
  const { t } = useLocale();

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("settings.title")}
        description={t("settings.description")}
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("settings.account")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              {t("settings.name")}
            </label>
            <p className="text-sm">{session?.user?.name || "-"}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              {t("settings.email")}
            </label>
            <p className="text-sm">{session?.user?.email || "-"}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              {t("settings.userId")}
            </label>
            <div className="flex items-center gap-1">
              <code className="text-xs text-muted-foreground">
                {session?.user?.id || "-"}
              </code>
              {session?.user?.id && (
                <CopyButton value={session.user.id} />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">{t("settings.api")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            {t("settings.apiDescription")}
          </p>
          <div className="space-y-2 text-sm">
            <div className="rounded-lg bg-muted p-3">
              <div className="font-medium">{t("settings.step1")}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {t("settings.step1Detail")}
              </p>
            </div>
            <div className="rounded-lg bg-muted p-3">
              <div className="font-medium">{t("settings.step2")}</div>
              <code className="text-xs text-muted-foreground">
                {t("settings.step2Detail")}
              </code>
            </div>
            <div className="rounded-lg bg-muted p-3">
              <div className="font-medium">{t("settings.step3")}</div>
              <code className="text-xs text-muted-foreground">
                {t("settings.step3Detail")}
              </code>
              <pre className="mt-1 text-xs text-muted-foreground">
{`{
  "machineCode": "your-machine-code"
}`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
