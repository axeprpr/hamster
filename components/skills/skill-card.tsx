"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Trash2, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/lib/i18n/context";

interface Skill {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  isPublished: boolean;
  credentialIds?: string[];
  createdAt: string;
}

export function SkillCard({
  skill,
  onDelete,
}: {
  skill: Skill;
  onDelete: (slug: string) => void;
}) {
  const { t } = useLocale();
  const credCount = skill.credentialIds?.length || 0;
  const [copied, setCopied] = useState(false);

  function handleCopyInstall() {
    const domain = typeof window !== "undefined" ? window.location.origin : "";
    const prompt = `请参考 ${domain}/api/s/${skill.id}/install-doc 帮我安装和配置 ${skill.name}。`;
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-base">{skill.name}</CardTitle>
          <code className="text-xs text-muted-foreground">{skill.slug}</code>
        </div>
        <Badge variant={skill.isPublished ? "default" : "secondary"}>
          {skill.isPublished ? t("common.published") : t("common.draft")}
        </Badge>
      </CardHeader>
      <CardContent>
        {skill.description && (
          <p className="mb-3 text-sm text-muted-foreground">
            {skill.description}
          </p>
        )}
        <div className="mb-3 text-xs text-muted-foreground">
          {t("skills.credentialsLinked", { count: credCount })}
        </div>

        {skill.isPublished && (
          <Button
            variant="outline"
            size="sm"
            className="mb-3 w-full"
            onClick={handleCopyInstall}
          >
            {copied ? (
              <>
                <Check className="size-3" />
                {t("skills.copied")}
              </>
            ) : (
              <>
                <Copy className="size-3" />
                {t("skills.copyInstall")}
              </>
            )}
          </Button>
        )}

        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {new Date(skill.createdAt).toLocaleDateString()}
          </span>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon-xs" render={<Link href={`/dashboard/skills/${skill.slug}`} />}>
                <Pencil className="size-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              onClick={() => onDelete(skill.slug)}
            >
              <Trash2 className="size-3 text-destructive" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
