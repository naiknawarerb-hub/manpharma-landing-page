# ManPharma — n8n Automation

Self-hosted workflow automation for ManPharma. No cloud, no API cost, fully local.

## Project Structure

```
n8n-automation/
├── docker-compose.yml       # Main service definition
├── .env.example             # Environment variable template
├── .env                     # Your config (gitignored)
├── .gitignore
├── scripts/
│   ├── setup.sh             # First-time setup
│   ├── start.sh             # Start n8n
│   ├── stop.sh              # Stop n8n
│   └── backup.sh            # Backup all data
├── workflows/
│   ├── 01-form-to-google-sheets.json
│   ├── 02-whatsapp-order-notification.json
│   └── 03-daily-email-report.json
└── backups/                 # Auto-created by backup.sh
```

## Quick Start

**Step 1 — Install Docker Desktop**
- Windows/Mac: https://www.docker.com/products/docker-desktop/
- Ubuntu: `sudo apt install docker.io docker-compose`

**Step 2 — First time setup**
```bash
cd n8n-automation
chmod +x scripts/*.sh
./scripts/setup.sh
```

**Step 3 — Start**
```bash
./scripts/start.sh
```

**Step 4 — Open in browser**
```
http://localhost:5678
```

## Daily Commands

| Task | Command |
|---|---|
| Start n8n | `./scripts/start.sh` |
| Stop n8n | `./scripts/stop.sh` |
| Backup data | `./scripts/backup.sh` |
| View logs | `docker logs manpharma-n8n -f` |
| Restart | `docker restart manpharma-n8n` |

## Pre-built Workflows (in `workflows/`)

| File | Purpose |
|---|---|
| `01-form-to-google-sheets.json` | Save website form leads to Google Sheets |
| `02-whatsapp-order-notification.json` | WhatsApp alert on new orders |
| `03-daily-email-report.json` | Daily 9AM summary email |

### How to import a workflow
1. Open n8n → Workflows → New
2. Click menu (⋯) → Import from file
3. Select `.json` from `workflows/` folder

## Available Integrations (400+)
Gmail, WhatsApp, Telegram, Slack, Google Sheets, Notion, GitHub, MySQL, HTTP Webhooks, Instagram, Shopify, PDF processing, Scheduled tasks, and more.

## Environment Variables

| Variable | Description | Default |
|---|---|---|
| `N8N_PORT` | Port to run on | `5678` |
| `N8N_ENCRYPTION_KEY` | Secret key for credentials | auto-generated |
| `GENERIC_TIMEZONE` | Your timezone | `Asia/Kolkata` |
| `N8N_DIAGNOSTICS_ENABLED` | Send usage data | `false` |
