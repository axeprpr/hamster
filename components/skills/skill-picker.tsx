"use client";

import { useState, useEffect } from "react";
import { Check, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLocale } from "@/lib/i18n/context";

interface Skill {
  id: string;
  name: string;
  slug: string;
}

export function SkillPicker({
  selected,
  onChange,
  excludeSlug,
}: {
  selected: string[];
  onChange: (ids: string[]) => void;
  excludeSlug?: string;
}) {
  const [skills, setSkills] = useState<Skill[]>([]);
  const { t } = useLocale();

  useEffect(() => {
    fetch("/api/skills")
      .then((r) => r.json())
      .then((data: Skill[]) => {
        setSkills(excludeSlug ? data.filter((s) => s.slug !== excludeSlug) : data);
      });
  }, [excludeSlug]);

  function toggle(id: string) {
    onChange(
      selected.includes(id)
        ? selected.filter((s) => s !== id)
        : [...selected, id]
    );
  }

  if (skills.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        {t("skills.noSkills")}
      </p>
    );
  }

  return (
    <div className="space-y-1">
      {skills.map((skill) => {
        const isSelected = selected.includes(skill.id);
        return (
          <button
            key={skill.id}
            type="button"
            onClick={() => toggle(skill.id)}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg border px-3 py-2 text-left text-sm transition-colors",
              isSelected
                ? "border-primary bg-primary/5"
                : "border-border hover:bg-muted"
            )}
          >
            <Zap className="size-4 text-muted-foreground" />
            <span className="flex-1">{skill.name}</span>
            <code className="text-xs text-muted-foreground">{skill.slug}</code>
            {isSelected && <Check className="size-4 text-primary" />}
          </button>
        );
      })}
    </div>
  );
}
