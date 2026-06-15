# ManPharma n8n — Context File

## Project
- Repo: `naiknawarerb-hub/manpharma-landing-page`
- Branch: `claude/open-source-automation-options-na6yn0`
- Work dir: `/home/user/manpharma-landing-page/`

## n8n Install (Cloud Env)
- Location: `/tmp/n8n-v1/`
- Version: 1.123.56
- Start cmd: `cd /tmp/n8n-v1 && nohup env N8N_PORT=5678 N8N_LISTEN_ADDRESS=0.0.0.0 N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=false ./node_modules/.bin/n8n start > /tmp/n8n-v1.log 2>&1 &`
- URL: http://localhost:5678
- Admin: admin@manpharma.com / ManPharma@2024
- DB: /root/.n8n/database.sqlite

## Fixes Applied
- xlsx blocked → overrode to 0.18.5 in package.json
- @langchain/core/utils/uuid missing → stub created at `/tmp/n8n-v1/node_modules/@langchain/core/utils/uuid.js`
- @langchain/core/language_models/stream missing → patched package.json exports
- IPv6 not available → N8N_LISTEN_ADDRESS=0.0.0.0

## File Structure
```
n8n-automation/
├── docker-compose.yml       ← Local machine Docker setup
├── .env.example
├── scripts/
│   ├── setup.sh             ← Docker required (local only)
│   ├── start.sh             ← Docker required (local only)
│   ├── stop.sh
│   └── backup.sh
└── workflows/
    ├── 01-form-to-google-sheets.json
    ├── 02-whatsapp-order-notification.json
    └── 03-daily-email-report.json
```

## Obsidian Note Path
- Vault: `Raman's brain`
- File: `05-AI-SYSTEMS/n8n automation`
- obsidian://open?vault=Raman's%20brain&file=05-AI-SYSTEMS%2Fn8n%20automation

## Important Notes
- Cloud env mein Docker daemon nahi hai → scripts kaam nahi karti
- scripts/ sirf LOCAL machine ke liye hain jahan Docker Desktop ho
- Cloud env mein nohup + node directly chalao (upar wala start cmd)
- n8n process restart hoti hai har new Bash session pe → nohup use karo

## Last Updated
2026-06-15
