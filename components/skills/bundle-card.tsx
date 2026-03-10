"use client";

import { useState } from "react";
import { Copy, Check, Trash2, Pencil, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/lib/i18n/context";

interface Bundle {
  id: string;
  name: string;
  description?: string | null;
  skillIds: string[];
  isPublished: boolean;
  createdAt: string;
}

export function BundleCard({
  bundle,
  onEdit,
  onDelete,
}: {
  bundle: Bundle;
  onEdit: (bundle: Bundle) => void;
  onDelete: (id: string) => void;
}) {
  const { t } = useLocale();
  const [copied, setCopied] = useState(false);

  function handleCopyInstall() {
    const domain = typeof window !== "undefined" ? window.location.origin : "";
    const prompt = `请参考 ${domain}/api/sb/${bundle.id}/install-doc 帮我安装和配置 ${bundle.name} 中的所有服务。`;
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <Package className="size-4 text-muted-foreground" />
          <CardTitle className="text-base">{bundle.name}</CardTitle>
        </div>
        <Badge variant={bundle.isPublished ? "default" : "secondary"}>
          {bundle.isPublished ? t("common.published") : t("common.draft")}
        </Badge>
      </CardHeader>
      <CardContent>
        {bundle.description && (
          <p className="mb-3 text-sm text-muted-foreground">
            {bundle.description}
          </p>
        )}
        <div className="mb-3 text-xs text-muted-foreground">
          {t("bundles.skillCount", { count: bundle.skillIds?.length || 0 })}
        </div>

        {bundle.isPublished && (
          <Button
            variant="outline"
            size="sm"
            className="mb-3 w-full"
            onClick={handleCopyInstall}
          >
            {copied ? (
              <>
                <Check className="size-3" />
                {t("bundles.copied")}
              </>
            ) : (
              <>
                <Copy className="size-3" />
                {t("bundles.copyInstall")}
              </>
            )}
          </Button>
        )}

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {new Date(bundle.createdAt).toLocaleDateString()}
          </span>
          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => onEdit(bundle)}
            >
              <Pencil className="size-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => onDelete(bundle.id)}
            >
              <Trash2 className="size-3 text-destructive" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
