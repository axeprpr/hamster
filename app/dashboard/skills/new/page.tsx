import { PageHeader } from "@/components/layout/page-header";
import { SkillForm } from "@/components/skills/skill-form";

export default function NewSkillPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="New Skill"
        description="Create a new AI skill with instruction template"
      />
      <SkillForm />
    </div>
  );
}
