import {
  Mail,
  Cloud,
  MessageSquare,
  Key,
  Database,
  Globe,
  LucideIcon,
} from "lucide-react";

const categoryConfig: Record<string, { icon: LucideIcon; color: string }> = {
  email: { icon: Mail, color: "text-blue-500" },
  oss: { icon: Cloud, color: "text-green-500" },
  im: { icon: MessageSquare, color: "text-purple-500" },
  api: { icon: Key, color: "text-orange-500" },
  database: { icon: Database, color: "text-red-500" },
  other: { icon: Globe, color: "text-gray-500" },
};

export const CREDENTIAL_CATEGORIES = [
  { value: "email", label: "Email" },
  { value: "oss", label: "OSS" },
  { value: "im", label: "IM" },
  { value: "api", label: "API Keys" },
  { value: "database", label: "Database" },
  { value: "other", label: "Other" },
];

export function CategoryIcon({
  category,
  className,
}: {
  category: string;
  className?: string;
}) {
  const config = categoryConfig[category] || categoryConfig.other;
  const Icon = config.icon;
  return <Icon className={`${config.color} ${className || "size-4"}`} />;
}
