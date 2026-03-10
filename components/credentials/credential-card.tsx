"use client";

import Link from "next/link";
import { Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CategoryIcon } from "./category-icon";

interface Credential {
  id: string;
  name: string;
  category: string;
  description?: string | null;
  metadata?: Record<string, string> | null;
  createdAt: string;
}

export function CredentialCard({
  credential,
  onDelete,
}: {
  credential: Credential;
  onDelete: (id: string) => void;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div className="flex items-center gap-2">
          <CategoryIcon category={credential.category} className="size-5" />
          <CardTitle className="text-base">{credential.name}</CardTitle>
        </div>
        <Badge variant="secondary" className="text-xs">
          {credential.category}
        </Badge>
      </CardHeader>
      <CardContent>
        {credential.description && (
          <p className="mb-3 text-sm text-muted-foreground">
            {credential.description}
          </p>
        )}
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            {new Date(credential.createdAt).toLocaleDateString()}
          </span>
          <div className="flex gap-1">
            <Button variant="ghost" size="icon-xs" className="rounded-md" render={<Link href={`/dashboard/credentials/${credential.id}`} />}>
                <Pencil className="size-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon-xs"
              className="rounded-md"
              onClick={() => onDelete(credential.id)}
            >
              <Trash2 className="size-3 text-destructive" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
