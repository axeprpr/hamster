"use client";

import { useSession } from "next-auth/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import { CopyButton } from "@/components/shared/copy-button";

export default function SettingsPage() {
  const { data: session } = useSession();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your account settings"
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Name
            </label>
            <p className="text-sm">{session?.user?.name || "-"}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              Email
            </label>
            <p className="text-sm">{session?.user?.email || "-"}</p>
          </div>
          <div>
            <label className="text-sm font-medium text-muted-foreground">
              User ID
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
          <CardTitle className="text-base">API Integration</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            AI tools can access your published skills through the following workflow:
          </p>
          <div className="space-y-2 text-sm">
            <div className="rounded-lg bg-muted p-3">
              <div className="font-medium">Step 1: Get Skill Instructions</div>
              <code className="text-xs text-muted-foreground">
                GET /api/skills/[slug]
              </code>
            </div>
            <div className="rounded-lg bg-muted p-3">
              <div className="font-medium">Step 2: Install with Credentials</div>
              <code className="text-xs text-muted-foreground">
                POST /api/skills/[slug]/install
              </code>
              <pre className="mt-1 text-xs text-muted-foreground">
{`{
  "machineCode": "your-machine-code",
  "token": "your-access-token"
}`}
              </pre>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
