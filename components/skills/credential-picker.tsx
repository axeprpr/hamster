"use client";

import { useState, useEffect } from "react";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";
import { CategoryIcon } from "@/components/credentials/category-icon";

interface Credential {
  id: string;
  name: string;
  category: string;
}

export function CredentialPicker({
  selected,
  onChange,
}: {
  selected: string[];
  onChange: (ids: string[]) => void;
}) {
  const [credentials, setCredentials] = useState<Credential[]>([]);

  useEffect(() => {
    fetch("/api/credentials")
      .then((r) => r.json())
      .then(setCredentials);
  }, []);

  function toggle(id: string) {
    onChange(
      selected.includes(id)
        ? selected.filter((s) => s !== id)
        : [...selected, id]
    );
  }

  if (credentials.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No credentials available. Create some first.
      </p>
    );
  }

  return (
    <div className="space-y-1">
      {credentials.map((cred) => {
        const isSelected = selected.includes(cred.id);
        return (
          <button
            key={cred.id}
            type="button"
            onClick={() => toggle(cred.id)}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-left text-sm transition-colors",
              isSelected
                ? "border-primary bg-primary/5"
                : "border-border hover:bg-muted"
            )}
          >
            <CategoryIcon category={cred.category} />
            <span className="flex-1">{cred.name}</span>
            {isSelected && <Check className="size-4 text-primary" />}
          </button>
        );
      })}
    </div>
  );
}
