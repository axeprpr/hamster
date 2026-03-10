"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, Trash2, Check, CopyPlus, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLocale } from "@/lib/i18n/context";
import { cn } from "@/lib/utils";

interface Skill {
  id: string;
  slug: string;
  name: string;
  description?: string | null;
  isPublished: boolean;
  credentialIds?: string[];
  linkedSkillIds?: string[];
  createdAt: string;
}

export function SkillCard({
  skill,
  onDelete,
  onDuplicate,
}: {
  skill: Skill;
  onDelete: (slug: string) => void;
  onDuplicate?: (skill: Skill) => void;
}) {
  const { t } = useLocale();
  const credCount = skill.credentialIds?.length || 0;
  const linkedCount = skill.linkedSkillIds?.length || 0;
  const [copied, setCopied] = useState(false);

  function handleCopyInstall() {
    if (!skill.isPublished) return;
    const domain = typeof window !== "undefined" ? window.location.origin : "";
    const prompt = `请参考 ${domain}/api/s/${skill.id}/install-doc 帮我安装和配置 ${skill.name}。`;
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Card className={cn(
      "relative flex flex-col transition-shadow",
      skill.isPublished && "group hover:shadow-lg hover:shadow-black/10 dark:hover:shadow-black/30"
    )}>
      {/* Clickable area for copy - everything except the bottom action bar */}
      <div
        role={skill.isPublished ? "button" : undefined}
        tabIndex={skill.isPublished ? 0 : undefined}
        onClick={handleCopyInstall}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") handleCopyInstall();
        }}
        className={cn(
          "flex-1",
          skill.isPublished && "cursor-pointer"
        )}
      >
        <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
          <div>
            <CardTitle className="text-base">{skill.name}</CardTitle>
            <code className="text-xs text-muted-foreground">{skill.slug}</code>
          </div>
          <Badge variant={skill.isPublished ? "default" : "secondary"}>
            {skill.isPublished ? t("common.published") : t("common.draft")}
          </Badge>
        </CardHeader>
        <CardContent className="pb-2">
          {skill.description && (
            <p className="mb-2 text-sm text-muted-foreground">
              {skill.description}
            </p>
          )}
          <div className="mb-1 text-xs text-muted-foreground">
            {t("skills.credentialsLinked", { count: credCount })}
            {linkedCount > 0 && (
              <span className="ml-2">{t("skills.linkedSkillsCount", { count: linkedCount })}</span>
            )}
          </div>

          {/* Copy hint for published skills */}
          {skill.isPublished && (
            <div className={cn(
              "mt-2 flex items-center gap-1.5 text-xs transition-opacity",
              copied ? "text-green-600 opacity-100" : "text-muted-foreground opacity-0 group-hover:opacity-100"
            )}>
              {copied ? (
                <>
                  <Check className="size-3" />
                  {t("skills.copied")}
                </>
              ) : (
                <>
                  <Copy className="size-3" />
                  {t("skills.clickToCopy")}
                </>
              )}
            </div>
          )}
        </CardContent>
      </div>

      {/* Bottom action bar - not part of the copy click area */}
      <div className="flex items-center justify-between border-t px-4 py-2">
        <span className="text-xs text-muted-foreground">
          {new Date(skill.createdAt).toLocaleDateString()}
        </span>
        <div className="flex gap-1">
          {onDuplicate && (
            <Button
              variant="ghost"
              size="icon-xs"
              className="rounded-md"
              onClick={() => onDuplicate(skill)}
              title={t("skills.duplicate")}
            >
              <CopyPlus className="size-3" />
            </Button>
          )}
          <Button
            variant="ghost"
            size="icon-xs"
            className="rounded-md"
            render={<Link href={`/dashboard/skills/${skill.slug}`} />}
          >
            <Pencil className="size-3" />
          </Button>
          <Button
            variant="ghost"
            size="icon-xs"
            className="rounded-md"
            onClick={() => onDelete(skill.slug)}
          >
            <Trash2 className="size-3 text-destructive" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
