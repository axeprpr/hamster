"use client";

import { useEffect, useState } from "react";
import { Plus, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { ConfirmDialog } from "@/components/shared/confirm-dialog";
import { CopyButton } from "@/components/shared/copy-button";

interface Machine {
  id: string;
  machineCode: string;
  label?: string | null;
  isActive: boolean;
  lastUsedAt?: string | null;
  createdAt: string;
}

export default function MachinesPage() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [adding, setAdding] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    fetch("/api/machines")
      .then((r) => r.json())
      .then(setMachines)
      .finally(() => setLoading(false));
  }, []);

  async function handleAdd(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setAdding(true);
    const formData = new FormData(e.currentTarget);

    const res = await fetch("/api/machines", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        machineCode: formData.get("machineCode"),
        label: formData.get("label") || undefined,
      }),
    });

    if (res.ok) {
      const machine = await res.json();
      setMachines((prev) => [...prev, machine]);
      setShowAdd(false);
    }
    setAdding(false);
  }

  async function toggleActive(machine: Machine) {
    const res = await fetch(`/api/machines/${machine.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !machine.isActive, label: machine.label }),
    });
    if (res.ok) {
      const updated = await res.json();
      setMachines((prev) =>
        prev.map((m) => (m.id === updated.id ? updated : m))
      );
    }
  }

  async function handleDelete() {
    if (!deleteId) return;
    setDeleting(true);
    await fetch(`/api/machines/${deleteId}`, { method: "DELETE" });
    setMachines((prev) => prev.filter((m) => m.id !== deleteId));
    setDeleteId(null);
    setDeleting(false);
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Machines" />
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          Loading...
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Machines"
        description="Authorize machines that can install skills"
        action={
          <Button onClick={() => setShowAdd(true)}>
            <Plus className="size-4" />
            Add Machine
          </Button>
        }
      />

      {machines.length === 0 ? (
        <EmptyState
          icon={Monitor}
          title="No machines authorized"
          description="Add a machine code to allow AI tools to install skills."
          action={
            <Button onClick={() => setShowAdd(true)}>
              <Plus className="size-4" />
              Add Machine
            </Button>
          }
        />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {machines.map((machine) => (
            <Card key={machine.id}>
              <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                <div>
                  <CardTitle className="text-base">
                    {machine.label || "Unnamed Machine"}
                  </CardTitle>
                  <div className="flex items-center gap-1 mt-1">
                    <code className="text-xs text-muted-foreground">
                      {machine.machineCode}
                    </code>
                    <CopyButton value={machine.machineCode} />
                  </div>
                </div>
                <Badge variant={machine.isActive ? "default" : "secondary"}>
                  {machine.isActive ? "Active" : "Inactive"}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    {machine.lastUsedAt
                      ? `Last used: ${new Date(machine.lastUsedAt).toLocaleDateString()}`
                      : "Never used"}
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={machine.isActive}
                      onCheckedChange={() => toggleActive(machine)}
                    />
                    <Button
                      variant="ghost"
                      size="icon-xs"
                      onClick={() => setDeleteId(machine.id)}
                    >
                      <span className="text-xs text-destructive">Delete</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Machine</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAdd} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="machineCode">Machine Code</Label>
              <Input
                id="machineCode"
                name="machineCode"
                placeholder="Unique machine identifier"
                required
                className="font-mono"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="label">Label (optional)</Label>
              <Input
                id="label"
                name="label"
                placeholder="e.g. Work Laptop"
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowAdd(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={adding}>
                {adding ? "Adding..." : "Add Machine"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title="Delete machine"
        description="This machine will no longer be able to install skills."
        onConfirm={handleDelete}
        loading={deleting}
        destructive
      />
    </div>
  );
}
