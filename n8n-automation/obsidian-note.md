---
title: n8n Self-Hosted Automation
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
---

# n8n Self-Hosted Automation

> Open-source workflow automation tool — locally hosted, no API cost, 400+ integrations.

---

## 📌 Overview

| Field | Details |
|---|---|
| **Tool** | n8n v1.123.56 |
| **Type** | Self-hosted Workflow Automation |
| **Setup Date** | 2026-06-15 |
| **Status** | ✅ Active |
| **URL (local)** | http://localhost:5678 |
| **Admin Email** | admin@manpharma.com |
| **Repo Path** | `manpharma-landing-page/n8n-automation/` |

---

## 🗂️ Related Notes

- [[Supertonic TTS]]
- [[AI System Index]]
- [[ManPharma Project]]

---

## 🧩 What It Does

n8n ek visual workflow builder hai jisme hum multiple apps ko bina code ke connect kar sakte hain.

**ManPharma ke liye use cases:**
- Website form submissions → Google Sheets
- New order → WhatsApp notification
- Roz 9AM → Email summary report
- Lead tracking automation
- Social media scheduling

---

## ⚙️ Installation Record

### Environment
- Platform: Cloud (Claude Code remote) / Local Docker
- Node.js: v22.22.2
- n8n: v1.123.56

### Issues Faced & Fixes

| Issue | Fix Applied |
|---|---|
| `cdn.sheetjs.com` blocked | `xlsx` override to `0.18.5` via `package.json overrides` |
| `@langchain/core/utils/uuid` missing export | Created stub file + added to `package.json exports` |
| `@langchain/core/language_models/stream` missing | Patched export pointing to `dist/utils/stream.js` |
| IPv6 not available | Set `N8N_LISTEN_ADDRESS=0.0.0.0` |

### Start Command (Local/Cloud)
```bash
cd /tmp/n8n-v1
N8N_PORT=5678 N8N_LISTEN_ADDRESS=0.0.0.0 \
N8N_ENFORCE_SETTINGS_FILE_PERMISSIONS=false \
./node_modules/.bin/n8n start
```

### Docker (Recommended for Local Machine)
```bash
cd n8n-automation
./scripts/setup.sh
./scripts/start.sh
```

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

## ✅ Test Results (2026-06-15)

- [x] Health check `/healthz` → `{"status":"ok"}`
- [x] Readiness check → `{"status":"ok"}`
- [x] Web UI accessible
- [x] Admin login working
- [x] Workflows API functional
- [x] Credentials API functional
- [x] Sample workflow created & retrieved
- [x] SQLite DB initialized (648KB)
- [x] Process stable (PID running, 2.1% RAM)

---

## 🔌 Available Integrations (400+)

`Gmail` `WhatsApp` `Telegram` `Slack` `Google Sheets` `Notion` `GitHub` `MySQL` `PostgreSQL` `HTTP Webhook` `Instagram` `Shopify` `WooCommerce` `OpenAI` `Ollama` `PDF` `Excel` `Schedule/Cron`

---

## 📝 Credentials Needed (Per Workflow)

| Workflow | Credentials Required |
|---|---|
| Form → Sheets | Google OAuth |
| WhatsApp Notify | Twilio Account SID + Token |
| Daily Email | SMTP credentials |

---

## 🔗 Resources

- GitHub: https://github.com/n8n-io/n8n
- Docs: https://docs.n8n.io
- Templates: https://github.com/enescingoz/awesome-n8n-templates
- Self-hosted AI Kit: https://github.com/n8n-io/self-hosted-ai-starter-kit

---

## 🕓 Change Log

| Date | Change |
|---|---|
| 2026-06-15 | Initial setup, testing complete, structured file created |
