"use client";

import Link from "next/link";
import { Pencil, Trash2, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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
  const credCount = skill.credentialIds?.length || 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-base">{skill.name}</CardTitle>
          <code className="text-xs text-muted-foreground">{skill.slug}</code>
        </div>
        <Badge variant={skill.isPublished ? "default" : "secondary"}>
          {skill.isPublished ? "Published" : "Draft"}
        </Badge>
      </CardHeader>
      <CardContent>
        {skill.description && (
          <p className="mb-3 text-sm text-muted-foreground">
            {skill.description}
          </p>
        )}
        <div className="mb-3 text-xs text-muted-foreground">
          {credCount} credential{credCount !== 1 ? "s" : ""} linked
        </div>
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {new Date(skill.createdAt).toLocaleDateString()}
          </span>
          <div className="flex gap-1">
            {skill.isPublished && (
              <Button variant="ghost" size="icon-xs" render={<Link href={`/api/skills/${skill.slug}`} target="_blank" />}>
                  <ExternalLink className="size-3" />
              </Button>
            )}
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
