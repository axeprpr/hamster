export interface SkillPreset {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: string;
  template: string;
}

export const SKILL_PRESETS: SkillPreset[] = [
  {
    id: "kirara-ai",
    name: "Kirara AI",
    slug: "kirara-ai",
    description: "Deploy Kirara AI chatbot framework",
    category: "AI Framework",
    template: `# Kirara AI Installation

## Prerequisites
- Python 3.10+
- pip

## Installation Steps

1. Clone the repository:
\`\`\`bash
git clone https://github.com/kirara-ai/kirara-ai.git
cd kirara-ai
\`\`\`

2. Install dependencies:
\`\`\`bash
pip install -r requirements.txt
\`\`\`

3. Configure the IM adapter with the following credentials:
   - IM Client ID: \`{{im_client_id}}\`
   - IM Client Secret: \`{{im_client_secret}}\`

4. Configure the LLM provider:
   - API Key: \`{{llm_api_key}}\`

5. Start the service:
\`\`\`bash
python main.py
\`\`\`
`,
  },
  {
    id: "koishi",
    name: "Koishi Bot",
    slug: "koishi-bot",
    description: "Deploy Koishi chatbot platform",
    category: "Bot Platform",
    template: `# Koishi Bot Installation

## Prerequisites
- Node.js 18+

## Installation Steps

1. Create a new Koishi project:
\`\`\`bash
npm init koishi
\`\`\`

2. Configure the adapter plugin with:
   - Bot Token: \`{{bot_token}}\`

3. Configure database connection:
   - Host: \`{{db_host}}\`
   - Port: \`{{db_port}}\`
   - Database: \`{{db_name}}\`
   - Username: \`{{db_username}}\`
   - Password: \`{{db_password}}\`

4. Start Koishi:
\`\`\`bash
npm start
\`\`\`
`,
  },
  {
    id: "lobechat",
    name: "LobeChat",
    slug: "lobechat",
    description: "Deploy LobeChat with custom API keys",
    category: "AI Chat",
    template: `# LobeChat Installation

## Prerequisites
- Node.js 18+
- pnpm

## Installation Steps

1. Clone the repository:
\`\`\`bash
git clone https://github.com/lobehub/lobe-chat.git
cd lobe-chat
\`\`\`

2. Install dependencies:
\`\`\`bash
pnpm install
\`\`\`

3. Create \`.env.local\` with the following:
\`\`\`
OPENAI_API_KEY={{openai_api_key}}
ANTHROPIC_API_KEY={{anthropic_api_key}}
\`\`\`

4. Configure S3 storage (optional):
\`\`\`
S3_ACCESS_KEY_ID={{s3_access_key_id}}
S3_SECRET_ACCESS_KEY={{s3_secret_access_key}}
S3_BUCKET={{s3_bucket}}
S3_REGION={{s3_region}}
\`\`\`

5. Start the development server:
\`\`\`bash
pnpm dev
\`\`\`
`,
  },
  {
    id: "email-sender",
    name: "Email Sender",
    slug: "email-sender",
    description: "Configure SMTP email sending",
    category: "Email",
    template: `# Email Sender Configuration

## SMTP Settings

Configure your email client or application with these settings:

- **SMTP Host:** \`{{smtp_host}}\`
- **SMTP Port:** \`{{smtp_port}}\`
- **Username:** \`{{smtp_username}}\`
- **Password:** \`{{smtp_password}}\`
- **Encryption:** \`{{smtp_encryption}}\`

## Test

Send a test email to verify the configuration is working correctly.
`,
  },
  {
    id: "oss-backup",
    name: "OSS Backup",
    slug: "oss-backup",
    description: "Configure automated cloud storage backup",
    category: "Storage",
    template: `# OSS Backup Configuration

## Storage Credentials

Configure your backup tool with these credentials:

- **Access Key ID:** \`{{access_key_id}}\`
- **Access Key Secret:** \`{{access_key_secret}}\`
- **Bucket:** \`{{bucket}}\`
- **Endpoint / Region:** \`{{endpoint}}\`

## Backup Script

\`\`\`bash
# Example using rclone
rclone config create myoss s3 \\
  access_key_id={{access_key_id}} \\
  secret_access_key={{access_key_secret}} \\
  endpoint={{endpoint}}

rclone sync /path/to/backup myoss:{{bucket}}/backup/
\`\`\`
`,
  },
];
