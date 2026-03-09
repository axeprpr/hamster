export interface CredentialField {
  key: string;
  label: string;
  type?: "text" | "password" | "number";
  placeholder?: string;
}

export interface CredentialSubType {
  value: string;
  label: string;
  category: string;
  fields: CredentialField[];
  setupGuide?: string[];
}

export const CREDENTIAL_SUB_TYPES: CredentialSubType[] = [
  // IM
  {
    value: "dingtalk",
    label: "DingTalk",
    category: "im",
    fields: [
      { key: "client_id", label: "Client ID", placeholder: "AppKey / Client ID" },
      { key: "client_secret", label: "Client Secret", type: "password", placeholder: "AppSecret / Client Secret" },
    ],
    setupGuide: [
      "Go to open-dev.dingtalk.com and log in",
      "Create a new application",
      "Enable the Bot capability",
      "Set the connection mode to Stream mode",
      "Copy the Client ID and Client Secret from the Credentials page",
    ],
  },
  {
    value: "feishu",
    label: "Feishu",
    category: "im",
    fields: [
      { key: "app_id", label: "App ID", placeholder: "cli_xxxxx" },
      { key: "app_secret", label: "App Secret", type: "password", placeholder: "App Secret" },
    ],
    setupGuide: [
      "Go to open.feishu.cn and log in",
      "Create or select your application",
      "Navigate to the Credentials page",
      "Copy the App ID and App Secret",
    ],
  },
  {
    value: "wecom",
    label: "WeCom",
    category: "im",
    fields: [
      { key: "corp_id", label: "Corp ID", placeholder: "Enterprise ID" },
      { key: "agent_id", label: "Agent ID", placeholder: "Application Agent ID" },
      { key: "corp_secret", label: "Corp Secret", type: "password", placeholder: "Application Secret" },
    ],
    setupGuide: [
      "Go to work.weixin.qq.com and log in",
      "Navigate to My Enterprise to find your Corp ID",
      "Go to Application Management and select or create your app",
      "Copy the Agent ID and Corp Secret",
    ],
  },
  {
    value: "telegram",
    label: "Telegram",
    category: "im",
    fields: [
      { key: "bot_token", label: "Bot Token", type: "password", placeholder: "123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11" },
    ],
    setupGuide: [
      "Open Telegram and search for @BotFather",
      "Send /newbot to create a new bot",
      "Follow the prompts to set a name and username",
      "Copy the bot token provided by BotFather",
    ],
  },
  {
    value: "discord",
    label: "Discord",
    category: "im",
    fields: [
      { key: "bot_token", label: "Bot Token", type: "password", placeholder: "Bot token" },
      { key: "application_id", label: "Application ID", placeholder: "Application ID" },
    ],
    setupGuide: [
      "Go to Discord Developer Portal (discord.com/developers)",
      "Create a new application or select an existing one",
      "Navigate to the Bot tab",
      "Click 'Reset Token' to generate a new bot token",
      "Copy the Token and Application ID",
    ],
  },
  {
    value: "slack",
    label: "Slack",
    category: "im",
    fields: [
      { key: "bot_token", label: "Bot Token", type: "password", placeholder: "xoxb-..." },
      { key: "app_token", label: "App Token", type: "password", placeholder: "xapp-..." },
      { key: "signing_secret", label: "Signing Secret", type: "password", placeholder: "Signing secret" },
    ],
    setupGuide: [
      "Go to api.slack.com/apps and create a new app",
      "Under OAuth & Permissions, install the app to your workspace",
      "Copy the Bot User OAuth Token (xoxb-...)",
      "Under Basic Information, generate an App-Level Token (xapp-...)",
      "Copy the Signing Secret from Basic Information",
    ],
  },
  // Email
  {
    value: "smtp",
    label: "SMTP",
    category: "email",
    fields: [
      { key: "host", label: "SMTP Host", placeholder: "smtp.gmail.com" },
      { key: "port", label: "Port", type: "number", placeholder: "587" },
      { key: "username", label: "Username", placeholder: "you@gmail.com" },
      { key: "password", label: "Password", type: "password", placeholder: "App password" },
      { key: "encryption", label: "Encryption", placeholder: "TLS / SSL / none" },
    ],
    setupGuide: [
      "Find your email provider's SMTP settings",
      "For Gmail: enable 2FA and generate an App Password",
      "For Outlook: use smtp-mail.outlook.com port 587",
      "Enter the SMTP host, port, and your login credentials",
    ],
  },
  // OSS
  {
    value: "aliyun_oss",
    label: "Aliyun OSS",
    category: "oss",
    fields: [
      { key: "access_key_id", label: "Access Key ID", placeholder: "LTAI..." },
      { key: "access_key_secret", label: "Access Key Secret", type: "password", placeholder: "Secret" },
      { key: "bucket", label: "Bucket", placeholder: "my-bucket" },
      { key: "endpoint", label: "Endpoint", placeholder: "oss-cn-hangzhou.aliyuncs.com" },
    ],
    setupGuide: [
      "Go to Aliyun RAM Console (ram.console.aliyun.com)",
      "Create an AccessKey pair for your user",
      "Grant OSS permissions to the RAM user",
      "Copy the Access Key ID and Secret",
    ],
  },
  {
    value: "aws_s3",
    label: "AWS S3",
    category: "oss",
    fields: [
      { key: "access_key_id", label: "Access Key ID", placeholder: "AKIA..." },
      { key: "secret_access_key", label: "Secret Access Key", type: "password", placeholder: "Secret" },
      { key: "bucket", label: "Bucket", placeholder: "my-bucket" },
      { key: "region", label: "Region", placeholder: "us-east-1" },
    ],
    setupGuide: [
      "Go to AWS IAM Console (console.aws.amazon.com/iam)",
      "Create a new IAM user with S3 access",
      "Generate access keys for the user",
      "Copy the Access Key ID and Secret Access Key",
    ],
  },
  // API
  {
    value: "openai",
    label: "OpenAI",
    category: "api",
    fields: [
      { key: "api_key", label: "API Key", type: "password", placeholder: "sk-..." },
    ],
    setupGuide: [
      "Go to platform.openai.com",
      "Navigate to API Keys in your account settings",
      "Create a new secret key",
      "Copy the API key immediately (it won't be shown again)",
    ],
  },
  {
    value: "anthropic",
    label: "Anthropic",
    category: "api",
    fields: [
      { key: "api_key", label: "API Key", type: "password", placeholder: "sk-ant-..." },
    ],
    setupGuide: [
      "Go to console.anthropic.com",
      "Navigate to API Keys",
      "Create a new API key",
      "Copy the key immediately",
    ],
  },
  {
    value: "custom_api",
    label: "Custom API",
    category: "api",
    fields: [
      { key: "name", label: "Key Name", placeholder: "e.g. X-API-Key" },
      { key: "value", label: "Key Value", type: "password", placeholder: "Your API key value" },
    ],
  },
  // Database
  {
    value: "postgresql",
    label: "PostgreSQL",
    category: "database",
    fields: [
      { key: "host", label: "Host", placeholder: "localhost" },
      { key: "port", label: "Port", type: "number", placeholder: "5432" },
      { key: "database", label: "Database", placeholder: "mydb" },
      { key: "username", label: "Username", placeholder: "postgres" },
      { key: "password", label: "Password", type: "password", placeholder: "Password" },
    ],
  },
  {
    value: "mysql",
    label: "MySQL",
    category: "database",
    fields: [
      { key: "host", label: "Host", placeholder: "localhost" },
      { key: "port", label: "Port", type: "number", placeholder: "3306" },
      { key: "database", label: "Database", placeholder: "mydb" },
      { key: "username", label: "Username", placeholder: "root" },
      { key: "password", label: "Password", type: "password", placeholder: "Password" },
    ],
  },
  {
    value: "redis",
    label: "Redis",
    category: "database",
    fields: [
      { key: "host", label: "Host", placeholder: "localhost" },
      { key: "port", label: "Port", type: "number", placeholder: "6379" },
      { key: "password", label: "Password", type: "password", placeholder: "Password (optional)" },
      { key: "db", label: "Database Number", type: "number", placeholder: "0" },
    ],
  },
];

export function getSubTypesForCategory(category: string): CredentialSubType[] {
  return CREDENTIAL_SUB_TYPES.filter((st) => st.category === category);
}

export function getSubType(value: string): CredentialSubType | undefined {
  return CREDENTIAL_SUB_TYPES.find((st) => st.value === value);
}
