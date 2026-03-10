"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { useLocale } from "@/lib/i18n/context";
import type { LocaleKeys } from "@/lib/i18n/locales/en";
import {
  Shield,
  Key,
  Zap,
  Monitor,
  ScrollText,
  Settings,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems: { href: string; labelKey: LocaleKeys; icon: typeof Key }[] = [
  { href: "/dashboard/skills", labelKey: "nav.skills", icon: Zap },
  { href: "/dashboard/credentials", labelKey: "nav.credentials", icon: Key },
  { href: "/dashboard/machines", labelKey: "nav.machines", icon: Monitor },
  { href: "/dashboard/logs", labelKey: "nav.logs", icon: ScrollText },
  { href: "/dashboard/settings", labelKey: "nav.settings", icon: Settings },
];

export function Sidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const { t } = useLocale();

  return (
    <>
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
        />
      )}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-border bg-sidebar transition-transform lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex h-14 items-center justify-between border-b border-border px-4">
          <Link href="/dashboard/skills" className="flex items-center gap-2">
            <Shield className="size-5 text-primary" />
            <span className="text-lg font-semibold">{t("brand.name")}</span>
          </Link>
          <Button
            variant="ghost"
            size="icon-sm"
            className="lg:hidden"
            onClick={onClose}
          >
            <X className="size-4" />
          </Button>
        </div>
        <nav className="flex-1 space-y-1 p-3">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-foreground"
                )}
              >
                <item.icon className="size-4" />
                {t(item.labelKey)}
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
