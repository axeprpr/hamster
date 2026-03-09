"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Key } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { CredentialCard } from "@/components/credentials/credential-card";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { CREDENTIAL_CATEGORIES } from "@/components/credentials/category-icon";

interface Credential {
  id: string;
  name: string;
  category: string;
  description?: string | null;
  createdAt: string;
}

export default function CredentialsPage() {
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    fetch("/api/credentials")
      .then((r) => r.json())
      .then(setCredentials)
      .finally(() => setLoading(false));
  }, []);

  const filtered =
    filter === "all"
      ? credentials
      : credentials.filter((c) => c.category === filter);

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    await fetch(`/api/credentials/${deleteId}`, { method: "DELETE" });
    setCredentials((prev) => prev.filter((c) => c.id !== deleteId));
    setDeleteId(null);
    setDeleting(false);
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Credentials" />
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Credentials"
        description="Manage your encrypted credentials for AI skills"
        action={
          <Button render={<Link href="/dashboard/credentials/new" />}>
              <Plus className="size-4" />
              Add Credential
          </Button>
        }
      />

      {credentials.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filter === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setFilter("all")}
          >
            All ({credentials.length})
          </Button>
          {CREDENTIAL_CATEGORIES.map((cat) => {
            const count = credentials.filter(
              (c) => c.category === cat.value
            ).length;
            if (count === 0) return null;
            return (
              <Button
                key={cat.value}
                variant={filter === cat.value ? "default" : "outline"}
                size="sm"
                onClick={() => setFilter(cat.value)}
              >
                {cat.label} ({count})
              </Button>
            );
          })}
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          icon={Key}
          title="No credentials yet"
          description="Add your first credential to get started with AI skills."
          action={
            <Button render={<Link href="/dashboard/credentials/new" />}>
                <Plus className="size-4" />
                Add Credential
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((cred) => (
            <CredentialCard
              key={cred.id}
              credential={cred}
              onDelete={setDeleteId}
            />
          ))}
        </div>
      )}

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete credential"
        description="This action cannot be undone. Skills using this credential will no longer work."
        onConfirm={handleDelete}
        loading={deleting}
        destructive
      />
    </div>
  );
}
