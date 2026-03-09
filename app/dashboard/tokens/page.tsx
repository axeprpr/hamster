"use client";

import { useEffect, useState } from "react";
import { Plus, Coins, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { CopyButton } from "@/components/shared/copy-button";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";

interface Token {
  id: string;
  name?: string | null;
  machineId?: string | null;
  expiresAt?: string | null;
  isRevoked: boolean;
  createdAt: string;
}

export default function TokensPage() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newToken, setNewToken] = useState<string | null>(null);
  const [revokeId, setRevokeId] = useState<string | null>(null);
  const [revoking, setRevoking] = useState(false);

  useEffect(() => {
    fetch("/api/tokens")
      .then((r) => r.json())
      .then(setTokens)
      .finally(() => setLoading(false));
  }, []);

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setCreating(true);
    const formData = new FormData(e.currentTarget);

    const res = await fetch("/api/tokens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: formData.get("name") || undefined,
        expiresInDays: Number(formData.get("expiresInDays")) || undefined,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      setNewToken(data.token);
      setTokens((prev) => [
        ...prev,
        {
          id: data.id,
          name: data.name,
          expiresAt: data.expiresAt,
          isRevoked: false,
          createdAt: data.createdAt,
        },
      ]);
      setShowCreate(false);
    }
    setCreating(false);
  }

  async function handleRevoke() {
    if (!revokeId) return;
    setRevoking(true);
    await fetch(`/api/tokens/${revokeId}`, { method: "DELETE" });
    setTokens((prev) =>
      prev.map((t) =>
        t.id === revokeId ? { ...t, isRevoked: true } : t
      )
    );
    setRevokeId(null);
    setRevoking(false);
  }

  function getStatus(token: Token) {
    if (token.isRevoked) return { label: "Revoked", variant: "destructive" as const };
    if (token.expiresAt && new Date(token.expiresAt) < new Date())
      return { label: "Expired", variant: "secondary" as const };
    return { label: "Active", variant: "default" as const };
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Tokens" />
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Access Tokens"
        description="Generate tokens for AI tools to authenticate"
        action={
          <Button onClick={() => setShowCreate(true)}>
            <Plus className="size-4" />
            Generate Token
          </Button>
        }
      />

      {newToken && (
        <div className="rounded-lg border border-orange-200 bg-orange-50 p-4 dark:border-orange-900 dark:bg-orange-950/30">
          <div className="flex items-center gap-2 text-sm font-medium text-orange-800 dark:text-orange-200">
            <AlertTriangle className="size-4" />
            Copy your token now. It won&apos;t be shown again.
          </div>
          <div className="mt-2 flex items-center gap-2">
            <code className="flex-1 break-all rounded bg-white px-3 py-2 text-sm font-mono dark:bg-black">
              {newToken}
            </code>
            <CopyButton value={newToken} />
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="mt-2"
            onClick={() => setNewToken(null)}
          >
            Dismiss
          </Button>
        </div>
      )}

      {tokens.length === 0 ? (
        <EmptyState
          icon={Coins}
          title="No tokens yet"
          description="Generate an access token for AI tools to install skills."
          action={
            <Button onClick={() => setShowCreate(true)}>
              <Plus className="size-4" />
              Generate Token
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tokens.map((token) => {
            const status = getStatus(token);
            return (
              <Card key={token.id}>
                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                  <CardTitle className="text-base">
                    {token.name || "Unnamed Token"}
                  </CardTitle>
                  <Badge variant={status.variant}>{status.label}</Badge>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 text-xs text-muted-foreground">
                    <div>
                      Created: {new Date(token.createdAt).toLocaleDateString()}
                    </div>
                    {token.expiresAt && (
                      <div>
                        Expires: {new Date(token.expiresAt).toLocaleDateString()}
                      </div>
                    )}
                  </div>
                  {!token.isRevoked && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 text-destructive"
                      onClick={() => setRevokeId(token.id)}
                    >
                      Revoke
                    </Button>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog open={showCreate} onOpenChange={setShowCreate}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Access Token</DialogTitle>
            <DialogDescription>
              Create a new token for AI tools to authenticate when installing skills.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="tokenName">Name (optional)</Label>
              <Input
                id="tokenName"
                name="name"
                placeholder="e.g. Claude Desktop Token"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="expiresInDays">Expires in (days, optional)</Label>
              <Input
                id="expiresInDays"
                name="expiresInDays"
                type="number"
                placeholder="30"
                min={1}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreate(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={creating}>
                {creating ? "Generating..." : "Generate"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!revokeId}
        onOpenChange={(open) => !open && setRevokeId(null)}
        title="Revoke token"
        description="This token will immediately stop working. This cannot be undone."
        onConfirm={handleRevoke}
        loading={revoking}
        destructive
      />
    </div>
  );
}
