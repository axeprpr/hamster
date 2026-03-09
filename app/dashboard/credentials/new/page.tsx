import { PageHeader } from "@/components/layout/page-header";
import { CredentialForm } from "@/components/credentials/credential-form";

export default function NewCredentialPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="New Credential"
        description="Add a new encrypted credential"
      />
      <CredentialForm />
    </div>
  );
}
