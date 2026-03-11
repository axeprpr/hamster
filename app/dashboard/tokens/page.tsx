"use client";

import { useEffect, useState } from "react";
import { KeyRound, AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/page-header";
import { CopyButton } from "@/components/shared/copy-button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { useLocale } from "@/lib/i18n/context";

interface Token {
  id: string;
  name?: string | null;
  expiresAt?: string | null;
  isRevoked: boolean;
  createdAt: string;
}

export default function TokensPage() {
  const { t } = useLocale();
  const [token, setToken] = useState<Token | null>(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [newTokenValue, setNewTokenValue] = useState<string | null>(null);
  const [showRegenerate, setShowRegenerate] = useState(false);

  useEffect(() => {
    fetch("/api/tokens")
      .then((r) => r.json())
      .then((tokens: Token[]) => {
        const active = tokens.find(
          (tk) =>
            !tk.isRevoked &&
            (!tk.expiresAt || new Date(tk.expiresAt) > new Date())
        );
        setToken(active ?? null);
      })
      .finally(() => setLoading(false));
  }, []);

  async function generateToken() {
    setGenerating(true);
    const res = await fetch("/api/tokens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: "API Token" }),
    });

    if (res.ok) {
      const data = await res.json();
      setNewTokenValue(data.token);
      setToken({
        id: data.id,
        name: data.name,
        expiresAt: data.expiresAt,
        isRevoked: false,
        createdAt: data.createdAt,
      });
    }
    setGenerating(false);
  }

  async function handleRegenerate() {
    if (token) {
      await fetch(`/api/tokens/${token.id}`, { method: "DELETE" });
    }
    setShowRegenerate(false);
    await generateToken();
  }

  function getStatus(tk: Token) {
    if (tk.isRevoked)
      return {
        label: t("tokens.status.revoked"),
        variant: "destructive" as const,
      };
    if (tk.expiresAt && new Date(tk.expiresAt) < new Date())
      return {
        label: t("tokens.status.expired"),
        variant: "secondary" as const,
      };
    return { label: t("tokens.status.active"), variant: "default" as const };
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title={t("tokens.title")} />
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          {t("common.loading")}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("tokens.title")}
        description={t("tokens.description")}
      />

      {newTokenValue && (
        <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-900 dark:bg-orange-950/30">
          <div className="flex items-center gap-2 text-sm font-medium text-orange-800 dark:text-orange-200">
            <AlertTriangle className="size-4" />
            {t("tokens.copyWarning")}
          </div>
          <div className="mt-2 flex items-center gap-2">
            <code className="flex-1 break-all rounded bg-white px-3 py-2 text-sm font-mono dark:bg-black">
              {newTokenValue}
            </code>
            <CopyButton value={newTokenValue} />
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="mt-2"
            onClick={() => setNewTokenValue(null)}
          >
            {t("common.dismiss")}
          </Button>
        </div>
      )}

      {!token ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <KeyRound className="size-10 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground mb-4">
              {t("tokens.noTokensDescription")}
            </p>
            <Button onClick={generateToken} disabled={generating}>
              {generating ? t("tokens.generating") : t("tokens.generate")}
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">
                    {t("tokens.apiToken")}
                  </span>
                  <Badge variant={getStatus(token).variant}>
                    {getStatus(token).label}
                  </Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {t("common.created", {
                    date: new Date(token.createdAt).toLocaleDateString(),
                  })}
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowRegenerate(true)}
                disabled={generating}
              >
                <RefreshCw className="size-4" />
                {t("tokens.regenerate")}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <ConfirmDialog
        open={showRegenerate}
        onOpenChange={setShowRegenerate}
        title={t("tokens.regenerateTitle")}
        description={t("tokens.regenerateDescription")}
        onConfirm={handleRegenerate}
        loading={generating}
        destructive
      />
    </div>
  );
}
