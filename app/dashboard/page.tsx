"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Key, Zap, Monitor, ScrollText, ArrowRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/page-header";
import { useLocale } from "@/lib/i18n/context";

interface Stats {
  credentials: number;
  skills: number;
  machines: number;
  recentLogs: Array<{
    id: string;
    action: string;
    success: boolean;
    createdAt: string;
  }>;
}

export default function DashboardPage() {
  const { t } = useLocale();
  const [stats, setStats] = useState<Stats>({
    credentials: 0,
    skills: 0,
    machines: 0,
    recentLogs: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/credentials").then((r) => r.json()),
      fetch("/api/skills").then((r) => r.json()),
      fetch("/api/machines").then((r) => r.json()),
      fetch("/api/logs?limit=5").then((r) => r.json()),
    ])
      .then(([credentials, skills, machines, logs]) => {
        setStats({
          credentials: credentials.length,
          skills: skills.length,
          machines: machines.length,
          recentLogs: logs,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  const statCards = [
    {
      title: t("nav.credentials"),
      value: stats.credentials,
      icon: Key,
      href: "/dashboard/credentials",
    },
    {
      title: t("nav.skills"),
      value: stats.skills,
      icon: Zap,
      href: "/dashboard/skills",
    },
    {
      title: t("nav.machines"),
      value: stats.machines,
      icon: Monitor,
      href: "/dashboard/machines",
    },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title={t("dashboard.title")}
        description={t("dashboard.description")}
      />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {statCards.map((stat) => (
          <Link key={stat.title} href={stat.href}>
            <Card className="transition-colors hover:bg-muted/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </CardTitle>
                <stat.icon className="size-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loading ? "-" : stat.value}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0">
          <CardTitle className="text-base">{t("dashboard.recentActivity")}</CardTitle>
          <Button variant="ghost" size="sm" render={<Link href="/dashboard/logs" />}>
            {t("dashboard.viewAll")} <ArrowRight className="size-3" />
          </Button>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">{t("common.loading")}</p>
          ) : stats.recentLogs.length === 0 ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <ScrollText className="size-4" />
              {t("dashboard.noActivity")}
            </div>
          ) : (
            <div className="space-y-2">
              {stats.recentLogs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between text-sm"
                >
                  <div className="flex items-center gap-2">
                    <span
                      className={`size-2 rounded-full ${
                        log.success ? "bg-green-500" : "bg-destructive"
                      }`}
                    />
                    <span>{log.action}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {new Date(log.createdAt).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
