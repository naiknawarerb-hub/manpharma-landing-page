---
title: Sales Engine Automation
vault: Raman's brain
folder: 06-MANPHARMA
created: 2026-06-30
updated: 2026-07-01
type: project-note
status: built-ready-to-deploy
engine: google-apps-script
tags:
  - manpharma
  - sales-automation
  - apps-script
  - n8n
  - sales-funnel
aliases:
  - ManPharma Sales Engine
  - Sales Team Automation
---

# 🤖 ManPharma — Sales Engine Automation

> [!abstract] Ek line me
> ManPharma Tutorials ke liye ek **complete automated sales team** — jo students tak pahunche, product bataye, follow-up kare, aur lead ko **sale me convert** kare. **Primary engine: Google Apps Script (free, no server)**. n8n version backup ke taur pe available.

> [!note] Obsidian path (confirmed ✅)
> - **Vault:** `Raman's brain`
> - **File:** `06-MANPHARMA/sales-engine-automation.md`
> - **URI:** `obsidian://open?vault=Raman's%20brain&file=06-MANPHARMA%2Fsales-engine-automation`
> Ye file repo me isi path (`06-MANPHARMA/…`) pe hai — vault me copy/sync karo to link seedha khulega.

---

## 🧭 Decision: Apps Script > n8n

| | Google Apps Script ✅ | n8n |
|---|---|---|
| Hosting | Google server, **free** | VPS/Docker chahiye |
| Google Sheet CRM | native | connector |
| Email bhejna | 1 line (`MailApp`) | node + SMTP |
| Webhook URLs | Web App deploy | needs public HTTPS |
| Cost | ₹0 | server cost |
| Verdict | **Primary** | Backup |

**Isliye Apps Script primary sales engine hai.**

---

## 🧑‍💼 The Sales Team (roles)

> [!info] Code: `automation/apps-script/`

| Role | Function | Kab chalta hai |
|------|----------|----------------|
| 🧲 SDR / Lead Gen | `captureLead_` | Website form / naya contact → CRM + welcome |
| 💬 Responder | `handleInbound_` | Incoming DM → keyword auto-reply |
| 🤝 Closer | `runDripNurture` | Roz 10:00 → Day1→Day6 follow-up + offers |
| 📣 Outreach | `runBroadcast` | Mon/Wed/Fri 18:00 → promo blast |
| 💳 Account Manager | `handlePurchase_` | Sale → Customer mark + upsell + referral |
| 📊 Sales Manager | `sendDailyReport` | Roz 21:00 → pipeline report email/Telegram |

**Channels:** Telegram · Email · WhatsApp · Instagram (sab `Channels.gs` se route).

---

## 🗂️ Files

```
automation/apps-script/
├── Config.gs        # settings + saari Hinglish message copy
├── Sheet.gs         # CRM read/write helpers
├── Channels.gs      # Telegram/Email/WhatsApp/Instagram senders
├── SalesTeam.gs     # 6 role functions (drip, broadcast, report, etc.)
├── WebApp.gs        # doPost endpoints (lead/inbound/purchase/telegram)
├── Setup.gs         # initSalesEngine() — sheet + triggers one-click
├── appsscript.json  # manifest (scopes, web app config)
└── README.md        # full setup guide
```

CRM Sheet tabs: **Leads · Content · Subscribers** (auto-ban jate hain `initSalesEngine` se).

---

## 🚀 Deploy Checklist

> [!todo]
> - [ ] Google Sheet "ManPharma CRM" banao, Sheet ID copy karo
> - [ ] Extensions → Apps Script → files paste karo
> - [ ] Script properties me `SHEET_ID`, `ADMIN_EMAIL`, `WEBHOOK_SECRET`, `TELEGRAM_BOT_TOKEN` daalo
> - [ ] `initSalesEngine` run karo (sheet + triggers ban jayenge)
> - [ ] Content tab me `content-calendar.csv` paste karo
> - [ ] Deploy → Web app (execute: Me, access: Anyone) → `/exec` URL copy
> - [ ] `registerTelegramWebhook` me URL daal ke run karo
> - [ ] `index.html` SITE_CONFIG me `leadWebhook` set karo
> - [ ] Test: bot ko "price" bhejo → reply + Leads row
> - [ ] *(optional)* WhatsApp Cloud API + Instagram tokens

---

## 🔗 Web App Endpoints (POST JSON + `secret`)

| Action | Kaam |
|--------|------|
| `?action=lead` | website form / naya lead |
| `?action=purchase` | sale event (Graphy/manual) |
| `?action=inbound` | incoming WhatsApp/IG message |
| `?action=telegram` | Telegram bot webhook |

---

## 📊 Funnel

```
Website / DM ─► 🧲 captureLead_ ─► CRM (New) + welcome
                     │ daily
                     ▼
              🤝 runDripNurture ─► Day1 value → Day2 ₹69 → Day4 objections → Day6 last-chance
                     │
   sale ─► 💳 handlePurchase_ ─► Customer + thank-you + combo upsell + referral + owner alert

   📣 runBroadcast (Mon/Wed/Fri) ─► Telegram + Email + WhatsApp
   💬 handleInbound_ ─► keyword replies
   📊 sendDailyReport (roz 9pm) ─► pipeline summary
```

---

## 🧠 Notes / Reality
- **Telegram + Email**: turant chalega, free. Yahin se start.
- **WhatsApp**: Cloud API + approved templates (24h rule).
- **Instagram**: Meta app review (`instagram_manage_messages`), 24h window.
- **Quotas**: consumer Gmail ~100 email/day, UrlFetch ~20k/day — starting funnel ke liye kaafi.
- **Compliance**: sirf opt-in logo ko message.

---

## 📝 Progress Log

- **2026-06-30** — n8n marketing automation banaya (5 workflows + CRM + landing form). Branch `claude/n8n-marketing-automation-c1k4w7`.
- **2026-06-30** — Obsidian summary note banaya (`automation/Manpharma marketing automation.md`).
- **2026-07-01** — ✅ **Google Apps Script sales engine banaya** (complete sales team: SDR/Responder/Closer/Account Manager/Sales Manager). Apps Script ko n8n se prefer kiya (free, no server). Files: `automation/apps-script/` (7 files + README).
- **2026-07-01** — Ye progress note (`06-MANPHARMA/sales-engine-automation.md`) banaya aur vault path confirm kiya.
- **2026-07-01** — Sheet ID mila: `1uSM-F45u2pYISVAyCn_XdpohVBvJKAfRwLfSyUHLo1g`. "Extensions → Apps Script open nahi ho raha" issue ke liye **ALL-IN-ONE single-file script** banaya (`automation/apps-script/ALL-IN-ONE.gs`) — Sheet ID already bhara hua, standalone project me paste karo. Syntax verified ✅.

### 🚧 Live Deployment Progress (2026-07-01)
- ✅ Standalone Apps Script project banaya: **"ManPharma Sales Engine"** (Code.gs me ALL-IN-ONE paste).
- ✅ `initSalesEngine` run hua — Sheet me **Leads / Content / Subscribers** tabs bane + daily triggers set (drip 10:00, broadcast 18:00 Mon/Wed/Fri, report 21:00).
- ✅ Telegram bot banaya (@BotFather), token + admin chat id nikaale.
- ✅ Script Properties me `TELEGRAM_BOT_TOKEN` + `ADMIN_TELEGRAM_CHAT_ID` daale.
- ✅ Web app deploy kiya (Execute as: Me, Access: Anyone) → `/exec` URL mila.
- ✅ Telegram webhook set (browser method: `.../setWebhook?url=<exec>?action=telegram`) → `"Webhook was set"`. **Bot reply kar raha hai = webhook working.** 🎉

### 🐞 Open Issue (debugging)
- **Problem:** bot ko `price` (aur baaki keywords) bhejne pe hamesha **default menu** aata hai, sahi keyword reply nahi.
- **Analysis:** `MESSAGES` + `replyForText_` intact hain (menu unhi se aata hai), to ya text code tak sahi nahi pahunch raha, ya **live webhook stale (purana) deployment chala raha hai**.
- **Diagnostic diya:** `testPriceReply()` function editor me run karke check karna — pricing aaya to logic sahi, phir **Deploy → Manage deployments → Edit → Version: "New version" → Deploy** (same URL update). Menu aaya to code fix karna.
- **Waiting on:** user ka `testPriceReply` log result.

- **Next up:** keyword-reply issue fix → landing page `leadWebhook` URL set → purchase webhook (Graphy) → WhatsApp/IG tokens (optional).

---
*Auto-maintained by Claude. Har naye kaam pe "Progress Log" update hota rahega.*
