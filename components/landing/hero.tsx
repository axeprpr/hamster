import Link from "next/link";
import { Shield, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 py-24 sm:py-32">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background" />
      <div className="mx-auto max-w-3xl text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-1.5 text-sm">
          <Shield className="size-4 text-primary" />
          Secure Credential Management for AI Skills
        </div>
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          One Place for All Your{" "}
          <span className="text-primary">AI Credentials</span>
        </h1>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-muted-foreground">
          Hamster provides a unified platform to securely manage and distribute
          credentials for AI skills. Store SMTP passwords, API keys, and IM
          tokens with AES-256-GCM encryption, and let AI tools install them
          with a single command.
        </p>
        <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button size="lg" render={<Link href="/register" />}>
              Get Started <ArrowRight className="size-4" />
          </Button>
          <Button variant="outline" size="lg" render={<Link href="/login" />}>
              Sign In
          </Button>
        </div>
      </div>
    </section>
  );
}
