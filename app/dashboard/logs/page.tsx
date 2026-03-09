"use client";

import { useEffect, useState } from "react";
import { ScrollText, CheckCircle2, XCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { useLocale } from "@/lib/i18n/context";

interface LogEntry {
  id: string;
  skillId?: string | null;
  machineId?: string | null;
  ipAddress?: string | null;
  action: string;
  success: boolean;
  details?: string | null;
  createdAt: string;
}

export default function LogsPage() {
  const { t } = useLocale();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/logs?limit=100")
      .then((r) => r.json())
      .then(setLogs)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title={t("logs.title")} />
        <div className="flex items-center justify-center py-16 text-muted-foreground">
          {t("common.loading")}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("logs.title")}
        description={t("logs.description")}
      />

      {logs.length === 0 ? (
        <EmptyState
          icon={ScrollText}
          title={t("logs.noLogs")}
          description={t("logs.noLogsDescription")}
        />
      ) : (
        <div className="rounded-lg border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("logs.table.time")}</TableHead>
                <TableHead>{t("logs.table.action")}</TableHead>
                <TableHead>{t("logs.table.status")}</TableHead>
                <TableHead>{t("logs.table.ip")}</TableHead>
                <TableHead>{t("logs.table.details")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                    {new Date(log.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{log.action}</Badge>
                  </TableCell>
                  <TableCell>
                    {log.success ? (
                      <CheckCircle2 className="size-4 text-green-500" />
                    ) : (
                      <XCircle className="size-4 text-destructive" />
                    )}
                  </TableCell>
                  <TableCell className="font-mono text-xs">
                    {log.ipAddress || "-"}
                  </TableCell>
                  <TableCell className="max-w-xs truncate text-xs text-muted-foreground">
                    {log.details || "-"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
