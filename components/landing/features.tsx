import { Shield, Key, Zap, Monitor, Lock, RefreshCcw } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: Lock,
    title: "AES-256-GCM Encryption",
    description:
      "Every credential is encrypted with military-grade encryption. Each entry has its own unique IV for maximum security.",
  },
  {
    icon: Key,
    title: "Unified Credential Store",
    description:
      "Manage email SMTP, OSS keys, IM tokens, API keys, and database credentials all in one place.",
  },
  {
    icon: Zap,
    title: "Skill Templates",
    description:
      "Create reusable instruction templates with credential placeholders. AI tools get exactly what they need.",
  },
  {
    icon: Monitor,
    title: "Machine Authorization",
    description:
      "Control which machines can install skills. Authorize devices and revoke access anytime.",
  },
  {
    icon: Shield,
    title: "Two-Step Verification",
    description:
      "AI tools first read public instructions, then authenticate with machine code and token to get credentials.",
  },
  {
    icon: RefreshCcw,
    title: "Access Logging",
    description:
      "Track every installation attempt with detailed logs. Monitor who accessed what and when.",
  },
];

export function Features() {
  return (
    <section className="px-4 py-20">
      <div className="mx-auto max-w-5xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            Everything you need to manage AI credentials
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-muted-foreground">
            Secure, organized, and easy to use. Hamster handles the complexity
            so your AI tools just work.
          </p>
        </div>
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title}>
              <CardHeader>
                <feature.icon className="mb-2 size-8 text-primary" />
                <CardTitle className="text-base">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
