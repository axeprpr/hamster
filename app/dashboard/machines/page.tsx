"use client";

import { useEffect, useState } from "react";
import { Plus, Monitor } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
import { useLocale } from "@/lib/i18n/context";

const MACHINE_COMMANDS = {
  linux: "cat /etc/machine-id",
  macos: `ioreg -d2 -c IOPlatformExpertDevice | awk -F\\" '/IOPlatformUUID/{print $(NF-1)}'`,
  windows: `powershell -Command "(Get-CimInstance -Class Win32_ComputerSystemProduct).UUID"`,
};

interface Machine {
  id: string;
  machineCode: string;
  label?: string | null;
  isActive: boolean;
  lastUsedAt?: string | null;
  createdAt: string;
}

export default function MachinesPage() {
  const { t } = useLocale();
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
        <PageHeader title={t("machines.title")} />
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          {t("common.loading")}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("machines.title")}
        description={t("machines.description")}
        action={
          <Button onClick={() => setShowAdd(true)}>
            <Plus className="size-4" />
            {t("machines.add")}
          </Button>
        }
      />

      {machines.length === 0 ? (
        <EmptyState
          icon={Monitor}
          title={t("machines.noMachines")}
          description={t("machines.noMachinesDescription")}
          action={
            <Button onClick={() => setShowAdd(true)}>
              <Plus className="size-4" />
              {t("machines.add")}
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
                    {machine.label || t("machines.unnamed")}
                  </CardTitle>
                  <div className="flex items-center gap-1 mt-1">
                    <code className="text-xs text-muted-foreground">
                      {machine.machineCode.substring(0, 12)}...
                    </code>
                  </div>
                </div>
                <Badge variant={machine.isActive ? "default" : "secondary"}>
                  {machine.isActive ? t("common.active") : t("common.inactive")}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-xs text-muted-foreground">
                    {machine.lastUsedAt
                      ? t("common.lastUsed", { date: new Date(machine.lastUsedAt).toLocaleDateString() })
                      : t("common.neverUsed")}
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
                      <span className="text-xs text-destructive">{t("common.delete")}</span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Dialog open={showAdd} onOpenChange={setShowAdd}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{t("machines.add")}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="rounded-lg border bg-muted/50 p-3">
              <p className="text-sm font-medium mb-2">{t("machines.form.getCodeTitle")}</p>
              <Tabs defaultValue="linux">
                <TabsList className="w-full">
                  <TabsTrigger value="linux" className="flex-1">{t("machines.form.linux")}</TabsTrigger>
                  <TabsTrigger value="macos" className="flex-1">{t("machines.form.macos")}</TabsTrigger>
                  <TabsTrigger value="windows" className="flex-1">{t("machines.form.windows")}</TabsTrigger>
                </TabsList>
                {(Object.entries(MACHINE_COMMANDS) as [string, string][]).map(([os, cmd]) => (
                  <TabsContent key={os} value={os}>
                    <div className="flex items-center gap-2 rounded-md bg-black p-3">
                      <code className="flex-1 text-xs text-green-400 font-mono break-all">
                        {cmd}
                      </code>
                      <CopyButton value={cmd} />
                    </div>
                  </TabsContent>
                ))}
              </Tabs>
            </div>

            <form onSubmit={handleAdd} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="machineCode">{t("machines.form.machineCode")}</Label>
                <Input
                  id="machineCode"
                  name="machineCode"
                  placeholder={t("machines.form.machineCodePlaceholder")}
                  required
                  className="font-mono"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="label">{t("machines.form.label")}</Label>
                <Input
                  id="label"
                  name="label"
                  placeholder={t("machines.form.labelPlaceholder")}
                />
              </div>
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAdd(false)}
                >
                  {t("common.cancel")}
                </Button>
                <Button type="submit" disabled={adding}>
                  {adding ? t("machines.adding") : t("machines.add")}
                </Button>
              </DialogFooter>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={!!deleteId}
        onOpenChange={(open) => !open && setDeleteId(null)}
        title={t("machines.deleteTitle")}
        description={t("machines.deleteDescription")}
        onConfirm={handleDelete}
        loading={deleting}
        destructive
      />
    </div>
  );
}
