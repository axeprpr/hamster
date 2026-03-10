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
  {
    id: "dify",
    name: "Dify",
    slug: "dify",
    description: "Deploy Dify AI application development platform",
    category: "AI Platform",
    template: `# Dify Installation

## Prerequisites
- Docker & Docker Compose

## Docker Compose

Create \`docker-compose.yml\`:

\`\`\`yaml
version: '3.8'
services:
  api:
    image: langgenius/dify-api:latest
    environment:
      MODE: api
      SECRET_KEY: \`{{openai_api_key}}\`
      DB_USERNAME: postgres
      DB_PASSWORD: \`{{db_password}}\`
      DB_HOST: db
      DB_PORT: 5432
      DB_DATABASE: dify
      REDIS_HOST: redis
      REDIS_PORT: 6379
      REDIS_PASSWORD: \`{{redis_password}}\`
    depends_on:
      - db
      - redis
    ports:
      - "5001:5001"

  worker:
    image: langgenius/dify-api:latest
    environment:
      MODE: worker
      SECRET_KEY: \`{{openai_api_key}}\`
      DB_USERNAME: postgres
      DB_PASSWORD: \`{{db_password}}\`
      DB_HOST: db
      DB_PORT: 5432
      DB_DATABASE: dify
      REDIS_HOST: redis
      REDIS_PORT: 6379
      REDIS_PASSWORD: \`{{redis_password}}\`
    depends_on:
      - db
      - redis

  web:
    image: langgenius/dify-web:latest
    ports:
      - "3000:3000"

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: \`{{db_password}}\`
      POSTGRES_DB: dify
    volumes:
      - db_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    command: redis-server --requirepass \`{{redis_password}}\`
    volumes:
      - redis_data:/data

volumes:
  db_data:
  redis_data:
\`\`\`

## Start

\`\`\`bash
docker compose up -d
\`\`\`
`,
  },
  {
    id: "one-api",
    name: "One API",
    slug: "one-api",
    description: "Deploy One API gateway for LLM providers",
    category: "AI Gateway",
    template: `# One API Installation

## Prerequisites
- Docker & Docker Compose

## Docker Compose

Create \`docker-compose.yml\`:

\`\`\`yaml
version: '3.8'
services:
  one-api:
    image: justsong/one-api:latest
    ports:
      - "3000:3000"
    environment:
      SQL_DSN: "postgres://postgres:{{db_password}}@db:5432/oneapi?sslmode=disable"
      SESSION_SECRET: \`{{root_token}}\`
      INITIAL_ROOT_TOKEN: \`{{root_token}}\`
    depends_on:
      - db
    volumes:
      - one_api_data:/data

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: \`{{db_password}}\`
      POSTGRES_DB: oneapi
    volumes:
      - db_data:/var/lib/postgresql/data

volumes:
  one_api_data:
  db_data:
\`\`\`

## Start

\`\`\`bash
docker compose up -d
\`\`\`

Access at http://localhost:3000, login with root token.
`,
  },
  {
    id: "chatgpt-next-web",
    name: "ChatGPT-Next-Web",
    slug: "chatgpt-next-web",
    description: "Deploy ChatGPT-Next-Web chat interface",
    category: "AI Chat",
    template: `# ChatGPT-Next-Web Installation

## Prerequisites
- Docker

## Docker Run

\`\`\`bash
docker run -d \\
  --name chatgpt-next-web \\
  -p 3000:3000 \\
  -e OPENAI_API_KEY="{{openai_api_key}}" \\
  -e CODE="{{access_code}}" \\
  yidadaa/chatgpt-next-web:latest
\`\`\`

## Environment Variables

- **OPENAI_API_KEY:** \`{{openai_api_key}}\`
- **CODE (Access Code):** \`{{access_code}}\`

## Docker Compose (Alternative)

Create \`docker-compose.yml\`:

\`\`\`yaml
version: '3.8'
services:
  chatgpt-next-web:
    image: yidadaa/chatgpt-next-web:latest
    ports:
      - "3000:3000"
    environment:
      OPENAI_API_KEY: \`{{openai_api_key}}\`
      CODE: \`{{access_code}}\`
\`\`\`

\`\`\`bash
docker compose up -d
\`\`\`

Access at http://localhost:3000, use the access code to login.
`,
  },
  {
    id: "open-webui",
    name: "Open WebUI",
    slug: "open-webui",
    description: "Deploy Open WebUI for LLM interaction",
    category: "AI Chat",
    template: `# Open WebUI Installation

## Prerequisites
- Docker & Docker Compose

## Docker Compose

Create \`docker-compose.yml\`:

\`\`\`yaml
version: '3.8'
services:
  open-webui:
    image: ghcr.io/open-webui/open-webui:main
    ports:
      - "3000:8080"
    environment:
      OPENAI_API_KEY: \`{{openai_api_key}}\`
      WEBUI_SECRET_KEY: \`{{webui_secret_key}}\`
    volumes:
      - open_webui_data:/app/backend/data

volumes:
  open_webui_data:
\`\`\`

## Start

\`\`\`bash
docker compose up -d
\`\`\`

Access at http://localhost:3000, create an admin account on first visit.
`,
  },
  {
    id: "n8n",
    name: "n8n",
    slug: "n8n",
    description: "Deploy n8n workflow automation platform",
    category: "Automation",
    template: `# n8n Installation

## Prerequisites
- Docker & Docker Compose

## Docker Compose

Create \`docker-compose.yml\`:

\`\`\`yaml
version: '3.8'
services:
  n8n:
    image: n8nio/n8n:latest
    ports:
      - "5678:5678"
    environment:
      DB_TYPE: postgresdb
      DB_POSTGRESDB_HOST: \`{{db_host}}\`
      DB_POSTGRESDB_PORT: \`{{db_port}}\`
      DB_POSTGRESDB_DATABASE: \`{{db_name}}\`
      DB_POSTGRESDB_USER: \`{{db_user}}\`
      DB_POSTGRESDB_PASSWORD: \`{{db_password}}\`
      N8N_BASIC_AUTH_ACTIVE: "true"
    volumes:
      - n8n_data:/home/node/.n8n
    depends_on:
      - db

  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: \`{{db_user}}\`
      POSTGRES_PASSWORD: \`{{db_password}}\`
      POSTGRES_DB: \`{{db_name}}\`
    volumes:
      - db_data:/var/lib/postgresql/data

volumes:
  n8n_data:
  db_data:
\`\`\`

## Start

\`\`\`bash
docker compose up -d
\`\`\`

Access at http://localhost:5678.
`,
  },
  {
    id: "uptime-kuma",
    name: "Uptime Kuma",
    slug: "uptime-kuma",
    description: "Deploy Uptime Kuma monitoring tool with SMTP alerts",
    category: "Monitoring",
    template: `# Uptime Kuma Installation

## Prerequisites
- Docker

## Docker Compose

Create \`docker-compose.yml\`:

\`\`\`yaml
version: '3.8'
services:
  uptime-kuma:
    image: louislam/uptime-kuma:latest
    ports:
      - "3001:3001"
    volumes:
      - uptime_kuma_data:/app/data

volumes:
  uptime_kuma_data:
\`\`\`

## Start

\`\`\`bash
docker compose up -d
\`\`\`

## SMTP Notification Configuration

After setup, go to Settings → Notifications → Add Notification → Email (SMTP):

- **SMTP Host:** \`{{smtp_host}}\`
- **SMTP Port:** \`{{smtp_port}}\`
- **SMTP Username:** \`{{smtp_username}}\`
- **SMTP Password:** \`{{smtp_password}}\`
- **Security:** STARTTLS

Access at http://localhost:3001, create an admin account on first visit.
`,
  },
  {
    id: "vaultwarden",
    name: "Vaultwarden",
    slug: "vaultwarden",
    description: "Deploy Vaultwarden password manager",
    category: "Security",
    template: `# Vaultwarden Installation

## Prerequisites
- Docker & Docker Compose

## Docker Compose

Create \`docker-compose.yml\`:

\`\`\`yaml
version: '3.8'
services:
  vaultwarden:
    image: vaultwarden/server:latest
    ports:
      - "8080:80"
    environment:
      ADMIN_TOKEN: \`{{admin_token}}\`
      DOMAIN: \`{{domain}}\`
      SMTP_HOST: \`{{smtp_host}}\`
      SMTP_PORT: \`{{smtp_port}}\`
      SMTP_FROM: noreply@\`{{domain}}\`
      SMTP_SECURITY: starttls
      SMTP_USERNAME: \`{{smtp_username}}\`
      SMTP_PASSWORD: \`{{smtp_password}}\`
      SIGNUPS_ALLOWED: "true"
    volumes:
      - vw_data:/data

volumes:
  vw_data:
\`\`\`

## Start

\`\`\`bash
docker compose up -d
\`\`\`

- Web Vault: http://localhost:8080
- Admin Panel: http://localhost:8080/admin (use admin_token to login)
`,
  },
];
