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

### 🐞 Issue → ✅ RESOLVED (2026-07-01)
- **Problem tha:** bot `price` pe har baar **menu** bhejta tha, aur multiple times.
- **Root cause:** live webhook **stale deployment** (pehli truncated paste) chala raha tha; wo error karta tha → Telegram retry → menu bar-bar.
- **Confirm kiya:** `testPriceReply()` ne sahi pricing diya → code perfect, sirf deploy purana tha.
- **Fix:** code re-paste (full) → **Deploy → New version (Version 3)** → `deleteWebhook?drop_pending_updates=true` (queue clear) → naye `/exec` URL pe `setWebhook`. ✅
- **Result:** 🎉 **Bot fully live!** `price`/`sample`/`syllabus`/`buy` sab sahi reply de rahe hain + Leads sheet me row ban rahi hai.

### 🟢 Live Status
- ✅ Telegram: Responder (auto-reply) + SDR (lead capture) LIVE
- ✅ Triggers active: drip 10:00, broadcast 18:00 (Mon/Wed/Fri), report 21:00
- Web app **Version 3** deployed.
- Web app URL: `https://script.google.com/macros/s/AKfycbzLh-Po9aWVQko2CwaWLsMxs90yMIMCEdGju5qVnX4YAksOaqISx5US0HeAnwOIuM1m/exec`

---

## 🔜 NEXT SESSION TODO (naye chat me yahan se continue)

### 🐞 BUG 1 — Duplicate replies (HIGH priority)
- **Symptom:** ek `price` bhejne pe bot **5-6 baar** wahi reply bhej deta hai.
- **Root cause:** Apps Script `doPost` slow hai (multiple full-sheet reads via `readLeads_`/`findLeadByContact_` + UrlFetch sends). Telegram ko time pe 200 OK nahi milta → **same `update_id` retry** karta hai → duplicate replies. (New-user path me `captureLead_` ek extra welcome bhi bhejta hai.)
- **Fix plan (code change in `ALL-IN-ONE.gs` → re-paste → new version deploy):**
  1. `doPost` me sabse pehle **`update_id` dedup** — `CacheService.getScriptCache()` me update_id store karo (put 300s); agar already seen → turant `json_({ok:true})` return, koi processing nahi.
  2. `handleInbound_` me se **duplicate work hatao**: `findLeadByContact_` ek hi baar call ho; inbound reply ke case me `captureLead_` ka welcome-send skip karo (sirf sheet me add karo).
  3. Optional: sheet read optimize (ek hi `readLeads_`).
- **Temporary option agar spam abhi rokna ho:** `deleteWebhook` call karke bot pause kar sakte hain.

### 🔗 CHANGE 1 — Website link (course link ki jagah)
- User chahta hai messages me **poori website ka link** ho (sirf Pharmaceutics course link nahi), taaki puri website dikhe.
- **BLOCKER:** website ka **live URL chahiye** (GitHub Pages `https://<user>.github.io/manpharma-landing-page/` ya custom domain?) — user se next chat me lena hai.
- **Kaam:** `getConfig()` me `WEBSITE` add karo; `MESSAGES()` me primary CTA `CHECKOUT` ki jagah `WEBSITE` use karo (ya dono).

### 🧭 CHANGE 2 — Menu / conversation flow redesign
- Naya flow: lead aane pe → **"aapki kya problem/subject hai?" poochho** → uske jawab pe **relevant solution + link offer karo**.
- Ye ek **guided/stateful flow** hai (lead ka current step Sheet me `stage`/`notes` me store karke). Design next chat me finalize karna — options: (a) numbered menu (1/2/3), (b) keyword based, (c) short Q&A.

### 📋 Baaki pending (pehle se)
- Landing page `leadWebhook` URL set (website form → leads).
- Content tab me broadcast posts (`content-calendar.csv`) paste.
- Purchase webhook (Graphy `?action=purchase`) → sale tracking + upsell.
- WhatsApp / Instagram tokens (optional).

> [!info] Naye chat ke liye quick context
> Standalone Apps Script project "ManPharma Sales Engine", Code.gs = `automation/apps-script/ALL-IN-ONE.gs`. Sheet ID `1uSM-F45u2pYISVAyCn_XdpohVBvJKAfRwLfSyUHLo1g`. Telegram live (Version 3). Fixes ke baad hamesha: re-paste → **Deploy → Manage deployments → Edit → New version** → (zaroorat ho to) webhook reset with `drop_pending_updates=true`.

---
*Auto-maintained by Claude. Har naye kaam pe "Progress Log" update hota rahega.*
