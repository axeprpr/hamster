export function HowItWorks() {
  const steps = [
    {
      step: "01",
      title: "Store Credentials",
      description:
        "Add your email passwords, API keys, OSS credentials, and IM tokens. Everything is encrypted with AES-256-GCM.",
    },
    {
      step: "02",
      title: "Create Skills",
      description:
        "Build instruction templates with credential placeholders like {{smtp_password}}. Link the credentials each skill needs.",
    },
    {
      step: "03",
      title: "Authorize Machines",
      description:
        "Register the machine codes of devices that should be able to install skills. Generate access tokens.",
    },
    {
      step: "04",
      title: "AI Installs",
      description:
        "AI tools call the API with machine code and token. Hamster verifies, decrypts credentials, renders the template, and returns the complete configuration.",
    },
  ];

  return (
    <section className="bg-muted/30 px-4 py-20">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight">How it works</h2>
          <p className="mt-4 text-muted-foreground">
            Four simple steps from storing credentials to AI-powered installation.
          </p>
        </div>
        <div className="mt-12 space-y-8">
          {steps.map((item, i) => (
            <div key={item.step} className="flex gap-6">
              <div className="flex flex-col items-center">
                <div className="flex size-10 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                  {item.step}
                </div>
                {i < steps.length - 1 && (
                  <div className="mt-2 h-full w-px bg-border" />
                )}
              </div>
              <div className="pb-8">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
