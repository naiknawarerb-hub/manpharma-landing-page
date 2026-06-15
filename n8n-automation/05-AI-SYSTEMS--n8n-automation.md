---
title: n8n automation
tags:
  - ai-system
  - automation
  - n8n
  - self-hosted
  - manpharma
date: 2026-06-15
status: active
type: tool-setup
category: AI System
obsidian-path: 05-AI-SYSTEMS/n8n automation
vault: Raman's brain
---

# n8n automation

> Open-source workflow automation — self-hosted, no API cost, 400+ integrations.

---

## 📌 Overview

| Field | Details |
|---|---|
| **Tool** | n8n v1.123.56 |
| **Type** | Self-hosted Workflow Automation |
| **Setup Date** | 2026-06-15 |
| **Status** | ✅ Active |
| **URL (local)** | http://localhost:5678 |
| **Admin** | admin@manpharma.com |
| **Repo** | `manpharma-landing-page/n8n-automation/` |
| **Branch** | `claude/open-source-automation-options-na6yn0` |

---

## 🗂️ Related Notes

- [[Supertonic TTS]]
- [[AI System Index]]
- [[ManPharma Project]]

---

## ⚙️ Installation Record

### Cloud Environment (Claude Code Web)
```bash
# Install
mkdir /tmp/n8n-v1 && cd /tmp/n8n-v1
cat > package.json << 'EOF'
{"name":"n8n-local","version":"1.0.0","overrides":{"xlsx":"0.18.5"}}
EOF
npm install n8n@1.123.56 --legacy-peer-deps

# Fix missing exports
# (see context file: .claude/context/n8n-context.md)

# Start
nohup env N8N_PORT=5678 N8N_LISTEN_ADDRESS=0.0.0.0 \
N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=false \
./node_modules/.bin/n8n start > /tmp/n8n-v1.log 2>&1 &
```

### Local Machine (Docker)
```bash
cd n8n-automation
./scripts/setup.sh   # pehli baar
./scripts/start.sh   # start karo
# http://localhost:5678
```

> ⚠️ `./scripts/` sirf local machine ke liye hai jahan Docker Desktop ho. Cloud env mein kaam nahi karta.

---

## 🐛 Issues & Fixes

| Issue | Fix |
|---|---|
| `cdn.sheetjs.com` 403 blocked | `xlsx` override → `0.18.5` via package.json |
| `@langchain/core/utils/uuid` missing export | Stub file created manually |
| `language_models/stream` missing | package.json exports patched |
| IPv6 not available | `N8N_LISTEN_ADDRESS=0.0.0.0` |
| `./scripts/setup.sh: command not found` | Docker nahi hai cloud env mein — nohup cmd use karo |

---

## ✅ Test Results (2026-06-15)

- [x] `/healthz` → `{"status":"ok"}`
- [x] `/healthz/readiness` → `{"status":"ok"}`
- [x] Web UI → HTTP 200
- [x] Admin login working
- [x] Workflow CREATE/READ/LIST working
- [x] SQLite DB initialized
- [x] 17/17 tests passed

---

## 📁 File Structure

```
n8n-automation/
├── docker-compose.yml
├── .env.example
├── .gitignore
├── scripts/
│   ├── setup.sh
│   ├── start.sh
│   ├── stop.sh
│   └── backup.sh
└── workflows/
    ├── 01-form-to-google-sheets.json
    ├── 02-whatsapp-order-notification.json
    └── 03-daily-email-report.json
```

---

## 🔌 Integrations Available (400+)

`Gmail` `WhatsApp` `Telegram` `Slack` `Google Sheets` `Notion` `GitHub` `MySQL` `HTTP Webhook` `Instagram` `Shopify` `PDF` `Schedule/Cron` `OpenAI` `Ollama`

---

## 🔗 Resources

- GitHub: https://github.com/n8n-io/n8n
- Templates: https://github.com/enescingoz/awesome-n8n-templates

---

## 🕓 Change Log

| Date | Update |
|---|---|
| 2026-06-15 | Initial setup, all fixes applied, 17 tests passed |
| 2026-06-15 | Structured file setup (scripts, workflows, .env) |
| 2026-06-15 | Obsidian note path fixed → `05-AI-SYSTEMS/n8n automation` |
| 2026-06-15 | Caveman context skill created |
